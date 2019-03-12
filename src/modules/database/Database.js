var mongoose = require("mongoose");
var config = require("../Config");

var database = {};
database.init = function(app) 
{
    console.log("[LSH] called database.init()");
    connect(app);
}

var connect = function(app)
{
    console.log("[LSH] Try Connect DB(%s)", config.db_url);
    
    mongoose.Promise = global.Promise;
    mongoose.connect(config.db_url, { useCreateIndex: true, useNewUrlParser: true });
    database.db = mongoose.connection;
    
    database.db.on("error", console.error.bind(console, "Mongoose error"));
    
    database.db.on("open", function()
    {
        console.log("[LSH] Succeed Connect DB");
        createSchema();
        app.set("database", database);
    });
    
    database.db.on("disconnected", function()
    {
        console.log("[LSH] Disconnect DB");
        app.set("database", null);
    });
};

// 스키마 생성 함수
var createSchema = function(app)
{
    var schemaLen = config.db_schemas.length;
    for (var iLoop = 0; iLoop < schemaLen; ++iLoop)
    {
        var schemaInfo = config.db_schemas[iLoop];
        var schema = require(schemaInfo.file).createSchema(mongoose);
        var model = mongoose.model(schemaInfo.collection, schema);
        database[schemaInfo.schemaName] = schema;
        database[schemaInfo.modelName] = model;
        
        console.log("[LSH] Create DB Schema : " + schemaInfo.schemaName);
    }
};

module.exports = database;