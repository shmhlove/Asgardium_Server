var util = require("../internal/Util");
var constant = require("../Constant");

// Mining Active 정보 정기구독
var subscribe_mining_active_info = function(req, res)
{
    util.requestLog(req);
    
    // 헤더 유효성 체크
    if (false == util.checkCertificate(req.app, req.headers.authorization, true)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    // 유저id 얻기
    var userId = req.body.user_id;
    
    // 컨테이너에 유저id 추가
    var subscribe_mining_active_info = req.app.get("subscribe_mining_active_info");
    {
        if (undefined == subscribe_mining_active_info) {
            subscribe_mining_active_info = [userId];
        }
        else {
            var index = subscribe_mining_active_info.indexOf(userId);
            if (-1 == index) {
                subscribe_mining_active_info.push(userId);
            }
        }
    }
    
    res.send(util.makeWebResponse(req, {"user_id":userId}, null));
}

// Mining Active 정보 정기구독 해제
var unsubscribe_mining_active_info = function(req, res)
{
    util.requestLog(req);
    
    // 헤더 유효성 체크
    if (false == util.checkCertificate(req.app, req.headers.authorization, true)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    // 유저id 얻기
    var userId = req.body.user_id;
    
    // 컨테이너에 유저id 삭제
    var subscribe_mining_active_info = req.app.get("subscribe_mining_active_info");
    {
        if (undefined == subscribe_mining_active_info) {
            subscribe_mining_active_info = [];
        }
        else {
            var index = subscribe_mining_active_info.indexOf(userId);
            if (-1 < index) {
                subscribe_mining_active_info.splice(index, 1);
            }
        }
    }
    
    res.send(util.makeWebResponse(req, {"user_id":userId}, null));
}

module.exports.subscribe_mining_active_info = subscribe_mining_active_info;
module.exports.unsubscribe_mining_active_info = unsubscribe_mining_active_info;