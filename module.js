const puppeteer = require('puppeteer');
const mysql = require('mysql');
const con = require('./connectDB')
module.exports = {
    get_content: function (URL, ID) {
        (async () => {
            await page.goto(URL, {
                timeout: 0
            });
            const metadata = await page.evaluate(() => {
                let link_fb_selector = 'div.mqc-single-ad > div > div > div.mqc-single-thumb > div > div';
                let title_selector = 'div.mqc-single-ad > div > div > div.mqc-single-block > div.mqc-single-title';
                let content_selector = 'div.mqc-single-ad > div > div > div.mqc-single-block > div.mqc-single-des';
                let linhvuc_selector = 'div.mqc-single-ad > div > div > div.mqc-single-block > div.mqc-single-extra > div:nth-child(1) > div.mqc-se-content';
                let mucdich_selector = 'div.mqc-single-ad > div > div > div.mqc-single-block > div.mqc-single-extra > div:nth-child(2) > div.mqc-se-content';
                let loaihinhqc_selector = 'div.mqc-single-ad > div > div > div.mqc-single-block > div.mqc-single-extra > div:nth-child(3) > div.mqc-se-content';
                let link_fb = document.querySelector(link_fb_selector).getAttribute('data-href');
                let title = document.querySelector(title_selector).textContent.replace('/\n/\t', '').trim();
                let content = document.querySelector(content_selector).textContent.trim();
                let linhvuc = document.querySelector(linhvuc_selector).textContent.trim();
                let mucdich = document.querySelector(mucdich_selector).textContent.trim();
                let loaihinhqc = document.querySelector(loaihinhqc_selector).textContent.trim();
                let metadata = [link_fb, title, content, linhvuc, mucdich, loaihinhqc];
                return metadata;
            })
            var sql = "INSERT INTO test (link_qc, link_fb, title, content, linhvuc, mucdich, loaihinhqc) VALUES (?, ?, ?, ?, ?, ?, ?) ";
            var values = [];
            values.push(URL);
            metadata.forEach(i => {
                values.push(i);
            })
            con.query(sql, values, function (err) {
                if (err) throw err;
                console.log(ID + "rows inserted !");
            });
            await browser.close();
        })();
    }
}
