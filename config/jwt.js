require('dotenv').config();

let jwtObj = {};

jwtObj.secret = process.env.JWT_SECRET_KEY

module.exports = jwtObj