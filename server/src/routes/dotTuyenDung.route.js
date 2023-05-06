const exp = require("express");
const router = exp.Router();
const controller = require('../controllers/dotTuyenDung.controller')

router.get('/danhsachungvien', controller.getDanhSachUngVienDotTuyenDung);
router.post('/', controller.createDotTuyenDung);
router.get('/', controller.getDotTuyenDung);
router.put('/', controller.updateDotTuyenDung);

module.exports = router;
