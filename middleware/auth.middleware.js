const jwt = require("jsonwebtoken");
const userService = require('../service/user.service.js')
const secretObj = require("../config/jwt")
const createError = require("http-errors");

exports.checkAuth = async (req, res, next) => {
    try {
        console.log(req.session)
        next()
    }

    catch (error) {
        // 권한없음
        return next(createError(500, 'Internal Server Error'))
    }
}