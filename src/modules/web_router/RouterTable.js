var util = require("../internal/Util");
var constant = require("../Constant");

var global_config = function(req, res)
{
    util.requestLog(req);
    
    // 헤더 유효성 체크
    if (false == util.checkCertificate(req.app, req.headers.authorization)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    util.getDocsAtApp(req.app, "global_config", null, function(result, data, error)
    {
        res.send(util.makeWebResponse(req, data, error));
    });
}

var global_unit_data = function(req, res)
{
    util.requestLog(req);
    
    // 헤더 유효성 체크
    if (false == util.checkCertificate(req.app, req.headers.authorization)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    util.getDocsAtApp(req.app, "global_unit_data", null, function(result, data, error)
    {
        res.send(util.makeWebResponse(req, data, error));
    });
}

var mining_active_company_npc = function(req, res)
{
    util.requestLog(req);
    
    // 헤더 유효성 체크
    if (false == util.checkCertificate(req.app, req.headers.authorization)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    util.getDocsAtApp(req.app, "mining_active_company_npc", null, function(result, data, error)
    {
        res.send(util.makeWebResponse(req, data, error));
    });
}

var mining_active_quantity = function(req, res)
{
    util.requestLog(req);
    
    // 헤더 유효성 체크
    if (false == util.checkCertificate(req.app, req.headers.authorization)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    util.getDocsAtApp(req.app, "mining_active_quantity", null, function(result, data, error)
    {
        res.send(util.makeWebResponse(req, data, error));
    });
}

var mining_active_supply = function(req, res)
{
    util.requestLog(req);
    
    // 헤더 유효성 체크
    if (false == util.checkCertificate(req.app, req.headers.authorization)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    util.getDocsAtApp(req.app, "mining_active_supply", null, function(result, data, error)
    {
        res.send(util.makeWebResponse(req, data, error));
    });
}

var mining_active_max_mp = function(req, res)
{
    util.requestLog(req);
    
    // 헤더 유효성 체크
    if (false == util.checkCertificate(req.app, req.headers.authorization)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    util.getDocsAtApp(req.app, "mining_active_max_mp", null, function(result, data, error)
    {
        res.send(util.makeWebResponse(req, data, error));
    });
}

var mining_active_recharge_delay = function(req, res)
{
    util.requestLog(req);
    
    // 헤더 유효성 체크
    if (false == util.checkCertificate(req.app, req.headers.authorization)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    util.getDocsAtApp(req.app, "mining_active_recharge_delay", null, function(result, data, error)
    {
        res.send(util.makeWebResponse(req, data, error));
    });
}

var instance_users = function(req, res)
{
    util.requestLog(req);
    
    // 헤더 유효성 체크
    if (false == util.checkCertificate(req.app, req.headers.authorization)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    var response = util.getDocsAllAtDB(req.app, "instance_users", null, function(result, data, error)
    {
        res.send(util.makeWebResponse(req, data, error));
    });
}

var instance_mining_active_company = function(req, res)
{
    util.requestLog(req);
    
    // 헤더 유효성 체크
    if (false == util.checkCertificate(req.app, req.headers.authorization)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    var response = util.getDocsAllAtDB(req.app, "instance_mining_active_company", null, function(result, data, error)
    {
        res.send(util.makeWebResponse(req, data, error));
    });
}

module.exports.global_config = global_config;
module.exports.global_unit_data = global_unit_data;
module.exports.mining_active_company_npc = mining_active_company_npc;
module.exports.mining_active_quantity = mining_active_quantity;
module.exports.mining_active_supply = mining_active_supply;
module.exports.mining_active_max_mp = mining_active_max_mp;
module.exports.mining_active_recharge_delay = mining_active_recharge_delay;
module.exports.instance_users = instance_users;
module.exports.instance_mining_active_company = instance_mining_active_company;