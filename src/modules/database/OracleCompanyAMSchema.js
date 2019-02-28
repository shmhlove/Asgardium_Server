
var Schema = {};
Schema.createSchema = function(mongoose)
{
    var CompanyAMSchema = mongoose.Schema(
    {
        "resource_id" : {type:Number, "default":0},
        "name_str_id" : {type:Number, "default":0},
        "emblem_id" : {type:Number, "default":0},
        "efficiency_lv" : {type:Number, "default":0},
        "supply_lv" : {type:Number, "default":0}
    });
    
    return CompanyAMSchema;
};

module.exports = Schema;