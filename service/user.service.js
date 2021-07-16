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

exports.deleteUser = async (userId,password) => {
    try {
        const user = await users.findOne({
            where: {
                userId: userId
            }
        })

        if(!user){
            const err = new Error("NotFoundError")
            err.name = "NotFoundError"
            throw err
        }

        const compareResult = await bcrypt.compare(password, user.password);

        //비밀번호가 같다면
        if(compareResult){
             const result = await users.destroy({
                where: {
                    userId: userId
                }
            })

            if(result == "SequelizeForeignKeyConstraintError"){
                const err = new Error("SequelizeForeignKeyConstraintError")
                err.name = "SequelizeForeignKeyConstraintError"
                throw err
            }
        }

        return true
    } catch (err) {
        return err.name
    }
}