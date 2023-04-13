const exp = require("express");
const router = exp.Router();
const controller = require('../controllers/auth.controller')

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/refresh', controller.refreshToken);

module.exports = router;
