let express = require('express');
let http = require('http');
let app = express();

app.use('/',function (req,res,next) {
    console.log('first');
    next();
});
app.use('/',function (req,res,next) {
    console.log('second');
    next();
});
app.use(function (req,res,next) {

    console.log('中间件1');
    next();
});
app.use(function (req,res,next) {
    console.log('中间件2');
    next();
});
app.use(function (req,res) {

    res.writeHead(200,{'content-type':'text/html;charset=utf-8'});
    res.write('<h2>end</h2>');
    res.end('');
    console.log('last end ');
});

app.listen('2345');

// var url = require('url');
// var a = url.parse('http://localhost:8080/one?a=index&t=article');
// console.log(a);


