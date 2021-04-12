const createError = require('http-errors')
const accountService = require('../service/account.service')

exports.addMoney = async (req, res, next) => {
    const accountId = req.params.accountId
    const money = req.query.money

    if(!accountId || !money){
        return next(createError(400, 'BadRequestError'))
    }

    try {
        const account = await accountService.addMoney(accountId,money)

        if(account == "NotFoundError"){
            return next(createError(404, 'NotFoundError'))
        }

        return res.send(
            {
                account: account
            }
        )
    } catch (err) {
        return res.status(500).json(err)
    }
}