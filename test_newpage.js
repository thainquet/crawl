const puppeteer = require('puppeteer');
const mysql = require('mysql');

(async () => {
    var con = mysql.createConnection({
        host: "localhost",
        user: "test",
        password: "1234",
        database: "mqc"
    });
    con.connect(function (err) {
        if (err) throw err

    });
    con.query("TRUNCATE `mqc`.`test`");

    const browser = await puppeteer.launch();
    const page1 = await browser.newPage();
    await page1.goto('https://mauquangcao.com', {
        timeout: 0
    });

    let link_page = await page1.evaluate(() => {
        let ID = 0;
        let links = document.querySelectorAll('div.eg-gallery.ng-isolate-scope.angular-grid div.item a.item__link');
        let array = [];
        links.forEach(_item => {
            array.push(_item.getAttribute('href'))
        });
        return array;
    });
    for (let i = 0; i < link_page.length; i++) {
        const page2 = await browser.newPage();
        await page2.goto(link_page[i], {
            timeout: 0
        });
        await page2.waitFor(500);
        const metadata = await page2.evaluate(() => {
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
        values.push(link_page[i]);
        metadata.forEach(i => {
            values.push(i);
        })
        con.query(sql, values, function (err) {
            if (err) throw err;
            console.log(i + " rows inserted !");
        });
        await page2.close();
    }
    let id_page = 1;
    let max_range = 180;
    for (id_page; id_page < max_range; id_page++) {
        await page1.waitForSelector('div.eg-wrapper > div > div > div.mqc-pagin')
        await page1.click('div.eg-wrapper > div > div > div.mqc-pagin > div.mqc-btn.mqc-btn-next');
        await page1.waitFor(5000);
        let link_page2 = await page1.evaluate(() => {
            let links = document.querySelectorAll('div.eg-gallery.ng-isolate-scope.angular-grid div.item a.item__link');
            let array = [];
            links.forEach(_item => {
                array.push(_item.getAttribute('href'))
            });
            return array;
        });
        const page2 = await browser.newPage();
        for (let i = 0; i < link_page2.length; i++) {
            await page2.goto(link_page2[i], {
                timeout: 0
            });
            //await page2.waitFor(3000);
            let a = 1,
                b = 1,
                c = 1;
            let linhvuc_selector = 'div.mqc-single-ad > div > div > div.mqc-single-block > div.mqc-single-extra > div:nth-child(1) > div.mqc-se-content';
            let mucdich_selector = 'div.mqc-single-ad > div > div > div.mqc-single-block > div.mqc-single-extra > div:nth-child(2) > div.mqc-se-content';
            let loaihinhqc_selector = 'div.mqc-single-ad > div > div > div.mqc-single-block > div.mqc-single-extra > div:nth-child(3) > div.mqc-se-content';
            if (await page2.$(linhvuc_selector) == null) a = 0;
            if (await page2.$(mucdich_selector) == null) b = 0;
            if (await page2.$(loaihinhqc_selector) == null) c = 0;
            if ((a == 1) && (b == 0) && (c == 0)) {
                const metadata = await page2.evaluate(() => {
                    let link_fb_selector = 'div.mqc-single-ad > div > div > div.mqc-single-thumb > div > div';
                    let title_selector = 'div.mqc-single-ad > div > div > div.mqc-single-block > div.mqc-single-title';
                    let content_selector = 'div.mqc-single-ad > div > div > div.mqc-single-block > div.mqc-single-des > p';
                    let linhvuc_selector = 'div.mqc-single-ad > div > div > div.mqc-single-block > div.mqc-single-extra > div:nth-child(1) > div.mqc-se-content';
                    let link_fb = document.querySelector(link_fb_selector).getAttribute('data-href');
                    let title = document.querySelector(title_selector).textContent.replace('/\n/\t', '').trim();
                    let content = document.querySelector(content_selector).textContent.trim();
                    let linhvuc = '';
                    let mucdich = '';
                    let loaihinhqc = document.querySelector(linhvuc_selector).textContent.trim();
                    let metadata = [link_fb, title, content, linhvuc, mucdich, loaihinhqc];
                    return metadata;
                })
                var sql = "INSERT INTO test (link_qc, link_fb, title, content, linhvuc, mucdich, loaihinhqc) VALUES (?, ?, ?, ?, ?, ?, ?) ";
                var values = [];
                values.push(link_page2[i]);
                metadata.forEach(i => {
                    values.push(i);
                })
                con.query(sql, values, function (err) {
                    if (err) throw err;
                });
            }
            if ((a == 1) && (b == 1) && (c == 0)) {
                const metadata = await page2.evaluate(() => {
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
                    let mucdich = ''
                    let loaihinhqc = document.querySelector(mucdich_selector).textContent.trim();
                    let metadata = [link_fb, title, content, linhvuc, mucdich, loaihinhqc];
                    return metadata;
                })
                var sql = "INSERT INTO test (link_qc, link_fb, title, content, linhvuc, mucdich, loaihinhqc) VALUES (?, ?, ?, ?, ?, ?, ?) ";
                var values = [];
                values.push(link_page2[i]);
                metadata.forEach(i => {
                    values.push(i);
                })
                con.query(sql, values, function (err) {
                    if (err) throw err;
                });
            }
            if ((a == 1) && (b == 1) && (c == 1)) {
                const metadata = await page2.evaluate(() => {
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
                values.push(link_page2[i]);
                metadata.forEach(i => {
                    values.push(i);
                })
                con.query(sql, values, function (err) {
                    if (err) throw err;
                });
            }
        }
        
        await page2.close();
        await page1.waitFor(3000);
        console.log(id_page + " page imported!");
    }


    //browser.close();
})();