
//模拟请求
const superagent = require('superagent');
const events = require('events');
const emitter = new events.EventEmitter();
const querystring = require('querystring');
const http =require('http');
function getDataForUrl(urls){
    superagent.post('http://www.cwl.gov.cn/cwl_admin/kjxx/findDrawNotice?name=ssq&issueCount=5')
        .type('text/html;charset=utf-8')
        .set('')
        .end(function (err,res) {

        })
}

let cookie = 'UniqueID=QOVldgdKTwYqMMHa1547713493316; Sites=_21; _ga=GA1.3.831973390.1547445117; _gid=GA1.3.1431945019.1547713495; 21_vq=4';