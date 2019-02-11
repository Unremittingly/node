

const fs =require('fs');





function initChannel() {
    //通过算法读取频道数据到file文件中  这个只有首次才会执行
    let allArr = [];
    let regArr = [12,];

    function writeTxtToFile(str, url) {


        if (!getIsExist(url)) {
            //异步方法
            fs.writeFile(url, '初始化第一行', function (err) {
                if (err) {
                    console.log('写文件操作失败');
                } else {
                    console.log('写文件操作成功');
                }
            });
        } else {
            fs.appendFile(url, str + '\n\n', 'utf8', function (err) {
                if (err) {
                    console.log('追加内容失败');
                } else {
                    console.log('已添加一章');
                }
            })
        }
    }

    async function getIsExist(url) {
        let isExist = false;
        await fs.exists(url, function (exists) {
            isExist = exists;
        });
        return isExist;
    }
}
getChanel();
function  getChanel() {
    let arr = [26021,12007,12008,12009,12012,26043];
    let randoms = [];
    for (let i = 0; i < 10; i++) {
        let random = parseInt(Math.random()*arr.length);
        randoms.push(random);
    }

    console.log(randoms);
    let lastRandom = randoms[parseInt(Math.random()*randoms.length)];

    console.log('last',arr[lastRandom]);
}