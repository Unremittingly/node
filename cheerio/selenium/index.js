/**
 * Created by qiang on 2018/3/12.
 */

const {Builder, By, Key, until} = require('selenium-webdriver');
const {Options} = require('selenium-webdriver/chrome');




var driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new Options().excludeSwitches(["ignore-certificate-errors", 'user-data-dir="C:\\Users\\qiang\\AppData\\Local\\Google\\Chrome\\User Data"']))
    .build();

driver.get('http://127.0.0.1:7777/')
    .then(function () {
        console.log('2222');
   }).catch(function (e) {
    console.log('2222', e);
});

let select =  driver.find(By.id('select'));
let span = driver.findElement(By.id('span'));
console.log('select',select,span);

