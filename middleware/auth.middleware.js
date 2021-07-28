const jwt = require("jsonwebtoken");
const userService = require('../service/user.service.js')
const secretObj = require("../config/jwt")
const createError = require("http-errors");

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