const createError = require('http-errors')
const accountService = require('../service/account.service')

exports.getAccount = async (req, res, next) => {
    const userId = req.params.userId

    if(!userId){
        return next(createError(400, 'BadRequestError'))
    }

    try {
        const account = await accountService.getAccount(userId)

        if(account.message){
            const err = new Error(account.message)
            throw err
        }

        return res.send(
            {
                account: account
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

exports.addMoney = async (req, res, next) => {
    const accountId = req.params.accountId
    const userId = req.params.userId
    const money = req.query.money


    if(!accountId || !money || !userId){
        return next(createError(400, 'Bad request'))
    }

    try {
        const account =await accountService.addMoney(userId, accountId, money)

        if(account.message){
            const err = new Error(account.message)
            throw err
        }

        const updateAccount = await accountService.getAccount(userId)

        return res.send(
            {
                account: updateAccount
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

exports.subMoney = async (req, res, next) => {
    const accountId = req.params.accountId
    const userId = req.params.userId
    const money = req.query.money

    if(!accountId || !money || !userId){
        return next(createError(400, 'Bad request'))
    }

    try {
        const account = await accountService.subMoney(userId, accountId, money)

        if(account.message){
            const err = new Error(account.message)
            throw err
        }

        const updateAccount = await accountService.getAccount(userId)

        return res.send(
            {
                account: updateAccount
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
