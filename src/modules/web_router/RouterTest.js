var util = require("../internal/Util");
var constant = require("../Constant");

var test = function(req, res)
{
    util.requestLog(req);
    
    // 헤더 유효성 체크
    if (false == util.checkCertificate(req.app, req.headers.authorization, false)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    res.send(util.makeWebResponse(req, {"version" : "1.0.0"}, null));
};

var test_use_mining_power = function(req, res)
{
    util.requestLog(req);
    
    // 헤더 유효성 체크
    if (false == util.checkCertificate(req.app, req.headers.authorization, true)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    // 파라미터 유효성 체크
    var userId = req.body.user_id;
    if (!userId) {
        var error = util.makeError(constant.Err_Common_InvalidParameter, "Invalid Parameter");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    var condition = function(element) { return element.key == "global_config"; };
    var globalConfig = util.getDocsAtApp(req.app, "global_config", condition);
    if (!globalConfig) {
        var error = util.makeError(constant.Err_Common_FailedgetCollectionAtDB, "Not found collection ( global_config )");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    util.getDocsOneAtDB(req.app, "instance_user_inventories", {"user_id":userId}, function(result, inventory, error)
    {
        if (!result) {
            res.send(util.makeWebResponse(req, null, error));
        }
        else {
            var timeSpan = (Date.now() - inventory.mining_power_at);
            var curPowerCount = timeSpan / globalConfig.basic_charge_time;
            
            if (curPowerCount < globalConfig.basic_mining_power_count) {
                inventory.mining_power_at = Math.min(Date.now(), (inventory.mining_power_at + globalConfig.basic_charge_time));
            }
            else {
                inventory.mining_power_at = Date.now() - (globalConfig.basic_charge_time * (globalConfig.basic_mining_power_count - 1));
            }
            
            util.updateOneDocumentAtDB(req.app, "instance_user_inventories", {"user_id":userId}, inventory, function(result, data, error)
            {
                res.send(util.makeWebResponse(req, inventory, null));
            });
        }
    });
};

var test_reset_mining_power = function(req, res)
{
    util.requestLog(req);
    
    // 헤더 유효성 체크
    if (false == util.checkCertificate(req.app, req.headers.authorization, true)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    // 파라미터 유효성 체크
    var userId = req.body.user_id;
    if (!userId) {
        var error = util.makeError(constant.Err_Common_InvalidParameter, "Invalid Parameter");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    var condition = function(element) { return element.key == "global_config"; };
    var globalConfig = util.getDocsAtApp(req.app, "global_config", condition);
    if (!globalConfig) {
        var error = util.makeError(constant.Err_Common_FailedgetCollectionAtDB, "Not found collection ( global_config )");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    util.getDocsOneAtDB(req.app, "instance_user_inventories", {"user_id":userId}, function(result, inventory, error)
    {
        if (!result) {
            res.send(util.makeWebResponse(req, null, error));
        }
        else {
            inventory.mining_power_at = Date.now() - (globalConfig.basic_charge_time * globalConfig.basic_mining_power_count);
            
            util.updateOneDocumentAtDB(req.app, "instance_user_inventories", {"user_id":userId}, inventory, function(result, data, error)
            {
                res.send(util.makeWebResponse(req, inventory, null));
            });
        }
    });
};

module.exports.test = test;
module.exports.test_use_mining_power = test_use_mining_power;
module.exports.test_reset_mining_power = test_reset_mining_power;