
var disconnect = function(app, socket, message)
{
    console.log("[LSH] socket event -> disconnect(" + socket.id + ") : " + message);
    console.dir(message);
}

var test_message = function(app, socket, message)
{
    console.log("[LSH] socket event -> test_message(" + socket.id + ") : " + message);
    
    // ---- 이 클라이언트에게 메시지 보내기
    socket.emit('test_message', message);
    
    // or
    //io.sockets.connected[socket.id].emit('test_message', message);

    // ---- 모든 클라이언트에게 메시지 보내기
    //io.sockets.emit('test_message', message);

    // ---- 나를 제외한 모든 클라이언트에게 메시지 보내기
    //socket.broadcast.emit('test_message', message);

    // ---- 특정 클라이언트에게만 메시지 보내기
    //  - 소켓 로그인 API 하나 만들어서 
    //    소켓 접속 후 클라에서 로그인 정보와 소켓id를 보내면 서버에서 맵형태로 관리
    //  - 특정 클라이언트에게만 메시지 보낼때는 로그인 정보로 소켓id를 조회해서 io.sockets.connected[소켓id].emit("key", "value"); 

    // ---- 특정 그룹에게만 메시지 보내기
}

module.exports.disconnect = disconnect;
module.exports.test_message = test_message;