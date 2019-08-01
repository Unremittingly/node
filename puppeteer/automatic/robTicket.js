const {puppeteerApi} = require('../common.js');


const url = 'https://www.12306.cn/index/';

//
puppeteerApi(false).then(async function (browser) {
    let page = await browser.newPage();
    await page.goto(url);

    page.click('.menu-login a:nth-child(1)')
    //越过验证码 图片验证码规则

});