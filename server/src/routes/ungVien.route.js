const exp = require("express");
const router = exp.Router();
const controller = require('../controllers/ungVien.controller')

router.post('/', controller.ungTuyen);

module.exports = router;
