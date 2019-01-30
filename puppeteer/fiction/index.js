const puppeteer = require('puppeteer');
const fs = require('fs');
let get_data = require('../../common/getData').getData;
const cheerio = require('cheerio');


(async () => {
    //获取数据  小说（凡人修仙传）

    let browser = await puppeteer.launch();
    let page = await browser.newPage();


    getDatas();

    //获取所有
    async function getDatas() {


        //笔趣网  3248375  这个网站 的页面是没有规律的    暂时不用  会找不到页面
        // let start = 3929103;
        // for (let i = start; i < start + 10; i++) {
        //     await getData1(i);
        // }
        //八一新中网
        for (let i = 56; i < 100; i++) {
            await getData(i);
        }

        browser.close();

    }

    //获取一章
    async function getData(num) {
        //八一新中网
        let url = 'https://www.81xzw.com/book/151103/';
        let result = await page.goto(url + num + '.html');

        let cur = await page.evaluate(function () {
            let title = document.getElementsByTagName('h1')[0].innerText;
            // text=text.replace(/\n/g,"<br/>");
            let num = title.match(/\((.+?)\)/g);
            if (num && num.length > 0) {
                num = num[0].match(/\/(\S*)/)[1].replace(')', '');
                return {
                    title: title.replace(/\((.+?)\)/g, ''),
                    num: num
                }
            } else {
                return {
                    title: title,
                    num: 1
                };
            }


        });
        console.log('data_num', cur);
        let data = {
            text: '',
        };
        if (cur.num >= 1) {
            for (let i = 0; i < cur.num; i++) {
                await page.goto(url + num + '_' + i + '.html');
                let data_i = await page.evaluate(function () {
                    let d_tit = document.getElementsByTagName('h1')[0];
                    let title = d_tit ? d_tit.innerText : "";
                    let d_txt = document.getElementById('content');
                    let text = d_txt ? d_txt.innerText : '';
                    let to_nextpage = document.getElementsByClassName('to_nextpage')[0] ? document.getElementsByClassName('to_nextpage')[0].innerText : '';
                    text = text.replace(to_nextpage + '', '').replace('-->>', '');
                    // text=text.replace(/\n/g,"<br/>");
                    return {
                        title: title,
                        text: text,
                    }
                });
                // console.log('data_i',data_i);
                data.text += data_i.text;
            }
        } else {
            data = await page.evaluate(function () {
                let d_tit = document.getElementsByTagName('h1')[0];
                let title = d_tit?d_tit.innerText:'';
                let d_txt = document.getElementById('content');
                let text = d_txt ? d_txt.innerText : '';
                let to_nextpage = document.getElementsByClassName('to_nextpage').innerText;
                text = text.replace(to_nextpage + '', '');
                // text=text.replace(/\n/g,"<br/>");
                return {
                    title: title,
                    text: text
                }
            });

        }

        data.title = cur.title;
        // console.log('data',data);
        if (data.text) {
            writeTxtToFile(data.title + '\n\n' + data.text, './puppeteer/fiction/fr.txt');
        }

    }


    async function getData1(num) {
        //笔趣网
        let url = 'https://www.biquke.com/bq/0/990/' + num + '.html';
        let result = await page.goto(url);


        let data = await page.evaluate(function () {
            let title = document.getElementsByTagName('h1')[0].innerText;
            let text = document.getElementById('content') ? document.getElementById('content').innerText : '';
            let to_nextpage = document.getElementsByClassName('to_nextpage').innerText;
            text.replace(to_nextpage + '', '');
            // text=text.replace(/\n/g,"<br/>");
            return {
                title: title,
                text: text
            }
        });

        console.log('data', data);

        // return false;
        if (data.text) {
            writeTxtToFile(data.title + '\n\n' + data.text, './puppeteer/fiction/fr.txt');
        }

    }


    function writeTxtToFile(str, url) {


        if (!getIsExist(url)) {
            //异步方法
            fs.writeFile(url, '初始化第一行', function (err) {
                if (err) {
                    console.log('写文件操作失败');
                } else {
                    console.log('写文件操作成功');
                }
            });
        } else {
            fs.appendFile(url, str + '\n\n', 'utf8', function (err) {
                if (err) {
                    console.log('追加内容失败');
                } else {
                    console.log('已添加一章');
                }
            })
        }
    }

    async function getIsExist(url) {
        let isExist = false;
        await fs.exists(url, function (exists) {
            isExist = exists;
        });
        return isExist;
    }


})();

