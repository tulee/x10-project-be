const exp = require("express");
const router = exp.Router();
const controller = require('../controllers/baiTestDauVao.controller');
const { validateBaiTest } = require("../vadilators/baiTestDauVao.validator");

router.get('/cauhoi', controller.getDanhSachCauHoi);
router.get('/', controller.getBaiTest);
router.delete('/',validateBaiTest.validateDeleteBaiTest(), controller.deleteBaiTest);
router.post('/createbaitest',validateBaiTest.validateCreateBaiTest(), controller.createBaiTest);
router.put('/nopbaitest', controller.nopBaiTest);

module.exports = router;
