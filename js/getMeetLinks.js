const getMeetLinks = async function (page) {
    let meetLinks = {};

    let tds = await page.$$eval('div#ctl00_mainContent_divContent + table > tbody > tr > td', tds =>
        tds.reduce((tdArr, td) => {
            let meetLink = td.querySelector('a[href^="https://meet"]');
            if (meetLink) {
                return [...tdArr, {
                    name: td.querySelector('a').textContent.slice(0, -1),
                    link: meetLink.href
                }]
            }
            return tdArr;       
        }, [])
    );
    tds.forEach(td => 
        !meetLinks.hasOwnProperty(td.name)
            ? meetLinks[td.name] = { link: [td.link] }
            : meetLinks[td.name].link.includes(td.link) ? null : meetLinks[td.name].link.push(td.link)
    );
    return meetLinks;
}

module.exports = getMeetLinks;