const db = require('../models')
const Board = db["board"]

exports.addBoard = async (name,content,writer,password) => {
    try {
        const board = await Board.create({
            name: name,
            content: content,
            writer: writer,
            password: password,
            hit: 0,
            star: 0,
        })

        if(!board){
            const err = new Error("BadRequestError")
            err.name = "BadRequestError"
            throw err
        }

        return board

exports.modifyBoard = async (boardId,name,content) => {
    try {
        const updateBoard = await Board.update({
            name: name,
            content: content,
        },{
            where:{
                boardId: boardId
            }})

        if(!updateBoard){
            const err = new Error("BadRequestError")
            err.name = "BadRequestError"
            throw err
        }

        return true

    } catch (err) {
        return err.name
    }
}
    } catch (err) {
        return err.name
    }
}