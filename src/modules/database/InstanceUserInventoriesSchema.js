var Schema = {};
Schema.createSchema = function(mongoose)
{
    var InstanceUserInventoriesSchema = mongoose.Schema(
    {
        user_id: {type:String, "default":""}
        , gold : {type:Number, "default":0}
        , mining_power_at: {type:Date, index:{unique:false}, "default":Date.now}
        , has_units: {type:Array } // {unit_id:xx, quantity:xx}
    });
    
    return InstanceUserInventoriesSchema;
};

module.exports = Schema;