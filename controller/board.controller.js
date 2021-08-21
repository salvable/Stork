const createError = require("http-errors");
const models = require("../models");
const boardService =require("../service/board.service")

exports.addBoard = async (req, res, next) => {
    const name = req.body.userId
    const content = req.body.content
    const writer = req.body.writer
    const password = req.body.password

    if(!name || !content || !writer || !password){
        return next(createError(400, 'BadRequestError'))
    }

    const board = await boardService.addBoard(name,content,writer,password)

    if(board == "BadRequestError"){
        return next(createError(400, 'BadRequestError'))
    }

    return res.send(
        {
            board: board
        }
    )
}

exports.modifyBoard = async (req, res, next) => {
    const boardId = req.params.boardId
    const name = req.body.name
    const content = req.body.content
    const password = req.body.password

    if(!boardId || !content || !name || !password){
        return next(createError(400, 'BadRequestError'))
    }

    const checkBoard = await boardService.checkBoard(boardId,password)
    if(checkBoard == "Forbidden"){
        return next(createError(403, 'Forbidden'))
    }

    const board = await boardService.modifyBoard(boardId,name,content)

    if(board == "BadRequestError"){
        return next(createError(400, 'BadRequestError'))
    }

    const newBoard = await boardService.getBoard(boardId)

    if(!newBoard){
        return next(createError(404, 'NotFoundError'))
    }

    return res.send(
        {
            board: newBoard
        }
    )
}