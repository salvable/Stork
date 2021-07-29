const secretObj = require("../config/jwt")
const jwt = require("jsonwebtoken");

exports.signAccessToken = async (userId) => {
    try {
        const token = jwt.sign({
                id: userId
            },
            secretObj.secret,
            {
                expiresIn: '60m'
            }
        )

        return token

    } catch (err) {
        console.log(err)
        return err.name
    }
}

exports.signRefreshToken = async (userId) => {
    try {
        const token = jwt.sign({
                id: userId
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