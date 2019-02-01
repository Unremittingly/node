const http = require('http');
const cheerio = require('cheerio');
const express = require('express');
const path = require('path');
const app = express();
const qs = require('querystring');
let getData = require('../common/getData').getData;
let {addData,update} = require('../common/sqlOperation');
let deleteD = require('../common/sqlOperation').deleteData;

app.use(express.static(path.join(__dirname)));

//过滤html  获取数据的规则
let filter = function (html, url) {
    let listData = {
        left: [],
        right: []
    };
    if (html) {
        // 沿用JQuery风格，定义$
        let $ = cheerio.load(html);
        // 根据id获取轮播图列表信息
        let listLeft = $('#content_left');
        let listRight = $('#content_right');

        listLeft.find('.c-container').each(function (i, item) {
            if (i < 3) {
                let $item = $(this);
                let text = $item.find('.t a').text();
                let src = $item.find('.t a').attr('href');
                listData.left.push({
                    text: text ? text.replace(/\r\n/g) : '',
                    src: src ? filterSpecialChars(src) : ''
                });
            }
        });
        listRight.find('.FYB_RD tbody').eq(0).find('tr').each(function (i, item) {
            if (i < 3) {
                let $item = $(this);
                let index = $item.find('span .c-index').text();
                let desc = $item.find('span a').text();

                let src = url + $item.find('span a').attr('href');
                listData.right.push({
                    index: index,
                    desc: desc,
                    src: src ? filterSpecialChars(src) : '',
                });
            }

        });
        listData['img'] = filterSpecialChars($('#lg').find('img').attr('src'));
        return listData;
    } else {
        console.log('无数据传入！');
    }

    function filterSpecialChars(str) {
        //去掉换行 回车 空格
        return str.replace(/\/\r\n/g, '');
    }

    return listData;

};
app.get('/', function (req, res, next) {

    res.json({
        'name': 'test'
    })
});

app.get('/getData', function (req, res) {

    let url = 'http://www.baidu.com/';
    let params = req.query ? req.query : {};
    // console.log('params', params);
    getData(params, function (html) {
        filter(html, url)
    }, function (data) {
        res.json({
            'ok': true,
            'name': 'test',
            'data': data
        });
    });
});
app.get('/addData', function (req, res) {
    let params = req.query ? req.query : {};
    let searchStr = qs.escape(params.str?params.str:'wold');//这个方法将中文转换成浏览器能识别的
    let url = 'http://www.baidu.com/s?wd=' + searchStr + '&rsv_spt=1&rsv_iqid=0xde0f6c3c000402ed&issp=1&f=8&rsv_bp=1&rsv_idx=2&ie=utf-8&rqlang=cn&tn=baiduhome_pg&rsv_enter=1&oq=aa&inputT=547&rsv_t=94d3Z7tMbG%2BpuEnOPrHr1UamFC8HB4%2FDItvkDQxqcgl9VqrcHCHrYr1wf1iLMCQxg5II&rsv_pq=f47fcffb00042e7a&rsv_sug3=7&rsv_sug1=6&rsv_sug7=100&rsv_sug2=0&rsv_sug4=547&rsv_sug=2';
    let domain = 'http://www.baidu.com/';
    getData({url: url}, function (html) {
        return filter(html, domain);
    }, function (data) {
        //插入数据库
        addData(data);
        res.json({
            'ok': true,
            'time': '',
            'data': data
        });
    })
});

/***
 * 直接添加到数据库  不用开启本地服务
 */
insertDataToDataBase();
function insertDataToDataBase() {
    let searchStr = qs.escape('wold');//这个方法将中文转换成浏览器能识别的
    let url = 'http://www.baidu.com/s?wd=' + searchStr + '&rsv_spt=1&rsv_iqid=0xde0f6c3c000402ed&issp=1&f=8&rsv_bp=1&rsv_idx=2&ie=utf-8&rqlang=cn&tn=baiduhome_pg&rsv_enter=1&oq=aa&inputT=547&rsv_t=94d3Z7tMbG%2BpuEnOPrHr1UamFC8HB4%2FDItvkDQxqcgl9VqrcHCHrYr1wf1iLMCQxg5II&rsv_pq=f47fcffb00042e7a&rsv_sug3=7&rsv_sug1=6&rsv_sug7=100&rsv_sug2=0&rsv_sug4=547&rsv_sug=2';
    let domain = 'http://www.baidu.com/';
    getData({url: url}, function (html) {
        return filter(html, domain);
    }, function (data) {
        //插入数据库
        addData(data);
    })
}


/****
 * 修改
 * @type {string}
 */

function updateRank() {
    let rank = '1000';
    let id = 21;
    let sql = 'UPDATE info SET cur_rank = '+rank+' where id='+id+'';
    update(sql,function (result) {
        console.log('result',result);
    });
}
// updateRank();

/****
 * 删除
 */
// deleteD(20);


// app.listen('8090', function () {
//     console.log('服务器启动  监听8090端口,请访问获取百度当前rank排名');
// });





