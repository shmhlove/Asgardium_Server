
var Schema = {};
Schema.createSchema = function(mongoose)
{
    var MiningActiveQuantitySchema = mongoose.Schema(
    {
        "level" : {type:Number, "default":0}
        , "cost_unit_per_weight" : {type:Number, "default":0}
        , "quantity" : {type:Number, "default":0}
    });
    
    return MiningActiveQuantitySchema;
};

module.exports = Schema;