const viTriRouter = require('./viTri.route');
const mailRouter = require('./mail.route');
const yeuCauUngTuyenRouter = require('./yeuCauUngTuyen.route');
const authRouter = require('./auth.route');
const ungVienRouter = require('./ungVien.route');
const baiTestDauVaoRouter = require('./baiTestDauVao.route');
const dotTuyenDungRouter = require('./dotTuyenDung.route');
const authMiddleware = require('../middlewares/auth.middleware');
const uploadRouter = require('./cloudinary.route');
const isAuth = authMiddleware.isAuth;

function route(app){
    app.use('/vitri',viTriRouter)
    app.use('/mail',mailRouter)
    app.use('/auth',authRouter)
    app.use('/yeucauungtuyen',yeuCauUngTuyenRouter)
    app.use('/baitest',baiTestDauVaoRouter)
    app.use('/uploads', uploadRouter);
    app.use('/ungvien', ungVienRouter)
    app.use('/dottuyendung', dotTuyenDungRouter)
    app.use('/',(req, res) => {
        res.send('Home page')
    })
}

module.exports = route