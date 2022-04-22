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
            throw err
        }

        return comment

    } catch (err) {
        return err
    }
}

exports.getComments = async (boardId) => {
    try {
        const comment = await Comment.findAll({
            where:{
                boardId: boardId
            },order: [
                ['createdAt', 'ASC'],
            ]
        })

        if(!comment){
            const err = new Error("BadRequestError")
            throw err
        }

        return comment

    } catch (err) {
        return err
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
            throw err
        }

        if(comment.password != password){
            const err = new Error("Forbidden")
            throw err
        }

        await Comment.destroy({
            where: {
                boardId: boardId,
                commentId: commentId
            }
        })

        return true

    } catch (err) {
        return err
    }
}