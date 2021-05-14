const db = require('../models')
const storks = db["stork"]

exports.addStork  = async (userId, storkName, number,transaction = undefined) => {
    const t = transaction || undefined

    try {

        const stork = await storks.findOne({
            where:{
                userId: userId
            }
        })

        // 해당 주식을 보유중이지 않다면 새로 생성
        if(!stork){
            const newStork = await storks.create({
                userId: userId,
                storkName: storkName,
                storkCount: number
            },{transaction: t})

            return newStork
        }

        const updateStork = await storks.update({
            storkCount: parseInt(stork.storkCount) + parseInt(number)
        })

        return updateStork

    } catch (err) {
        return err.name
    }
}

exports.getStork = async (userId,storkName) => {
    try {
        const stork = await storks.findOne({
            where: {
                userId: userId,
                storkName: storkName
            }
        })

        if(stork == null){
            const err = new Error("NotFoundError")
            err.name = "NotFoundError"
            throw err
        }

        return stork
    } catch (err) {
        return err.name
    }
}