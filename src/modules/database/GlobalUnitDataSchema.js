
var Schema = {};
Schema.createSchema = function(mongoose)
{
    var GlobalUnitDataSchema = mongoose.Schema(
    {
        "unit_id" : {type:Number, "default":0}
        , "name_str_id" : {type:Number, "default":0}
        , "icon_name" : {type:String, "default":""}
        , "weight" : {type:Number, "default":0}
        , "fuel_unit_id_1" : {type:Number, "default":0}
        , "fuel_unit_id_2" : {type:Number, "default":0}
    });
    
    return GlobalUnitDataSchema;
};


module.exports = Schema;