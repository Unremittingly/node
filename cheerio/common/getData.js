const http = require('http');


const  getData = function (params,filter,callback) {

    let  url = params.url||'';
    if(!url){
        return {};
    }
    console.log('url',url);
    let listData = {};
    http.get(url,{
        json:true
    }, function (res) {
        let html = '';
        res.on('data', function (data) {
            html += data;
        });
        //结束
        res.on('end',  async function () {

            // let slideListData = filter(html);

            //获取数据

            listData = await filter(html,url);
            if(callback){
                callback(listData);
            }
        })

    }).on('error', function () {
        console.log('获取数据出错');
    });
};


exports.getData = getData;