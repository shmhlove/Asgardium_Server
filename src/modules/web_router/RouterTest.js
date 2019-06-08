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
    
    var globalConfigTable = util.getDocsAtApp(req.app, "global_config");
    if (!globalConfigTable) {
        var error = util.makeError(constant.Err_Common_FailedgetCollectionAtDB, "Not found collection ( global_config )");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    util.getDocsOneAtDB(req.app, "instance_users", {"user_id":userId}, function(result, docs, error)
    {
        if (!result) {
            res.send(util.makeWebResponse(req, null, error));
        }
        else {
            var timeSpan = (Date.now() - docs.mining_power_at);
            var curPowerCount = timeSpan / globalConfigTable[0].basic_charge_time;
            
            if (curPowerCount < globalConfigTable[0].basic_mining_power_count) {
                docs.mining_power_at = Math.min(Date.now(), (docs.mining_power_at + globalConfigTable[0].basic_charge_time));
            }
            else {
                docs.mining_power_at = Date.now() - (globalConfigTable[0].basic_charge_time * (globalConfigTable[0].basic_mining_power_count - 1));
            }
            
            util.updateOneDocumentAtDB(req.app, "instance_users", {"user_id":userId}, { mining_power_at: docs.mining_power_at }, function(result, data, error)
            {
                res.send(util.makeWebResponse(req, docs, null));
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
    
    var globalConfigTable = util.getDocsAtApp(req.app, "global_config");
    if (!globalConfigTable) {
        var error = util.makeError(constant.Err_Common_FailedgetCollectionAtDB, "Not found collection ( global_config )");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    util.getDocsOneAtDB(req.app, "instance_users", {"user_id":userId}, function(result, docs, error)
    {
        if (!result) {
            res.send(util.makeWebResponse(req, null, error));
        }
        else {
            docs.mining_power_at = Date.now() - (globalConfigTable[0].basic_charge_time * globalConfigTable[0].basic_mining_power_count);
            
            util.updateOneDocumentAtDB(req.app, "instance_users", {"user_id":userId}, { mining_power_at: docs.mining_power_at }, function(result, data, error)
            {
                res.send(util.makeWebResponse(req, docs, null));
            });
        }
    });
};

module.exports.test = test;
module.exports.test_use_mining_power = test_use_mining_power;
module.exports.test_reset_mining_power = test_reset_mining_power;