/**
 * Created by qiang on 2018/3/12.
 */

const {Builder, By, Key, until} = require('selenium-webdriver');
const {Options} = require('selenium-webdriver/chrome');

const webdriver = require('selenium-webdriver');




var driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new Options().excludeSwitches(["ignore-certificate-errors", 'user-data-dir="C:\\Users\\qiang\\AppData\\Local\\Google\\Chrome\\User Data"']))
    .build();

driver.get('http://www.baidu.com')
    .then(function () {
        console.log('2222');
   }).catch(function (e) {
    console.log('2222', e);
});



let span = driver.findElement(By.id('u1'));
let tj_trnews = driver.findElement(By.name('tj_trnews'));
let searchIpt = driver.findElement(By.id('kw'));
let searchBtn = driver.findElement(By.id('su'));
let searchStr = 'aa';
searchIpt.sendKeys(searchStr);

// driver.get('http://127.0.0.1:7777').then(function () {
//     let select = driver.findElement(By.xpath('option'));
//     console.log('select',select.length);
// });

//模拟点击事件
// tj_trnews.click(function () {
//
// });
//模拟搜索点击事件
searchBtn.click(function () {

});


