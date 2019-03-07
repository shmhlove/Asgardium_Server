var crypto = require("crypto");

var Schema = {};
Schema.createSchema = function(mongoose)
{
    var CompanyForMiningSchema = mongoose.Schema(
    {
        "instance_id" : {type:String, "default":""}
        , "resource_id" : {type:Number, "default":0}
        , "name_strid" : {type:Number, "default":0}
        , "emblem_image" : {type:String, "default":""}
        , "efficiency_lv" : {type:Number, "default":0}
        , "supply_count" : {type:Number, "default":0}
        , "is_basic_company" : {type:Boolean, "default":false}
    });
    
    return CompanyForMiningSchema;
};

module.exports = Schema;