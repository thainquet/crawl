const puppeteer = require('puppeteer');
const download = require('image-downloader');
let DOMAIN = 'https://demo.tutorialzine.com/2009/09/simple-ajax-website-jquery';
let URL = DOMAIN + '/demo.html';

(async() => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(URL);

        await page.click('#navigation > li:nth-child(3) > a');
        await page.waitForSelector('div#pageContent img');

        const imgUrl = await page.evaluate(() => {
            return document.querySelector('div#pageContent img').getAttribute('src');
        });
        console.log(imgUrl);
        const options = {
            url: DOMAIN + '/' + imgUrl,
            dest: 'images'
        };
        const { filename, image } = await download.image(options);
        browser.close()
    } catch (error) {
        console.log("Catch : " + error);
    }
})();