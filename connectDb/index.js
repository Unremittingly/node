
const mysql = require('mysql');

let connection = mysql.createConnection({
    host:'localhost',
    port: '3306',
    user:'root',
    password:'fcymwg&M%8r_',
    database:'test'
});
connection.connect();
let sql = 'SELECT * FROM info';
connection.query(sql,function (err,result) {
   if(err){
       console.log('查询错误',err);
       return  false;
       
   } 
   console.log('----------result-------');
   console.log(result);
});


connection.end();