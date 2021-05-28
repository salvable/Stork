const userService = require('../service/user.service.js')
const accountService = require('../service/account.service.js')
const gradeService = require('../service/grade.service.js')
const createError = require('http-errors')
const models = require('../models')

exports.getUser = async (req, res, next) => {
    const userId = req.body.userId

    if(!userId){
        return next(createError(400, 'BadRequestError'))
    }

    try {
        const user = userService.getUser(userId)
        const grade = gradeService.getGrade(userId)

        if(!user || !grade){
            return next(createError(404, 'NotFoundError'))
        }

        return res.send(
            {
                user: user,
                grade: grade
            }
        )
    } catch (err) {
        return res.send({
            error: err.name
        })
    }
}

exports.addUser = async (req, res, next) => {
    const userId = req.body.userId
    const password = req.body.password
    const email = req.body.email
    const name = req.body.name
    const phoneNumber = req.body.phoneNumber

    try {

        const {user,account,grade} = await models.sequelize.transaction(async (t) => {
            const user = await userService.addUser(userId,password,email,name,phoneNumber,t)

            if(user == "ValidationError"){
                const err = new Error("ValidationError")
                err.name = "ValidationError"
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
        return res.send({
            error: err.name
        })
    }
}