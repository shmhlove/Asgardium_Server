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

var company_for_mining = function(req, res)
{
    console.log("[LSH] %s %s 요청", req.method, req.url);
    console.dir(req.body);
    
    // 데이터 베이스 확인 : 에러발생
    var companyForMining = req.app.get("database").db.collection("company_for_mining");
    if (!companyForMining) {
        var error = {"code":constantModule.Err_Common_NotFoundCollection, "message":"company_for_mining 데이터베이스 컬렉션 조회 실패"};
        res.send(utilModule.makeResponse(req, null, error));
        return;
    }
    
    companyForMining.find().toArray(function(err, docs) 
    {
        if (err) {
            var error = {"code":constantModule.Err_Common_CollectionRead, "message":"company_for_mining 데이터 베이스 쿼리 실패"};
            res.send(utilModule.makeResponse(req, null, error));
            return;
        }
        
        if (0 == docs.length) {
            var error = {"code":constantModule.Err_Common_EmptyCollection, "message":"company_for_mining 비어있는 컬렉션"};
            res.send(utilModule.makeResponse(req, null, error));
            return;
        }
        
        res.send(utilModule.makeResponse(req, docs, null));
    });
}

var active_mining_quantity = function(req, res)
{
    console.log("[LSH] %s %s 요청", req.method, req.url);
    console.dir(req.body);
    
    // 데이터 베이스 확인 : 에러발생
    var activeMiningQuantity = req.app.get("database").db.collection("active_mining_quantity");
    if (!activeMiningQuantity) {
        var error = {"code":constantModule.Err_Common_NotFoundCollection, "message":"active_mining_quantity 데이터베이스 컬렉션 조회 실패"};
        res.send(utilModule.makeResponse(req, null, error));
        return;
    }
    
    activeMiningQuantity.find().toArray(function(err, docs) 
    {
        if (err) {
            var error = {"code":constantModule.Err_Common_CollectionRead, "message":"active_mining_quantity 데이터 베이스 쿼리 실패"};
            res.send(utilModule.makeResponse(req, null, error));
            return;
        }
        
        if (0 == docs.length) {
            var error = {"code":constantModule.Err_Common_EmptyCollection, "message":"active_mining_quantity 비어있는 컬렉션"};
            res.send(utilModule.makeResponse(req, null, error));
            return;
        }
        
        res.send(utilModule.makeResponse(req, docs, null));
    });
}

var active_mining_supply = function(req, res)
{
    console.log("[LSH] %s %s 요청", req.method, req.url);
    console.dir(req.body);
    
    // 데이터 베이스 확인 : 에러발생
    var activeMiningSupply = req.app.get("database").db.collection("active_mining_supply");
    if (!activeMiningSupply) {
        var error = {"code":constantModule.Err_Common_NotFoundCollection, "message":"active_mining_supply 데이터베이스 컬렉션 조회 실패"};
        res.send(utilModule.makeResponse(req, null, error));
        return;
    }
    
    activeMiningSupply.find().toArray(function(err, docs) 
    {
        if (err) {
            var error = {"code":constantModule.Err_Common_CollectionRead, "message":"active_mining_supply 데이터 베이스 쿼리 실패"};
            res.send(utilModule.makeResponse(req, null, error));
            return;
        }
        
        if (0 == docs.length) {
            var error = {"code":constantModule.Err_Common_EmptyCollection, "message":"active_mining_supply 비어있는 컬렉션"};
            res.send(utilModule.makeResponse(req, null, error));
            return;
        }
        
        res.send(utilModule.makeResponse(req, docs, null));
    });
}

module.exports.config = config;
module.exports.oracle_company_am = oracle_company_am;
module.exports.asgardium_resource_data = asgardium_resource_data;
module.exports.company_for_mining = company_for_mining;
module.exports.active_mining_quantity = active_mining_quantity;
module.exports.active_mining_supply = active_mining_supply;
