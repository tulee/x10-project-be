const exp = require("express");
const router = exp.Router();
const controller = require('../controllers/baiTestDauVao.controller');
const { validateBaiTest } = require("../vadilators/baiTestDauVao.validator");

router.get('/cauhoi', controller.getDanhSachCauHoi);
router.delete('/',validateBaiTest.validateDeleteBaiTest(), controller.deleteBaiTest);
router.put('/',validateBaiTest.validateUpdateBaiTest(), controller.updateBaiTest);
router.post('/createbaitest',validateBaiTest.validateCreateBaiTest(), controller.createBaiTest);
router.put('/nopbaitest', validateBaiTest.validateNopBaiTest(), controller.nopBaiTest);
router.get('/', controller.getBaiTest);

module.exports = router;
