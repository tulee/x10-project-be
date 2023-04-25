const exp = require("express");
const router = exp.Router();
const controller = require('../controllers/ungVien.controller')
const fileUploader = require('../config/cloudinary');

router.post('/', fileUploader.single('file'), controller.ungTuyen);

module.exports = router;
