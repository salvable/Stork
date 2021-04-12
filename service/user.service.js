const db = require('../models')
const users = db["user"]

exports.addUser = async (userId,password,email,name,phoneNumber,transaction = undefined) => {
    const t = transaction || undefined

    try {
        const user = await users.findByPk(userId)
        if(user){
            const err = new Error("ValidationError")
            err.name = "ValidationError"
            throw err
        }

        const newUser = await users.create({
            userId: userId,
            password: password,
            email: email,
            name: name,
            phoneNumber: phoneNumber
        },{transaction: t})

        return newUser

    } catch (err) {
        return err.name
    }
}

exports.getUser = async (userId,password) => {
    try {
        const user = await users.findOne({
            where: {
                id: userId,
                password: password
            }
        })

        if(user == null){
            const err = new Error("NotFoundError")
            err.name = "NotFoundError"
            throw err
        }

        return user
    } catch (err) {
        return err.name
    }
}