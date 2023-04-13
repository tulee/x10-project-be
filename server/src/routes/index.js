const viTriRouter = require('./viTri.route');
const mailRouter = require('./mail.route');
const authRouter = require('./auth.route');
const authMiddleware = require('../middlewares/auth.middleware');
const isAuth = authMiddleware.isAuth;

function route(app){
    app.use('/vitri',isAuth,viTriRouter)
    app.use('/mail',isAuth,mailRouter)
    app.use('/auth',authRouter)
    app.use('/',(req, res) => {
        res.send('Home page')
    })
}

module.exports = route