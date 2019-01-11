var crypto = require("crypto");

var Schema = {};
Schema.createSchema = function(mongoose)
{
    var UserSchema = mongoose.Schema(
    {
        username: String,
        password: String,
    });
    
    return UserSchema;
};

module.exports = Schema;