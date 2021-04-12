const userService = require('../service/user.service.js')
const accountService = require('../service/account.service.js')
const createError = require('http-errors')
const models = require('../models')

exports.addUser = async (req, res, next) => {
    const userId = req.body.userId
    const password = req.body.password
    const email = req.body.email
    const name = req.body.name
    const phoneNumber = req.body.phoneNumber

    try {

        const {user,account} = await models.sequelize.transaction(async (t) => {
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

            return {user,account}
        })

        return res.send(
            {
                user: user,
                account: account
            }
        )
    } catch (err) {
        return res.send({
            error: err.name
        })
    }
}