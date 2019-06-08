var util = require("../internal/Util");

// MiningActiveInfo 구독
var subscribe_mining_active_info = function(app, socket, message)
{
    // 헤더 유효성 체크
    if (false == util.checkCertificate(app, message.jwt_header, true)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        socket.emit('subscribe_mining_active_info', util.makeSocketResponse("subscribe_mining_active_info", null, error));
        return;
    }
    
    // 파라미터 유효성 체크
    var userId = message.body.user_id;
    if (!userId) {
        var error = util.makeError(constant.Err_Common_InvalidParameter, "Invalid Parameter");
        socket.emit('subscribe_mining_active_info', util.makeSocketResponse("subscribe_mining_active_info", null, error));
        return;
    }
    
    // 컨테이너에 유저id 추가
    var subscribe_mining_active_info = app.get("subscribe_mining_active_info");
    {
        if (undefined == subscribe_mining_active_info) {
            subscribe_mining_active_info = {};
        }
        
        subscribe_mining_active_info[socket.id] = userId;
    }
    app.set("subscribe_mining_active_info", subscribe_mining_active_info);
    
    socket.emit('subscribe_mining_active_info', util.makeSocketResponse("subscribe_mining_active_info", {"socket_id":socket.id, "user_id":userId}, null));
}

// MiningActiveInfo 구독해제
var unsubscribe_mining_active_info = function(app, socket, message)
{
    // 헤더 유효성 체크
    if (false == util.checkCertificate(app, message.jwt_header, true)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        socket.emit('unsubscribe_mining_active_info', util.makeSocketResponse("unsubscribe_mining_active_info", null, error));
        return;
    }
    
    // 파라미터 유효성 체크
    var userId = message.body.user_id;
    if (!userId) {
        var error = util.makeError(constant.Err_Common_InvalidParameter, "Invalid Parameter");
        socket.emit('subscribe_mining_active_info', util.makeSocketResponse("subscribe_mining_active_info", null, error));
        return;
    }
    
    // 컨테이너에 유저id 삭제
    var subscribe_mining_active_info = app.get("subscribe_mining_active_info");
    {
        if (subscribe_mining_active_info) {
            delete subscribe_mining_active_info[socket.id];
        }
    }
    app.set("subscribe_mining_active_info", subscribe_mining_active_info);
    
    socket.emit('unsubscribe_mining_active_info', util.makeSocketResponse("unsubscribe_mining_active_info", {"socket_id":socket.id, "user_id":userId}, null));
}

module.exports.subscribe_mining_active_info = subscribe_mining_active_info;
module.exports.unsubscribe_mining_active_info = unsubscribe_mining_active_info;