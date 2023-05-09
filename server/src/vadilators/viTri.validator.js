const {check, body} = require('express-validator');

let validateCreateViTri = () => {
    return [ 
      check('ma_vi_tri', 'Thiếu mã vị trí').not().isEmpty(),
      check('ten_vi_tri', 'Thiếu tên vị trí').not().isEmpty(),
    ]; 
}

let validateDeleteViTri = () => {
    return [
        check('id', 'Thiếu id vị trí').not().isEmpty()
    ]
}


let validateViTri = {
    validateCreateViTri: validateCreateViTri,
    validateDeleteViTri:validateDeleteViTri
};
  
module.exports = {validateViTri};