const {check, body} = require('express-validator');

let validateCreateCauHoi = () => {
    return [ 
      check('id_bai_test', 'Thiếu id bài test').not().isEmpty(),
      check('so_diem_cau_hoi', 'Thiếu số điểm câu hỏi').not().isEmpty(),
      check('noi_dung', 'Thiếu nội dung câu hỏi').not().isEmpty(),
      check('dap_an', 'Thiếu danh sách đáp án câu hỏi').not().isEmpty(),
      check('dap_an_dung', 'Thiếu danh sách đáp án đúng câu hỏi').not().isEmpty(),
      check('so_diem_cau_hoi', 'Số điểm câu hỏi phải là Số').isNumeric(),
      check('dap_an', 'Đáp án phải là Array').isArray(),
      check('dap_an_dung', 'Đáp án đúng phải là Array').isArray()
    ]; 
}

let validateDeleteCauHoi = () => {
    return [
        check('id', 'Thiếu id câu hỏi').not().isEmpty()
    ]
}

let validateUpdateCauHoi = () => {
    return [
        check('id', 'Thiếu id câu hỏi').not().isEmpty(),
        check('data.id_bai_test', 'Thiếu id bài test').if(body('data.id_bai_test').exists()).not().isEmpty(),
        check('data.so_diem_cau_hoi', 'Thiếu số điểm câu hỏi').if(body('data.so_diem_cau_hoi').exists()).not().isEmpty(),
        check('data.noi_dung', 'Thiếu nội dung câu hỏi').not().if(body('data.noi_dung').exists()).isEmpty(),
        check('data.dap_an', 'Thiếu danh sách đáp án câu hỏi').if(body('data.dap_an').exists()).not().isEmpty(),
        check('data.dap_an_dung', 'Thiếu danh sách đáp án đúng câu hỏi').if(body('data.dap_an_dung').exists()).not().isEmpty(),
        check('data.so_diem_cau_hoi', 'Số điểm câu hỏi phải là Số').if(body('data.so_diem_cau_hoi').exists()).isNumeric(),
        check('data.dap_an', 'Đáp án phải là Array').if(body('data.dap_an').exists()).isArray(),
        check('data.dap_an_dung', 'Đáp án đúng phải là Array').if(body('data.dap_an_dung').exists()).isArray()
    ]
}


let validateCauHoi = {
    validateCreateCauHoi: validateCreateCauHoi,
    validateDeleteCauHoi:validateDeleteCauHoi,
    validateUpdateCauHoi:validateUpdateCauHoi
};
  
module.exports = {validateCauHoi};