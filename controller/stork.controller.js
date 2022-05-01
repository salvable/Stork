const createError = require('http-errors')
const storkService = require('../service/stork.service.js')
const userService = require('../service/user.service.js')
const accountService = require('../service/account.service')
const models = require('../models')


exports.addStork = async (req, res, next) => {
    const userId = req.params.userId
    const accountId = req.params.accountId
    const storkName = req.body.storkName
    const number = req.body.number
    const price = req.body.price

    if(!userId || !storkName || !number || !price || !accountId){
        return next(createError(400, 'BadRequestError'))
    }

    try {
         await models.sequelize.transaction(async (t) => {
            const account = await accountService.subMoneyByStork(userId, accountId, number, price, t)

            if(account.message){
                const err = new Error(account.message)
                throw err
            }

            const stork = await storkService.addStork(userId, storkName, number, t)

             if(stork.message){
                 const err = new Error(stork.message)
                 throw err
             }
        })

        const account = await accountService.getAccount(userId)
        const stork = await storkService.getStork(userId,storkName)

        return res.send(
            {
                account: account,
                stork: stork
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

exports.subStork = async (req, res, next) => {
    const userId = req.params.userId
    const accountId = req.params.accountId
    const storkName = req.query.storkName
    const number = req.query.number
    const price = req.query.price

    if(!userId || !storkName || !number || !price || !accountId){
        return next(createError(400, 'BadRequestError'))
    }

    try {
        await models.sequelize.transaction(async (t) => {
            const account = await accountService.addMoneyByStork(userId, accountId, number, price, t)
            if(account.message){
                const err = new Error(account.message)
                throw err
            }

            const stork = await storkService.subStork(userId, storkName, number, t)
            if(stork.message){
                const err = new Error(stork.message)
                throw err
            }
        })

        const account = await accountService.getAccount(userId)
        const stork = await storkService.getStork(userId,storkName)

        return res.send(
            {
                account: account,
                stork: stork
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

exports.getStork = async (req, res, next) => {
    const userId = req.params.userId
    const storkName = req.params.storkName

    if(!userId || !storkName ){
        return next(createError(400, 'BadRequestError'))
    }

    try {
        const stork = await storkService.getStork(userId, storkName)

        if(stork.message){
            const err = new Error(stork.message)
            throw err
        }

        return res.send(
            {
                stork: stork
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

exports.getStorks = async (req, res, next) => {
    const userId = req.params.userId

    if(!userId){
        return next(createError(400, 'BadRequestError'))
    }

    try {
        const user = await userService.getUser(userId)
        if (user.message){
            const err = new Error(user.message)
            throw err
        }

        const storks = await storkService.getStorks(userId)

        if(storks.message){
            const err = new Error(storks.message)
            throw err
        }

        return res.send(
            {
                account: storks
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