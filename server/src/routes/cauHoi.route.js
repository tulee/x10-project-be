const exp = require("express");
const router = exp.Router();
const controller = require('../controllers/cauHoi.controller');
const { validateCauHoi } = require("../vadilators/cauHoi.validator");

router.get('/', controller.getCauHoiById);
router.post('/',validateCauHoi.validateCreateCauHoi(), controller.createCauHoi);
router.delete('/',validateCauHoi.validateDeleteCauHoi(), controller.deleteCauHoi);
router.put('/',validateCauHoi.validateUpdateCauHoi(), controller.updateCauHoi);

module.exports = router;
