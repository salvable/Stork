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

exports.refreshToken = async (req, res, next) => {
    try {
        req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        return next();
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