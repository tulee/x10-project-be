const {check} = require('express-validator');

let validateUngTuyen = () => {
    return [ 
      check('ho_va_ten', 'Thiếu họ và tên').not().isEmpty(),
      check('sdt', 'Thiếu số điện thoại').not().isEmpty(),
      check('email', 'Thiếu email').not().isEmpty(),
      check('nam_sinh', 'Thiếu năm sinh').not().isEmpty(),
      check('gioi_tinh', 'Thiếu giới tính').not().isEmpty(),
      check('id_dot_tuyen_dung', 'Thiếu id đợt tuyển dụng').not().isEmpty(),
      check('id_vi_tri', 'Thiếu id vị trí').not().isEmpty(),
      // check('file', 'Thiếu file CV').not().isEmpty(),
      check('sdt', 'Số điện thoại sai định dạng').isMobilePhone(),
      check('email', 'Email sai định dạng').isEmail(),
      check('nam_sinh', 'Năm sinh là số').isNumeric(),
      check('id_dot_tuyen_dung', 'Id đợt tuyển dụng sai định dạng, phải là Mongo ObjectId').isLength(24),
      check('id_vi_tri', 'Id vị trí sai định dạng, phải là Mongo ObjectId').isLength(24)
    ]; 
}

let validateUngVien = {
  validateUngTuyen: validateUngTuyen
};
  
module.exports = {validateUngVien};