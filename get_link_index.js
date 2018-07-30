const puppeteer = require('puppeteer');
const mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "test",
    password: "1234",
    database: "mqc"
});
con.connect(function (err) {
    if (err) throw err

});

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://mauquangcao.com', {
        timeout: 0
    });

    //await autoScroll(page); // Hàm cuộn trang hiện tại xuống cuối
    await page.waitFor(5000); // Đợi 5s load trang
    let promise = []; // Tạo 1 promise chứa tất cả các link get được từ index
    //--------------------------------------------
    // Lấy link từ trang 1
    let link_page = await page.evaluate(() => {

        let ID = 0;
        let links = document.querySelectorAll('div.eg-gallery.ng-isolate-scope.angular-grid div.item a.item__link');
        let array = [];
        links.forEach(_item => {
            array.push(_item.getAttribute('href'))
        });
        return array;
    });
    link_page.forEach(item => {
        promise.push(item);
    })
    //console.log(promise);
    //------------------------------
    // Lấy link từ các trang tiếp theo nhờ click vào nút next
    let id_page = 1;
    let max_range = 180;
    for (id_page; id_page < max_range; id_page++) {
        //await autoScroll(page);
        await page.waitForSelector('div.eg-wrapper > div > div > div.mqc-pagin')
        await page.click('div.eg-wrapper > div > div > div.mqc-pagin > div.mqc-btn.mqc-btn-next');
        await page.waitFor(7000);
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

    promise.forEach(i => {
        var sql = "INSERT INTO test_id_incre (link) VALUES (?) ";
        con.query(sql,i);
    })
    
    
    console.log("import success");
    await browser.close();
})();


function autoScroll(page) {
    return page.evaluate(() => {
        return new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        })
    });
}