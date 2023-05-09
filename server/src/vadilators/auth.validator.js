const {check} = require('express-validator');

let validateRegister = () => {
    return [ 
      check('username', 'Thiếu tên đăng nhập').not().isEmpty(),
      check('username', 'Tên đăng nhập chỉ được bao gồm chữ và số').isAlphanumeric(),
      check('username', 'Tên đăng nhập phải nhiều hơn 6 kí tự').isLength({ min: 6 }),
      check('password', 'Mật khẩu phải nhiều hơn 6 kí tự').isLength({ min: 6 }),
    ]; 
}

let validateLogin = () => {
    return [ 
      check('username', 'Thiếu tên đăng nhập').not().isEmpty(),
      check('password', 'Mật khẩu phải nhiều hơn 6 kí tự').isLength({ min: 6 }),
    ]; 
}

let validateAuth = {
    validateRegister: validateRegister,
    validateLogin:validateLogin
};
  
module.exports = {validateAuth};