const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    let data = await fs.readFileSync('./credential.txt', 'utf8', data => data);
    let credential = data.split('\n').map(dat => {
        let colonPos = dat.indexOf(":");
        return dat.slice(colonPos+1).trim();
    });

    const [ EMAIL, PASSWORD ] = credential;

    const browser = await puppeteer.launch({
        // executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        headless: true
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
    // await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36");

    // await page.setViewport({ width: 1366, height: 768});
    console.log(1);
    await page.goto('https://fap.fpt.edu.vn/', {
        waitUntil: 'networkidle0',
    });
    await page.select('#ctl00_mainContent_ddlCampus', '3')
    await page.waitForNavigation();
    await page.click('.abcRioButtonContents')
    console.log(2);
    // popup
    const [ popup ] = await Promise.all([
        new Promise((resolve) => page.once('popup', resolve)),
    ]);
    await popup.waitForNavigation({
        waitUntil: 'networkidle0'
    });
    console.log(3);
    await popup.type('#identifierId', EMAIL);
    await popup.click('[jsname="V67aGc"]');
    await popup.waitForNavigation({
        waitUntil: 'networkidle0'
    });
    await new Promise(r => setTimeout(r, 2000));
    await popup.type('[type="password"]', PASSWORD);
    await popup.click('button[jsname="LgbsSe"]');
    await popup.waitForNavigation();
    await page.waitForNavigation({
        waitUntil: 'networkidle0'
    });
    console.log(4);
    await page.goto('https://fap.fpt.edu.vn/Report/ScheduleOfWeek.aspx');
    // await page.waitForNavigation();
    await page.evaluate(() => window.scroll(0, 400));
    console.log(5);
    await page.screenshot({ path: 'schedule.png' });
    await browser.close();
})();;