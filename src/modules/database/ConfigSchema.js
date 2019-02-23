
var Schema = {};
Schema.createSchema = function(mongoose)
{
    var ConfigSchema = mongoose.Schema(
    {
        basic_mining_power: {type:Number, "default":0}
        , basic_charge_time: {type:Number, "default":0}
    });
    
    return ConfigSchema;
};

module.exports = Schema;