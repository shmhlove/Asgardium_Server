/*
* 테스트
-> mac : sudo mongod --dbpath /data/Asgardium
-> win : mongod --dbpath "C:\Users\HoYaNoteBook\AppData\Local\MongoDB\Asgardium"
-> local : http://localhost:3001/process/test
-> aws : http://13.124.43.70:3001/process/test

- 기타정보
    : jsonwebtoken: JSON Web Token 을 손쉽게 생성하고, 또 검증도 해줍니다.
    : morgan: Express 서버에서 발생하는 이벤트들을 기록해주는 미들웨어입니다
*/

console.log("Start Asgardium Server");

// 3rd party modules : Express
var express = require("express");
var expressStatic = require("serve-static");
var expressBodyParser = require("body-parser");

// 3rd party modules : Utility
var http = require("http");
var path = require("path");
var shell = require("shelljs");
var webSocket = require("socket.io");
var cors = require("cors");

// my modules
var configModule = require("./modules/Config");
var routerModule = require("./modules/router/RouterLoader");
var databaseModule = require("./modules/database/Database");

var expressApp = express();

// 포트 및 호스트 설정
expressApp.set("port", process.env.PORT || configModule.server_port);
expressApp.set("host", configModule.server_host);

// body파서 등록(POST방식에서 body를 쉽게 읽을 수 있도록)
expressApp.use(expressBodyParser.urlencoded({extended: false}));
expressApp.use(expressBodyParser.json());

// static 패스 등록(public디렉토리를 /public으로 접근할 수 있도록)
expressApp.use("/public", expressStatic(path.join(__dirname, "public")));

// 데이터 베이스 등록
databaseModule.init(expressApp);

// 라우터 등록
var router = express.Router();
routerModule.init(expressApp, router);

// 웹 소켓 설정 : cors를 미들웨어로 사용하도록 등록
expressApp.use(cors());

// 실행중인 프로세스 종료
// sudo lsof -i :"포트 번호"
// sudo kill -9 "프로세스 번호"
var lsof = shell.exec("lsof -i :" + expressApp.get("port")).stdout;
if (undefined != lsof.split(" ")[37])
{
    console.log("PID : " + lsof.split(" ")[37]);
    shell.exec("kill -9 " + lsof.split(" ")[37]);
}

// 웹서버 시작
var server = http.createServer(expressApp).listen(expressApp.get("port"), function()
{
    console.log("[LSH] Express 서버 시작됨");
});

// 소켓 이벤트 등록
var socketio = webSocket(server);
socketio.of("sockettest").on("connection", function(socket)
{
    console.log("connection info : ", socket.request.connection._peername);
    socket.remoteAddress = socket.request.connection._peername.address;
    socket.remotePort = socket.request.connection._peername.port;
    
    socket.on("message", function(message)
    {
        console.log("message 이벤트를 받았습니다.");
        console.dir(message);
        socketio.sockets.emit('message', message);
    });
});