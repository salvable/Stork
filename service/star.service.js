const db = require('../models')
const Star = db["star"]

exports.isExistStar = async (userId,boardId) => {
        const star = await Star.findOne({
            where: {
                userId: userId,
                boardId: boardId
            }
        })

        if(!star){
            return false
        }

        return true
}

exports.addStar = async (boardId,userId,starType,transaction = undefined) => {
    const t = transaction || undefined
    const star = await Star.create({
            userId: userId,
            boardId: boardId,
            starType: starType
    },{transaction: t})

    if(!star){
        return false
    }

    return star
}
