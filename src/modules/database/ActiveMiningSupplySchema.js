
var Schema = {};
Schema.createSchema = function(mongoose)
{
    var ActiveMiningSupply = mongoose.Schema(
    {
        "level" : {type:Number, "default":0}
        , "cost_unit" : {type:Number, "default":0}
        , "supply" : {type:Number, "default":0}
    });
    
    return ActiveMiningSupply;
};

module.exports = Schema;