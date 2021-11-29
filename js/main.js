const 
    puppeteer = require('puppeteer'),
    fileFunc = require('./fileFunc'),
    login = require('./login'),
    getMeetLinks = require('./getMeetLinks'),
    getAbsent = require('./getAbsent');

main();

async function main() {
    const CREDENTIALS = await fileFunc.getCredentials();
    
    const browser = await puppeteer.launch({
        // executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        headless: false,
        args: [
            // '--no-sandbox', '--disable-setuid-sandbox',
            '--user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
        ]
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 720});
    await page.goto('https://fap.fpt.edu.vn/');

    // popup
    await login(page, CREDENTIALS);

    await page.goto('https://fap.fpt.edu.vn/Report/ScheduleOfWeek.aspx');
    let meetLinks = await getMeetLinks(page);
    await fileFunc.screenshot(page);

    await page.goto('https://fap.fpt.edu.vn/Report/ViewAttendstudent.aspx');
    await getAbsent(page, meetLinks)   

    await browser.close();
    await fileFunc.writeResults(meetLinks);
}