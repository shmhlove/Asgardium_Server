var Schema = {};
Schema.createSchema = function(mongoose)
{
    var InstanceUserUpgradeInfoSchema = mongoose.Schema(
    {
        user_id: {type:String, "default":""}
        , mining_power_lv: {type:Number, "default":0}
        , charge_time_lv: {type:Number, "default":0}
    });
    
    return InstanceUserUpgradeInfoSchema;
};

module.exports = Schema;