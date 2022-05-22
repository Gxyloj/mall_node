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

// connection.connect();

// connection.query('select * from data', function(error, results, fields) {
//     if (error) throw error;
//     console.log('The solution is: ', results);
// });

// connection.connect();

// // var modSql = 'UPDATE websites SET name = ?,url = ? WHERE Id = ?';
// var modSql = 'update data set weekOrderCount = ?,weekOrderSum = ?,totalOrder = ?,totalPrice = ?'
// var modSqlParams = [0, 0, 0, 0];
// //改
// connection.query(modSql, modSqlParams, function(err, result) {
//     if (err) {
//         console.log('[UPDATE ERROR] - ', err.message);
//         return;
//     }
//     console.log('--------------------------UPDATE----------------------------');
//     console.log('UPDATE affectedRows', result.affectedRows);
//     console.log('-----------------------------------------------------------------\n\n');
// });

// connection.end();