// ---- 메시지를 전송한 클라이언트에게 메시지 보내기
//socket.emit('test_message', message);

// ---- 모든 클라이언트에게 메시지 보내기
//io.emit('test_message', message);

// ---- 메시지를 전송한 클라이언트를 제외한 모든 클라이언트에게 메시지 보내기
//socket.broadcast.emit('test_message', message);

// ---- 특정 클라이언트에게만 메시지 보내기
// io.to(socket.id).emit('event_name', data);

// ---- 특정 그룹에게만 메시지 보내기

var webSocket = require("socket.io");

var config = require("../Config");
var polling = require("./SocketPolling");

var router_loader = {};

// socket lifecycle : bind -> listen -> accept -> send&recv -> close
router_loader.init = function(app, webServer)
{
    console.log("[LSH] called socket_router_loader.init(app, router)");
    
    var io = webSocket.listen(webServer);
    app.set("socket.io", io);
    
    // Socket 연결 이벤트 정의
    io.sockets.on("connection", function(socket)
    {
        console.log("[LSH] socket connection to : ", socket.id, "->", socket.request.connection._peername);
        
        var sockets = app.get("sockets");
        if (undefined == sockets) {
            sockets = {};
        }
        sockets[socket.id] = socket;
        app.set("sockets", sockets);
        
        // socket 객체에 클라이언트의 Host와 Port 정보를 속성으로 추가
        socket.remoteAddress = socket.request.connection._peername.address;
        socket.remotePort = socket.request.connection._peername.port;
        
        // Socket 연결종료 이벤트 정의
        socket.on("disconnect", function(message)
        {
            console.log("[LSH] socket disconnect to : ", socket.id, "->", socket.request.connection._peername);

            var sockets = app.get("sockets");
            if (sockets) {
                delete sockets[socket.id];
            }
            
            socket = null;
        });
        
        // Socket 커스텀 이벤트 라우터 연결
        bindRouter(app, socket);
    });
    
    // SocketPolling 시작명령
    polling.startSocketPolling(app);
}

function bindRouter(app, socket)
{
	console.log("[LSH] called socket_router_loader.init(app, socket)");
    
	var infoLen = config.socket_route_info.length;
	for (var iLoop = 0; iLoop < infoLen; ++iLoop)
    {
        var curRouter = config.socket_route_info[iLoop];
        var curModule = require(curRouter.file);
        
        addSocketEvent(app, socket, curRouter.event_name, curModule[curRouter.method]);
    }
}

function addSocketEvent(app, socket, eventName, eventMethod)
{
    console.log("[LSH] added router in socket : %s", eventName);
    
    socket.on(eventName, (message) => 
    {
        console.log("[LSH] socket - %s 요청", eventName);
        eventMethod(app, socket, JSON.parse(message.split("'").join("\"")));
    });
}

module.exports = router_loader;