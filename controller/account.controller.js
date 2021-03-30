const createError = require('http-errors')

exports.addMoney = async (req, res, next) => {
    const accountId = req.params.accountId
    const money = req.query.money

    if(!accountId || !money){
        return next(createError(400, 'BadRequestError'))
    }

    try {


    } catch (err) {
        return res.status(500).json(err)
    }
}