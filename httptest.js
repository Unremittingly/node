//导入http模块
var http = require('http');
//导入文件操作模块
var file = require('fs');

//创建HTTP服务器
var server = http.createServer(function(request,response){
    response.writeHead(200,{'content-type':'text/html;charset=utf-8'});
    //读取文件
    file.readFile('message.txt','utf-8', function(err,data){
        if(err){
            response.write('文件httptest.js读取失败！');
        }
        else{
            response.write('<h2>message.txt内容：</h2>');
            response.write('<pre>');
            response.write(data);
            response.write('</pre>');
        }
        response.end('<hr/>');
    });
});

//启动监听
server.listen('9999');

console.log('HTTP服务已启动，监听端口9999');