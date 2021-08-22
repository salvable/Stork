const db = require('../models')
const Comment = db["comment"]

exports.addComment = async (boardId, userId, password, content) => {
    try {
        const randomString = Math.floor(Math.random() * 9999999);

        const comment = await Comment.create({
            commentId: randomString,
            boardId: boardId,
            userId: userId,
            password: password,
            content: content,
        })

        if(!comment){
            const err = new Error("BadRequestError")
            err.name = "BadRequestError"
            throw err
        }

        return comment

    } catch (err) {
        return err.name
    }
}

exports.getComment = async (boardId) => {
    try {
        const comment = await Comment.findOne({
            where:{
                boardId: boardId
            }
        })

        if(!comment){
            const err = new Error("NotFoundError")
            err.name = "NotFoundError"
            throw err
        }

        return comment

    } catch (err) {
        return err.name
    }
}

exports.deleteComment = async (boardId,commentId,password) => {
    try {
        const comment = await Comment.findOne({
            where:{
                boardId: boardId,
                commentId: commentId
            }
        })

        if(!comment){
            const err = new Error("NotFoundError")
            err.name = "NotFoundError"
            throw err
        }

        if(comment.password == password){
            const result = await Comment.destroy({
                where: {
                    boardId: boardId,
                    commentId: commentId
                }
            })

            return result
        }

        return false

    } catch (err) {
        return err.name
    }
}