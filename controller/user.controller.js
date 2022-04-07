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

    try{
        const user = await userService.getUser(userId)

        if(user.message){
            const err = new Error(user.message)
            throw err
        }

        return res.send(
            {
                user: user
            })
    }catch (err){
        switch(err.message){
            case "Bad request":
                return next(createError(400, 'Bad request'))
            case "Not Found":
                return next(createError(404, 'Not Found'))
            case "Conflict":
                return next(createError(409, 'Conflict'))
            default:
                return next(createError(500, 'Error'))
        }
    }


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
            case "BadRequestError":
                return next(createError(400, 'BadRequestError'))
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
            if(user.message){
                const err = new Error(user.message)
                throw err
            }

            const account = await accountService.addAccount(userId,t)
            if(account.message){
                const err = new Error(account.message)
                throw err
            }

            const grade = await gradeService.addGrade(userId,t)
            if(grade.message){
                const err = new Error(grade.message)
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
        switch(err.message){
            case "Bad request":
                return next(createError(400, 'Bad request'))
            case "Not Found":
                return next(createError(404, 'Not Found'))
            case "Conflict":
                return next(createError(409, 'Conflict'))
            default:
                return next(createError(500, 'Error'))
        }
    }
}

exports.updateUser = async (req, res, next) => {
    const userId = req.params.userId
    const password = req.body.password
    const email = req.body.email
    const name = req.body.name
    const phoneNumber = req.body.phoneNumber

    if(!userId || !password || !email || !name || !phoneNumber){
        return next(createError(400, 'Bad request'))
    }

    const isExistUser = await userService.getUser(userId)

    if(isExistUser.message == "Not Found"){
        return next(createError(404, 'Not Found'))
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
    const userId = req.params.userId

    if(!userId){
        return next(createError(400, 'Bad request'))
    }

    try {
            const result = await userService.deleteUser(userId)
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