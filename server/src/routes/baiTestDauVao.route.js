const exp = require("express");
const router = exp.Router();
const controller = require('../controllers/baiTestDauVao.controller')

router.get('/cauhoi', controller.getDanhSachCauHoi);
router.get('/', controller.getBaiTest);
router.put('/nopbaitest', controller.nopBaiTest);

module.exports = router;
