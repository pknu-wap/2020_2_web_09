import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { getInfo } from "./crawling/getSubject";
import { getAssignment } from "./crawling/getAssignment";
import { authRouter } from "./routes/auth"
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

const app = express();
app.set('view engine', 'pug'); 
app.use(express.static(path.join(__dirname , 'public')))
app.use(morgan('dev'))

app.get('/', (req, res)=>{
    res.send("hello!")
})

app.use('/auth', authRouter);

app.get('/api/test', (req, res)=>{
    db.query(
        "SELECT name FROM user",
        (err, result) =>{
            if(err) return res.send("ERROR")
            res.send(result)
        }
    )
})


app.get('/assignment/async', (req, res)=>{
    // const { lms_id, lms_pw } = req.body;
    getAssignment(process.env.SMART_LMS_ID , process.env.SMART_LMS_PW , async function(datas, gettingError){
        if(gettingError) return res.json({success : false, gettingError});
        for(let i=0; i<datas.length; i++){
            let flag = false;
            const data = datas[i]
            db.query(
                "INSERT INTO `assignment` (ssubjectName, detail, deadline) VALUES (?, ?, CAST(? AS DATE));",
                [data.subjectName, data.content, data.date],
            ).on('error',(err)=>{
                console.log("err!")
            })
        }
    })
})



const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>{
    console.log(`http://localhost:${PORT}`)
})
