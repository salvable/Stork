const secretObj = require("../config/jwt")
const jwt = require("jsonwebtoken");

exports.signAccessToken = async (userId,password) => {
    try {
        const token = jwt.sign({
                id: userId,
                password: password
            },
            secretObj.secret,
            {
                expiresIn: '15m'
            }
        )

        return token

    } catch (err) {
        console.log(err)
        return err.name
    }
}

exports.signRefreshToken = async (userId,password) => {
    try {
        const token = jwt.sign({
                id: userId,
                password: password
            },
            secretObj.secret,
            {
                expiresIn: '7d'
            }
        )

        return token

    } catch (err) {
        console.log(err)
        return err.name
    }
}