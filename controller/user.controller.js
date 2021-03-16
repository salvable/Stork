const userService = require('../service/user.service.js')
const createError = require('http-errors')

exports.addUser = async (req, res, next) => {
    // const userId = "Test"
    // const password = "1q2w3e4r!"
    // const email = "test@naver.com"
    // const name = "엄준식"
    // const phoneNumber = "010-4562-3464"
    const userId = req.body.userId
    const password = req.body.password
    const email = req.body.email
    const name = req.body.name
    const phoneNumber = req.body.phoneNumber

    try {
        const user = await userService.addUser(userId,password,email,name,phoneNumber)


        if(user == "ValidationError"){
            return next(createError(400, 'BadRequestError'))
        }

        return res.send(
            {
                user: user
            }
        )
    } catch (err) {
        return res.status(500).json(err)
    }
}