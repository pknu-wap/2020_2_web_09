import express from "express";
import axios from "axios";
import qs from "qs"
import path from "path";
import { db } from "../db";
import { getAssignment } from "../crawling/getAssignment";
import { onlyPublic, onlyPrivate } from "../utils/middleware";

const gradeRouter = express.Router(); 

function saveData(data, userId) {
    const { year, subjectTitle, grade, score, field } = data;
    const promises = {};
    return new Promise((resolve, reject)=>{
        db.query(
            `INSERT INTO grade 
            (year, subjectTitle, grade, score, field, userId) 
            VALUES (?, ?, ?, ?, ?, ?);`,
            [year, subjectTitle, grade, score, field, userId],
            ((err, res, feilds)=>{            
                if(err){
                    return reject(err) 
                }   
                promises.id = res.insertId;
                promises.subjectTitle = subjectTitle;
                promises.grade = grade; 
                promises.score = score;
                promises.field = field;
                promises.year = year;
                resolve(promises); 
            })
        ) 
    })
}


gradeRouter.get("/rest", (req, res)=>{
    res.sendFile(path.resolve(__dirname,'../client/html/grade_calculate_current.html'));
})


gradeRouter.get("/average", (req, res)=>{
    res.sendFile(path.resolve(__dirname,'../client/html/grade_calculate_average.html'));
})


gradeRouter.get("/get/all", onlyPrivate, (req, res)=>{
    const userId = req.session.user['id'];
    db.query('SELECT * FROM grade WHERE userId=?', [userId], (err, result)=>{
        if(err){
            return res.json({success : false, err })
        }
        return res.json({success : true, values : result})
    })
})

gradeRouter.post("/save", onlyPrivate, (req, res)=>{
    const userId = req.session.user['id'];
    if(!req.body) return res.json({success:false, err : 'body is null'});

    let majorHap = 0;
    let hap = grade * score;
    let cnt = 0;

    const { field , grade, score } = req.body;
    if(field == 'major'){
        majorHap = hap
    }

    // db.query(`UPDATE averageGrade SET grade_sum = grade_sum + ${grade} WHERE userId = ${userId}`, 
    // (err, result)=>{
    //     if(err) console.log(err)
    //     console.log(result)
    // })

    db.query(`INSERT INTO averageGrade (all, major, points, grade_sum, userId)
    VALUSES (?, ?, ?, ?) 
    `, [hap, majorHap, grade, userId],
    (err, result)=>{
        console.log(result)
    })

    // saveData(req.body, userId)
    // .then(value=>{
    //     value.success = true
    //     return res.json(value)
    // })
    // .catch(err=>{
    //     return res.json({success:false, err})
    // })
})
  
export { gradeRouter };