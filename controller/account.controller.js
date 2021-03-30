exports.addMoney = async (req, res, next) => {
    const accountId = req.params.accountId
    const money = req.query

    try {

    } catch (err) {
        return res.status(500).json(err)
    }
}