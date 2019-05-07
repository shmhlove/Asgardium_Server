const crypto = require('crypto');
var config = require("../Config");
var textEncoding = require('text-encoding');
var textDecoder = textEncoding.TextDecoder;

var requestLog = function(req)
{
    console.log("[LSH] %s %s 요청", req.method, req.url);
    //console.dir(req.body);
}

var loadCollectionAtExpressApp = function(req, app, collectionName, callback)
{
    var table = app.get(collectionName);
    if (table) {
        callback(makeResponse(req, table, null));
    }
    else {
        var error = makeError(constant.Err_Common_FailedGetCollection, "Not found collection in ExpressApp( " + collectionName + " )");
        callback(makeResponse(req, null, error));
    }
}

var loadCollectionAtDB = function(req, app, collectionName, callback)
{
    var table = getCollection(app, collectionName);
    if (!table) {
        var error = makeError(constant.Err_Common_FailedGetCollection, "Not found collection ( " + collectionName + " )");
        callback(makeResponse(req, null, error));
    }
    
    table.find().toArray(function(err, docs) 
    {
        if (err) {
            var error = makeError(constant.Err_Common_FailedFindCollection, "Failed find collection ( " + collectionName + " )");
            callback(makeResponse(req, null, error));
        }

        if (0 == docs.length) {
            var error = makeError(constant.Err_Common_EmptyCollection, "Empty collection ( " + collectionName + " )");
            callback(makeResponse(req, null, error));
        }
        
        callback(makeResponse(req, docs, null));
    });
}

var getCollection = function(app, collection)
{
    return app.get("database").db.collection(collection);
}

var makeError = function(code, message, extras)
{
    return {"code":code, "message":message, "extras":extras};
}

var makeResponse = function(req, data, error)
{
    var result = {
        "result" : error ? false : true,
        "data" : data,
        "error" : error
    };
    
    console.log("[LSH] %s %s 응답(%s)", req.method, req.url, result["result"] ? "succeed" : "failed");
    
    return result;
}

var checkCertificate = function(req, isCheckAccessToken)
{
    var headers = req.headers.authorization.split(".");
    var encodedHeader = headers["0"];
    var encodedPayload = headers["1"];
    var clientSignature = headers["2"];
    
    var certificate = req.app.get("certificate");
    var certString = new textDecoder("utf-8").decode(certificate["cert"]);
    
    certString = certString.replace('-----BEGIN CERTIFICATE-----', '')
                           .replace('-----END CERTIFICATE-----', '')
                           .split('\r\n').join('')      // Windows 계열              
                           .split('\n').join('');       // Linux, Unix 계열
                           // CR(\r\n) : 0x0D (13 decimal), LF(\n) : 0x0A (10 decimal)
    
    var serverSignature = crypto.createHmac('sha256', certString)
                                .update(encodedHeader + '.' + encodedPayload)
                                .digest('base64')
                                .split('=').join('')  // Remove any trailing '='s
                                .split('+').join('-') // 62nd char of encoding
                                .split('/').join('_');// 63rd char of encoding
    
    if (clientSignature != serverSignature) {
        console.log("Clienet Signature : " + clientSignature);
        console.log("Server Signature : " + serverSignature);
        return false;
    }
    
    if (isCheckAccessToken) {
        
        var userId = undefined;
        var payload = JSON.parse(new Buffer(encodedPayload, 'base64').toString('utf-8'));
        for (var key in payload) {
            if ("access_token" == key) {
                userId = payload[key];
                break;
            }
        }
        
        return undefined != userId;
    }
    
    return true;
}

var makeJWT = function()
{
    // 헤더헤더
    ///////////////////////////////////////////////////////////////
    const header = {
        "typ": "JWT",   // 헤더타입
        "alg": "HS256"  // signature에 사용할 암호알고리즘
    };
    
    const encodedHeader = new Buffer(JSON.stringify(header))
                                .toString('base64')
                                 .split('=').join('')  // Remove any trailing '='s
                                 .split('+').join('-') // 62nd char of encoding
                                 .split('/').join('_');// 63rd char of encoding
    
    console.log('header: ', encodedHeader);
    
    
    // 정보정보
    ///////////////////////////////////////////////////////////////
    const payload = {
        // 등록된 클레임 : 이미 정해져있는 key
        "iss": "MangoNight.Client.com",// 토큰 발급자
        "sub": "MangoNight",    // 토큰 제목
        "aud": "Asgardium",     // 토큰 대상자
        "exp": "1485270000000", // 토큰의 만료시간(이 시간이 지난후 토큰은 유효하지 않음)
        "nbf": "1485270000000", // 토큰의 시작시간(이 시간이 되기전 토큰은 유효하지 않음)
        "iat": "1485270000000", // 토큰이 발급된 시간
        "jti": "temp",          // JWT의 고유식별자로 주로 중복처리방지에 사용됨(일회용토큰에 사용하기 좋다?)
        
        // 공개 클레임 : 충돌방지용으로 임의의 key (URL 형식으로 지어 사용)
        "https://mangonight.com/jwt_claims/is_admin": true,
        
        // 비공개 클레임 : 서버 - 클라 간 협의하에 사용하는 클레임?? 무슨말이지?
        "userId": "11028373727102",
        "username": "MangoNight"
    };
    
    const encodedPayload = new Buffer(JSON.stringify(payload))
                                .toString('base64')
                                 .split('=').join('')  // Remove any trailing '='s
                                 .split('+').join('-') // 62nd char of encoding
                                 .split('/').join('_');// 63rd char of encoding
    
    console.log('payload: ', encodedPayload);
    
    
    // 서명서명
    // 서명은 헤더의 인코딩값과, 정보의 인코딩값을 합친후 주어진 비밀키로 해쉬를 하여 생성합니다.
    /*
        HMACSHA256(
          base64UrlEncode(header) + "." +
          base64UrlEncode(payload),
          secret)
    */
    ///////////////////////////////////////////////////////////////
    const signature = crypto.createHmac('sha256', 'SeCrEtKeYfOrHaShInG')
                 .update(encodedHeader + '.' + encodedPayload)
                 .digest('base64')
                 .split('=').join('')  // Remove any trailing '='s
                 .split('+').join('-') // 62nd char of encoding
                 .split('/').join('_');// 63rd char of encoding
    
    console.log('signature: ', signature);
    
    // JWT 합체
    ///////////////////////////////////////////////////////////////
    console.log('JWT: ', encodedHeader + '.' + encodedPayload + '.' + signature);
}

module.exports.requestLog = requestLog;
module.exports.getCollection = getCollection;
module.exports.loadCollectionAtDB = loadCollectionAtDB;
module.exports.loadCollectionAtExpressApp = loadCollectionAtExpressApp;
module.exports.makeError = makeError;
module.exports.makeResponse = makeResponse;
module.exports.makeJWT = makeJWT;
module.exports.checkCertificate = checkCertificate;