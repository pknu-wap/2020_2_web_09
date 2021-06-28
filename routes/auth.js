import express from "express";
import path  from "path";
import { login, register, logout} from "../controllers/auth";
import { kakaoController } from "../controllers/kakaoAuth";
import { onlyPublic, onlyPrivate } from "../utils/middleware";

const authRouter = express.Router();


authRouter.get('/logout', logout);

authRouter.get('/login', onlyPublic, (req, res)=>{
    res.sendFile(path.resolve(__dirname,'../client/html/login.html'));
})

authRouter.post('/login', onlyPublic, login);


authRouter.get('/join', onlyPublic, (req, res)=>{
    res.sendFile(path.resolve(__dirname,'../client/html/join.html'));
})

authRouter.post('/join', onlyPublic, register);


authRouter.get('/redirect/kakao', onlyPublic, kakaoController)


export { authRouter };