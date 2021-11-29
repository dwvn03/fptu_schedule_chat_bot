const login = async function (page, CREDENTIALS) {
    //start sso
    const [ EMAIL, PASSWORD, CAMPUS ] = CREDENTIALS;
    await page.select('#ctl00_mainContent_ddlCampus', CAMPUS.toString());
    await page.waitForNavigation();
    await page.click('.abcRioButtonContents');

    // handle sso
    const [ popup ] = await Promise.all([
        new Promise((resolve) => page.once('popup', resolve)),
    ]);

    let passInputField = await popup.waitForSelector('#identifierId');
    await passInputField.type(EMAIL);
    await popup.click('[jsname="V67aGc"]');
    await popup.waitForNavigation({
        waitUntil: 'networkidle0'
    });
    
    let emailInputField = await popup.waitForSelector('[type="password"]');
    await emailInputField.type(PASSWORD);
    await popup.click('button[jsname="LgbsSe"]');

    await popup.waitForNavigation();
    await page.waitForNavigation();
}

module.exports = login;