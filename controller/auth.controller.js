const jwt = require("jsonwebtoken");
const userService = require('../service/user.service.js')
const secretObj = require("../config/jwt")
const db = require('../models')
const users = db["users"]
const createError = require('http-errors')
const authService = require('../service/auth.service')

exports.Login = async (req, res, next) => {
    const id = req.query.id
    const password = req.query.password

    if(!id || !password){
        return next(createError(400, 'BadRequestError'))
    }

    const user = await userService.login(id,password)

    if(user == "NotFoundError"){
        return next(createError(404, 'NotFoundError'))
    }

    const token = await authService.signAccessToken(id)
    const refreshToken = await authService.signRefreshToken(id)

    res.cookie("user", token);
            res.json({
                token: token,
                refreshToken: refreshToken
            })
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
        }

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