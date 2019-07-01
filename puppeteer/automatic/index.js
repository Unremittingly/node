const {puppeteerApi} = require('../common');


puppeteerApi(false).then(async function (browser) {
    let page = await browser.newPage();
    // await page.setViewport({
    //     height: 800,
    //     width: 1366
    // });
    let url = 'http://localhost:3000/';
    await page.goto(url, {
        waitUntil: 'networkidle0'
    });

    page.on('close', function () {
        console.log('close');
    });
    page.on('console', function (dd) {
        // console.log('console for page',dd);
    })

    await page.click('.login-btn',);
    await page.type('.login-contain input', 'zq', {
        'delay': '100'
    });
    await page.type('.login-contain input:nth-child(2)', 'zq123', {
        'delay': '100'
    });

    await page.click('.ant-btn-primary', {
        'delay': '200'
    });

    //这个是哪些登录是跳转页面的网站做的
    // await page.waitForNavigation({
    //     waitUntil: 'load'
    // });


    await sleep(1000);
    //  console.log('22');
    await page.click('.navigation a:nth-child(5)')

});

function sleep(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout));
}