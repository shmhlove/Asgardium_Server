
var Schema = {};
Schema.createSchema = function(mongoose)
{
    var CompanyAMSchema = mongoose.Schema(
    {
        "instance_id" : {type:String, "default":""}
        , "resource_id" : {type:Number, "default":0}
        , "name_strid" : {type:Number, "default":0}
        , "emblem_image" : {type:String, "default":""}
        , "efficiency_lv" : {type:Number, "default":0}
        , "supply_lv" : {type:Number, "default":0}
        , "is_use" : {type:Number, "default":0}
    });
    
    return CompanyAMSchema;
};

module.exports = Schema;