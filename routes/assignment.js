import express from "express";
import axios from "axios";
import qs from "qs"
import path from "path";
import { db } from "../db";
import { getAssignment } from "../crawling/getAssignment";

const assignRouter = express.Router();

assignRouter.get('/page', (req, res)=>{
    res.sendFile(path.resolve(__dirname,'../client/html/assignment.html'));
})


assignRouter.post('/async', (req, res)=>{
    const { id : lms_id, pw : lms_pw} = req.body;
    console.log(lms_id, lms_pw)
    getAssignment(lms_id , lms_pw , async function(datas, gettingError){
        if(gettingError) return res.json({success : false, gettingError});

        for(let i=0; i<datas.length; i++){
            let flag = false;
            const data = datas[i]
            db.query(
                "INSERT INTO `assignment` (subjectName, detail, deadline) VALUES (?, ?, CAST(? AS DATE));",
                [data.subjectName, data.content, data.date],
            ).on('error',(err)=>{
                console.log("err!")
            })
        }

        return res.json(datas)
    })
})


assignRouter.get('/complete', (req, res)=>{
    res.sendFile(path.resolve(__dirname,'../client/html/assignment.html'));
})


export { assignRouter };