
var Schema = {};
Schema.createSchema = function(mongoose)
{
    var ActiveMiningQuantity = mongoose.Schema(
    {
        "level" : {type:Number, "default":0}
        , "cost_unit" : {type:Number, "default":0}
        , "quantity" : {type:Number, "default":0}
    });
    
    return ActiveMiningQuantity;
};

module.exports = Schema;