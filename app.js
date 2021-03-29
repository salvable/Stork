const userController = require('./controller/user.controller')
const authController = require('./controller/auth.controller')

const createError = require('http-errors')
const express = require('express')
const bodyParser = require('body-parser')
const sequelize = require('./models').sequelize;
const app = express()
const port = 3000;

app.use(bodyParser.json());
const jwt = require("jsonwebtoken");

app.get ( '/', (req, res) => {res.send ( 'Hello Api Server!!!');});
app.post('/adduser' ,userController.addUser)
app.get('/Login', authController.Login)

const driver = async () =>{
    try{
        await sequelize.sync({force:true});
    } catch (err) {
        console.log("init Fail");
        return;
    }
}

driver();

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})



