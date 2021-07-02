const db = require('../models')
const favorites = db["favorite"]

exports.addFavorite  = async (favoriteId,favoriteName,userId) => {

    try {
        const favorite = await favorites.findOne({
            where:{
                favoriteId: favoriteId,
                userId: userId
            }
        })

        // 이미 즐겨찾기가 되어있다면
        if(favorite){
            const err = new Error("Conflict")
            err.name = "Conflict"
            throw err
        }

        const newFavorite = await favorites.create({
            favoriteId: favoriteId,
            favoriteName: favoriteName,
            userId: userId
        })

        return newFavorite

    } catch (err) {
        return err.name
    }
}

exports.removeFavorite  = async (favoriteId,userId) => {
    try {
        const favorite = await favorites.findOne({
            where:{
                favoriteId: favoriteId,
                userId: userId
            }
        })

        if(!favorite){
            const err = new Error("NotFoundError")
            err.name = "NotFoundError"
            throw err
        }

        await favorites.destroy({
            where: {
            favoriteId: favoriteId,
            userId: userId
            }
        })

        //성공했다면 true를 리턴
        return true

    } catch (err) {
        return err.name
    }
}