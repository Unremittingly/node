const  http = require('http');
const express = require('express');
const cheerio = require('cheerio');
const path = require('path');
const app = express();
const getData = require('../../common/getData').getData;
app.use(express.static(path.join(__dirname)));
app.get('/shake',function (req,res) {
    let url = 'http://kaijiang.500.com/shtml/ssq/index.shtml';
    getData({
        url:url
    },function (html) {
       return  filter(html,url)
    },function (data) {
        console.log('data',data);
        res.json({
            'ok':true,
            'data':data,
        })
    })
});
function filter(html,url) {
    if(html){
        // 沿用JQuery风格，定义$
        let $ = cheerio.load(html);
        let content = $('.kj_main01_right');
        let $number = content.find('.ball_box01').eq(0);
        console.log('$number',$number.text());
        $number.find('li').each(function (key,value) {
            console.log($(value).text());
        })
    }
}

app.listen('7777',function () {
    console.log('监听7777端口');
});