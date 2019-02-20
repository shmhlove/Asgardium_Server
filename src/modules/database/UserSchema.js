var crypto = require("crypto");

var Schema = {};
Schema.createSchema = function(mongoose)
{
    var UserSchema = mongoose.Schema(
    {
        userId: {type:String, "default":""}
        , userEmail: {type:String, index:"hashed", "default":""}
        , userName: {type:String, "default":""}
        , password: {type:String, "default":""}
        , createdAt: {type:Date, index:{unique:false}, "default":Date.now}
        , updatedAt: {type:Date, index:{unique:false}, "default":Date.now}
        , miningPowerAt: {type:Date, index:{unique:false}, "default":Date.now}
    });
    
    return UserSchema;
};

module.exports = Schema;