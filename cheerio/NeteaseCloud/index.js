const cheerio = require("cheerio");
const fs = require('fs');
const charset = require("superagent-charset");
const agent = require("superagent");
const https = require('https');

charset(agent); //


function getNeteaseCloud() {
    let url = 'https://music.163.com/#/playlist?id=2557908184';

    let opt = {
        hostname: 'music.163.com',
        port: 443,
        path: '/weapi/v1/resource/comments/A_PL_0_2557908184?csrf_token=',
        method: 'POST',
        headers: {
            'Connection': ' keep-alive',
            'Content-Length': '478',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': '_iuqxldmzr_=32; _ntes_nnid=cd158acc40df275d430b34b580e74c0f,1548038813815; _ntes_nuid=cd158acc40df275d430b34b580e74c0f; WM_NI=YAH%2FktYN3W7iuR%2Furg4cxKFmUkyx2lHtm5PdsBieOvUnZ7fWph7wFGmruLLaCwj3eU4H9KiSalHmb6XRhEM0u3DHnXnzDJtwVVR9KjTwK5TbFdP0hyuVB0AdbxHb8Yn1NmI%3D; WM_NIKE=9ca17ae2e6ffcda170e2e6eea7d95e8bb5e1a7ca6387b88aa2c55b978f9b84bb3c9ca7bcafd36ea29d98d3ca2af0fea7c3b92a9b9f88d0ea809b92fdb8b663b78ee196f16df8bdb8acc56797b5b799b1688caca3d6d370b19ea786ce7e97b296d8e55db4b8f998c54dafaebbadcf6b81a9a6d4e85ff898f7acec59a3b4888ee13e9c8ea8a6d03cb7ed8ca9ed54aea68cabf77d968a9edaca6298a985d6d76a86bca0d1eb73b78a8ed1c470a2a88883bb53aeef828ecc37e2a3; WM_TID=1ptOP2gBjZ1BFQEBBQN41XioIKPaDD3O; JSESSIONID-WYYY=edgusfZrztBltK1h8kOe3ZiGlGr91a9jv%2BsGnqlSIijSq0VgMmcAb9EmhnNSNfV1FoIfhieTTblHGFrEW%5C4MO84Ouob%2BB4RSfTjXS10tdpQDf%5Cu2SdokbYB3ruKbS2XhgxhO4rYK3rjpl2%2F0R8E7aOt6YaHcKOGy0GgXS45U%2BCr%5CJypO%3A1548056461483',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'
        }
    };
    let req = https.request(opt, function (res) {

        var json = ""; //定义json变量来接收服务器传来的数据
        console.log(res.statusCode);
        //res.on方法监听数据返回这一过程，"data"参数表示数数据接收的过程中，数据是一点点返回回来的，这里的chunk代表着一条条数据
        res.on("data", function (chunk) {
            json += chunk; //json由一条条数据拼接而成
            // consolnpm e.log('chunk',chunk);
        });
        //"end"是监听数据返回结束，callback（json）利用回调传参的方式传给后台结果再返回给前台
        res.on("end", function () {
            console.log('json',json);
        })
    });
    req.on("error", function (error) {
        console.log('error',error)
    });

    req.end();

}

getNeteaseCloud();
