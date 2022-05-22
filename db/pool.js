var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'oj981229',
    database: 'mall'
});

module.exports = {
    connection
}