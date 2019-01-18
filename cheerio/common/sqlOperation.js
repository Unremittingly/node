const mysql = require('mysql');


let sameId = 0;
let connection = null;

const connectMysql = function() {
    connection = mysql.createConnection({
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: 'fcymwg&M%8r_',
        database: 'test'
    });
    connection.connect();
    return connection;
};

const addData = function (data,operation) {
    if (connection) {
        let right = data.right;
        let time = getTime() / 1000;
        let value = '';
        let same_id = Math.random() * 1000;
        for (let i = 0; i < right.length; i++) {
            let obj = right[i];
            obj.src = obj.src.substring(0, 200);
            value += '("' + obj.desc + '",' + time + ',' + obj.index + ',' + same_id + ',"' + obj.src + '"),'
        }
        value = value.substring(0, value.length - 1);
        console.log('value', value);
        let sql = 'INSERT INTO info(name,cur_time,cur_rank,same_id,url) VALUES' + value;
        console.log('sql', sql);
        connection.query(sql, function (error, result) {
            if (error) {
                console.log('数据添加失败', error);
            } else {
                console.log('result', result);
            }
        })

    } else {
        connectMysql();
        addData(data);
    }

};


function getTime() {
    return new Date().getTime();
}

exports.addData = addData;
exports.connectSql = connectMysql;
exports.getTime = getTime;