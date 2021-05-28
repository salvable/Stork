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