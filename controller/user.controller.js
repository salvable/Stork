const userService = require('../service/user.service.js')
const accountService = require('../service/account.service.js')
const gradeService = require('../service/grade.service.js')
const createError = require('http-errors')
const models = require('../models')

exports.getUser = async (req, res, next) => {
    const userId = req.params.userId

    if(!userId){
        return next(createError(400, 'Bad request'))
    }

    const user = await userService.getUser(userId)

    if(!user){
        return next(createError(404, 'NotFoundError'))
    }

    return res.send(
        {
                user: user
        })
}

exports.checkUser = async (req, res, next) => {
    const userId = req.params.userId
    const password = req.query.password

    if(!userId || !password) {
        return next(createError(400, 'Bad request'))
    }

    try{
        const user = await userService.checkUser(userId,password)

        if(user == "NotFoundError" || user == "BadRequestError"){
            const err = new Error(user)
            err.name = user
            throw err
        }

    return res.send(
        {
            result: user
        })

    } catch (err) {
        switch(err.name){
            case "Bad request":
                return next(createError(400, 'Bad request'))
            case "NotFoundError":
                return next(createError(404, 'NotFoundError'))
            default:
                return next(createError(500, 'Error'))
        }
    }
}

exports.addUser = async (req, res, next) => {
    const userId = req.body.userId
    const password = req.body.password
    const email = req.body.email
    const name = req.body.name
    const phoneNumber = req.body.phoneNumber

    if(!userId || !password || !email || !name || !phoneNumber){
        return next(createError(400, 'Bad request'))
    }


    try {
        const {user,account,grade} = await models.sequelize.transaction(async (t) => {
            const user = await userService.addUser(userId,password,email,name,phoneNumber,t)

            if(user == "Conflict"){
                const err = new Error("Conflict")
                err.name = "Conflict"
                throw err
            }

            const account = await accountService.addAccount(userId,t)
            if(account == "Bad request"){
                const err = new Error("Bad request")
                err.name = "Bad request"
                throw err
            }

            const grade = await gradeService.addGrade(userId,t)
            if (grade == "Conflict"){
                const err = new Error("Conflict")
                err.name = "Conflict"
                throw err
            }
            return {user,account,grade}
        })

        return res.send(
            {
                user: user,
                account: account,
                grade: grade
            }
        )
    } catch (err) {
        switch(err.name){
            case "Conflict":
                return next(createError(409, 'Conflict'))
            case "Bad request":
                return next(createError(400, 'Bad request'))
            default:
                return next(createError(500, 'Error'))
        }
    }
}

exports.updateUser = async (req, res, next) => {
    const password = req.body.password
    const email = req.body.email
    const name = req.body.name
    const phoneNumber = req.body.phoneNumber
    const userId = req.params.userId

    if(!userId || !password || !email || !name || !phoneNumber){
        return next(createError(400, 'Bad request'))
    }

    const isExistUser = await userService.getUser(userId)

    if(isExistUser == "NotFoundError"){
        return next(createError(404, 'NotFoundError'))
    }

    try {

        const user = await models.sequelize.transaction(async (t) => {
            const user = await userService.updateUser(userId,password,email,name,phoneNumber,t)

            if(user == "Conflict"){
                const err = new Error("Conflict")
                err.name = "Conflict"
                throw err
            }

            return user
        })

        return res.send(
            {
                user: user,

            }
        )
    } catch (err) {
        switch(err.name){
            case "Conflict":
                return next(createError(409, 'Conflict'))
            case "Bad request":
                return next(createError(400, 'Bad request'))
            default:
                return next(createError(500, 'Error'))
        }
    }
}

exports.deleteUser = async (req, res, next) => {
    const userId = req.body.userId
    const password = req.body.password

    if(!userId || !password){
        return next(createError(400, 'Bad request'))
    }

    try {
            const result = await userService.deleteUser(userId,password)
            if(result == "NotFoundError" || result == "SequelizeForeignKeyConstraintError"){
                const err = new Error(result)
                err.name = result
                throw err
            }

        return res.send(
            {
                result: result
            }
        )
    } catch (err) {
        switch(err.name){
            case "Bad NotFoundError":
                return next(createError(404, 'Bad NotFoundError'))
            default:
                return next(createError(500, 'Error'))
        }
    }
}