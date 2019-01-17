let fs = require('fs');

//读取指定文件中的用户信息
let url = './user.txt';

function readInfo(url) {
    let rs = fs.createReadStream(url);
    //一系列文件读取中的监听事件 这里是文件流的读写
    rs.on('open', function () {
        console.log('开始读取');
    });
    rs.on('data', function (data) {
        console.log(data.toString());
    });
    rs.on('error', function (err) {
        console.log(err);
    });
    rs.on('end', function () {
        console.log('读取文件结束')
    });
    rs.on('close', function () {
        console.log('文件关闭');
    });
    rs.resume();
}

// readInfo(url);

function getUserInfoForFile(url) {
    //异步的形式读取
    fs.readFile(url, {
        flag: 'r',
        encoding: 'utf-8'
    }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log('异步', data);
        }
    });
    //同步的形式读取
    let str = fs.readFileSync(url, {encoding: 'utf-8'});
    let strArr = str.split('\r\n');
    let info = {};
    for (let i = 0; i < strArr.length; i++) {
        let objArr = strArr[i].split(':');
        info[objArr[0]] = objArr[1];
    }
    return info;
}

let userInfo =  getUserInfoForFile(url);
process.memoryUsage();
console.log('userInfo',userInfo);