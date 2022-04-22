const db = require('../models')
const Star = db["star"]

exports.isExistStar = async (userId,boardId) => {
    try{
        const star = await Star.findOne({
            where: {
                userId: userId,
                boardId: boardId
            }
        })

        if(star){
            const err = new Error("Conflict")
            throw err
        }

        return true
    } catch (e) {
        return e
    }

}

exports.addStar = async (boardId,userId,starType,transaction = undefined) => {
    const t = transaction || undefined

    try{
        const star = await Star.create({
            userId: userId,
            boardId: boardId,
            starType: starType
        },{transaction: t})

        if(!star){
            const err = new Error("BadRequestError")
            throw err
        }

        return star
    } catch (e) {
        return e
    }

}
