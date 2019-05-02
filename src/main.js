/*
- AWS 접속
    : ssh -i "MangoNight.pem" ubuntu@13.124.43.70

- 테스트
-> mac DB : sudo mongod --dbpath /data/Asgardium
-> win DB : mongod --dbpath "C:\Users\HoYaNoteBook\AppData\Local\MongoDB\Asgardium"
-> local : https://localhost:3001/process/test
-> aws : https://13.124.43.70:3001/process/test

- 기타정보
    : jsonwebtoken: JSON Web Token 을 손쉽게 생성하고, 또 검증도 해줌
    : morgan: Express 서버에서 발생하는 이벤트들을 기록해주는 미들웨어
*/

console.log("[LSH] Start Asgardium Server");

// 3rd party modules : Express
var express = require("express");
var expressStatic = require("serve-static");
var expressBodyParser = require("body-parser");

// 3rd party modules : Utility
var https = require("https");
var path = require("path");
var shell = require("shelljs");
var webSocket = require("socket.io");
var cors = require("cors");
var fs = require('fs');

// my modules
var config = require("./modules/Config");
var webRouterLoader = require("./modules/web_router/RouterLoader");
var socketRouterLoader = require("./modules/socket_router/RouterLoader");
var database = require("./modules/database/Database");
var initialization = require("./modules/internal/Initialization");

var expressApp = express();

// HTTPS용 인증서
var options = {  
    key: fs.readFileSync(path.join(__dirname, "keys", "HTTPS_key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "keys", "HTTPS_cert.pem"))
};

// 포트 및 호스트 설정
expressApp.set("port", config.server_port);
expressApp.set("host", config.server_host);
expressApp.set("certificate", options);

// body파서 등록(POST방식에서 body를 쉽게 읽을 수 있도록)
expressApp.use(expressBodyParser.urlencoded({extended: false}));
expressApp.use(expressBodyParser.json());

// static 패스 등록(public디렉토리를 /public으로 접근할 수 있도록)
//expressApp.use("/public", expressStatic(path.join(__dirname, "public")));

// 데이터 베이스 등록
database.init(expressApp);

// 라우터 등록
webRouterLoader.init(expressApp, express.Router());

// 실행중인 프로세스 종료
if (process.platform == "win32") {
// 정상동작안함(수동으로 정상동작함)
//    const cmd = require('child_process');
//    cmd.get("netstat -nao | findstr " + expressApp.get("port"), (err, data, stderr) => {
//        nodeCmd.get("taskkill /f /pid " + data[4], (err, data, stderr)=>{});
//    });
}
else {
    // sudo lsof -i :"포트 번호"
    // sudo kill -9 "프로세스 번호"
    var lsof = shell.exec("lsof -i :" + expressApp.get("port")).stdout;
    if ((undefined != lsof) && (undefined != lsof.split(" ")[37]))
    {
        console.log("PID : " + lsof.split(" ")[37]);
        shell.exec("kill -9 " + lsof.split(" ")[37]);
    }
}

// HTTPS 웹서버 시작
var webServer = https.createServer(options, expressApp).listen(expressApp.get("port"), function()
{
    console.log("[LSH] Start Express HTTPS Server");
    
    var initServer = setInterval(function()
    {
        var database = expressApp.get("database");
        if (database) {
            initialization.initialization(expressApp, function()
            {
                console.log("[LSH] Ready Express HTTPS Server : %s:%s", 
                            expressApp.get("host"), expressApp.get("port"));
            });
            clearInterval(initServer);
        }
    }, 100);
});

// 웹 소켓 설정 : cors를 미들웨어로 사용하도록 등록
expressApp.use(cors());

// 아래 코드처럼 네임스페이스가 들어가면 전체메시지 발송이 안되네..
//var socketio = webSocket(server);
//socketio.of("namespace").on("connection", function(socket)

var io = webSocket.listen(webServer);
io.sockets.on("connection", function(socket)
{
    // socket 객체에 클라이언트의 Host와 Port 정보를 속성으로 추가
    console.log("[LSH] connection to : ", socket.id, "->", socket.request.connection._peername);
    socket.remoteAddress = socket.request.connection._peername.address;
    socket.remotePort = socket.request.connection._peername.port;
    
    socketRouterLoader.init(expressApp, socket);
});