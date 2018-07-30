const puppeteer = require('puppeteer');
const download = require('image-downloader');

(async() => {
    try {
        const browser = await puppeteer.launch();
    console.log('Browser openned');
    const page = await browser.newPage();
    const url = 'http://kenh14.vn/ai-roi-cung-khac-cac-hot-girl-nay-cung-khong-ngoai-le-khi-vong-1-cu-ngay-cang-phong-phao-20171207193958533.chn';
    await page.goto(url,{
        timeout: 0
    });
    console.log('Page loaded');

    const imgLinks = await page.evaluate(() => {
        let imgElements = document.querySelectorAll('.sp-img-zoom > img, .sp-img-lightbox > img, .detail-img-lightbox > img');
        imgElements = [...imgElements];
        let imgLinks = imgElements.map(i => i.getAttribute('src'));
        return imgLinks;
    });
    console.log(imgLinks);

    // Tải các ảnh này về thư mục hiện tại
    await Promise.all(imgLinks.map(imgUrl => download.image({
        url: imgUrl,
        dest: __dirname/img
    })));

    await browser.close();
    } catch (error) {
        console.log("Catch : " + error);
    }
})();