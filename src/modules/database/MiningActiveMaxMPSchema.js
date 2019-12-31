
var Schema = {};
Schema.createSchema = function(mongoose)
{
    var MiningActiveMaxMPSchema = mongoose.Schema(
    {
        "level" : {type:Number, "default":0}
        , "cost_gold" : {type:Number, "default":0}
        , "max_mp" : {type:Number, "default":0}
    });
    
    return MiningActiveMaxMPSchema;
};

module.exports = Schema;