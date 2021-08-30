const createError = require("http-errors");
const models = require("../models");
const boardService =require("../service/board.service")
const starService = require("../service/star.service");

exports.addBoard = async (req, res, next) => {
    const name = req.body.userId
    const content = req.body.content
    const writer = req.body.writer || "익명"
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

exports.deleteBoard = async (req, res, next) => {
    const boardId = req.params.boardId
    const password = req.query.password

    console.log(boardId,password)
    if(!boardId || !password){
        return next(createError(400, 'Bad request'))
    }

    const board = await boardService.getBoardWithPassword(boardId,password)

    if(board == "NotFoundError"){
        return next(createError(404, 'NotFoundError'))
    }

    const result = await boardService.deleteBoard(boardId)

    return res.send(
        {
            result: result
        }
    )
}

exports.getBoard = async (req, res, next) => {
    const boardId = req.params.boardId

    if(!boardId){
        return next(createError(400, 'BadRequestError'))
    }

    const result = await boardService.updateHit(boardId)

    if(!result){
        return next(createError(400,'BadRequestError'))
    }

    const board = await boardService.getBoard(boardId)

    if(!board || board == "NotFoundError"){
        return next(createError(404, 'NotFoundError'))
    }

    return res.send(
        {
            board: board
        }
    )
}

exports.getBoards = async (req, res, next) => {
    const page = req.query.page
    const pageSize = req.query.pageSize || 10

    if(!page || !pageSize){
        return next(createError(400, 'BadRequestError'))
    }

    if(page < 1){
        return next(createError(400, 'BadRequestError'))
    }


    const board = await boardService.getBoards(page,pageSize)

    if(board == "BadRequestError"){
        return next(createError(400, 'BadRequestError'))
    }

    return res.send(
        {
            board: board.rows,
            totalCount: board.count
        }
    )
}

exports.updateStar = async (req, res, next) => {
    const boardId = req.params.boardId
    const userId = req.body.userId
    const starType = req.body.type

    if(!boardId || !starType || !userId){
        return next(createError(400, 'BadRequestError'))
    }

    const isExistStar = await starService.isExistStar(userId,boardId)
    if(isExistStar){
        return next(createError(409, "Conflict"))
    }

    const result = await models.sequelize.transaction(async (t) => {
            const result = await boardService.updateStar(boardId, starType, t)
            const star = await starService.addStar(boardId, userId, starType, t)
        return result
        })

    if(!result){
        return next(createError(400, 'BadRequestError'))
    }

    const newBoard = await boardService.getBoard(boardId)

    if(newBoard == "NotFoundError"){
        return next(createError(404, 'NotFoundError'))
    }

    return res.send(
        {
            board: newBoard
        }
    )
}

exports.checkBoardPassword = async (req, res, next) => {
    const boardId = req.params.boardId
    const password = req.query.password

    if(!boardId || !password){
        return next(createError(400, 'BadRequestError'))
    }

    const board = await boardService.getBoardWithPassword(boardId,password)

    if(board == "NotFoundError"){
        return next(createError(404, 'NotFoundError'))
    }

    return res.send(
        {
            result: true
        }
    )
}

