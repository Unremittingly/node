

const {puppeteerApi} = require('../common');

let isLogin = false;

puppeteerApi(false).then(async function (browser) {
    let page = await browser.newPage();
    // await page.setViewport({
    //     height: 800,
    //     width: 1366
    // });
    let url = 'http://localhost:9000/';
    await page.goto(url, {
        waitUntil: 'networkidle0'
    });

    page.on('close', function () {
        console.log('close');
    });
    page.on('console', function (dd) {
        // console.log('console for page',dd);
    });


   async function isLogin() {
        let dom = await page.$('.user-entrance-trigger');
        if(dom){
            return true
        }else{
            return false;
        }
    }
    async function login(){
       await page.click('.login-on',{
           'delay':'100'
       })
        await page.type('#account','yuke',{
            'delay':'500'
        });

       await page.type('#pwd','123456',{
           'delay':'200'
       })
        await page.click('.air-btn-medium',{
            'delay':'500'
        })
        console.log('===');
    }

    let isl = await isLogin();
    if(!isl){
      await login();
    }


    console.log('111');

    await page.type('#arrCitySelect','123456',{
        'delay':'200'
    })

    await page.click('#arrCitySelect', {
        'delay': '8000'
    });

    await page.click('.search-btn', {
        'delay': '1000'
    });


    await sleep(1000);
    //  console.log('22');
    await page.click('.navigation a:nth-child(5)')

});

function sleep(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout));
}