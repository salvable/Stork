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