const userController = require('./controller/user.controller')
const authController = require('./controller/auth.controller')
const accountController = require('./controller/account.controller')
const storkController = require('./controller/stork.controller')
const favoriteController = require('./controller/favorite.controller')
const authMiddleware = require('./middleware/auth.middleware')

const passport = require('passport');
const passportConfig = require('./passport');
const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const sequelize = require('./models').sequelize;
const app = express()
const port = 3000;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));  // 클라이언트의 form값을 req.body에 넣음
app.use(cors());
app.use(passport.initialize());
passportConfig();
app.use(function(err, req, res, next) {
    res.status(500).send('Something broke!');
});

app.get ( '/', (req, res) => {res.send ( 'Hello Api Server!!!' +
    '');});
app.get('/checkAuth', authController.checkAuth)
app.get('/refreshToken', authController.refreshToken)
app.post('/Login', authController.Login)
app.post('/adduser' ,userController.addUser)
app.get('/getUser/:userId',authMiddleware.checkAuth, userController.getUser)
app.get('/checkUser/:userId',authMiddleware.checkAuth,  userController.checkUser)
app.delete('/deleteUser/:userId',authMiddleware.checkAuth, userController.deleteUser)
app.put('/updateUser/:userId',authMiddleware.checkAuth, userController.updateUser)
app.put('/user/account/addMoney/:accountId',authMiddleware.checkAuth, accountController.addMoney)
app.put('/user/account/subMoney/:accountId',authMiddleware.checkAuth, accountController.subMoney)
app.get('/account/:userId',authMiddleware.checkAuth, accountController.getAccount)
app.post('/stork/addStork/:userId',authMiddleware.checkAuth, storkController.addStork)
app.post('/stork/subStork/:userId',authMiddleware.checkAuth, storkController.subStork)
app.get('/stork/:userId/:storkName',authMiddleware.checkAuth, storkController.getStork)
app.get('/account/:userId',authMiddleware.checkAuth, storkController.getStorks)
app.post('/favorite/:userId',authMiddleware.checkAuth, favoriteController.addFavorite)
app.delete('/favorite/:userId',authMiddleware.checkAuth, favoriteController.removeFavorite)
app.get('/favorite/:userId',authMiddleware.checkAuth, favoriteController.getFavorite)
app.get('/favorites/:userId',authMiddleware.checkAuth, favoriteController.getFavorites)
app.get('/favorites/getFavoriteList/:userId',authMiddleware.checkAuth, favoriteController.getFavoritesByName)


const driver = async () =>{
    try{
        await sequelize.sync({force:false});
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



