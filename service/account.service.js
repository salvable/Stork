const db = require('../models')
const Account = db["account"]

exports.addAccount = async (userId,transaction = undefined) => {
    const t = transaction || undefined

    try {
        const account = await Account.findOne({
            userId: userId
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

exports.addMoney = async (accountId, money) => {
    try {
        const account = await Account.update({
            money: Account.money + parseInt(money)
        },{
            where: {
                accountId: accountId
            }
        })

        if(!account){
            const err = new Error("NotFoundError")
            err.name = "NotFoundError"
            throw err
        }

        const updateAccount = await Account.findOne({
            where:{
                accountId:accountId
            }
        })

        if(!updateAccount){
            const err = new Error("NotFoundError")
            err.name = "NotFoundError"
            throw err
        }

        return updateAccount

    } catch (err) {
        console.log(err)
        return err.name
    }
}

exports.subMoney = async (accountId, money, transaction = undefined) => {

    const t = transaction || undefined

    try {

        const account = await Account.update({
            money: Account.money - parseInt(money)
        },{
            where: {
                accountId: accountId
            }
        }, {transaction : t})

        if(!account){
            const err = new Error("NotFoundError")
            err.name = "NotFoundError"
            throw err
        }

        const updateAccount = await Account.findOne({
            where:{
                accountId:accountId
            }
        })

        if(!updateAccount){
            const err = new Error("NotFoundError")
            err.name = "NotFoundError"
            throw err
        }

        return updateAccount

    } catch (err) {
        console.log(err)
        return err.name
    }
}