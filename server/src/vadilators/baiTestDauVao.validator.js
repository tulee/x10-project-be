const {check, body} = require('express-validator');

let validateCreateBaiTest = () => {
    return [ 
      check('ma_bai_test', 'Thiếu mã bài test').not().isEmpty(),
      check('ten_bai_test', 'Thiếu tên bài test').not().isEmpty(),
      check('so_diem_toi_thieu', 'Thiếu số điểm tối thiểu').not().isEmpty(),
      check('thoi_luong', 'Thiếu thời lượng').not().isEmpty(),
      check('vi_tri', 'Thiếu vị trí').not().isEmpty(),
      check('danhSachCauHoi', 'Thiếu danh sách câu hỏi').not().isEmpty(),
      check('danhSachCauHoi.*.so_diem_cau_hoi', 'Thiếu số điểm câu hỏi').not().isEmpty(),
      check('danhSachCauHoi.*.noi_dung', 'Thiếu nội dung câu hỏi').not().isEmpty(),
      check('danhSachCauHoi.*.dap_an', 'Thiếu danh sách đáp án').not().isEmpty(),
      check('danhSachCauHoi.*.dap_an_dung', 'Thiếu đáp án đúng của câu hỏi').not().isEmpty(),
      check('so_diem_toi_thieu', 'Số điểm tối thiểu phải là số dương').isNumeric({min:0}),
      check('thoi_luong', 'Thời lượng phải là số dương').isNumeric({min:0}),
      check('vi_tri', 'Vị trí phải là array').isArray(),
      check('danhSachCauHoi','Danh sách câu hỏi phải là array').isArray(),
      check('danhSachCauHoi.*.so_diem_cau_hoi', 'Số điểm câu hỏi phải là định dạng số').isNumeric(),
      check('danhSachCauHoi.*.dap_an', 'Danh sách đáp án phải là Array').isArray(),
      check('danhSachCauHoi.*.dap_an_dung', 'Danh sách đáp án đúng phải là Array').isArray(),
    ]; 
}

let validateDeleteBaiTest = () => {
    return [
        check('id', 'Thiếu id bài test').not().isEmpty()
    ]
}

let validateUpdateBaiTest = () => {
    return [
        check('id_bai_test', 'Thiếu id bài test').not().isEmpty(),
        check('ma_bai_test', 'Mã bài test không được trống')
            .if(body('ma_bai_test').exists())
            .not().isEmpty(),
        check('ten_bai_test', 'Tên bài test không được trống')
            .if(body('ten_bai_test').exists())
            .not().isEmpty(),
        check('so_diem_toi_thieu', 'Số điểm tối thiểu không được trống')
            .if(body('so_diem_toi_thieu').exists())
            .not().isEmpty(),
        check('thoi_luong', 'Thời lượng không được trống')
            .if(body('thoi_luong').exists())
            .not().isEmpty(),
        check('vi_tri', 'Vị trí không được trống')
            .if(body('vi_tri').exists())
            .not().isEmpty(),
        check('ngay_tao_bai_test', 'Ngày tạo bài test không được để trống')
            .if(body('ngay_tao_bai_test').exists())
            .not().isEmpty(),
        check('ngay_tao_bai_test', 'Ngày tạo bài test sai định dạng yyyy-mm-dd')
            .if(body('ngay_tao_bai_test').exists())
            .isISO8601('yyyy-mm-dd'),
        check('so_diem_toi_thieu', 'Số điểm tối thiểu phải là số dương')
            .if(body('so_diem_toi_thieu').exists())
            .isNumeric({min:0}),
        check('thoi_luong', 'Thời lượng phải là số dương')
            .if(body('thoi_luong').exists())
            .isNumeric({min:0}),
        check('vi_tri', 'Vị trí phải là array')
            .if(body('vi_tri').exists())
            .isArray(),
    ]
}

let validateNopBaiTest = () => {
    return [
        check('idYeuCauUngTuyen', 'Thiếu id yêu cầu ứng tuyển').not().isEmpty(),
        check('dsDapAnUngVien.*.dapAnUngVien', 'Thiếu đáp án ứng viên').not().isEmpty(),
        check('dsDapAnUngVien.*.idCauHoi', 'Thiếu id câu hỏi').not().isEmpty(),
        check('dsDapAnUngVien.*.dapAnUngVien', 'Đáp án ứng viên phải là Array').isArray()
    ]
}

let validateBaiTest = {
    validateCreateBaiTest: validateCreateBaiTest,
    validateDeleteBaiTest:validateDeleteBaiTest,
    validateUpdateBaiTest:validateUpdateBaiTest,
    validateNopBaiTest:validateNopBaiTest
};
  
module.exports = {validateBaiTest};