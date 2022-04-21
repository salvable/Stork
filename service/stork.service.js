const db = require('../models')
const storks = db["stork"]

exports.addStork  = async (userId, storkName, number, transaction) => {
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

        }

        else{
            await storks.update({
                    storkCount: parseInt(stork.storkCount) + parseInt(number)
                },{
                    where:{
                        userId: userId,
                        storkName: storkName
                    }
                },{transaction: t}
            )
        }

        return true

    } catch (err) {
        return err
    }
}

exports.subStork  = async (userId, storkName, number, transaction) => {
    const t = transaction || undefined
    console.log(userId,storkName)

    try {
        const stork = await storks.findOne({
            where:{
                userId: userId,
                storkName: storkName
            }
        })
        console.log(stork)
        // 해당 주식을 보유중이지 않다면 에러
        if(!stork){
            const err = new Error("NotFoundError")
            throw err
        }

        if(number > stork.storkCount){
            console.log("##################33")
            const err = new Error("BadRequestError")
            throw err
        }

        await storks.update({
                storkCount: parseInt(stork.storkCount) - parseInt(number)
            },{
                where:{
                    userId: userId,
                    storkName: storkName
                }
            },{transaction: t}
        )
        return true

    } catch (err) {
        return err
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
        return err
    }
}

exports.getStorks = async (userId) => {
    try {
        const stork = await storks.findOne({
            where: {
                userId: userId
            }
        })

        if(stork == null){
            const err = new Error("NotFoundError")
            throw err
        }

        return stork
    } catch (err) {
        return err
    }
}