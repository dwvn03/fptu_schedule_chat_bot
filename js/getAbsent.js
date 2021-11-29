const getAbsent = async function (page, meetLinks) {
    for (let subject in meetLinks) {
        let subjectAbsentXpath = `//div[@id="ctl00_mainContent_divCourse"]/table/tbody/tr/td/a[contains(text(),"${subject}")]`;         
        let [ subjectAbsentLink ] = await page.$x(subjectAbsentXpath);
        if (subjectAbsentLink) {
            await subjectAbsentLink.click();
            await page.waitForNavigation();
        }
        meetLinks[subject].absent = await page.$eval('td[colspan="7"]', el => el.textContent);
    }
}

module.exports = getAbsent;