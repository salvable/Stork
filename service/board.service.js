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
            unStar: 0,
        })

        if(!board){
            const err = new Error("BadRequestError")
            throw err
        }

        return board

    } catch (err) {
        return err
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
            throw err
        }

        return true

    } catch (err) {
        return err
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
            throw err
        }

        return true

    } catch (err) {
        return err
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
            throw err
        }

        return board

    } catch (err) {
        return err
    }
}

exports.getBoardWithPassword = async (boardId,password) => {
    try {
        const board = await Board.findOne({
            where:{
                boardId: boardId,
                password: password
            }
        })

        if(!board){
            const err = new Error("BadRequestError")
            throw err
        }

        return board

    } catch (err) {
        return err
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
            throw err
        }

        return board

    } catch (err) {
        return err
    }
}

exports.deleteBoard = async (boardId) => {
    try {
        const result = await Board.destroy({
            where: {
                boardId: boardId
            }
        })

        // ????????? ?????????????????? true ??????

        return true
    } catch (err) {
        return err.name
    }
}

exports.updateHit = async (boardId,transaction) => {
    const t = transaction || undefined

    try {
        const board = await Board.findOne({
            where:{
                boardId: boardId
            }
        })

        if(!board){
            const err = new Error("NotFoundError")
            throw err
        }

        await Board.update({
            hit: board.hit + 1
        },{
            where:{
                boardId: boardId
            }},{
            transaction: t
        })

        return true

    } catch (err) {
        return err
    }
}

exports.updateStar = async (boardId,starType,transaction = undefined) => {
    const t = transaction || undefined

    try {
        const board = await Board.findOne({
            where:{
                boardId: boardId
            }
        })

        if(!board){
            const err = new Error("NotFoundError")
            throw err
        }

        if(starType == "star"){
            await Board.update({
                star: board.star + 1
                },{
                    where:{
                        boardId: boardId
                    }}, {transaction: t})
        }else{
            await Board.update({
                unStar: board.unStar + 1
                },{
                    where:{
                        boardId: boardId
                    }},{transaction: t})
        }

        return true

    } catch (err) {
        return err
    }
}
