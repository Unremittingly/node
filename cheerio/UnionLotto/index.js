 var http = require("http");
 var fs = require("fs");
 var cheerio = require("cheerio");
var charset = require("superagent-charset");
 var agent = require("superagent");
 charset(agent); //

let filter = function(html){
    let listData = {
        red:[],
        blue:0
    };
    if(html){
        let $ = cheerio.load(html);
        let content =$('.kjxq_box02');
        let qs = $('.cfont2 strong').text();
        console.log('qs',qs);

        content.find('.ball_box01 li').each(function (key,value) {
            if($(this).hasClass('ball_blue')){
                listData['blue']=$(this).text()
            } else{
                listData['red'].push($(this).text());
            }
        });
        listData['period'] = qs;
    }





    return listData;
};

function insetData() {
    let url = 'http://kaijiang.500.com/shtml/ssq/19008.shtml?0_ala_baidu';
    let html = '';
    let resStr = '';
    agent.get(url).charset('gbk').end(function (err,res) {
        html =res.text;
        let listData =  filter(html);
        console.log('listData',listData);
    })
}
function addData(data,connect) {
    if(connect){

    }
}

insetData();

