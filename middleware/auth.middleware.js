const jwt = require("jsonwebtoken");
const userService = require('../service/user.service.js')
const secretObj = require("../config/jwt")
const createError = require("http-errors");

exports.checkAuth = async (req, res, next) => {
    try {
        console.log("req: " + req.userId)

        next()
    }

    catch (error) {
        //기간만료
        if (error.name === 'TokenExpiredError') {
            return next(createError(419, 'TokenExpiredError'))
        }

        // 권한없음
        return next(createError(401, 'Unauthorized'))
    }
}