
var Schema = {};
Schema.createSchema = function(mongoose)
{
    var GlobalConfigSchema = mongoose.Schema(
    {
        basic_mining_power_count: {type:Number, "default":0}
        , basic_charge_time: {type:Number, "default":0}
        , basic_active_mining_supply: {type:Number, "default":0}
        , basic_refresh_time_ou_mining: {type:Number, "default":0}
        , cost_unit_company1: {type:Number, "default":0}
        , cost_unit_company2: {type:Number, "default":0}
        , cost_unit_company3: {type:Number, "default":0}
    });
    
    return GlobalConfigSchema;
};

module.exports = Schema;