const puppeteer = require('puppeteer');
const fs = require('fs');

main();

async function main() {
    // take credential data
    const [ EMAIL, PASSWORD ] = await getCredential();

    const browser = await puppeteer.launch({
        // executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        headless: false,
        // args: [
        //     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
        // ]
    });
    const page = await browser.newPage();
    // await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
    // await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36");
    // await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36");

    await page.setViewport({ width: 1366, height: 720});
    console.log(1);
    await page.goto('https://fap.fpt.edu.vn/', {
        waitUntil: 'networkidle0',
    });

    console.log(2);

    // popup
    await login(page, EMAIL, PASSWORD);

    console.log(5);
    await page.goto('https://fap.fpt.edu.vn/Student.aspx', {
        waitUntil: 'networkidle0',
    });

    await page.goto('https://fap.fpt.edu.vn/Report/ScheduleOfWeek.aspx');
    // await page.waitForNavigation({
    //     waitUntil: 'networkidle0'
    // });
    // await page.evaluate(() => window.scroll(0, 400));
    console.log(6);
    await fs.writeFile('meet_links.json', await getMeetLinks(page), 'utf8', err => {
        if (err) throw err
    });
    await page.screenshot({
        path: 'schedule.png',
        fullPage: true
    });
    // await new Promise(r => setTimeout(r, 1000000));
    await browser.close();
}

async function wait(time) {
    await new Promise(r => setTimeout(r, time));
}

async function getCredential() {
    let data = await fs.readFileSync('./credential.txt', 'utf8', data => data);
    let credential = data.split('\n').map(dat => {
        let colonPos = dat.indexOf(":");
        return dat.slice(colonPos+1).trim();
    });
    return credential;
}

async function login(page, EMAIL, PASSWORD) {
    //start sso
    await page.select('#ctl00_mainContent_ddlCampus', '3');
    await page.waitForNavigation();
    await page.click('.abcRioButtonContents');

    //handle sso
    const [ popup ] = await Promise.all([
        new Promise((resolve) => page.once('popup', resolve)),
    ]);
    await popup.waitForNavigation({
        waitUntil: 'networkidle0'
    });
    await popup.waitForSelector('#identifierId');
    console.log(3);
    await popup.type('#identifierId', EMAIL);
    await popup.click('[jsname="V67aGc"]');
    await popup.waitForNavigation({
        waitUntil: 'networkidle0'
    });
    console.log(4);
    await wait(2000);
    await popup.type('[type="password"]', PASSWORD);
    await popup.click('button[jsname="LgbsSe"]');
    await popup.waitForNavigation();
    await page.waitForNavigation({
        waitUntil: 'networkidle0'
    });
}

async function getMeetLinks(page) {
    let meetLinks = {};
    let tds = await page.$$eval('div#ctl00_mainContent_divContent + table > tbody > tr > td', tds => {
        return tds.map(td => {
            if (td.querySelector('a[href^="https://meet"]')) {
                return {
                    name: td.querySelector('a').textContent.slice(0,-1),
                    link: td.querySelector('a[href^="https://meet"]').href
                }
            }
        });
    });
    tds.filter(td => td).forEach(td => {
        if (!meetLinks.hasOwnProperty(td.name)) {
            meetLinks[td.name] = [td.link]; 
        } else {
            meetLinks[td.name].includes(td.link) ? null : meetLinks[td.name].push(td.link);
        }
    });
    return JSON.stringify(meetLinks);
}