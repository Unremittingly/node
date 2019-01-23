let puppeteer = require('puppeteer');

(async () =>{
    let url = 'https://www.toutiao.com/';
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await page.goto(url);
    
    let d = page.evaluate(function () {
        let listData =[];
        let dom_t = document.querySelectorAll('.feed-infinite-wrapper ul li .title-box a');
        let dom_comment = document.querySelectorAll('.feed-infinite-wrapper ul li ')
        for(let ele of dom){

        }
        return listData;
    });
    console.log('d',d);


})();