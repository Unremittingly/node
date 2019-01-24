const http = require('http');
const cheerio = require('cheerio');
const express = require('express');
const app = express();
const util = require('util');
const path = require('path');
const getData = require('../../common/getData').getData;
app.use(express.static(path.join(__dirname)));
app.get('/shake', function (req, res) {
    let url = 'http://127.0.0.1:7777/';
    getData({
        url: url
    }, function (html) {
        return  filter(html);
    }, function (data) {
        res.json(
            {
                'ok': true,
                'data': data
            }
        )
    })

});



async function filter(html, url) {
    let listData = [];



    var p =  await new Promise(function (resolve,reject) {
        setTimeout(function () {
            let $ = cheerio.load(html);
            let list = $('body select');
            console.log('select',list.find('option').length);

            list.find('option').each(function (key,valu) {
                listData.push($(this).val())
            });
            resolve(listData);
            console.log('1111');
        },2000);
    });


    console.log('2222');


    return listData;
}


app.listen('7777');