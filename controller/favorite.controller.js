const createError = require('http-errors')
const favoriteService = require('../service/favorite.service')


exports.addFavorite = async (req, res, next) => {
    const userId = req.params.userId
    const favoriteId = req.body.favoriteId
    const favoriteName = req.body.favoriteName
    const type = req.body.type

    if(!userId || !favoriteId || !favoriteName || !type){
        return next(createError(400, 'BadRequestError'))
    }

    try{
        const favorite = await favoriteService.addFavorite(favoriteId,favoriteName,userId,type)

        if(favorite.message){
            const err = new Error(favorite.message)
            throw err
        }

        return res.send(
            {
                favorite: favorite
            }
        )
    } catch (err) {
        switch(err.message){
            case "BadRequestError":
                return next(createError(400, 'BadRequestError'))
            case "NotFoundError":
                return next(createError(404, 'NotFoundError'))
            case "Conflict":
                return next(createError(409, 'Conflict'))
            default:
                return next(createError(500, 'Error'))
        }
    }

}

exports.removeFavorite = async (req, res, next) => {
    const userId = req.params.userId
    const favoriteId = req.query.favoriteId

    if(!userId || !favoriteId){
        return next(createError(400, 'BadRequestError'))
    }

    try{
        const result = await favoriteService.removeFavorite(favoriteId,userId)

        if(result.message){
            const err = new Error(result.message)
            throw err
        }

        return res.send(
            {
                result: result
            }
        )
    } catch (err) {
        switch(err.message){
            case "BadRequestError":
                return next(createError(400, 'BadRequestError'))
            case "NotFoundError":
                return next(createError(404, 'NotFoundError'))
            default:
                return next(createError(500, 'Error'))
        }
    }

}

exports.getFavorites = async (req, res, next) => {
    const userId = req.params.userId

    if(!userId){
        return next(createError(400, 'BadRequestError'))
    }

    try{
        const favorites = await favoriteService.getFavorites(userId)

        if(favorites.message){
            const err = new Error(favorites.message)
            throw err
        }

        return res.send(
            {
                favorites: favorites
            }
        )
    } catch (err) {
        switch(err.message){
            case "BadRequestError":
                return next(createError(400, 'BadRequestError'))
            case "NotFoundError":
                return next(createError(404, 'NotFoundError'))
            default:
                return next(createError(500, 'Error'))
        }
    }
}

exports.getFavorite = async (req, res, next) => {
    const userId = req.params.userId
    const favoriteId = req.query.favoriteId

    if(!userId || !favoriteId){
        return next(createError(400, 'BadRequestError'))
    }

    try{
        const favorite = await favoriteService.getFavorite(userId,favoriteId)

        if(favorite.message){
            const err = new Error(favorite.message)
            throw err
        }

        return res.send(
            {
                favorite: favorite
            }
        )
    } catch (err) {
        switch(err.message){
            case "BadRequestError":
                return next(createError(400, 'BadRequestError'))
            case "NotFoundError":
                return next(createError(404, 'NotFoundError'))
            default:
                return next(createError(500, 'Error'))
        }
    }


}

exports.getFavoritesByName = async (req, res, next) => {
    const userId = req.params.userId
    const search = req.query.search

    if(!userId){
        return next(createError(400, 'BadRequestError'))
    }

    try{
        const favorites = await favoriteService.getFavoritesByName(userId,search)

        if(favorites.message){
            const err = new Error(favorites.message)
            throw err
        }

        return res.send(
            {
                favorite: favorites
            }
        )
    } catch (err) {
        switch(err.message){
            default:
                return next(createError(500, 'Error'))
        }
    }

}