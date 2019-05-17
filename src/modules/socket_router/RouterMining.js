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
var subscribe_mining_active_info = function(app, socket, message)
{
    socket.emit('subscribe_mining_active_info', "");
}

// 테스트 메시지
var unsubscribe_mining_active_info = function(app, socket, message)
{
    socket.emit('unsubscribe_mining_active_info', "");
}

module.exports.subscribe_mining_active_info = subscribe_mining_active_info;
module.exports.unsubscribe_mining_active_info = unsubscribe_mining_active_info;