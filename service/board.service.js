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

    } catch (err) {
        return err.name
    }
}

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

exports.checkBoard = async (boardId,password) => {
    try {
        const board = await Board.findOne({
            where:{
                boardId: boardId,
                password: password
            }
        })

        if(!board){
            const err = new Error("Forbidden")
            err.name = "Forbidden"
            throw err
        }

        return true

    } catch (err) {
        return err.name
    }
}

exports.getBoard = async (boardId) => {
    try {
        const board = await Board.findOne({
            where:{
                boardId: boardId
            }
        })

        if(!board){
            const err = new Error("NotFoundError")
            err.name = "NotFoundError"
            throw err
        }

        return board

    } catch (err) {
        return err.name
    }
}

exports.getBoards = async (page, pageSize) => {
    try {
        const board = await Board.findAndCountAll({
            limit: pageSize,
            offset: pageSize * (page - 1),
            order: [
                ['boardId', 'DESC'],
            ],
        })

        if(!board){
            const err = new Error("NotFoundError")
            err.name = "NotFoundError"
            throw err
        }

        return board

    } catch (err) {
        return err.name
    }
}
