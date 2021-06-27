import dotenv from 'dotenv';

dotenv.config();

// db
const mysql = require('mysql');
const db = mysql.createConnection({
    host: "wapdb.chx45as4kgwe.ap-northeast-2.rds.amazonaws.com",
    user: "user", 
    password: process.env.DB_PASSWORD,
    port: "3306",
    database: "pknu"
})

db.connect();

export { db }; 