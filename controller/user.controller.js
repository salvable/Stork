const userService = require('../service/user.service.js')
const accountService = require('../service/account.service.js')
const gradeService = require('../service/grade.service.js')
const createError = require('http-errors')
const models = require('../models')

exports.getUser = async (req, res, next) => {
    const userId = req.params.userId

    console.log(userId)

    if(!userId){
        return res.status(400).send("BadRequestError")
    }

    const user = await userService.getUser(userId)
    const grade = await gradeService.getGrade(userId)

    if(!user || !grade){
        return res.status(404).send("NotFoundError")
    }

    return res.send(
        {
                user: user,
                grade: grade
        })
}

exports.addUser = async (req, res, next) => {
    const userId = req.body.userId
    const password = req.body.password
    const email = req.body.email
    const name = req.body.name
    const phoneNumber = req.body.phoneNumber

    if(!userId || !password || !email || !name || !phoneNumber){
        return res.status(400).send("BadRequestError")
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