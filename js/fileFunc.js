const fsPromise = require('fs/promises');

const fileFunc = {
    getCredentials: async function () {
        let data = await fsPromise.readFile('./credential.txt', 'utf8');
        let credential = data.split('\n').map((dat, i) => {
            let colonPos = dat.indexOf(":");
            let info = dat.slice(colonPos+1).trim();
            if (i == 2) {
                const campus = ['hn', 'hcm', 'dn', 'ct', 'qn'];
                if (campus.indexOf(info) != -1) {
                    return campus.indexOf(info) + 3;
                };
                throw Error('Wrong campus');
            }
            return info
        });
        return credential;        
    },
    writeResults: async function (meetLinks) {
        let data = '';
        for (let subject in meetLinks) {
            data += `${subject}:\n`;
            meetLinks[subject].link.forEach(link => data += `    ${link}\n`)
            data += `    ${meetLinks[subject].absent}\n`
        }
        await fsPromise.writeFile('./results/meet_links.txt', data);
    },
    screenshot: async function (page) {
        await page.screenshot({
            path: './results/schedule.png',
            fullPage: true
        });
    }
};

module.exports = fileFunc;