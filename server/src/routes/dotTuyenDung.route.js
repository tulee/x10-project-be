const exp = require("express");
const router = exp.Router();
const controller = require('../controllers/dotTuyenDung.controller')

router.post('/', controller.createDotTuyenDung);
router.get('/', controller.getDotTuyenDung);

module.exports = router;
