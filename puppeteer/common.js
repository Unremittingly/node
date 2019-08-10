let  https = require("https");

const fs = require('fs');
const puppeteerApi = function (headless = true) {

    let headLess = headless;
    return require("puppeteer-chromium-resolver")({
        //hosts: ["https://storage.googleapis.com", "https://npm.taobao.org/mirrors"]
    }).then(async function (revisionInfo) {
        return await revisionInfo.puppeteer.launch(
            {
                headless: headLess,//这个参数控制是否需要打开浏览器  无头浏览
                executablePath: revisionInfo.executablePath
            }
        );
    });
};



function downLoads(urls,basePath,http) {

    if(http){
        https = http;
    }
    (async (__filename) => {
        fs.stat(__filename, (err) => {
            if (err) {
                fs.mkdir(__filename, (e) => {
                    if (e) {
                        console.log(e);
                    }
                });
            }
        })
    })(basePath);

    for (let i = 0; i < urls.length; i++) {
        let url = urls[i];
        downLoad(url,basePath);
    }

}

function downLoad(url,basePath) {
    https.get(url, function (res) {
        let imgData = "";
        let urlArr = url.split('/');
        let fileName = urlArr[urlArr.length - 1];
        let filePath = (fileName.split('.').length > 1) ? basePath + fileName : basePath + fileName + '.png';
        res.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开
        res.on("data", function (chunk) {
            imgData += chunk;
        });
        res.on("end", function () {
            // return false;
            fs.writeFile(filePath, imgData, "binary", function (err) {
                if (err) {
                    console.log("down fail", error);
                } else {
                    console.log("down success");
                }
            });
        });
    });
}

exports.downImg = downLoads;
exports.puppeteerApi = puppeteerApi;
