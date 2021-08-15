const createError = require('http-errors')
const favoriteService = require('../service/favorite.service')


exports.addFavorite = async (req, res, next) => {
    const userId = req.params.userId
    const favoriteId = req.body.favoriteId
    const favoriteName = req.body.favoriteName
    const type = req.body.type

    if(!userId || !favoriteId || !favoriteName){
        return next(createError(400, 'BadRequestError'))
    }

    const favorite = await favoriteService.addFavorite(favoriteId,favoriteName,userId,type)

    if(favorite == "Conflict"){
        return next(createError(409, 'Conflict'))
    }

        return res.send(
            {
                favorite: favorite
            }
        )

}

exports.removeFavorite = async (req, res, next) => {
    const userId = req.params.userId
    const favoriteId = req.query.favoriteId

    if(!userId || !favoriteId){
        return next(createError(400, 'BadRequestError'))
    }

    const result = await favoriteService.removeFavorite(favoriteId,userId)

    if(result == "NotFoundError"){
        return next(createError(404, 'NotFoundError'))
    }

    return res.send(
        {
            result: result
        }
    )

}

exports.getFavorites = async (req, res, next) => {
    const userId = req.params.userId

    if(!userId){
        return next(createError(400, 'BadRequestError'))
    }

    const favorites = await favoriteService.getFavorites(userId)

    if(favorites == "NotFoundError"){
        return next(createError(404, 'NotFoundError'))
    }

    return res.send(
        {
            favorites: favorites
        }
    )
}

exports.getFavorite = async (req, res, next) => {
    const userId = req.params.userId
    const favoriteId = req.query.favoriteId

    if(!userId || !favoriteId){
        return next(createError(400, 'BadRequestError'))
    }

    const favorite = await favoriteService.getFavorite(userId,favoriteId)

    if(!favorite){
        return res.send({
            favorite: favorite
        })
    }

    return res.send(
        {
            favorite: favorite
        }
    )
}