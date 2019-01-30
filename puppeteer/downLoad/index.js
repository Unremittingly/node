/**
 * @time:2019/1/24
 * @author: zq
 * @desc:  抓取图片并下载到本地
 */

const puppeteer = require('puppeteer');
const https = require("https");
const http = require('http');
const fs = require('fs');
const path = require('path');
const basePath = './images/';





(async () => {
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await page.setViewport({
        height: 800,
        width: 1366
    });
    let url = 'https://image.baidu.com/';
    await page.goto(url, {
        waitUntil: 'networkidle0'
    });
    // await page.waitForNavigation();  //这里测试waitForNavigation似乎没用  他默认的是load事件加载完成    但是这里有可能是后面ajax请求过来的

    // let viewPort = await page.viewport();
    // console.log('aaa',viewPort);
    let startTime = (new Date().getTime()) / 1000;

    async function getUrls() {


        page.on('console', msg => {
            for (let i = 0; i < msg.args().length; ++i)
                console.log(`${i}: ${msg.args()[i]}`); // 译者注：这句话的效果是打印到你的代码的控制台
        });
        let imageUrls = await page.evaluate(function () {
            let urls = [];
            let dom_s = document.querySelectorAll('#imglist .imgitem img');
            for (let i = 0; i < dom_s.length; i++) {
                urls.push(dom_s[i] ? dom_s[i].getAttribute('src') : '')
            }

            return urls;
        });
        if (imageUrls.length <= 0) {
            //处理图片延时加载 会获取不到的问题  递归获取  超过2秒 连接超时
            let endTime = (new Date().getTime()) / 1000;
            console.log('reGet', endTime - startTime);
            if (endTime - startTime > 2) {
                console.log('连接超时');
                return imageUrls;
            } else {
                return await getUrls();
            }
        } else {
            return imageUrls;
        }
    }

    let urls = await getUrls();
    downLoads(urls);
    console.log('imageUrls', urls.length);
    browser.close();
})();

function downLoads(urls) {

    (async (__filename) => {
        fs.stat(__filename, (err) => {
            if (err) {
                fs.mkdir(__filename, (e) => {
                    if (e) {
                        console.log(e);
                    }
                });
            }
        })
    })(basePath);

    for (let i = 0; i < urls.length; i++) {
        let url = urls[i];
        downLoad(url);
    }

}

function downLoad(url) {
    https.get(url, function (res) {
        var imgData = "";
        let urlArr = url.split('/');
        let fileName = urlArr[urlArr.length - 1];
        let filePath = (fileName.split('.').length > 1) ? basePath + fileName : basePath + fileName + '.png';
        res.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开
        res.on("data", function (chunk) {
            imgData += chunk;
        });
        res.on("end", function () {
            // return false;
            fs.writeFile(filePath, imgData, "binary", function (err) {
                if (err) {
                    console.log("down fail", error);
                } else {
                    console.log("down success");
                }
            });
        });
    });
}


