const db = require('../models')
const grades = db["grade"]

exports.addGrade = async (userId,transaction = undefined) => {
    const t = transaction || undefined

    // 초기값이기에 Common값
    try {

        const ExistGrade = grades.findOne({
            userId: userId
        })

        if(ExistGrade){
            const err = new Error("Conflict")
            err.name = "Conflict"
            throw err
        }

        const grade = grades.create({
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