const db = require('../models')
const bcrypt = require("bcrypt");
const users = db["user"]

exports.addUser = async (userId,password,email,name,phoneNumber,transaction = undefined) => {
    const t = transaction || undefined
    const hash_password = await bcrypt.hash(password, 10)

    try {
        const user = await users.findByPk(userId)
        if(user){
            const err = new Error('Conflict')
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
        return err
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
            throw err
        }

        return user
    } catch (err) {
        return err
    }
}

exports.checkUser = async (userId,password) => {
    try {
        const user = await users.findOne({
            where: {
                userId: userId
            }
        })

        if(user == null){
            const err = new Error("NotFoundError")
            throw err
        }

        const compareResult = await bcrypt.compare(password, user.password);

        if(!compareResult){
            const err = new Error("BadRequestError")
            throw err
        }

        return true
    } catch (err) {
        return err
    }
}

exports.updateUser = async (userId,password,email,name,phoneNumber,transaction = undefined) => {
    const t = transaction || undefined

    try {
        const hash_password = await bcrypt.hash(password, 10)

        await users.update({
            password: hash_password,
            email: email,
            name: name,
            phoneNumber: phoneNumber
        },{
            where:{
                userId: userId
            }}, {transaction: t})

        return true

    } catch (err) {
        return err
    }
}

exports.deleteUser = async (userId, password) => {
    try {
        const user = await users.findOne({
            where: {
                userId: userId
            }
        })

        if(!user){
            const err = new Error("NotFoundError")
            throw err
        }

        const compareResult = await bcrypt.compare(password, user.password);

        if(!compareResult){
            const err = new Error("BadRequestError")
            throw err
        }

        //비밀번호가 같다면
             await users.destroy({
                where: {
                    userId: userId
                }
            })

        return true
    } catch (err) {
        return err
    }
}