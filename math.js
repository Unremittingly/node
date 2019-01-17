const fs = require('fs');
const path = require('path');

let promise = new  Promise(function (resolve, reject) {

});
throw promise.then(function () {

}).then(function () {

});

async function getIsExist() {
    let isExist = false;
    await fs.exists(url, function (exists) {
        isExist = exists;
    });
    return isExist;
}

function writeTxtToFile(str, url) {


    if (!getIsExist()) {
        //异步方法
        fs.writeFile(url, '初始化第一行', function (err) {
            if (err) {
                console.log('写文件操作失败');
            } else {
                console.log('写文件操作成功');
            }
        });
    } else {
        let time = new Date().getTime();
        let date = formatDate(time);
        fs.appendFile(url, str+': '+ date + ' 这是追加的数据'+'\n' , function (err) {
            if (err) {
                console.log('追加内容失败');
            } else {
                console.log('已追加一行');
            }
        })
    }
}

function formatDate(time, formatStr) {
    let date = new Date(time);
    let Y = date.getFullYear();
    let M = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    let D = date.getDate() < 10 ? '0' + (date.getDate()) : data.getDate();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    formatStr = formatStr || 'YYYY-MM-DD H:m:s';
    return formatStr.replace(/YYYY|MM|DD|H|m|s/ig, function (matches) {
        return ({
            YYYY: Y,
            MM: M,
            DD: D,
            H: h,
            m: m,
            s: s
        })[matches];
    });
}

let url = './message.txt';
function circ(index) {
    writeTxtToFile(index, url);
    setTimeout(function () {
       circ(++index);
    }, 5000);
}

circ(1);



