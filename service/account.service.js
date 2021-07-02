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

exports.updateMoney = async (accountId, money, price) => {
    try {
        const account = await Account.update({
            money: Account.money + parseInt(money) * parseInt(price)
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

        return true

    } catch (err) {
        console.log(err)
        return err.name
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