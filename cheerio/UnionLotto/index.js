
 const cheerio = require("cheerio");
 const charset = require("superagent-charset");
 const agent = require("superagent");
 const connectSql  = require('../common/sqlOperation').connectSql;
 const getTime = require('../common/sqlOperation').getTime;
 charset(agent); //

 const fs  = require('fs');
let arr = [];
let filter = function(html){
    let listData = {
        red:[],
        blue:0
    };
    if(html){
        let $ = cheerio.load(html);
        let content =$('.kjxq_box02');
        let qs = $('.cfont2 strong').text();

        content.find('.ball_box01 li').each(function (key,value) {
            if($(this).hasClass('ball_blue')){
                listData['blue']=$(this).text()
            } else{
                listData['red'].push($(this).text());
            }
        });
        $('.iSelectList a').each(function () {
           arr.push($(this).text());
        });
        let first_dom = $('.kj_tablelist02').eq(1).find('tr').eq(2);
        listData['first_money'] = first_dom.find('td').eq(1).text().replace(/[/\n/\t]/g,'');
        listData['first_num'] = first_dom.find('td').eq(2).text().replace(/[/\n/\t/,]/g,'');
        listData['c_date'] = content.find('.span_right').text();
        listData['period'] = qs;
    }



    // console.log('arr',arr);

    // writeFile(arr);

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
   let data =   fs.readFileSync(filePath,{
         flag: 'r',
         encoding: 'utf-8'
     });
     return  data.split(',');
 }
function writeFile(arr) {
    let filePath = './period.txt';
    // console.log('1',arr.join(','));
    if(!getIsExist(filePath)){
        console.log('111',arr.length);
        fs.writeFile(filePath,arr.join(','), function (err) {
            console.log('222');
            if (err) {
                console.log('写文件操作失败');
            } else {
                console.log('写文件操作成功');
            }
        });
    }else{
        console.log("文件不存在");
    }
}



function insetData(num) {
    let url = 'http://kaijiang.500.com/shtml/ssq/'+num+'.shtml?0_ala_baidu';
    let html = '';
    agent.get(url).charset('gbk').end(function (err,res) {
        if(err){
            console.log('数据读取失败');
        }else{
            html =res.text;
            let listData =  filter(html);

            // return false;
            let connect = connectSql();
            addData(listData,connect)
        }

    })
}
function addData(data,connect) {
    if(connect){

        let time = parseInt(getTime() / 1000) ;
        let value = '';

        // console.log(data);
        value += '("' + data.red.join(',') + '",' + data.blue + ',' + data.period + ',' + time + ',"' + data.c_date + '",'+data.first_money+','+data.first_num +'),';

        value = value.substring(0, value.length - 1);
        let sql = 'INSERT INTO unionlotto(red,blue,period,c_time,c_date,first_money,first_num) VALUES' + value;
        connect.query(sql,function (error,result) {
            if (error) {
                console.log('数据添加失败');
            } else {
                console.log('数据添加成功');
            }
            connect.end();
        })
    }
}

let periods = getPeriodForFile();
// periods = periods[0].concat(periods[1]);
addDataForPeriod(periods,0);
function addDataForPeriod(periods,index) {
    setTimeout(function () {
        insetData(periods[index]);
        if(index<periods.length){
            console.log('读取添加中中。。。，当前期数为：',periods[index]);
            addDataForPeriod(periods,++index);
            // console.log('11');
        }else{
            console.log('end');
        }

    },1000);

}
