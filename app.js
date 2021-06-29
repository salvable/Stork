const userController = require('./controller/user.controller')
const authController = require('./controller/auth.controller')
const accountController = require('./controller/account.controller')
const storkController = require('./controller/stork.controller')

const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const sequelize = require('./models').sequelize;
const app = express()
const port = 3000;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));  // 클라이언트의 form값을 req.body에 넣음
app.use(cors())

app.get ( '/', (req, res) => {res.send ( 'Hello Api Server!!!' +
    '');});
app.get('/checkAuth', authController.checkAuth)
app.post('/adduser' ,userController.addUser)
app.get('/Login', authController.Login)
app.post('/user/account/:accountId', accountController.updateMoney)
app.get('/account/:userId', accountController.getAccount)
app.post('stork/:userId', storkController.addStork)
app.get('/stork/:userId/:storkName', storkController.getStork)
app.get('/account/:userId', storkController.getStorks)
const driver = async () =>{
    try{
        await sequelize.sync({force:true});
    } catch (err) {
        console.log(err)
        console.log("init Fail");
        return;
    }
}

driver();

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})



