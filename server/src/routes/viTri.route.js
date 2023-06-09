const exp = require("express");
const router = exp.Router();
const controller = require('../controllers/viTri.controller');
const { validateViTri } = require("../vadilators/viTri.validator");

router.get('/', controller.getViTri);
router.get('/chitiet', controller.getViTriById);
router.post('/',validateViTri.validateCreateViTri(), controller.createViTri);
router.delete('/',validateViTri.validateDeleteViTri(), controller.deleteViTri);
router.put('/',validateViTri.validateUpdateViTri(), controller.updateViTri);

module.exports = router;
