var util = require("./RouterUtil");
var constant = require("../Constant");

var test = function(req, res)
{
    util.requestLog(req);
    
    // 헤더 유효성 체크
    if (false == util.checkCertificate(req, false)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        res.send(util.makeResponse(req, null, error));
        return;
    }
    
    res.send(util.makeResponse(req, {"version" : "1.0.0"}, null));
};

var test_use_mining_power = function(req, res)
{
    util.requestLog(req);
    
    // 헤더 유효성 체크
    if (false == util.checkCertificate(req, true)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        res.send(util.makeResponse(req, null, error));
        return;
    }
    
    // 파라미터 유효성 체크
    var userId = req.body.user_id;
    if (!userId) {
        var error = util.makeError(constant.Err_Common_InvalidParameter, "Invalid Parameter");
        res.send(util.makeResponse(req, null, error));
        return;
    }
    
    var users = util.getCollection(req.app, "instance_users");
    if (!users) {
        var error = util.makeError(constant.Err_Common_FailedGetCollection, "Failed get DB collection ( 'instance_users' )");
        res.send(util.makeResponse(req, null, error));
        return;
    }
    
    var globalConfig = req.app.get("global_config");
    users.find({"user_id":userId}).toArray(function(err, docs) 
    {
        if (err) {
            var error = util.makeError(constant.Err_Common_FailedFindCollection, "Failed find DB collection ( 'instance_users' )");
            res.send(util.makeResponse(req, null, error));
            return;
        }

        if (0 == docs.length) {
            var error = util.makeError(constant.Err_Auth_NoSignupUser, "No Singup User");
            res.send(util.makeResponse(req, null, error));
            return;
        }
        
        var timeSpan = (Date.now() - docs[0].mining_power_at);
        var curPowerCount = timeSpan / globalConfig[0].basic_charge_time;
        
        if (curPowerCount < globalConfig[0].basic_mining_power_count) {
            docs[0].mining_power_at = Math.min(Date.now(), (docs[0].mining_power_at + globalConfig[0].basic_charge_time));
        }
        else {
            docs[0].mining_power_at = Date.now() - (globalConfig[0].basic_charge_time * (globalConfig[0].basic_mining_power_count - 1));
        }
        
        users.updateOne({ "user_id":userId }, { $set: { mining_power_at: docs[0].mining_power_at } });

        res.send(util.makeResponse(req, docs[0], null));
    });
};

var test_reset_mining_power = function(req, res)
{
    util.requestLog(req);
    
    // 헤더 유효성 체크
    if (false == util.checkCertificate(req, true)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        res.send(util.makeResponse(req, null, error));
        return;
    }
    
    // 파라미터 유효성 체크
    var userId = req.body.user_id;
    if (!userId) {
        var error = util.makeError(constant.Err_Common_InvalidParameter, "Invalid Parameter");
        res.send(util.makeResponse(req, null, error));
        return;
    }
    
    // 데이터 베이스 확인 : 에러발생
    var users = req.app.get("database").db.collection("instance_users");
    if (!users) {
        var error = util.makeError(constant.Err_Common_FailedGetCollection, "Failed get DB collection ( 'instance_users' )");
        res.send(util.makeResponse(req, null, error));
        return;
    }
    
    var globalConfig = req.app.get("global_config");
    users.find({"user_id":userId}).toArray(function(err, docs) 
    {
        if (err) {
            var error = util.makeError(constant.Err_Auth_NotFoundUser, "데이터 베이스 유저 조회 실패");
            res.send(util.makeResponse(req, null, error));
            return;
        }

        if (0 == docs.length) {
            var error = util.makeError(constant.Err_Auth_NoSignupUser, "No Singup User");
            res.send(util.makeResponse(req, null, error));
            return;
        }
        
        docs[0].mining_power_at = Date.now() - (globalConfig[0].basic_charge_time * globalConfig[0].basic_mining_power_count);
        
        users.updateOne({ "user_id":userId }, { $set: { mining_power_at: docs[0].mining_power_at } });

        res.send(util.makeResponse(req, docs[0], null));
    });
};

module.exports.test = test;
module.exports.test_use_mining_power = test_use_mining_power;
module.exports.test_reset_mining_power = test_reset_mining_power;