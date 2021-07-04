const db = require('../models')
const grades = db["grade"]
const account = db["account"]

exports.addGrade = async (userId,transaction = undefined) => {
    const t = transaction || undefined

    // 초기값이기에 Common값
    try {

        const ExistGrade = await grades.findOne({
            where:{
                userId: userId
            }
        })
        if(ExistGrade){
            const err = new Error("Conflict")
            err.name = "Conflict"
            throw err
        }

        const grade = await grades.create({
            userId: userId,
            grade: "common"
        },{transaction: t})

        return grade

    } catch (err) {
        console.log(err)
        return err.name
    }
}

exports.getGrade = async (userId) => {
    try {
        const grade = await grades.findOne({
            where: {
                userId: userId,
            }
        })

        if(grade == null){
            const err = new Error("NotFoundError")
            err.name = "NotFoundError"
            throw err
        }

        return grade
    } catch (err) {
        return err.name
    }
}

exports.setGrade = async (userId) => {
    try {
        const account = await account.findOne({
            where: {
                userId: userId,
            }
        })

        if(account == null){
            const err = new Error("NotFoundError")
            err.name = "NotFoundError"
            throw err
        }


        //Todo 추후생각  opthion에 따라 등급을 나누자.
        if(account.money >= 1000000000){
            await grades.update({
                grade: "Master"
            },{
                where: {
                    userId: userId
                }
            })
        }

        return true
    } catch (err) {
        return err.name
    }
}