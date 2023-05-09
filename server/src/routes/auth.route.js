const exp = require("express");
const router = exp.Router();
const controller = require('../controllers/auth.controller');
const { validateAuth } = require("../vadilators/auth.validator");

router.post('/register', validateAuth.validateRegister(), controller.register);
router.post('/login',validateAuth.validateLogin(), controller.login);
router.post('/refresh', controller.refreshToken);

module.exports = router;
