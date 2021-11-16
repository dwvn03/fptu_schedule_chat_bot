const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        // executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        headless: false
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768});
    await page.goto('https://wordcounter.net/', {
        waitUntil: 'networkidle2',
    });
    page.type('#box', 'asfdsad')
    await new Promise(r => setTimeout(r, 2000));
    await browser.close();
})();;