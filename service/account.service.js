const db = require('../models')
const Account = db["account"]

exports.addAccount = async (userId,transaction = undefined) => {
    const t = transaction || undefined

    try {
        const account = await Account.findOne({
            where:{
                userId: userId
            }
        })

        if(account){
            const err = new Error("ValidationError")
            err.name = "ValidationError"
            throw err
        }

        const randomString = Math.floor(Math.random() * 9999999);

        const newAccount = await Account.create({
            accountId: randomString,
            money: 10000000,
            userId: userId
        },{transaction: t})

        if(!newAccount){
            const err = new Error("create error")
            err.name = "Bad request"
            throw err
        }

        return newAccount

    } catch (err) {
        console.log(err)
        return err.name
    }
}

exports.addMoney = async (userId , number, price, transaction = undefined) => {
    const t = transaction || undefined

    try {
        const account = await Account.findOne({
            where:{
                userId: userId
            }
        })

        if(!account){
            const err = new Error("NotFoundError")
            err.name = "NotFoundError"
            throw err
        }

        await Account.update({
            money: account.money + parseInt(number) * parseInt(price)
        },{
            where: {
                userId: userId
            }
        },{transaction:t})

        return true

    } catch (err) {
        return err.name
    }
}

exports.subMoney = async (userId , number, price, transaction = undefined) => {
    const t = transaction || undefined

    try {
        const account = await Account.findOne({
            where:{
                userId: userId
            }
        })

        if(!account){
            const err = new Error("NotFoundError")
            err.name = "NotFoundError"
            throw err
        }

        if(account.money < number * price){
            const err = new Error("BadRequestError")
            err.name = "BadRequestError"
            err.code = 400
            throw err
        }

        await Account.update({
            money: account.money - parseInt(number) * parseInt(price)
        },{
            where: {
                userId: userId
            }
        },{transaction:t})

        return true

    } catch (err) {
        return err
    }
}

exports.getAccount = async (userId) => {

    try {
        const account = await Account.findOne({
            where:{
                userId: userId
            }
        })

        if(!account){
            const err = new Error("NotFoundError")
            err.name = "NotFoundError"
            throw err
        }

        return account

    } catch (err) {
        console.log(err)
        return err.name
    }
}