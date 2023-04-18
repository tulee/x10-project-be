const exp = require("express");
const router = exp.Router();
const controller = require('../controllers/baiTestDauVao.controller')

router.get('/', controller.getBaiTest);

module.exports = router;
