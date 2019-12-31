var Schema = {};
Schema.createSchema = function(mongoose)
{
    var MiningActiveRechargeDelay = mongoose.Schema(
    {
        "level" : {type:Number, "default":0}
        , "cost_unit_per_weight" : {type:Number, "default":0}
        , "delay" : {type:Number, "default":0}
    });
    
    return MiningActiveRechargeDelay;
};

module.exports = Schema;