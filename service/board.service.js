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