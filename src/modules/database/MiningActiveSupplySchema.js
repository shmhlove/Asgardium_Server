
var Schema = {};
Schema.createSchema = function(mongoose)
{
    var MiningActiveSupplySchema = mongoose.Schema(
    {
        "level" : {type:Number, "default":0}
        , "cost_unit_per_weight" : {type:Number, "default":0}
        , "supply" : {type:Number, "default":0}
    });
    
    return MiningActiveSupplySchema;
};

module.exports = Schema;