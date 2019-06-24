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

exports.puppeteerApi = puppeteerApi;
