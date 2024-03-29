const fs = require('fs');
const {puppeteerApi} = require('../common');


puppeteerApi(false).then(async function (browser) {
    let page = await browser.newPage();

    let success = [];


    let d = await getAllNum();

    async function getAllNum() {
        let url = 'https://www.81xzw.com/book/151103/';
        await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 12000
        });
        return await page.evaluate(function () {
            let n = document.querySelectorAll('#newchapter li').length;
            n = n > 0 ? n : 0;
            let first_url = document.querySelectorAll('#newchapter li a');
            first_url = first_url[first_url.length - 1].getAttribute('href');
            let last = first_url.split('/')[3];
            let start = first_url ? last.substring(0, last.length - 5) : '';
            return {
                num: n,
                start: start

            };
        });
    }

    getDatas(d);

    //获取所有
    async function getDatas(d) {


        //笔趣网  3248375  这个网站 的页面是没有规律的    暂时不用  会找不到页面  不过这个网址比 八一新中网 更全
        // let start = 3929103;
        // for (let i = start; i < start + 10; i++) {
        //     await getData1(i);
        // }
        //八一新中网   94位置  白屏啦
        for (let i = 1019; i < 1100; i++) {
            let isSuccess = await getData(i);
            if (!isSuccess) {
                break;
            }
        }
        console.log('success', success);
        browser.close();
        return success;
    }

    //获取一章
    async function getData(num) {
        //八一新中网
        let url = 'https://www.81xzw.com/book/151103/';
        let time = new Date().getTime() / 1000;
        try {
            let result = await page.goto(url + num + '.html', {
                waitUntil: 'networkidle0',
                timeout: 12000
            });
        } catch (e) {
            console.log('error', e);
            return false;
        }

        let n_time = new Date().getTime() / 1000;
        console.log('n_time', n_time - time, num);
        if (n_time - time > 100) {
            console.log('链接超时，error');
            status = 2;
            return false;
        }
        let cur = null;
        try {
            cur = await page.evaluate(function () {
                let d_tit = document.getElementsByTagName('h1')[0];
                let title = d_tit ? d_tit.innerText : '';
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

        } catch (e) {
            console.log('error', e);
            status = 3;
            return false;
        }
        console.log('data_num', cur);
        if (!cur.title) {
            return false;
        }
        let data = {
            text: '',
        };
        try {
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
                    let title = d_tit ? d_tit.innerText : '';
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
        } catch (e) {
            console.log('errrorrrr', e);
            status = 3;
            return false;
        }

        data.title = cur.title;
        // console.log('data',data);
        if (data.text) {
            if (data.title.indexOf('凡人修仙传') != -1) {
                success.push(data.title);
            }
            writeTxtToFile('\n' + data.title + '\n\n' + data.text, './puppeteer/fiction/fr_1.txt');
        }
        status = 1;
        return true;

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
            writeTxtToFile(data.title + '\n\n' + data.text, './puppeteer/fiction/fr_1.txt');
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
                    status = 4;
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


});




