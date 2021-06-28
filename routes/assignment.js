import express from "express";
import axios from "axios";
import qs from "qs"
import path from "path";
import { db } from "../db";
import { getAssignment } from "../crawling/getAssignment";
import { onlyPublic, onlyPrivate } from "../utils/middleware";

const assignRouter = express.Router();


function saveData(assign, userId) {
    const promises = {};
    return new Promise((resolve, reject)=>{
        db.query(
            "INSERT INTO `assignment` (subjectName, detail, deadline, userId) VALUES (?, ?, CAST(? AS DATETIME) + INTERVAL 1 DAY , ?);",
            [assign.subjectName, assign.content, assign.date, userId],
            ((err, res, feilds)=>{            
                if(err){
                    return reject(err) 
                }   
                promises.id = res.insertId;
                promises.subjectName = assign.subjectName;
                promises.content = assign.content
                promises.date = assign.date;
                resolve(promises);
            })
        ) 
    })
}


assignRouter.get('/page', onlyPrivate, (req, res)=>{
    res.sendFile(path.resolve(__dirname,'../client/html/assignment.html'));
})

assignRouter.get('/get/:order', onlyPrivate, (req, res)=>{
    const { id } = req.session.user;
    const order = req.params.order;

    let queryStr = "SELECT * FROM assignment WHERE userId = ?";
    if(order == 'recent'){
        queryStr = 'SELECT * FROM assignment WHERE userId = ? ORDER BY deadline ASC'
    }else if(order == 'limit'){
        queryStr = 'SELECT * FROM assignment WHERE userId = ? ORDER BY deadline ASC LIMIT 4'
    }

    db.query(queryStr, [id], (err, assigns)=>{
        if(err){
            return res.send('404')
        }
        console.log(assigns)
        return res.json(assigns);
    })
})


assignRouter.post('/async', onlyPrivate,  (req, res)=>{
    const { id : lms_id, pw : lms_pw} = req.body;
    const userId = req.session.user['id'];

    console.log(lms_id, lms_pw)
    getAssignment(lms_id , lms_pw , async function(datas, gettingError){
        if(gettingError) return res.json({success : false, gettingError});
        const promises = [];

        datas.map(data=>{
            promises.push(
                new Promise(resolve=>{
                    saveData(data, userId)
                    .then(values=>{
                        resolve(values)
                    })
                    .catch(err=>{
                        console.error(err)
                    })
                })
            )
        })

        Promise.all(promises).then(values=>{
            return res.json(values)
        })
    })
})


assignRouter.post('/save', onlyPrivate, (req, res)=>{
    const assignObj = req.body;
    console.log(assignObj);
    if(!assignObj) return res.status(300).send('404')

    const userId = req.session.user['id'];
    saveData(assignObj, userId)
    .then(value=>{
        return res.json(value)
    })
})


assignRouter.get('/delete/:id', onlyPrivate, (req, res)=>{
    const id = req.params.id;
    const userId = req.session.user['id'];
    db.query('DELETE FROM assignment WHERE id=? and userId=?', [id, userId], (err, result, fields)=>{
        if(err){
            console.log(err)
            return res.send('404')
        }
        console.log(result)
    })
})


export { assignRouter };


