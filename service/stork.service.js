const db = require('../models')
const users = db["stork"]

exports.addStork  = async (userId,password,email,name,phoneNumber,transaction = undefined) => {
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