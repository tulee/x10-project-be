const {check, body} = require('express-validator');

let validateCreateDotTuyenDung = () => {
    return [ 
      check('ten', 'Thiếu tên đợt tuyển dụng').not().isEmpty(),
      check('vi_tri', 'Thiếu vị trí').not().isEmpty(),
      check('ngay_bat_dau', 'Thiếu ngày bắt đầu').not().isEmpty(),
      check('ngay_ket_thuc', 'Thiếu ngày kết thúc').not().isEmpty(),
      check('ngay_bat_dau', 'Ngày bắt đầu sai định dạng yyyy-mm-dd').isISO8601('yyyy-mm-dd'),
      check('ngay_ket_thuc', 'Ngày kết thúc sai định dạng yyyy-mm-dd').isISO8601('yyyy-mm-dd'),
      check('vi_tri', 'Vị trí phải là array').isArray(),
    ]; 
}

let validateUpdateDotTuyenDung = () => {
  return [ 
    check('idDotTuyenDung', 'Thiếu Id đợt tuyển dụng').not().isEmpty(),
    check('ten', 'Thiếu tên đợt tuyển dụng').if(body('ten').exists()).not().isEmpty(),
    check('vi_tri', 'Thiếu vị trí').if(body('vi_tri').exists()).not().isEmpty(),
    check('ngay_bat_dau', 'Thiếu ngày bắt đầu').if(body('ngay_bat_dau').exists()).not().isEmpty(),
    check('ngay_ket_thuc', 'Thiếu ngày kết thúc').if(body('ngay_ket_thuc').exists()).not().isEmpty(),
    check('ngay_bat_dau', 'Ngày bắt đầu sai định dạng yyyy-mm-dd').if(body('ngay_bat_dau').exists()).isISO8601('yyyy-mm-dd'),
    check('ngay_ket_thuc', 'Ngày kết thúc sai định dạng yyyy-mm-dd').if(body('ngay_ket_thuc').exists()).isISO8601('yyyy-mm-dd'),
    check('vi_tri', 'Vị trí phải là array').if(body('vi_tri').exists()).isArray(),
  ]; 
}

let validateDotTuyenDung = {
    validateCreateDotTuyenDung: validateCreateDotTuyenDung,
    validateUpdateDotTuyenDung:validateUpdateDotTuyenDung
};
  
module.exports = {validateDotTuyenDung};