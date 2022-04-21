const db = require('../models')
const {Op} = require("sequelize");
const favorites = db["favorite"]
const users = db["user"]

exports.addFavorite  = async (favoriteId,favoriteName,userId,type) => {

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
            throw err
        }

        const newFavorite = await favorites.create({
            favoriteId: favoriteId,
            favoriteName: favoriteName,
            userId: userId,
            type: type
        })

        return newFavorite

    } catch (err) {
        return err
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
        return err
    }
}

exports.getFavorites  = async (userId) => {
    try {
        const user = await users.findOne({
            where:{
                userId: userId
            }
        })

        if (!user){
            const err = new Error("NotFoundError")
            throw err
        }

        const favorite = await favorites.findAll({
            where:{
                userId: userId
            }
        })

        return favorite

    } catch (err) {
        return err
    }
}

exports.getFavorite  = async (userId, favoriteId) => {
    try {
        const user = await users.findOne({
            where:{
                userId: userId
            }
        })

        if (!user){
            const err = new Error("NotFoundError")
            throw err
        }

        const favorite = await favorites.findOne({
            where:{
                userId: userId,
                favoriteId: favoriteId
            }
        })

        if (!favorite){
            const err = new Error("NotFoundError")
            throw err
        }

        return favorite

    } catch (err) {
        return err
    }
}

exports.getFavoritesByName  = async (userId, search) => {
    try {

        const favorite = await favorites.findAll({
            where:{
                favoriteName: {
                    [Op.like]: "%" + search + "%"
                },
                userId: userId,
            }
        })

        if(!favorite){
            return null
        }

        return favorite

    } catch (err) {
        return err
    }
}
