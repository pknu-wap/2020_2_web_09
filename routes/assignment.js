import express from "express";
import axios from "axios";
import qs from "qs"
import path from "path";
import { db } from "../db";
import { getAssignment } from "../crawling/getAssignment";
import { onlyPublic, onlyPrivate } from "../utils/middleware";

const assignRouter = express.Router();



assignRouter.get('/page', onlyPrivate, (req, res)=>{
    res.sendFile(path.resolve(__dirname,'../client/html/assignment.html'));
})

assignRouter.get('/get/:order', onlyPrivate, (req, res)=>{
    const { id } = req.session.user;
    const order = req.params.order | '';
    console.log(req.session)
    db.query('SELECT * FROM assignment WHERE userid = ?', [id], (err, assigns)=>{
        return res.json(assigns);
    })
})

function saveData(assign) {
    const promises = {};
    return new Promise((resolve, reject)=>{
        db.query(
            "INSERT INTO `assignment` (subjectName, detail, deadline) VALUES (?, ?, CAST(? AS DATE));",
            [assign.subjectName, assign.content, assign.date],
            ((err, res, feilds)=>{                
                promises.id = res.insertId;
                promises.subjectName = assign.subjectName;
                promises.content = assign.content
                promises.date = assign.date;
                resolve(promises);
            })
        ) 
    })
}

assignRouter.post('/async', (req, res)=>{
    const { id : lms_id, pw : lms_pw} = req.body;
    console.log(lms_id, lms_pw)
    getAssignment(lms_id , lms_pw , async function(datas, gettingError){
        if(gettingError) return res.json({success : false, gettingError});
        const promises = [];

        datas.map(data=>{
            promises.push(
                new Promise(resolve=>{
                    saveData(data)
                    .then(values=>{
                        resolve(values)
                    })
                })
            )
        })

        Promise.all(promises).then(values=>{
            return res.json(values)
        })
    })
})


assignRouter.get('/complete', (req, res)=>{
    res.sendFile(path.resolve(__dirname,'../client/html/assignment.html'));
})



export { assignRouter };



// new Promise((resolve, rej)=>{
//     for(let i=0; i<datas.length; i++){
//         let flag = false;
//         const data = datas[i]
//         db.query(
//             "INSERT INTO `assignment` (subjectName, detail, deadline) VALUES (?, ?, CAST(? AS DATE));",
//             [data.subjectName, data.content, data.date],
//             ((err, res, feilds)=>{
//                 datas[i]['id'] = res.insertId
//                 console.log("1111111")
//                 console.log(datas)
//             })
//         ) 

//         console.log("22222222222")
//         console.log(datas)
//     }
//     console.log("3333333333333")
//     console.log(datas)
//     resolve(true)
// })
// .then(success=>{
//     console.log("2")
//     return res.json(datas)
// })