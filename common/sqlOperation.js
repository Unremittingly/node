const mysql = require('mysql');
let connection = null;

const connectMysql = function (option) {
    let opt = {
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: 'fcymwg&M%8r_',
        database: 'test'
    };
    opt =  Object.assign(opt,option);
    connection = mysql.createConnection(opt);
    connection.connect();
    return connection;
};

const addData = function (data, operation) {
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
        let sql = 'INSERT INTO info(name,cur_time,cur_rank,same_id,url) VALUES' + value;
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
const selectAll = function (callBack) {
    if (connection) {
        let sql = 'SELECT * FROM unionlotto';
        connection.query(sql, function (error, result) {
            if (error) {
                console.log('查询失败', error);
            } else {
                if (result) {
                    callBack(result);
                }
                // console.log('result',result);
            }
        })
    }
};

const update = function (sql, callBack) {
    if (connection) {
        if (!sql) {
            return false;
        }
        connection.query(sql, function (error, result) {
            if (error) {
                console.log('查询失败', error);
            } else {
                if (result) {
                    callBack(result);
                }
                // console.log('result',result);
            }
        })
    }else{
        connectMysql();
        update(sql,callBack);
    }
};

function deleteData(id) {
    if(connection){
        if(id){
            let sql = 'DELETE FROM info WHERE id = '+id+'';
            connection.query(sql,function (error,result) {
                if(error){
                    console.log('删除失败',error);
                }else{
                    console.log('result',result);
                }
            })
        }else{
            console.log('该条数据不存在');
        }

    }else{
        connectMysql();
        deleteData(id);
    }
}


function getTime() {
    return new Date().getTime();
}
function insertData(sql){
    let isSuccess = false;
    if(connection){
        let defaultSql = sql||'';
        if(defaultSql){
            connection.query(defaultSql,function (error,result) {
                if(error){
                   console.log('数据插入失败');
                    isSuccess = false;
                }else{
                    console.log('数据插入成功',result);
                    isSuccess = true;
                }
            })
        }
    }else{
        connectMysql();
        insertData(sql);
    }
    return isSuccess;
}

exports.addData = addData;
exports.connectSql = connectMysql;
exports.getTime = getTime;
exports.selectAll = selectAll;
exports.update = update;
exports.deleteData = deleteData;
exports.insertData = insertData;