var crypto = require('crypto');
var config = require("../Config");
var textEncoding = require('text-encoding');
var textDecoder = textEncoding.TextDecoder;

var requestLog = function(req)
{
    console.log("[LSH] web - %s %s 요청", req.method, req.url);
}

var loadCollectionAtExpressApp = function(req, app, collectionName, callback)
{
    var table = app.get(collectionName);
    if (table) {
        callback(makeWebResponse(req, table, null));
    }
    else {
        var error = makeError(constant.Err_Common_FailedGetCollection, "Not found collection in ExpressApp( " + collectionName + " )");
        callback(makeWebResponse(req, null, error));
    }
}

var loadCollectionAtDB = function(app, collectionName, callback)
{
    var table = getCollection(app, collectionName);
    if (!table) {
        var error = makeError(constant.Err_Common_FailedGetCollection, "Not found collection ( " + collectionName + " )");
        callback(null, error);
    }
    
    table.find().toArray(function(err, docs) 
    {
        if (err) {
            var error = makeError(constant.Err_Common_FailedFindCollection, "Failed find collection ( " + collectionName + " )");
            callback(null, error);
        }

        if (0 == docs.length) {
            var error = makeError(constant.Err_Common_EmptyCollection, "Empty collection ( " + collectionName + " )");
            callback(null, error);
        }
        
        callback(docs, null);
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

var makeWebResponse = function(req, data, error)
{
    var result = {
        "result" : error ? false : true,
        "data" : data,
        "error" : error
    };
    
    console.log("[LSH] web - %s %s 응답(%s)", req.method, req.url, result["result"] ? "succeed" : "failed");
    
    return result;
}

var makeSocketResponse = function(eventName, data, error, isLoging)
{
    var result = {
        "result" : error ? false : true,
        "data" : data,
        "error" : error
    };
    
    if (isLoging) {
        console.log("[LSH] socket - %s 응답(%s)", eventName, result.result ? "succeed" : "failed");
    }
    
    return JSON.stringify(result);
}

var checkCertificate = function(app, jwtHeader, isCheckAccessToken)
{
    var headers = jwtHeader.split(".");
    
    var encodedHeader = headers["0"];
    var encodedPayload = headers["1"];
    var clientSignature = headers["2"];
    
    var certificate = app.get("certificate");
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

module.exports.requestLog = requestLog;
module.exports.getCollection = getCollection;
module.exports.loadCollectionAtDB = loadCollectionAtDB;
module.exports.loadCollectionAtExpressApp = loadCollectionAtExpressApp;
module.exports.makeError = makeError;
module.exports.makeWebResponse = makeWebResponse;
module.exports.makeSocketResponse = makeSocketResponse;
module.exports.checkCertificate = checkCertificate;