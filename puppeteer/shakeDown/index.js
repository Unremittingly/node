
const puppeteer = require('puppeteer');
const fs = require('fs');
let get_data = require('../../common/getData').getData;
const cheerio = require('cheerio');



require("puppeteer-chromium-resolver")({
    //hosts: ["https://storage.googleapis.com", "https://npm.taobao.org/mirrors"]
}).then(function (revisionInfo) {
    console.log("Chromium revision installed.");


    (async () => {
        //获取数据  小说（凡人修仙传）

        let status = 1;//抓取的状态   1.成功  2.链接超时  3.evaluate方法内报错  4.添加到文件报错  5.

        let browser = await   revisionInfo.puppeteer.launch({
            headless: false,//这个参数控制是否需要打开浏览器  无头浏览
            executablePath: revisionInfo.executablePath
        });
        let page = await browser.newPage();

        let success = [];



    
        async function getAllNum(){
            let url ='https://kyfw.12306.cn/otn/leftTicket/init?linktypeid=dc&fs=%E6%88%90%E9%83%BD,CDW&ts=%E8%A5%BF%E5%AE%89,XAY&date=2019-06-07&flag=N,N,Y';
            await page.goto(url, {
                waitUntil: 'networkidle0',
                timeout: 12000
            });
            return await page.evaluate(function () {
                let n = document.querySelectorAll('#queryLeftTable tr');
                let trainNumbers = [];//车次



                //获取当天的车次
                for (let i = 0; i < n.length; i++) {
                    let a = n[i];
                    let has = a.querySelectorAll('.t-list .yes');
                    if(has.length && (hasClass(has,'ZE')||hasClass(has,'YZ'))){
                        trainNumbers.push(a.querySelector('.train a').innerText);
                    }

                }

                function login() {
                    //登录
                }

                function hasClass(doms,className){
                    let hasClass = false;

                    for (let i = 0; i < doms.length; i++) {
                        let dom = doms[i];
                        let curClassName = dom.getAttribute('id');
                        let classArr = curClassName.split('_');
                        if(classArr[0] === className){
                            hasClass = true;
                            break;
                        }
                    }
                    return hasClass;
                }
                //获取当天有票的车次

                console.log('arr',trainNumbers);
                return trainNumbers;
            });
        }

        let d =  await getAllNum();
        console.log('d',d);





     

    })();

});




