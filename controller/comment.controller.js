const createError = require("http-errors");
const models = require("../models");
const commentService =require("../service/comment.service")
const boardService =require("../service/board.service")

exports.addComment = async (req, res, next) => {
    const boardId = req.params.boardId
    const userId = req.body.userId
    const password = req.body.password
    const content = req.body.content

    if(!boardId || !userId || !password || !content){
        return next(createError(400, 'BadRequestError'))
    }

    try{
        const board = await boardService.getBoard(boardId)

        if(board.message) {
            const err = new Error(board.message)
            throw err
        }

        const comment = await commentService.addComment(boardId,userId,password,content)

        if(comment.message) {
            const err = new Error(comment.message)
            throw err
        }

        return res.send(
            {
                comment: comment
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

exports.getComments = async (req, res, next) => {
    const boardId = req.params.boardId

    if(!boardId){
        return next(createError(400, 'BadRequestError'))
    }

    try{
        const board = await boardService.getBoard(boardId)

        if(board.message) {
            const err = new Error(board.message)
            throw err
        }

        const comment = await commentService.getComments(boardId)

        if(comment.message){
            const err = new Error(comment.message)
            throw err
        }

        return res.send(
            {
                comment: comment
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

exports.deleteComment = async (req, res, next) => {
    const boardId = req.params.boardId
    const commentId = req.params.commentId
    const password = req.query.password

    if(!boardId || !commentId || !password){
        return next(createError(400, 'BadRequestError'))
    }

    try{
        const comment = await commentService.deleteComment(boardId,commentId,password)

        if(comment.message){
            const err = new Error(comment.message)
            throw err
        }

        return res.send(
            {
                comment: comment
            }
        )
    } catch (err) {
        switch(err.message){
            case "BadRequestError":
                return next(createError(400, 'BadRequestError'))
            case "Forbidden":
                return next(createError(403, 'Forbidden'))
            case "NotFoundError":
                return next(createError(404, 'NotFoundError'))
            default:
                return next(createError(500, 'Error'))
        }
    }
}