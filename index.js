import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { getInfo } from "./crawling/getSubject";
import { getAssignment } from "./crawling/getAssignment";
import { authRouter } from "./routes/auth"
import { assignRouter } from "./routes/assignment";

dotenv.config();


const app = express();
app.set('view engine', 'pug'); 
app.use(express.static(path.join(__dirname , 'public')))
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended:false}))

app.get('/', (req, res)=>{
    res.send("hello!")
})

app.use('/auth', authRouter);

app.use('/assign', assignRouter);

app.get('/api/test', (req, res)=>{
    db.query(
        "SELECT name FROM user",
        (err, result) =>{
            if(err) return res.send("ERROR")
            res.send(result)
        }
    )
})





const PORT = process.env.PORT || 1000;
app.listen(PORT, ()=>{
    console.log(`http://localhost:${PORT}`)
})
