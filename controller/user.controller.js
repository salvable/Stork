const userService = require('../service/user.service.js')
const accountService = require('../service/account.service.js')
const createError = require('http-errors')

exports.addUser = async (req, res, next) => {
    const userId = req.body.userId
    const password = req.body.password
    const email = req.body.email
    const name = req.body.name
    const phoneNumber = req.body.phoneNumber

    try {
        const user = await userService.addUser(userId,password,email,name,phoneNumber)

        if(user == "ValidationError"){
            return next(createError(400, 'BadRequestError'))
        }

        const account = await accountService.addAccount(userId)
        if(account == "Bad request"){
            return next(createError(400, 'BadRequestError'))
        }

        return res.send(
            {
                user: user,
                account: account
            }
        )
    } catch (err) {
        return res.status(500).json(err)
    }
}