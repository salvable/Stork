const jwt = require("jsonwebtoken");
const userService = require('../service/user.service.js')
const secretObj = require("../config/jwt")
const db = require('../models')
const users = db["users"]
const createError = require('http-errors')
const authService = require('../service/auth.service')
const passport = require('passport');

exports.Login = async (req, res, next) => {

    try {
        // 아까 local로 등록한 인증과정 실행
        passport.authenticate('local', (passportError, user, info) => {
            // 인증이 실패했거나 유저 데이터가 없다면 에러 발생
            if (passportError || !user) {
                console.log(user, passportError, info)
                res.status(400).json({ message: info.reason });
                return;
            }

            // user데이터를 통해 로그인 진행
            req.login(user, { session: false }, (loginError) => {
                if (loginError) {
                    res.send(loginError);
                    return;
                }

                // 클라이언트에게 JWT생성 후 반환
                const token = jwt.sign({id: user.userId}, secretObj.secret, {expiresIn: '30m'})
                const refreshToken = jwt.sign({id: user.userId}, secretObj.secret, {expiresIn: '7d'})
                res.json({
                    token: token,
                    refreshToken: refreshToken
                });
            });
        })(req, res);
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.checkAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")
        //token[0]는 방식, basic or bearer
        //token[1]은 accessToken
        if(token[0] == "Bearer"){
            const checkAuth = jwt.verify(token[1], secretObj.secret);
            const user = await userService.getUser(checkAuth.id)

            if(user == "SequelizeDatabaseError"){
                throw new Error
            }

            return res.status(200).json({
                userId: checkAuth.id
            });
        }

        return res.status(200).json({
            response: true
        });
    }

    catch (error) {
        //기간만료
        if (error.name === 'TokenExpiredError') {
            return res.status(419).json({
                code: 419,
            });
        }

        // 토큰의 비밀키 불일치
        return res.status(401).json({
            code: 401,
        });
    }
}

exports.refreshToken = async (req, res, next) => {
    try {
        req.decoded = jwt.verify(req.headers.authorization, secretObj.secret);

        //Todo
        //refreshToken이 만료되지 않았다면 해당 토큰을 디코드하여 id를 얻어와 토큰과 리프레시토큰을 재발급
        const token = await authService.signAccessToken(req.decoded.id)
        const refreshToken = await authService.signRefreshToken(req.decoded.id)
        res.cookie("user", token);
        res.json({
            token: token,
            refreshToken: refreshToken
        })
    }

    catch (error) {
        //기간만료
        if (error.name === 'TokenExpiredError') {
            return res.status(419).json({
                code: 419,
            });
        }

        // 토큰의 비밀키 불일치
        return res.status(401).json({
            code: 401,
        });
    }
}