var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "test",
    password: "1234",
    database: "mqc"
});

con.connect();

module.exports = con;