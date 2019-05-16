// ---- 메시지를 전송한 클라이언트에게 메시지 보내기
//socket.emit('test_message', message);

// ---- 모든 클라이언트에게 메시지 보내기
//io.emit('test_message', message);

// ---- 메시지를 전송한 클라이언트를 제외한 모든 클라이언트에게 메시지 보내기
//socket.broadcast.emit('test_message', message);

// ---- 특정 클라이언트에게만 메시지 보내기
// io.to(socket.id).emit('event_name', data);

// ---- 특정 그룹에게만 메시지 보내기

// 클라이언트 요청에 의한 명시적인 연결종료
var force_disconnect = function(app, socket, message)
{
    console.log("[LSH] socket event -> force_disconnect(" + socket.id + ") : " + message);
    socket.emit('force_disconnect', "");
    socket.disconnect();
}

// 테스트 메시지
var test_message = function(app, socket, message)
{
    console.log("[LSH] socket event -> test_message(" + socket.id + ") : " + message);
    socket.emit('test_message', message);
}

module.exports.force_disconnect = force_disconnect;
module.exports.test_message = test_message;