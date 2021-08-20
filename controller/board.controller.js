const createError = require("http-errors");
const models = require("../models");
const boardService =require("../service/board.service")

exports.addBoard = async (req, res, next) => {
    const name = req.body.userId
    const content = req.body.content
    const writer = req.body.writer
    const password = req.body.password

    if(!name || !content || !writer || !password){
        return next(createError(400, 'Bad request'))
    }

    const board = await boardService.addBoard(name,content,writer,password)

    if(board == "BadRequestError"){
        return next(createError(400, 'Bad request'))
    }

    return res.send(
        {
            board: board
        }
    )
}
