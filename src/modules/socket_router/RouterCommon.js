var util = require("../internal/Util");

// 클라이언트 요청에 의한 명시적인 연결종료
var force_disconnect = function(app, socket, message)
{
    // 헤더 유효성 체크
    if (false == util.checkCertificate(app, message.jwt_header, false)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        socket.emit('force_disconnect', util.makeSocketResponse("force_disconnect", null, error, true));
        return;
    }
    
    socket.emit('force_disconnect', util.makeSocketResponse("force_disconnect", "{}", null));
    socket.disconnect();
}

// 테스트 메시지
var test_message = function(app, socket, message)
{
    // 헤더 유효성 체크
    if (false == util.checkCertificate(app, message.jwt_header, false)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        socket.emit('test_message', util.makeSocketResponse("test_message", null, error));
        return;
    }
    
    socket.emit('test_message', util.makeSocketResponse("test_message", message.body, null));
}

module.exports.force_disconnect = force_disconnect;
module.exports.test_message = test_message;