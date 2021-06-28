import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { getInfo } from "./crawling/getSubject";
import { getAssignment } from "./crawling/getAssignment";
import { authRouter } from "./routes/auth"
import { assignRouter } from "./routes/assignment";
import { gradeRouter } from "./routes/grade";
import cookieParser from "cookie-parser";
import { decodeJwt, isAuth } from "./utils/middleware";

import session from "express-session";
const MySQLStore = require('express-mysql-session')(session);     
const options = {
    host: "wapdb.chx45as4kgwe.ap-northeast-2.rds.amazonaws.com",
    user: "user", 
    password: process.env.DB_PASSWORD,
    port: "3306",
    database: "pknu"
};

const sessionStore = new MySQLStore(options);

const app = express();

// app.use(
//     session({
//         key : 'key',
//         secret : 'secret',
//         resave : false,
//         store : sessionStore,
//         saveUninitialized: false,
//     })
// ) 

app.use(
    session({
      key: "session_cookie_name",
      secret: "session_cookie_secret",
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
    })
);

app.set('view engine', 'pug'); 
app.use(express.static(path.join(__dirname , 'client')))
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser())


app.get('/', isAuth, (req, res)=>{
    res.sendFile(path.join(__dirname+'/client/html/main.html'));
}) 

app.get('/isauth', (req, res)=>{
    const user = req.session.user;
    if(user){
        return res.json({ logged : true, success : true})
    }
    return res.json({ logged : false, success : true})
})

app.use('/auth', authRouter);
  
app.use('/assign', assignRouter); 

app.use('/grade', gradeRouter); 





const PORT = process.env.PORT || 1000;
app.listen(PORT, ()=>{
    console.log(`http://localhost:${PORT}`)
})
