const createError = require('http-errors')
const accountService = require('../service/account.service')

exports.getAccount = async (req, res, next) => {
    const userId = req.params.userId

    if(!userId){
        return next(createError(400, 'BadRequestError'))
    }

    try {
        const account = await accountService.getAccount(userId)

        if(account == "NotFoundError"){
            return next(createError(404, 'NotFoundError'))
        }

        return res.send(
            {
                account: account
            }
        )
    } catch (err) {
        return res.status(500).json(err)
    }
}

exports.addMoney = async (req, res, next) => {
    const accountId = req.params.accountId
    const userId = req.params.userId
    const money = req.query.money


    if(!accountId || !money){
        const err = new Error('BadRequestError')
        err.name = 'BadRequestError'
        throw err
    }

    try {
        const account =await accountService.addMoney(accountId,money)

        if(account == 'NotFoundError'){
            const err = new Error(account)
            err.name = account
            throw err
        }

        const updateAccount = await accountService.getAccount(userId)

        return res.send(
            {
                account: updateAccount
            }
        )
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

exports.subMoney = async (req, res, next) => {
    const accountId = req.params.accountId
    const userId = req.query.userId
    const money = req.query.money


    if(!accountId || !money){
        const err = new Error('BadRequestError')
        err.name = 'BadRequestError'
        throw err
    }

    try {
        const account =await accountService.subMoney(accountId,money)

        if(account == 'NotFoundError'){
            const err = new Error(account)
            err.name = account
            throw err
        }

        const updateAccount = await accountService.getAccount(userId)

        return res.send(
            {
                account: updateAccount
            }
        )
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
