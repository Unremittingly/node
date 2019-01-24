#!/usr/local/bin/node

/**
 * @author: vanishcode
 * @desc: hahahaha, fuck you, ADs!
 */

const puppeteer = require('puppeteer');
const https = require("https");
const http = require('http');
const fs = require('fs');

(async ()=>{
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    let url = 'https://image.baidu.com/';
    await page.goto(url);
    // page.waitForNavigation();

    setTimeout(async function () {

    },2000);

    let startTime = (new Date().getTime())/1000;
    async  function getUrls(){

        let imageUrls = await page.evaluate(function () {
            let urls = [];
            console.log('1aaa',document.querySelectorAll('#imglist').length);
            let dom_s = document.querySelectorAll('#imglist .imgitem img');
            for(let i =0;i<dom_s.length;i++){
                urls.push(dom_s[i]?dom_s[i].getAttribute('src'):'')
            }
            return urls;
        });
        if(imageUrls.length<=0){
            //处理图片延时加载 会获取不到的问题  递归获取  超过2秒 连接超时
            let endTime = (new Date().getTime())/1000;
            console.log('reGet',endTime-startTime);
            if(endTime-startTime > 2){
                console.log('连接超时');
                return imageUrls;
            }else{
                return await getUrls();
            }

        }else{
            return imageUrls;
        }

    }
    let urls = await getUrls();

    // downLoads(urls);

    // console.log('imageUrls',urls);
    browser.close();


})();
// run('http://jandan.net/ooxx');





// downLoads();

function downLoads(urls) {

    var server = https.createServer(function(req, res){}).listen(50082);
    console.log("http start");
    // var url = "http://s0.hao123img.com/res/img/logo/logonew.png";
    for (let i = 0; i < urls.length; i++) {
        let url = urls[i];
        downLoad(url);
    }

}

function downLoad(url) {
    https.get(url, function(res){
        var imgData = "";
        let urlArr = url.split('/');
        let fileName =  urlArr[urlArr.length-1];
        let filePath =  (fileName.split('.').length>1)? './images/'+fileName : './images/'+fileName+'.png';
        res.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开
        res.on("data", function(chunk){
            imgData+=chunk;
        });
        res.on("end", function(){
            // return false;
            fs.writeFile(filePath, imgData, "binary", function(err){
                if(err){
                    console.log("down fail");
                }else{
                    console.log("down success");
                }
            });
        });
    });
}


