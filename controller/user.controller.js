const userService = require('../service/user.service.js')
const accountService = require('../service/account.service.js')
const gradeService = require('../service/grade.service.js')
const createError = require('http-errors')
const models = require('../models')

exports.getUser = async (req, res, next) => {
    const userId = req.params.userId

    if(!userId){
        return next(createError(400, 'BadRequestError'))
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
            case "BadRequestError":
                return next(createError(400, 'BadRequestError'))
            case "NotFoundError":
                return next(createError(404, 'NotFoundError'))
            default:
                return next(createError(500, 'Error'))
        }
    }


}

exports.checkUser = async (req, res, next) => {
    const userId = req.params.userId
    const password = req.query.password

    if(!userId || !password) {
        return next(createError(400, 'BadRequestError'))
    }

    try{
        const user = await userService.checkUser(userId,password)

        if(user.message){
            const err = new Error(user.message)
            throw err
        }

    return res.send(
        {
            result: user
        })

    } catch (err) {
        switch(err.message){
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
        return next(createError(400, 'BadRequestError'))
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
            case "BadRequestError":
                return next(createError(400, 'BadRequestError'))
            case "NotFoundError":
                return next(createError(404, 'NotFoundError'))
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
        return next(createError(400, 'BadRequestError'))
    }

    try {
        const isExistUser = await userService.getUser(userId)

        if(isExistUser.message) {
            const err = new Error(isExistUser.message)
            throw err
        }

        const user = await models.sequelize.transaction(async (t) => {
            const user = await userService.updateUser(userId,password,email,name,phoneNumber,t)

            if(user.message){
                const err = new Error(user.message)
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
        switch(err.message){
            case "BadRequestError":
                return next(createError(400, 'BadRequestError'))
            case "NotFoundError":
                return next(createError(404, 'NotFoundError'))
            default:
                return next(createError(500, 'Error'))
        }
    }
}

exports.deleteUser = async (req, res, next) => {
    const userId = req.params.userId
    const password = req.query.password

    if(!userId || !password){
        return next(createError(400, 'BadRequestError'))
    }

    try {
            const result = await userService.deleteUser(userId, password)
            if(result.message){
                const err = new Error(result.message)
                throw err
            }

        return res.send(
            {
                result: result
            }
        )
    } catch (err) {
        switch(err.message){
            case "BadRequestError":
                return next(createError(400, 'BadRequestError'))
            case "NotFoundError":
                return next(createError(404, 'NotFoundError'))
            default:
                return next(createError(500, 'Error'))
        }
    }
}