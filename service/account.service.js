const db = require('../models')
const account = db["account"]

exports.addAccount = async (userId) => {
    try {
        const randomString = Math.floor(Math.random() * 9999999);
        const newAccount = await account.create({
            accountId: randomString,
            money: 10000000,
            userId: userId
        })

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
        const Account = await account.update({
            money: Account.money + parseInt(money)
        },{
            where: {
                accountId: accountId
            }
        })

        if(!Account){
            const err = new Error("NotFoundError")
            err.name = "NotFoundError"
            throw err
        }

        const updateAccount = await account.findOne({
            where:{
                accountId:accountId
            }
        })


        return updateAccount

    } catch (err) {
        console.log(err)
        return err.name
    }
}

exports.subMoney = async (accountId, money) => {
    try {
        const Account = await account.update({
            money: Account.money - parseInt(money)
        },{
            where: {
                accountId: accountId
            }
        })

        if(!Account){
            const err = new Error("NotFoundError")
            err.name = "NotFoundError"
            throw err
        }

        const updateAccount = await account.findOne({
            where:{
                accountId:accountId
            }
        })

        return updateAccount

    } catch (err) {
        console.log(err)
        return err.name
    }
}