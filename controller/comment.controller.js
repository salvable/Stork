const createError = require("http-errors");
const models = require("../models");
const commentService =require("../service/comment.service")

exports.addComment = async (req, res, next) => {
    const boardId = req.params.boardId
    const userId = req.body.userId
    const password = req.body.password
    const content = req.body.content

    if(!boardId || !userId || !password || !content){
        return next(createError(400, 'BadRequestError'))
    }

    const comment = await commentService.addComment(boardId,userId,password,content)

    if(comment == "BadRequestError"){
        return next(createError(400, 'BadRequestError'))
    }

    return res.send(
        {
            comment: comment
        }
    )
}

exports.getComment = async (req, res, next) => {
    const boardId = req.params.boardId

    if(!boardId){
        return next(createError(400, 'BadRequestError'))
    }

    const comment = await commentService.getComment(boardId)

    if(comment == "NotFoundError"){
        return next(createError(400, 'NotFoundError'))
    }

    return res.send(
        {
            comment: comment
        }
    )
}

exports.deleteComment = async (req, res, next) => {
    const boardId = req.params.boardId
    const commentId = req.body.commentId
    const password = req.body.password

    if(!boardId || !commentId || !password){
        return next(createError(400, 'BadRequestError'))
    }

    const comment = await commentService.deleteComment(boardId,commentId,password)

    if(comment != true){
        return next(createError(400, 'BadRequestError'))
    }

    return res.send(
        {
            comment: comment
        }
    )
}