const puppeteer = require('puppeteer');
const con = require("./connectDB");

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let ids = [];
    for (let ID = 1; ID < 100; ID ++) {
        let sql = "SELECT link FROM test_id_incre WHERE ID = ?";
        const id = await queryId(con, sql, ID);
        ids.push(id[0].link);
    }
    for (let i=0; i< ids.length; i++) {
        await page.goto(ids[i], {timeout : 0});
        //await page.waitFor(3000);
        const metadata = await page.evaluate(() => {
            let link_fb = document.querySelector('div.mqc-single-ad > div > div > div.mqc-single-thumb > div > div').getAttribute('data-href');
            let title = document.querySelector('div.mqc-single-ad > div > div > div.mqc-single-block > div.mqc-single-title').textContent.replace('/\n/\t', '').trim();
            let content = document.querySelector('div.mqc-single-ad > div > div > div.mqc-single-block > div.mqc-single-des').textContent.trim();
            let linhvuc = document.querySelector('div.mqc-single-ad > div > div > div.mqc-single-block > div.mqc-single-extra > div:nth-child(1) > div.mqc-se-content').textContent.trim();
            let mucdich = document.querySelector('div.mqc-single-ad > div > div > div.mqc-single-block > div.mqc-single-extra > div:nth-child(2) > div.mqc-se-content').textContent.trim();
            let loaihinhqc = document.querySelector('div.mqc-single-ad > div > div > div.mqc-single-block > div.mqc-single-extra > div:nth-child(3) > div.mqc-se-content').textContent.trim();
            let metadata = [link_fb, title, content, linhvuc, mucdich, loaihinhqc];
            return metadata;
        })
        console.log(metadata);
    }
    await browser.close();
})();

function queryId(con, sql, ID) {
    return new Promise((resolve, reject) => {
        con.query(sql, ID, function (err, result) {
            if (err) return reject(err);
            return resolve(result);
        });
    })
}

function get_content(page) {
    
}

