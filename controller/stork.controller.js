const createError = require('http-errors')
const storkService = require('../service/stork.service.js')
const accountService = require('../service/account.service')
const models = require('../models')


exports.addStork = async (req, res, next) => {
    const userId = req.params.userId
    const storkName = req.query.storkName
    const number = req.query.number

    if(!userId || !storkName || !number){
        return next(createError(400, 'BadRequestError'))
    }

    try {
        await models.sequelize.transaction(async (t) => {
            const account = await accountService.updateMoney(userId,number,t)
            //Todo account에서는 number * 가격만큼 잔고에서 빼야 하고 stork에서는 산 수량만큼 업데이트 or 새로 생성을 해줘야 한다.
            const stork = await storkService.addStork(userId, storkName, number, t)
        })

        const updateStork = await storkService.getStork(userId,storkName)

        return res.send(
            {
                account: updateStork
            }
        )
    } catch (err) {
        return res.status(500).json(err)
    }
}



exports.getStork = async (req, res, next) => {
    const userId = req.params.userId
    const storkName = req.query.storkName

    if(!userId || !storkName ){
        return next(createError(400, 'BadRequestError'))
    }

    try {
        const stork = await storkService.getStork(userId, storkName)

        if(!stork){
            return next(createError(404, 'NotFoundError'))
        }

        return res.send(
            {
                account: stork
            }
        )
    } catch (err) {
        return res.status(500).json(err)
    }
}