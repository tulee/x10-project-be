const exp = require("express");
const router = exp.Router();
const controller = require('../controllers/viTri.controller')

router.get('/', controller.getAllViTri);

module.exports = router;
