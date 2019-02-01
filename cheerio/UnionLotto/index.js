const cheerio = require("cheerio");
const charset = require("superagent-charset");
const agent = require("superagent");
const {selectAll,getTime,connectSql} = require('../../common/sqlOperation');
// const getData = require('../../common/getData').getData;
const {getDataForPuppeteer,getData} = require('../../common/getData');
charset(agent); //

const fs = require('fs');
let arr = [];
let filter = function (html) {
    let listData = {
        red: [],
        blue: 0
    };
    if (html) {
        let $ = cheerio.load(html);
        let content = $('.kjxq_box02');
        let qs = $('.cfont2 strong').text();

        content.find('.ball_box01 li').each(function (key, value) {
            if ($(this).hasClass('ball_blue')) {
                listData['blue'] = $(this).text()
            } else {
                listData['red'].push($(this).text());
            }
        });
        $('.iSelectList a').each(function () {
            arr.push($(this).text());
        });
        let first_dom = $('.kj_tablelist02').eq(1).find('tr').eq(2);
        listData['first_money'] = first_dom.find('td').eq(1).text().replace(/[/\n/\t]/g, '');
        listData['first_num'] = first_dom.find('td').eq(2).text().replace(/[/\n/\t/,]/g, '');
        listData['c_date'] = content.find('.span_right').text();
        listData['period'] = qs;
    }

    return listData;
};

function getIsExist(url) {
    let isExist = false;
    fs.exists(url, function (exists) {
        isExist = exists;
    });
    console.log('isEx', isExist);
    return isExist;
}

function getPeriodForFile() {

    let filePath = './period.txt';
    let data = fs.readFileSync(filePath, {
        flag: 'r',
        encoding: 'utf-8'
    });
    return data.split(',');
}

function writeFile(arr) {
    let filePath = './period.txt';
    // console.log('1',arr.join(','));
    if (!getIsExist(filePath)) {
        console.log('111', arr.length);
        fs.writeFile(filePath, arr.join(','), function (err) {
            console.log('222');
            if (err) {
                console.log('写文件操作失败');
            } else {
                console.log('写文件操作成功');
            }
        });
    } else {
        console.log("文件不存在");
    }
}

//换一个其他网站   就百度搜索的吧

function filterG(html) {
    let listData = {
        red: [],
        blue: 0,

    };
    if (html) {
        let $ = cheerio.load(html);
        $('.result-op').find('.c-gap-top span').each(function () {
            console.log('1', $(this).text());
            if ($(this).hasClass('c-icon-ball-blue')) {
                listData['blue'] = $(this).text();
            } else {
                if ($(this).text() && $(this).text() != '开奖时间：') {
                    listData['red'].push($(this).text());
                }
            }

            let fm = $('.c-border div').eq(2).find('p').eq(0).text().replace(/[/\n/\t]/g, '');
            let fn = $('.c-border div').eq(2).find('p').eq(0).text().replace(/[/\n/\t]/g, '');
            listData['first_money'] = fn.trim();
            listData['first_num'] =  fm.trim();
            listData['c_date'] = $('.c-border div').eq(0).text();
            listData['period'] = $('.c-border div').eq(0).find('b').text();
        })
    }


    return listData;
}

/******
 *
 * @param type 1.只获取当前第一个   2.获取所有  包括没有获取到的
 * @returns {Promise<*|undefined>}
 */
 function insetDataForG(type) {
    let url = 'http://www.cwl.gov.cn/kjxx/ssq/';
    return    getDataForPuppeteer({url: url, type: type}, async function () {
        //这里面使用原生JS获取数据
        let reds = [];

        let index = document.querySelector('.kjnr .xzkjq select').selectedIndex;
        let qs = document.querySelector('.kjnr .xzkjq select').options[index].innerText;//默认第一个
        let c_date = document.querySelector('.kjnr .kjrq').innerText;
        let dom_blue = document.querySelector('.kjnr  .hmj li.qiuL').innerText;
        let dom_red = document.querySelectorAll('.kjnr .hmj li');
        let first_num = document.querySelector('.bqxq  tbody tr .z1').innerText;

        let first_money = document.querySelector('.bqxq  tbody tr .m1').innerText;
        for (let i = 0; i < dom_red.length; i++) {
            let obj = dom_red[i].innerText;
            reds.push(obj);
        }


       // await  document.write("<script src='http://libs.baidu.com/jquery/2.1.1/jquery.min.js'><\/script>");

        return {
            red: reds,
            blue: dom_blue,
            period: qs ? qs.substring(2, qs.length) : 0,
            c_date: c_date,
            first_num: first_num,
            first_money: first_money
        };
    });

}

async function insetData(num) {

    // return false;
    let url = 'http://kaijiang.500.com/shtml/ssq/' + num + '.shtml?0_ala_baidu';
    let html = '';
    agent.get(url).charset('gbk').end( async function (err, res) {
        if (err) {
            console.log('数据读取失败', err);
            let listData =  await insetDataForG(1);
            let connect = connectSql();
            addData(listData, connect);
        } else {
            html = res.text;
            let listData = filter(html);

            // return false;
            let connect = connectSql();
            addData(listData, connect)
        }

    })
}

 function addData(data, connect) {
    if (connect) {

        let time = parseInt(getTime() / 1000);
        let value = '';

        console.log('data111',data);
        // return false;
        // console.log(data);
        value += '("' + data.red.join(',') + '",' + data.blue + ',' + data.period + ',' + time + ',"' + data.c_date + '",' + data.first_money + ',' + data.first_num + '),';

        value = value.substring(0, value.length - 1);
        let sql = 'INSERT INTO unionlotto(red,blue,period,c_time,c_date,first_money,first_num) VALUES' + value;
        connect.query(sql, function (error, result) {
            if (error) {
                console.log('数据添加失败');
            } else {
                console.log('数据添加成功');
            }
            connect.end();
        })
    }
}


function sendUrl() {
    
}

sendUrl();

insetData(19009);
/****
 * 这里是获取所有的  这里递归获取  从select框中获取
 */
let periods = getPeriodForFile();
// periods = periods[0].concat(periods[1]);
// addDataForPeriod(periods,0);
function addDataForPeriod(periods, index) {
    setTimeout(function () {
        insetData(periods[index]);
        if (index < periods.length) {
            console.log('读取添加中中。。。，当前期数为：', periods[index]);
            addDataForPeriod(periods, ++index);
            // console.log('11');
        } else {
            console.log('end');
        }

    }, 1000);

}


/**
 * 查询
 */
function selectUnionLotto() {
    let connect = connectSql();
    if (connect) {
        selectAll('unionlotto',function (data) {
            //返回一群数组
            console.log('data', data);
        });
    }

}

// selectUnionLotto();

