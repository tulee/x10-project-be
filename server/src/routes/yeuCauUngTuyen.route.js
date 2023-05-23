const exp = require("express");
const router = exp.Router();
const controller = require('../controllers/yeuCauUngTuyen.controller')

router.put('/lichpv', controller.updateLichPv);
router.put('/ketquapv', controller.updateKetQuaPv);
router.put('/', controller.updateYeuCauTuyenDung);

module.exports = router;
