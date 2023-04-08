const viTriRouter = require('./viTri.route');
const mailRouter = require('./mail.route');

function route(app){
    app.use('/vitri',viTriRouter)
    app.use('/mail',mailRouter)
    app.use('/',(req, res) => {
        res.send('Home page')
    })
}

module.exports = route