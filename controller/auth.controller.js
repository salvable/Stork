const jwt = require("jsonwebtoken");
const userService = require('../service/user.service.js')
const secretObj = require("../config/jwt")
const db = require('../models')
const users = db["users"]
const createError = require('http-errors')

exports.getAuth = async (req, res, next) => {

    const id = req.body.id
    const password = req.body.password

    if(!id || !password){
        return next(createError(400, 'BadRequestError'))
    }

    const user = await userService.getUser(id,password)

    if(user == "NotFoundError"){
        return next(createError(404, 'NotFoundError'))
    }

    const token = jwt.sign({
            id: id,
            password: password
        },
        secretObj.secret,
        {
            expiresIn: '15m'
        }
    )

    res.cookie("user", token);
            res.json({
                token: token
            })
}