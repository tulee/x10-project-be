const exp = require("express");
const router = exp.Router();
const controller = require('../controllers/dotTuyenDung.controller');
const { validateDotTuyenDung } = require("../vadilators/dotTuyenDung.validator");

router.get('/danhsachungvien', controller.getDanhSachUngVienDotTuyenDung);
router.get('/gannhat', controller.getLastedDotTuyenDungDetail);
router.post('/',validateDotTuyenDung.validateCreateDotTuyenDung(), controller.createDotTuyenDung);
router.get('/:iddottuyendung', controller.getDotTuyenDungDetail);
router.get('/', controller.getDotTuyenDung);
router.put('/',validateDotTuyenDung.validateUpdateDotTuyenDung(), controller.updateDotTuyenDung);
router.delete('/', controller.deleteDotTuyenDung);

module.exports = router;
