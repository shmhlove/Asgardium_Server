var utilModule = require("./RouterUtil");
var constantModule = require("../Constant");

var config = function(req, res)
{
    console.log("[LSH] %s %s 요청", req.method, req.url);
    console.dir(req.body);
    
    // 데이터 베이스 확인 : 에러발생
    var config = req.app.get("database").db.collection("config");
    if (!config) {
        var error = {"code":constantModule.Err_Common_NotFoundCollection, "message":"config 데이터베이스 컬렉션 조회 실패"};
        res.send(utilModule.makeResponse(req, null, error));
        return;
    }
    
    config.find().toArray(function(err, docs) 
    {
        if (err) {
            var error = {"code":constantModule.Err_Common_CollectionRead, "message":"config 데이터 베이스 쿼리 실패"};
            res.send(utilModule.makeResponse(req, null, error));
            return;
        }

        if (0 == docs.length) {
            var error = {"code":constantModule.Err_Common_EmptyCollection, "message":"config 비어있는 컬렉션"};
            res.send(utilModule.makeResponse(req, null, error));
            return;
        }
        
        res.send(utilModule.makeResponse(req, docs[0], null));
    });
}

var oracle_company_am = function(req, res)
{
    console.log("[LSH] %s %s 요청", req.method, req.url);
    console.dir(req.body);
    
    // 데이터 베이스 확인 : 에러발생
    var oracleCompanyAM = req.app.get("database").db.collection("oracle_company_am");
    if (!oracleCompanyAM) {
        var error = {"code":constantModule.Err_Common_NotFoundCollection, "message":"oracle_company_am 데이터베이스 컬렉션 조회 실패"};
        res.send(utilModule.makeResponse(req, null, error));
        return;
    }
    
    oracleCompanyAM.find().toArray(function(err, docs) 
    {
        if (err) {
            var error = {"code":constantModule.Err_Common_CollectionRead, "message":"oracle_company_am 데이터 베이스 쿼리 실패"};
            res.send(utilModule.makeResponse(req, null, error));
            return;
        }
        
        if (0 == docs.length) {
            var error = {"code":constantModule.Err_Common_EmptyCollection, "message":"oracle_company_am 비어있는 컬렉션"};
            res.send(utilModule.makeResponse(req, null, error));
            return;
        }
        
        res.send(utilModule.makeResponse(req, docs, null));
    });
}

var asgardium_resource_data = function(req, res)
{
    console.log("[LSH] %s %s 요청", req.method, req.url);
    console.dir(req.body);
    
    // 데이터 베이스 확인 : 에러발생
    var asgardiumResourceData = req.app.get("database").db.collection("asgardium_resource_data");
    if (!asgardiumResourceData) {
        var error = {"code":constantModule.Err_Common_NotFoundCollection, "message":"asgardium_resource_data 데이터베이스 컬렉션 조회 실패"};
        res.send(utilModule.makeResponse(req, null, error));
        return;
    }
    
    asgardiumResourceData.find().toArray(function(err, docs) 
    {
        if (err) {
            var error = {"code":constantModule.Err_Common_CollectionRead, "message":"asgardium_resource_data 데이터 베이스 쿼리 실패"};
            res.send(utilModule.makeResponse(req, null, error));
            return;
        }
        
        if (0 == docs.length) {
            var error = {"code":constantModule.Err_Common_EmptyCollection, "message":"asgardium_resource_data 비어있는 컬렉션"};
            res.send(utilModule.makeResponse(req, null, error));
            return;
        }
        
        res.send(utilModule.makeResponse(req, docs, null));
    });
}

module.exports.config = config;
module.exports.oracle_company_am = oracle_company_am;
module.exports.asgardium_resource_data = asgardium_resource_data;
