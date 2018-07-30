const puppeteer = require('puppeteer');
const con = require("./connectDB");
const test = require("./test");
let URL = 'https://www.mauquangcao.com/ad/fpt-shop/';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(URL,{timeout : 0});
    const metadata = await page.evaluate(() => {
        let img_link = document.querySelector('div.mqc-single-ad > div > div > div.mqc-single-thumb > div > img').getAttribute('src');
        let title = document.querySelector('div.mqc-single-ad > div > div > div.mqc-single-block > div.mqc-single-title').textContent.replace('/\n/\t', '').trim();
        let content = document.querySelector('div.mqc-single-ad > div > div > div.mqc-single-block > div.mqc-single-des').textContent.trim();
        let linhvuc = document.querySelector('div.mqc-single-ad > div > div > div.mqc-single-block > div.mqc-single-extra > div:nth-child(1) > div.mqc-se-content').textContent.trim();
        let mucdich = document.querySelector('div.mqc-single-ad > div > div > div.mqc-single-block > div.mqc-single-extra > div:nth-child(2) > div.mqc-se-content').textContent.trim();
        let loaihinhqc = document.querySelector('div.mqc-single-ad > div > div > div.mqc-single-block > div.mqc-single-extra > div:nth-child(3) > div.mqc-se-content').textContent.trim();
        let metadata = [img_link, title, content, linhvuc, mucdich, loaihinhqc];
        return metadata;
    })
    console.log(metadata);
    await browser.close();
})();


