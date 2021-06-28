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

gradeRouter.get("/get/scores", onlyPrivate, (req, res)=>{
    const userId = req.session.user['id'];
    db.query('SELECT * FROM averageGrade WHERE userId=?', [userId], (err, result)=>{
        if(err){
            return res.json({success : false, err })
        }
        return res.json({success : true, values : result[0]})
    })
})

gradeRouter.post("/remove", onlyPrivate, (req, res)=>{
    const userId = req.session.user['id'];
    let { id, score , grade } = req.body;

    score = parseFloat(score)
    grade = parseInt(grade)
    const point = score * grade;

    db.query('DELETE FROM grade WHERE id=? and userId=?', [id, userId], (err, result, fields)=>{
        if(err){
            console.log(err)
            return res.json({success : false, err })
        }
        return res.json({success : true})
    })

    db.query(`
        UPDATE averageGrade 
        SET allGradeSum = allGradeSum - ? , allScoreSum = allScoreSum - ?
        WHERE userId = ?`, 
        [grade, point, userId],
        (err, res)=>{
            console.log(err, res)
        }
    )
}) 

gradeRouter.post("/save", onlyPrivate, (req, res)=>{
    const userId = req.session.user['id'];
    if(!req.body) return res.json({success:false, err : 'body is null'});
    const data = req.body;
    console.log(data)
    const { year, subjectTitle, grade, score, field } = data;

    let majorAverage = 0;
    if(field == 'major') majorAverage = score*grade;


    db.query(
    `INSERT INTO averageGrade 
        (allScoreSum, majorScoreSum, allGradeSum, userId) 
    VALUES 
        (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
        allScoreSum = allScoreSum + ?,
        majorScoreSum = majorScoreSum + ?,
        allGradeSum = allGradeSum + ?`
    ,
    [
      score*grade, majorAverage, parseInt(grade), userId,
      score*grade, majorAverage, parseInt(grade)
    ]
    ,(err, result, fields)=>{
        console.error(err)
        console.log(result)
        console.log(fields)
    })

    db.query(
        `INSERT INTO grade
            (subjectTitle, grade, score, userId, field, year)
        VALUES
            (?, ?, ?, ?, ?, ?)
        `,
        [subjectTitle, grade, score, userId, field, year],
        (err ,result)=>{
            if(!err){
                data.id = result.insertId;
                data.success = true;
                return res.json(data);
            }
            return res.json({success : false})
        }
    )
})
  
export { gradeRouter };