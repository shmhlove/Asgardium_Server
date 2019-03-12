var crypto = require("crypto");

var Schema = {};
Schema.createSchema = function(mongoose)
{
    var InstanceMiningActiveCompanySchema = mongoose.Schema(
    {
        "instance_id" : {type:String, "default":""}
        , "unit_id" : {type:Number, "default":0}
        , "name_str_id" : {type:Number, "default":0}
        , "emblem_image" : {type:String, "default":""}
        , "efficiency_lv" : {type:Number, "default":0}
        , "supply_count" : {type:Number, "default":0}
        , "is_basic_company" : {type:Boolean, "default":false}
    });
    
    return InstanceMiningActiveCompanySchema;
};

module.exports = Schema;