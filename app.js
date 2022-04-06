const userController = require('./controller/user.controller')
const authController = require('./controller/auth.controller')
const accountController = require('./controller/account.controller')
const storkController = require('./controller/stork.controller')
const favoriteController = require('./controller/favorite.controller')
const boardController = require('./controller/board.controller')
const commentController = require("./controller/comment.controller");
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


app.get ( '/', (req, res) => {res.send ( 'Stork Server!!!' );});
app.get('/checkAuth', authController.checkAuth)
app.get('/refreshToken', authController.refreshToken)
app.post('/Login', authController.Login)
app.get('/user' ,userController.addUser)
app.get('/user/:userId',authMiddleware.checkAuth, userController.getUser)
app.delete('/user/:userId',authMiddleware.checkAuth, userController.deleteUser)
app.put('/user/:userId',authMiddleware.checkAuth, userController.updateUser)
app.get('/checkUser/:userId',authMiddleware.checkAuth,  userController.checkUser)
app.put('/user/account/deposit/:accountId',authMiddleware.checkAuth, accountController.addMoney)
app.put('/user/account/withdrawal/:accountId',authMiddleware.checkAuth, accountController.subMoney)
app.get('/account/:userId',authMiddleware.checkAuth, accountController.getAccount)
app.post('/stork/purchase/:userId',authMiddleware.checkAuth, storkController.addStork)
app.post('/stork/sale/:userId',authMiddleware.checkAuth, storkController.subStork)
app.get('/stork/:userId/:storkName',authMiddleware.checkAuth, storkController.getStork)
app.get('/account/:userId',authMiddleware.checkAuth, storkController.getStorks)
app.post('/favorite/:userId',authMiddleware.checkAuth, favoriteController.addFavorite)
app.delete('/favorite/:userId',authMiddleware.checkAuth, favoriteController.removeFavorite)
app.get('/favorite/:userId',authMiddleware.checkAuth, favoriteController.getFavorite)
app.get('/favorites/:userId',authMiddleware.checkAuth, favoriteController.getFavorites)
app.get('/favorites/favoriteList/:userId',authMiddleware.checkAuth, favoriteController.getFavoritesByName)
app.post('/board',authMiddleware.checkAuth ,boardController.addBoard)
// 게시글을 보는 것은 비회원도 가능한 요청이라 checkAuth를 거치지 않음
app.get('/board/:boardId', boardController.getBoard)
app.get('/boards', boardController.getBoards)
app.delete('/board/:boardId', boardController.deleteBoard)
app.put('/board/:boardId' ,boardController.modifyBoard)
app.get('/board/:boardId/checkPw' ,boardController.checkBoardPassword)
app.post('/board/:boardId/comment', authMiddleware.checkAuth, commentController.addComment)
app.get('/board/:boardId/comment', commentController.getComment)
app.put('/board/:boardId/star',authMiddleware.checkAuth ,boardController.updateStar)

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

module.exports = app;

