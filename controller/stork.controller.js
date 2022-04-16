const createError = require('http-errors')
const storkService = require('../service/stork.service.js')
const accountService = require('../service/account.service')
const models = require('../models')


exports.addStork = async (req, res, next) => {
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
                return res.status(500).json(err)

        }
    }
}

exports.subStork = async (req, res, next) => {
    const userId = req.params.userId
    const accountId = req.params.accountId
    const storkName = req.query.storkName
    const number = req.query.number
    const price = req.query.price

    if(!userId || !storkName || !number || !price){
        return next(createError(400, 'BadRequestError'))
    }

    try {
        await models.sequelize.transaction(async (t) => {
            const account = await accountService.addMoneyByStork(userId, accountId, number, price, t)
            if(account == "NotFoundError" || account == "BadRequestError"){
                const err = new Error(account)
                err.name = account
                throw err
            }

            const stork = await storkService.subStork(userId, storkName, number, t)
            if(stork == "NotFoundError" || stork == "BadRequestError"){
                const err = new Error(stork)
                err.name = stork
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
        switch(err.name){
            case "NotFoundError":
                return next(createError(400, 'NotFoundError'))
            case "BadRequestError":
                return next(createError(404, 'BadRequestError'))
            default:
                return res.status(500).json(err)

        }
    }
}

exports.getStork = async (req, res, next) => {
    const userId = req.params.userId
    const storkName = req.query.storkName

    if(!userId || !storkName ){
        return next(createError(400, 'BadRequestError'))
    }

    try {
        const stork = await storkService.getStork(userId, storkName)

        if(!stork){
            return next(createError(404, 'NotFoundError'))
        }

        return res.send(
            {
                stork: stork
            }
        )
    } catch (err) {
        return res.status(500).json(err)
    }
}

exports.getStorks = async (req, res, next) => {
    const userId = req.params.userId

    if(!userId){
        return next(createError(400, 'BadRequestError'))
    }

    try {
        const stork = await storkService.getStorks(userId)

        if(!stork){
            return next(createError(404, 'NotFoundError'))
        }

        return res.send(
            {
                account: stork
            }
        )
    } catch (err) {
        return res.status(500).json(err)
    }
}