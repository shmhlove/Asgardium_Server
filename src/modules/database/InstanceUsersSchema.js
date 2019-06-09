var crypto = require("crypto");

var Schema = {};
Schema.createSchema = function(mongoose)
{
    var InstanceUsersSchema = mongoose.Schema(
    {
        user_id: {type:String, "default":""}
        , user_email: {type:String, index:"hashed", "default":""}
        , user_name: {type:String, "default":""}
        , password: {type:String, "default":""}
        , created_at: {type:Date, index:{unique:false}, "default":Date.now}
        , updated_at: {type:Date, index:{unique:false}, "default":Date.now}
    });
    
    return InstanceUsersSchema;
};

module.exports = Schema;