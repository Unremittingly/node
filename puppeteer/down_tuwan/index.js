/**
 * @time:2019/1/24
 * @author: zq
 * @desc:  抓取图片并下载到本地
 */

const basePath = './tuwan_img/';
const http = require('http');
const {puppeteerApi,downImg} = require('../common');

puppeteerApi(false).then(async function (browser) {
    let page = await browser.newPage();
    await page.setViewport({
        height: 800,
        width: 1366
    });
    let url = 'https://www.tuwanjun.com/';
    await page.goto(url, {
        waitUntil: 'networkidle0'
    });

    // await page.waitForNavigation();  //这里测试waitForNavigation似乎没用  他默认的是load事件加载完成    但是这里有可能是后面ajax请求过来的

    // let viewPort = await page.viewport();
    // console.log('aaa',viewPort);
    let startTime = (new Date().getTime()) / 1000;


    function getAllUrls(promiseList){
        return Promise.all(promiseList)
    }
    function getUrl(document){
        return new Promise(resolve => {
            setTimeout(function () {
                let swipers =  document.querySelectorAll('.swiper-wrapper .swiper-slide img');
                for (let j = 0; j < swipers.length; j++) {
                    // let url1 = swipers[j];
                    urls.push(swipers[j] ? swipers[j].getAttribute('src') : '')
                }
                document.querySelector('.swiper-close').click();
                resolve(urls);

            },1000);

        })
    }


    function sleep(time){
        // return new P
    }

    async function getUrls() {

        // page.on('console', msg => {
        //     for (let i = 0; i < msg.args().length; ++i)
        //         console.log(`${i}: ${msg.args()[i]}`); // 译者注：这句话的效果是打印到你的代码的控制台
        // });





        let imageUrls = await page.evaluate(async function () {

            let dom_s = document.querySelectorAll('#grid li img');

            let urls = [];

            function sleep(delay) {
                var start = (new Date()).getTime();
                while((new Date()).getTime() - start < delay) {
                    continue;
                }
            }

            for (let i = 0; i < dom_s.length; i++) {


                // sleep(100);
                // console.log('dom_s',dom_s[i]);
                await  dom_s[i].click();

                // ps.push(getUrl(document)) ;
                //
                // console.log('');
                // sleep(300);


                // urls.push(dom_s[i] ? dom_s[i].getAttribute('src') : '')
            }
           // let  urls =  await getAllUrls(ps);


       
            return await new Promise(resolve => {
                setTimeout(function () {
                    let swipers =  document.querySelectorAll('.swiper-wrapper .swiper-slide img');
                    for (let j = 0; j < swipers.length; j++) {
                        // let url1 = swipers[j];
                        // let url =  swipers[j].getAttribute('src');
                        console.log('url',swipers[j]);
                        urls.push(swipers[j] ? (swipers[j].getAttribute('src')?  swipers[j].getAttribute('src'):swipers[j].getAttribute('data-src')) : '')
                    }
                    // document.querySelector('.swiper-close').click();
                    // console.log('urlss',urls,swipers);
                    resolve(urls)
                },5000);
            });
        });
        console.log('urls',imageUrls.filter((item)=>{
            return item;
        }));
        // if (imageUrls.length <= 0) {
        //     //处理图片延时加载 会获取不到的问题  递归获取  超过2秒 连接超时
        //     let endTime = (new Date().getTime()) / 1000;
        //     console.log('reGet', endTime - startTime);
        //     if (endTime - startTime > 2) {
        //         console.log('连接超时');
        //         return imageUrls;
        //     } else {
        //         return await getUrls();
        //     }
        // } else {
        //     return imageUrls;
        // }

        return imageUrls.filter((item)=>{
            return item;
        });
    }

    let urls = await getUrls();
    // downImg(urls,basePath);

    downImg(urls,basePath,http);
    console.log('imageUrls', urls.length);
    // browser.close();
});




