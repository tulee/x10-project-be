const exp = require("express");
const router = exp.Router();
const controller = require('../controllers/ungVien.controller')
const fileUploader = require('../config/cloudinary');
const { validateUngVien } = require("../vadilators/ungVien.validator");

router.post('/', fileUploader.single('file'), validateUngVien.validateUngTuyen(), controller.ungTuyen);
router.get('/',  controller.danhSachUngVien);
router.put('/',  controller.capNhatUngVien);

module.exports = router;
