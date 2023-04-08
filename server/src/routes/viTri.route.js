const exp = require("express");
const router = exp.Router();
const controller = require('../controllers/viTri.controller')

router.get('/', controller.layTatCaViTri);

module.exports = router;
