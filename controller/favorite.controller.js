const createError = require('http-errors')
const favoriteService = require('../service/favorite.service')


exports.addFavorite = async (req, res, next) => {
    const userId = req.params.userId
    const favoriteId = req.query.favoriteId
    const favoriteName = req.query.favoriteName

    if(!userId || !favoriteId || !favoriteName){
        return next(createError(400, 'BadRequestError'))
    }

    const favorite = await favoriteService.addFavorite(favoriteId,favoriteName,userId)

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