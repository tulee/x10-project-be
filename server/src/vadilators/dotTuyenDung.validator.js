const {check} = require('express-validator');

let validateCreateDotTuyenDung = () => {
    return [ 
      check('ten', 'Thiếu tên đợt tuyển dụng').not().isEmpty(),
      check('ngay_bat_dau', 'Ngày bắt đầu sai định dạng yyyy-mm-dd').isISO8601('yyyy-mm-dd'),
      check('ngay_ket_thuc', 'Ngày kết thúc sai định dạng yyyy-mm-dd').isISO8601('yyyy-mm-dd')
    ]; 
}

let validateDotTuyenDung = {
    validateCreateDotTuyenDung: validateCreateDotTuyenDung
};
  
module.exports = {validateDotTuyenDung};