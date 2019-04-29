var util = require("./RouterUtil");
var constant = require("../Constant");

// Mining Active 정보 정기구독
var subscribe_mining_active_info = function(req, res)
{
    util.requestLog(req);
    
    // 헤더 유효성 체크
    if (false == util.checkCertificate(req, true)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        res.send(util.makeResponse(req, null, error));
        return;
    }
    
    // 유저id 얻기
    var userId = req.body.user_id;
    console.log(userId);
    
    // app에 컨테이너 얻기
    // 컨테이너에 유저id 추가
    
    res.send(util.makeResponse(req, util.makeResponse(req, {}, null)));
}

// Mining Active 정보 정기구독 해제
var unsubscribe_mining_active_info = function(req, res)
{
    util.requestLog(req);
    
    // 헤더 유효성 체크
    if (false == util.checkCertificate(req, true)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        res.send(util.makeResponse(req, null, error));
        return;
    }
    
    // 유저id 얻기
    var userId = req.body.user_id;
    console.log(userId);
    
    // app에 컨테이너 얻기
    // 컨테이너에 유저id 삭제
    
    res.send(util.makeResponse(req, util.makeResponse(req, {}, null)));
}

module.exports.subscribe_mining_active_info = subscribe_mining_active_info;
module.exports.unsubscribe_mining_active_info = unsubscribe_mining_active_info;