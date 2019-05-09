// ---- 메시지를 전송한 클라이언트에게 메시지 보내기
//socket.emit('test_message', message);

// ---- 모든 클라이언트에게 메시지 보내기
//io.emit('test_message', message);

// ---- 메시지를 전송한 클라이언트를 제외한 모든 클라이언트에게 메시지 보내기
//socket.broadcast.emit('test_message', message);

// ---- 특정 클라이언트에게만 메시지 보내기
// io.to(socket.id).emit('event_name', data);

// ---- 특정 그룹에게만 메시지 보내기

var socketPollingInstanceMiningActiveCompany = function(app)
{
    // 인스턴스회사테이블
    // 구독요청클라정보
    // 클라소켓정보
    // DB가 준비되기 전까지 초기화 대기
//    var sockets = app.get("sockets");
//    for (var key in sockets) {
//        sockets[key].emit("test_message", "test polling");
//    }
//    var subscribe_mining_active_info = app.get("subscribe_mining_active_info");
//    if (sockets && subscribe_mining_active_info) {
//        var subscribeLen = subscribe_mining_active_info.length;
//        for (var iLoop = 0; iLoop < subscribeLen; ++iLoop) {
//            var userId = subscribe_mining_active_info[iLoop];
//        }
//        console.log("연결된 소켓 수 : " + Object.keys(sockets).length);
//    }
}

module.exports.socketPollingInstanceMiningActiveCompany = socketPollingInstanceMiningActiveCompany;