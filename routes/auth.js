import express from "express";
import axios from "axios";
import qs from "qs"
import path  from "path";

const authRouter = express.Router();

authRouter.get('/login', (req, res)=>{
    res.sendFile(path.resolve(__dirname,'../client/login.html'));
})


authRouter.get('/join', (req, res)=>{
    res.sendFile(path.resolve(__dirname,'../client/join.html'));
})


//https://kauth.kakao.com/oauth/authorize?response_type=code&client_id={REST_API_KEY}&redirect_uri={REDIRECT_URI}

authRouter.get('/redirect/kakao', (req, res)=>{
    if(req.query.error){
        return res.end();
    }
    // 인가코드
    const code = req.query.code;
    // 파라미터
    const data =  {
        grant_type: "authorization_code",
        client_id: process.env.K_RESTAPI_KEY,
        redirect_uri: "http://localhost:1000/auth/redirect/kakao/",
        code: code,
    }
    // 헤더
    const headers = {
        "content-type" : "application/x-www-form-urlencoded"
    }
    // 인증 코드로 토큰 요청
    axios.default.post('https://kauth.kakao.com/oauth/token', qs.stringify(data), { headers })
    .then(async (value) => {
        // 토큰 전달
        const { data : { access_token } } = value;
        
        // 토큰으로 api호출 
        try {
            const userInfo = await axios({
              method: "GET",
              url: "https://kapi.kakao.com/v2/user/me",
              headers: {
                Authorization: `Bearer ${access_token}`
              }
            });

            const {
                properties : { nickname, profile_image },
                id
            } = userInfo.data;

            console.log(userInfo.data)
        } catch (error) {
            console.log(error, 'token-login-err')
            return res.redirect('/auth/login');
        }

    })
    .catch(err=>{
        console.log(err, 'err')
        return res.redirect('/auth/login');
    })
})


export { authRouter };