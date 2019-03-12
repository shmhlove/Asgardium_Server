
var Schema = {};
Schema.createSchema = function(mongoose)
{
    var MiningActiveCompanyNPCSchema = mongoose.Schema(
    {
        "instance_id" : {type:String, "default":""}
        , "unit_id" : {type:Number, "default":0}
        , "name_str_id" : {type:Number, "default":0}
        , "emblem_image" : {type:String, "default":""}
        , "efficiency_lv" : {type:Number, "default":0}
        , "supply_lv" : {type:Number, "default":0}
        , "is_use" : {type:Number, "default":0}
    });
    
    return MiningActiveCompanyNPCSchema;
};

module.exports = Schema;