const http = require("http");
 const fs = require("fs");
 const cheerio = require("cheerio");
 const charset = require("superagent-charset");
 const agent = require("superagent");
 const connectSql  = require('../common/sqlOperation').connectSql;
 const getTime = require('../common/sqlOperation').getTime;
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
        let first_dom = $('.kj_tablelist02').eq(1).find('tr').eq(2);
        listData['first_money'] = first_dom.find('td').eq(1).text().replace(/[/\n/\t]/g,'');
        listData['first_num'] = first_dom.find('td').eq(2).text().replace(/[/\n/\t/,]/g,'');
        listData['c_date'] = content.find('.span_right').text();
        listData['period'] = qs;
    }





    return listData;
};

function insetData() {
    let url = 'http://kaijiang.500.com/shtml/ssq/18151.shtml?0_ala_baidu';
    let html = '';
    let resStr = '';
    agent.get(url).charset('gbk').end(function (err,res) {
        html =res.text;
        let listData =  filter(html);

        let connect =connectSql();
        addData(listData,connect)
    })
}
function addData(data,connect) {
    if(connect){

        let time = parseInt(getTime() / 1000) ;
        let value = '';

        console.log(data);
        value += '("' + data.red.join(',') + '",' + data.blue + ',' + data.period + ',' + time + ',"' + data.c_date + '",'+data.first_money+','+data.first_num +'),';

        value = value.substring(0, value.length - 1);
        console.log('value', value);
        let sql = 'INSERT INTO unionlotto(red,blue,period,c_time,c_date,first_money,first_num) VALUES' + value;
       console.log('sql',sql);
        connect.query(sql,function (error,result) {
            if (error) {
                console.log('数据添加失败', error);
            } else {
                console.log('result', result);
            }
            connect.end();
        })
    }
}

insetData();

