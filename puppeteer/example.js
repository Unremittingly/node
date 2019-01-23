const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://127.0.0.1:7777/');

    let list = [];
    let a =  await page.$$eval('#select > option',els=>function () {
        console.log('els',els);
        return els.map(v=> {
            list.push(v.value);
            return v.value;
        })
    });
   let b = await page.evaluate(function () {
      let els = document.querySelectorAll('#select option') ;
      let list = [];
       for (let i = 0; i < els.length; i++) {
           let bElement = els[i];
           list.push(bElement.value)
       }
      return list;
   });
    console.log('b',b);
    console.log('a',a,list);
    page.once('load',function () {
        console.log('page  aleary load');
    });

    await browser.close();
})();
