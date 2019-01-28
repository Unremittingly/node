const http = require('http');
const puppeteer = require('puppeteer');


const getData = function (params, filter, callback) {

    let url = params.url || '';
    if (!url) {
        return {};
    }
    // console.log('url',url);
    let listData = {};
    http.get(url, {
        json: true
    }, function (res) {
        let html = '';
        res.on('data', function (data) {
            html += data;
        });
        //结束
        res.on('end', async function () {
            //获取数据
            listData = await filter(html, url);
            if (callback) {
                callback(listData);
            }
        })

    }).on('error', function () {
        console.log('获取数据出错');
    });
};
const getDataForPuppeteer = async function (params, callBack) {
    let listData;
    let url = params.url || '';
    let type = params.type || 1;
    if (!url) {
        return {};
    }
    //这里的callback 回调  我们只获取一条数据  如果有异步ajax加载的 需要自己去操作一下界面
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await page.goto(url);

    await page.addScriptTag({
        url:'http://libs.baidu.com/jquery/2.1.1/jquery.min.js'
    });
    if(type == 2){
        //多个 需要额外的 点击或其他操作  todo:这里如果是select框的选择的话会有 问题  待解决  
        let divs =   await page.$$('.kjnr .xzkjq select option');
        console.log('divs',divs);
        for (let i = 0; i < divs.length; i++) {
            let  div = divs[i];
             page.click('.kjnr .xzkjq select option');

            let itemData  = await page.evaluate(callBack ? callBack : function () {
                return {};
            });

        }

    }else{
        //通用
        listData = await page.evaluate(callBack ? callBack : function () {
            return {};
        });
    }

    browser.close();

    return listData;


};

exports.getDataForPuppeteer = getDataForPuppeteer;
exports.getData = getData;