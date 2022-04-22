const createError = require("http-errors");
const models = require("../models");
const boardService =require("../service/board.service")
const starService = require("../service/star.service");

exports.addBoard = async (req, res, next) => {
    const name = req.body.name
    const content = req.body.content
    const writer = req.body.writer || "익명"
    const password = req.body.password

    if(!name || !content || !writer || !password){
        return next(createError(400, 'BadRequestError'))
    }

    try{
        const board = await boardService.addBoard(name,content,writer,password)

        if(board.message){
            const err = new Error(board.message)
            throw err
        }

        return res.send(
            {
                board: board
            }
        )

    } catch (err) {
        switch(err.message){
            case "BadRequestError":
                return next(createError(400, 'BadRequestError'))
            case "NotFoundError":
                return next(createError(404, 'NotFoundError'))
            default:
                return next(createError(500, 'Error'))
        }
    }
}

exports.modifyBoard = async (req, res, next) => {
    const boardId = req.params.boardId
    const name = req.body.name
    const content = req.body.content
    const password = req.body.password

    if(!boardId || !content || !name || !password){
        return next(createError(400, 'BadRequestError'))
    }

    try{
        const checkBoard = await boardService.checkBoard(boardId,password)
        if(checkBoard.message){
            const err = new Error(checkBoard.message)
            throw err
        }

        const board = await boardService.modifyBoard(boardId,name,content)

        if(board.message){
            const err = new Error(board.message)
            throw err
        }

        const newBoard = await boardService.getBoard(boardId)

        if(newBoard.message){
            const err = new Error(newBoard.message)
            throw err
        }

        return res.send(
            {
                board: newBoard
            }
        )

    } catch (err) {
        switch(err.message){
            case "BadRequestError":
                return next(createError(400, 'BadRequestError'))
            case "Forbidden":
                return next(createError(403, 'Forbidden'))
            case "NotFoundError":
                return next(createError(404, 'NotFoundError'))
            default:
                return next(createError(500, 'Error'))
        }
    }

}

exports.deleteBoard = async (req, res, next) => {
    const boardId = req.params.boardId
    const password = req.query.password

    if(!boardId || !password){
        return next(createError(400, 'Bad request'))
    }

    try{
        const board = await boardService.getBoardWithPassword(boardId,password)

        if(board.message){
            const err = new Error(board.message)
            throw err
        }

        const result = await boardService.deleteBoard(boardId)

        return res.send(
            {
                result: result
            }
        )
    } catch (err) {
        switch(err.message){
            case "BadRequestError":
                return next(createError(400, 'BadRequestError'))
            case "NotFoundError":
                return next(createError(404, 'NotFoundError'))
            default:
                return next(createError(500, 'Error'))
        }
    }

}

exports.getBoard = async (req, res, next) => {
    const boardId = req.params.boardId

    if(!boardId){
        return next(createError(400, 'BadRequestError'))
    }

    try{
        const board = await models.sequelize.transaction(async (t) => {
            const result = await boardService.updateHit(boardId,t)

            if (result.message) {
                const err = new Error(result.message)
                throw err
            }

            const board = await boardService.getBoard(boardId)

            if (board.message) {
                const err = new Error(board.message)
                throw err
            }

            return board
        })

        return res.send(
            {
                board: board
            }
        )
    } catch (err) {
        switch(err.message){
            case "BadRequestError":
                return next(createError(400, 'BadRequestError'))
            case "NotFoundError":
                return next(createError(404, 'NotFoundError'))
            default:
                return next(createError(500, 'Error'))
        }
    }

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

    try{
        const board = await boardService.getBoards(page,pageSize)

        if(board.message){
            const err = new Error(board.message)
            throw err
        }

        return res.send(
            {
                board: board.rows,
                totalCount: board.count
            }
        )
    } catch (err) {
        switch(err.message){
            case "BadRequestError":
                return next(createError(400, 'BadRequestError'))
            default:
                return next(createError(500, 'Error'))
        }
    }


}

exports.updateStar = async (req, res, next) => {
    const boardId = req.params.boardId
    const userId = req.body.userId
    const starType = req.body.type

    if(!boardId || !starType || !userId){
        return next(createError(400, 'BadRequestError'))
    }

    try{
        const isExistStar = await starService.isExistStar(userId,boardId)

        if(isExistStar.message){
            const err = new Error(isExistStar.message)
            throw err
        }

        const result = await models.sequelize.transaction(async (t) => {
            const result = await boardService.updateStar(boardId, starType, t)

            if(result.message){
                const err = new Error(result.message)
                throw err
            }

            const star = await starService.addStar(boardId, userId, starType, t)

            if(star.message){
                const err = new Error(star.message)
                throw err
            }

            return result
        })

        const newBoard = await boardService.getBoard(boardId)

        if(newBoard.message){
            const err = new Error(newBoard.message)
            throw err
        }

        return res.send(
            {
                board: newBoard
            }
        )
    } catch (err) {
        switch(err.message){
            case "BadRequestError":
                return next(createError(400, 'BadRequestError'))
            case "NotFoundError":
                return next(createError(404, 'NotFoundError'))
            case "Conflict":
                return next(createError(409, 'Conflict'))
            default:
                return next(createError(500, 'Error'))
        }
    }


}

exports.checkBoardPassword = async (req, res, next) => {
    const boardId = req.params.boardId
    const password = req.query.password

    if(!boardId || !password){
        return next(createError(400, 'BadRequestError'))
    }

    try{
        const board = await boardService.getBoardWithPassword(boardId,password)

        if(board.message){
            const err = new Error(board.message)
            throw err
        }

        return res.send(
            {
                result: true
            }
        )
    } catch (err) {
        switch(err.message){
            case "BadRequestError":
                return next(createError(400, 'BadRequestError'))
            case "NotFoundError":
                return next(createError(404, 'NotFoundError'))
            default:
                return next(createError(500, 'Error'))
        }
    }

}

