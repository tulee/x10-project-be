const mongoose = require('mongoose');
const BaseModel = require('./base.model');
const CbnvSchema = require('./schemas/cbnv.schema');
class CbnvModel extends BaseModel {
    constructor(){
        super()
        this.init("cbnv", CbnvSchema, "cbnv");
    }

    async getCbnvByUsername(username){
        const query = this.model.findOne({username: username});
        return query.exec();
    }

    async updateCbnvByUsername(username, data){
        this.getCbnvByUsername(username).then(cbnv => {
            let query = this.update(cbnv._id, data)
            console.log(query);
            return query.exec() 
        })        
    }
}

module.exports = new CbnvModel();
