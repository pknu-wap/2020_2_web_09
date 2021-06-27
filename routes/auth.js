import express from "express";
import path  from "path";
import { login, register } from "../controllers/auth";
import { kakaoController } from "../controllers/kakaoAuth";

const authRouter = express.Router();

authRouter.get('/login', (req, res)=>{
    res.sendFile(path.resolve(__dirname,'../client/login.html'));
})

authRouter.post('/login', login);


authRouter.get('/join', (req, res)=>{
    res.sendFile(path.resolve(__dirname,'../client/join.html'));
})

authRouter.post('/join', register);


authRouter.get('/redirect/kakao', kakaoController)


export { authRouter };