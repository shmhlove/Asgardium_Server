var util = require("./RouterUtil");
var constant = require("../Constant");

var global_config = function(req, res)
{
    util.requestLog(req);
    
    var table = req.app.get("global_config");
    if(table) {
        res.send(util.makeResponse(req, table[0], null));
    }
    else {
        var error = util.makeError(constant.Err_Common_NotFoundCollection, "Not found collection in ExpressApp( global_config )");
        res.send(util.makeResponse(req, null, error));
    }
}

var global_unit_data = function(req, res)
{
    util.requestLog(req);
    
    var table = req.app.get("global_unit_data");
    if(table) {
        res.send(util.makeResponse(req, table, null));
    }
    else {
        var error = util.makeError(constant.Err_Common_NotFoundCollection, "Not found collection in ExpressApp( global_unit_data )");
        res.send(util.makeResponse(req, null, error));
    }
}

var mining_active_company_npc = function(req, res)
{
    util.requestLog(req);
    
    var table = req.app.get("mining_active_company_npc");
    if(table) {
        res.send(util.makeResponse(req, table, null));
    }
    else {
        var error = util.makeError(constant.Err_Common_NotFoundCollection, "Not found collection in ExpressApp( mining_active_company_npc )");
        res.send(util.makeResponse(req, null, error));
    }
}

var mining_active_quantity = function(req, res)
{
    util.requestLog(req);
    
    var table = req.app.get("mining_active_quantity");
    if(table) {
        res.send(util.makeResponse(req, table, null));
    }
    else {
        var error = util.makeError(constant.Err_Common_NotFoundCollection, "Not found collection in ExpressApp( mining_active_quantity )");
        res.send(util.makeResponse(req, null, error));
    }
}

var mining_active_supply = function(req, res)
{
    util.requestLog(req);
    
    var table = req.app.get("mining_active_supply");
    if(table) {
        res.send(util.makeResponse(req, table, null));
    }
    else {
        var error = util.makeError(constant.Err_Common_NotFoundCollection, "Not found collection in ExpressApp( mining_active_supply )");
        res.send(util.makeResponse(req, null, error));
    }
}

var instance_users = function(req, res)
{
    util.requestLog(req);
    var response = util.loadCollection(req, req.app, "instance_users", function(response)
    {
        res.send(response);
    });
}

var instance_mining_active_company = function(req, res)
{
    util.requestLog(req);
    var response = util.loadCollection(req, req.app, "instance_mining_active_company", function(response)
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