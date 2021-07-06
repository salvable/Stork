const db = require('../models')
const bcrypt = require("bcrypt");
const users = db["user"]

exports.addUser = async (userId,password,email,name,phoneNumber,transaction = undefined) => {
    const t = transaction || undefined
    const hash_password = await bcrypt.hash(password, 10)

    try {
        const user = await users.findByPk(userId)
        if(user){
            const err = new Error("Conflict")
            err.name = "Conflict"
            throw err
        }

        const newUser = await users.create({
            userId: userId,
            password: hash_password,
            email: email,
            name: name,
            phoneNumber: phoneNumber
        },{transaction: t})

        return newUser

    } catch (err) {
        return err.name
    }
}

exports.login = async (userId,password) => {
    try {
        const user = await users.findOne({
            where: {
                userid: userId,
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

exports.getUser = async (userId) => {
    try {
        const user = await users.findOne({
            where: {
                userId: userId
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