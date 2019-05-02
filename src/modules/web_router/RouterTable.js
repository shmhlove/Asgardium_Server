var util = require("./RouterUtil");
var constant = require("../Constant");

var global_config = function(req, res)
{
    util.requestLog(req);
    
    // 헤더 유효성 체크
    if (false == util.checkCertificate(req, false)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        res.send(util.makeResponse(req, null, error));
        return;
    }
    
    // ExpressApp 메모리에 올라온 테이블 릴레이
    util.loadCollectionAtExpressApp(req, req.app, "global_config", function(response)
    {
        res.send(response);
    });
}

var global_unit_data = function(req, res)
{
    util.requestLog(req);
    
    // 헤더 유효성 체크
    if (false == util.checkCertificate(req, false)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        res.send(util.makeResponse(req, null, error));
        return;
    }
    
    // ExpressApp 메모리에 올라온 테이블 릴레이
    util.loadCollectionAtExpressApp(req, req.app, "global_unit_data", function(response)
    {
        res.send(response);
    });
}

var mining_active_company_npc = function(req, res)
{
    util.requestLog(req);
    
    // 헤더 유효성 체크
    if (false == util.checkCertificate(req, false)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        res.send(util.makeResponse(req, null, error));
        return;
    }
    
    // ExpressApp 메모리에 올라온 테이블 릴레이
    util.loadCollectionAtExpressApp(req, req.app, "mining_active_company_npc", function(response)
    {
        res.send(response);
    });
}

var mining_active_quantity = function(req, res)
{
    util.requestLog(req);
    
    // 헤더 유효성 체크
    if (false == util.checkCertificate(req, false)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        res.send(util.makeResponse(req, null, error));
        return;
    }
    
    // ExpressApp 메모리에 올라온 테이블 릴레이
    util.loadCollectionAtExpressApp(req, req.app, "mining_active_quantity", function(response)
    {
        res.send(response);
    });
}

var mining_active_supply = function(req, res)
{
    util.requestLog(req);
    
    // 헤더 유효성 체크
    if (false == util.checkCertificate(req, false)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        res.send(util.makeResponse(req, null, error));
        return;
    }
    
    // ExpressApp 메모리에 올라온 테이블 릴레이
    util.loadCollectionAtExpressApp(req, req.app, "mining_active_supply", function(response)
    {
        res.send(response);
    });
}

var instance_users = function(req, res)
{
    util.requestLog(req);
    
    // 헤더 유효성 체크
    if (false == util.checkCertificate(req, false)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        res.send(util.makeResponse(req, null, error));
        return;
    }
    
    // DB에서 테이블 로드
    var response = util.loadCollectionAtDB(req, req.app, "instance_users", function(response)
    {
        res.send(response);
    });
}

var instance_mining_active_company = function(req, res)
{
    util.requestLog(req);
    
    // 헤더 유효성 체크
    if (false == util.checkCertificate(req, false)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        res.send(util.makeResponse(req, null, error));
        return;
    }
    
    // DB에서 테이블 로드
    var response = util.loadCollectionAtDB(req, req.app, "instance_mining_active_company", function(response)
    {
        res.send(response);
    });
}

module.exports.global_config = global_config;
module.exports.global_unit_data = global_unit_data;
module.exports.mining_active_company_npc = mining_active_company_npc;
module.exports.mining_active_quantity = mining_active_quantity;
module.exports.mining_active_supply = mining_active_supply;
module.exports.instance_users = instance_users;
module.exports.instance_mining_active_company = instance_mining_active_company;