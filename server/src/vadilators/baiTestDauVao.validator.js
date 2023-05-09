const {check} = require('express-validator');

let validateCreateBaiTest = () => {
    return [ 
      check('ma_bai_test', 'Thiếu mã bài test').not().isEmpty(),
      check('ten_bai_test', 'Thiếu tên bài test').not().isEmpty(),
      check('ngay_tao_bai_test', 'Thiếu ngày tạo bài test').not().isEmpty(),
      check('so_diem_toi_thieu', 'Thiếu số điểm tối thiểu').not().isEmpty(),
      check('thoi_luong', 'Thiếu thời lượng').not().isEmpty(),
      check('vi_tri', 'Thiếu vị trí').not().isEmpty(),
      check('ngay_tao_bai_test', 'Ngày tạo bài test sai định dạng yyyy-mm-dd').isISO8601('yyyy-mm-dd'),
      check('so_diem_toi_thieu', 'Số điểm tối thiểu phải là số dương').isNumeric({min:0}),
      check('thoi_luong', 'Thời lượng phải là số dương').isNumeric({min:0}),
      check('vi_tri', 'Vị trí phải là array').isArray(),
    ]; 
}

let validateBaiTest = {
    validateCreateBaiTest: validateCreateBaiTest
};
  
module.exports = {validateBaiTest};