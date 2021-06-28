import { db } from "../db";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const decodeJwt = (token) =>{
    try{
        const decoded = jwt.decode(token,process.env.JWT_SECRET);
        const id = decoded['id']
        db.query('SELECT * FROM `users` WHERE id = ?', [id], (err, res)=>{
            console.log(res)
            return res
        })
    }catch(err){
        console.log('catch err ' + err)
        return undefined;
    }
}

const isAuth = ( req, res, next ) =>{
    console.log(req.session)

    if (req.session.user) {
        return next();
    } 

    return res.redirect("/auth/login");
}

const onlyPublic = (req, res, next)=>{
    if (!req.session.user) {
        return next();
    } 

    return res.redirect("/");
}

const onlyPrivate = (req, res, next)=>{
    if (req.session.user) {
        return next();
    } 

    return res.redirect("/auth/login");
}


export { isAuth , onlyPublic, onlyPrivate}