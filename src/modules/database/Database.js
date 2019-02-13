var mongoose = require("mongoose");
var configModule = require("../Config");

var database = {};
database.init = function(app) 
{
    console.log("[LSH] database.init()");
    connect(app);
}

var connect = function(app)
{
    console.log("[LSH] 데이터베이스 연결을 시도합니다.(%s)", configModule.db_url);
    
    mongoose.Promise = global.Promise;
    mongoose.connect(configModule.db_url, { useCreateIndex: true, useNewUrlParser: true });
    
    mongoose.set('useCreateIndex', true);
    database.db.on("error", console.error.bind(console, "Mongoose connection error."));
    
    database.db.on("open", function()
    {
        console.log("[LSH] 데이터 베이스에 연결되었습니다.");
        app.set("database", createSchema());
    });
    
    database.db.on("disconnected", function()
    {
        console.log("[LSH] 데이터 베이스 연결이 종료되었습니다.");
    });
};

// 스키마 생성 함수
var createSchema = function(app)
{
    var schemaLen = configModule.db_schemas.length;
    for (var iLoop = 0; iLoop < schemaLen; ++iLoop)
    {
        var curConfig = configModule.db_schemas[iLoop];
        var curSchema = require(curConfig.file).createSchema(mongoose);
        var curModel = mongoose.model(curConfig.collection, curSchema);
        database[curConfig.schemaName] = curSchema;
        database[curConfig.modelName] = curModel;
        
        console.log("[LSH] 데이터 베이스 스키마 생성 : " + curConfig.schemaName);
    }
    
    return database;
};

module.exports = database;