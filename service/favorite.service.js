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