/*
- AWS 접속
    : ssh -i "MangoNight.pem" ubuntu@13.124.43.70
      ssh -i "MangoNight.pem" ubuntu@ec2-15-164-50-110.ap-northeast-2.compute.amazonaws.com
      IP : 15.164.50.110
      
- DB 실행
    -> mac DB : sudo mongod --dbpath /Users/HoYaMacBook/data/Asgardium
    -> win DB : mongod --dbpath "C:\Users\HoYaNoteBook\AppData\Local\MongoDB\Asgardium"
    
- 테스트
    -> local : https://localhost:3001/process/test
    -> aws : https://15.164.50.110:3001/process/test

- 기타정보
    : jsonwebtoken: JSON Web Token 을 손쉽게 생성하고, 또 검증도 해줌
    : morgan: Express 서버에서 발생하는 이벤트들을 기록(로깅)해주는 미들웨어
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
var cors = require("cors");
var fs = require('fs');

// my modules
var config = require("./modules/Config");
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

// cors를 미들웨어로 사용하도록 등록(현재 도메인과 다른 도메인으로 리소스가 요청될 경우 허용처리)
expressApp.use(cors());

// static 패스 등록(public디렉토리를 /public으로 접근할 수 있도록)
//expressApp.use("/public", expressStatic(path.join(__dirname, "public")));

// 데이터 베이스 등록
database.init(expressApp);

// 실행중인 서버 프로세스 종료처리
if (process.platform == "win32") {
    // netstat -nao | findstr "포트번호"
    // taskkill /f /pid "프로세스ID"
    var netstat = shell.exec("netstat -nao | findstr " + expressApp.get("port")).stdout;
    var netstatSplit = netstat.replace(/\s{2,}/gi, ' ').split(' ');
    if (undefined != netstatSplit[5])
    {
        shell.exec("taskkill /f /pid " + netstatSplit[5]);
        console.log("Kill Process PID " + netstatSplit[5]);
    }
}
else {
    // sudo lsof -i :"포트번호"
    // sudo kill -9 "프로세스ID"
    var lsof = shell.exec("lsof -i :" + expressApp.get("port")).stdout;
    var lsofSplit = lsof.replace(/\s{2,}/gi, ' ').split(' ');
    if (undefined != lsofSplit[9])
    {
        shell.exec("kill -9 " + lsofSplit[9]);
        console.log("Kill Process PID " + lsofSplit[9]);
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
            initialization.init(express, expressApp, webServer, function()
            {
                console.log("[LSH] Ready Express HTTPS Server : %s:%s", 
                            expressApp.get("host"), expressApp.get("port"));
            });
            clearInterval(initServer);
        }
    }, 100);
});