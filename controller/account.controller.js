const createError = require('http-errors')
const accountService = require('../service/account.service')

exports.addMoney = async (req, res, next) => {
    const accountId = req.params.accountId
    const userId = req.query.userId
    const money = req.query.money


    if(!accountId || !money){
        return next(createError(400, 'BadRequestError'))
    }

    try {
        await accountService.updateMoney(accountId,money)

        if(account == "NotFoundError"){
            return next(createError(404, 'NotFoundError'))
        }

        const updateAccount = await accountService.getAccount(userId)

        return res.send(
            {
                account: updateAccount
            }
        )
    } catch (err) {
        return res.status(500).json(err)
    }
}