const exp = require("express");
const router = exp.Router();
const controller = require('../controllers/mail.controller')

router.post('/', controller.guiMail);

module.exports = router;
