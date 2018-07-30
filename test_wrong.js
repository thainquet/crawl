const puppeteer = require('puppeteer');
const mysql = require('mysql');
const con = require('./connectDB');


con.query("TRUNCATE `mqc`.`link_page`");
let sql = "INSERT INTO link_page (link) VALUES (?) ";

(async () => {
     // mở browser
    const browser = await puppeteer.launch({headless : false});
     // từ browser mới mở, mở 1 tab mới
    const page = await browser.newPage();
    // đến trang mauquangcao.com
    await page.goto('https://mauquangcao.com', {
        timeout: 0
    });
     // Tạo 1 mảng chứa tất cả các link get được từ index
    let promise = [];
    // // Lấy link từ trang 1
    // let link_page = await page.evaluate(() => {

    //     let ID = 0;
    //     let links = document.querySelectorAll('div.eg-gallery.ng-isolate-scope.angular-grid div.item a');
    //     let array = [];
    //     // 1 object trên trang chủ sẽ get đc 2 link trùng nhau => loại bỏ link trùng
    //     for (let i = 0; i<links.length; i++) {
    //         if ((i % 2) == 0 ) {
    //             array.push(links[i].getAttribute('href'));
    //         }
    //     }
    //     return array;
    // });
    // // đẩy link get được vào mảng
    // link_page.forEach(item => {
    //     promise.push(item);
    // })
    // lấy link từ 180 trang còn lại
    let id_page = 1;
    let max_range = 180;
    for (id_page; id_page < max_range; id_page++) {
        await page.waitForSelector('div.eg-wrapper > div > div > div.mqc-pagin')
        await page.click('div.eg-wrapper > div > div > div.mqc-pagin > div.mqc-btn.mqc-btn-next');
        await page.waitFor(5000);
        let link_page2 = await page.evaluate(() => {
            let links = document.querySelectorAll('div.eg-gallery.ng-isolate-scope.angular-grid div.item a.item__link');
            let array = [];
            links.forEach(_item => {
                array.push(_item.getAttribute('href'))
            });
            return array;
        });
        link_page2.forEach(item => {
            promise.push(item);
        })
    }
    // đóng browser
    await browser.close();
    console.log('done');
    
})();
