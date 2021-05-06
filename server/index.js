
const path= require('path');
const express = require('express');
let sqlOperation= require('../common/sqlOperation');
const { setUnionLottoNperIntoFile, addDataForPeriod, getPeriodForFile } = require('../cheerio/UnionLotto/index');

const app = express();

app.use(express.static(path.join(__dirname)));

//跨域设置 允许所有来源
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header('Access-Control-Allow-Credentials', true);
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "userInfo/json;charset=utf-8");
    next();
});

app.get('/getData',function (req,res) {

    sqlOperation.selectAll('unionlotto',function (data) {
        res.json({
            'ok': true,
            'name': 'test',
            'data': data
        });
    })

});

app.get('/insertData',function (req,res) {
    const {start,offset} = req.query;
    setUnionLottoNperIntoFile(start,offset);
    setTimeout(()=>{
        let periods = getPeriodForFile();
        addDataForPeriod(periods,0,(result)=>{
            res.json({
                'ok': true,
                'name': result,
                'data': null
            });
        })
    },1000);
});

app.listen('9999',function () {
   console.log('start server:端口号 9999');
});




