let puppeteer = require('puppeteer');
let insertData = require('../../common/sqlOperation').insertData;
let getTime = require('../../common/sqlOperation').getTime;

(async () =>{
    let url = 'https://www.toutiao.com';
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await page.goto(url);

    let d = await page.evaluate(function () {
        let listData =[];
        let domain = 'https://www.toutiao.com';
        let dom_img = document.querySelectorAll('.slide-list li img');
        let dom_tit = document.querySelectorAll('.slide-list li .title');
        let dom_src =  document.querySelectorAll('.slide-list li a');
        let dom_tab = document.querySelectorAll('.slide-tab li ');
        for(let i=0;i<dom_img.length;i++ ){
            listData.push({
                img:domain + (dom_img[i]?dom_img[i].getAttribute('src'):''),
                tit:removeSpaceAndLine(dom_tit[i]?dom_tit[i].innerText:''),
                url:domain + (dom_src[i]?dom_src[i].getAttribute('href'):''),
                type:removeSpaceAndLine(dom_tab[i]?dom_tab[i].innerText:'')
            })
        }
        function removeSpaceAndLine(str) {
            return str.replace(/\/\r\n/g,'').trim()
        }
        return listData;
    });
    addData(d);
    function addData(data) {
        let value = '';
        for (let i = 0; i < data.length; i++) {
            let obj = data[i];
            let arrSrc = obj.url.split('/');
            obj.url = obj.url.substring(0, 200);
            let v_item = '("' + obj.tit + '",' + parseInt(getTime()/1000)  + ',"' + obj.url + '",' + arrSrc[arrSrc.length-2] + ',"' + obj.type + '","' + obj.img +'")';


            value += '("' + obj.tit + '",' + parseInt(getTime()/1000)  + ',"' + obj.url + '",' + arrSrc[arrSrc.length-2] + ',"' + obj.type + '","' + obj.img +'"),';


            let sql = 'INSERT INTO headline(title,cur_time,url,c_identify,c_type,img) VALUES' + v_item;
            //这里一条一条的插入吧   防止 实时更新后  有些数据是新的 有些是旧的导致无法插入
            let result =  insertData(sql);
            console.log('result',result);

        }
        //这里多条的  暂时没用
        // value = value.substring(0, value.length - 1);
        // let sql = 'INSERT INTO headline(title,cur_time,url,c_identify,c_type,img) VALUES' + value;
        //
        // let result =  insertData(sql);
        // console.log('result',result);

    }

    await browser.close()





})();