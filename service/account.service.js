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
            const err = new Error("Conflict")
            throw err
        }

        const randomString = Math.floor(Math.random() * 9999999);

        const newAccount = await Account.create({
            accountId: randomString,
            money: 10000000,
            userId: userId
        },{transaction: t})

        if(!newAccount){
            const err = new Error("Bad request")
            throw err
        }

        return newAccount

    } catch (err) {
        return err
    }
}

exports.addMoney = async (userId, accountId, money) => {
    try {
        const account = await Account.findOne({
            where:{
                accountId: accountId,
                userId: userId
            }
        })

        if(!account){
            const err = new Error("NotFoundError")
            throw err
        }

        await Account.update({
            money: account.money + parseInt(money)
        },{
            where: {
                userId: userId,
                accountId: accountId
            }
        })

        return true

    } catch (err) {
        return err
    }
}

exports.subMoney = async (userId, accountId, money) => {
    try {
        const account = await Account.findOne({
            where:{
                accountId: accountId,
                userId: userId
            }
        })

        if(!account){
            const err = new Error("NotFoundError")
            throw err
        }

        if(account.money < money){
            const err = new Error("Bad request")
            throw err
        }


        await Account.update({
            money: account.money + parseInt(money)
        },{
            where: {
                userId: userId,
                accountId: accountId
            }
        })

        return true

    } catch (err) {
        return err
    }
}

exports.subMoneyByStork = async (userId, accountId, number, price, transaction = undefined) => {
    const t = transaction || undefined

    try {
        const account = await Account.findOne({
            where:{
                userId: userId,
                accountId: accountId
            }
        })

        if(!account){
            const err = new Error("NotFoundError")
            throw err
        }

        if(account.money < parseInt(number) * parseInt(price)){
            const err = new Error("BadRequestError")
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