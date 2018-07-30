const puppeteer = require('puppeteer');
const mysql = require('mysql');

(async () => {
    try {
        var con = mysql.createConnection({
            host: "localhost",
            user: "test",
            password: "1234",
            database: "mqc"
        });
        con.connect(function (err) {
            if (err) throw err
    
        });
        let sql = "SELECT link FROM link_page";
            con.query(sql, function (err, result) {
                if (err) reject(err);
                var row = [];
                Object.keys(result).forEach(function(key) {
                    row.push(result[key])
                  });
                  console.log(row.link);
            });
        //browser.close();
    } catch (error) {
        console.log("Catch : " + error);
    }
})();