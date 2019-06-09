var crypto = require('crypto');
var config = require("../Config");
var constant = require("../Constant");
var textEncoding = require('text-encoding');
var textDecoder = textEncoding.TextDecoder;

var requestLog = function(req)
{
    console.log("[LSH] web - %s %s 요청", req.method, req.url);
}

var getDocsAtApp = function(app, collectionName, condition, callback)
{
    var docs = app.get(collectionName);
    if (!docs) {
        if (callback) {
            var error = makeError(constant.Err_Common_FailedgetDocsAtApp, 
                                  "Not found documents in App( " + collectionName + " )");
            callback(false, null, error);
        }
        return null;
    }
    else {
        if (condition) {
            docs = docs.find(condition);
            if (!docs) {
                var error = makeError(constant.Err_Common_EmptyDocuments,
                                      "Empty documents ( " + collectionName + " : " + condition.toString() + " )");
                callback(false, null, error);
                return null;
            }
        }
        
        if (callback) {
            callback(true, docs, null);
        }
        
        return docs;
    }
}

var getDocsAllAtDB = function(app, collectionName, condition, callback)
{
    var collection = getCollectionAtDB(app, collectionName);
    if (!collection) {
        var error = makeError(constant.Err_Common_FailedgetCollectionAtDB,
                              "Not found collection ( " + collectionName + " )");
        callback(false, null, error);
    }
    else {
        collection.find(condition).toArray(function(err, docs) 
        {
            if (err) {
                var error = makeError(constant.Err_Common_FailedgetDocsAtDB,
                                      "Failed find documents ( " + collectionName + " )");
                callback(false, null, error);
                return;
            }
            
            if (0 == docs.length) {
                var error = makeError(constant.Err_Common_EmptyDocuments,
                                      "Empty documents ( " + collectionName + " : " + condition + " )");
                callback(false, null, error);
                return;
            }
            
            callback(true, docs, null);
        });
    }
}

var getDocsOneAtDB = function(app, collectionName, condition, callback)
{
    var collection = getCollectionAtDB(app, collectionName);
    if (!collection) {
        var error = makeError(constant.Err_Common_FailedgetCollectionAtDB,
                              "Not found collection ( " + collectionName + " )");
        callback(false, null, error);
    }
    else {
        collection.findOne(condition, function(err, docs) 
        {
            if (err) {
                var error = makeError(constant.Err_Common_FailedgetDocsAtDB,
                                      "Failed find documents ( " + collectionName + " )");
                callback(false, null, error);
            }
            
            if (!docs) {
                var error = makeError(constant.Err_Common_EmptyDocuments,
                                      "Empty documents ( " + collectionName + " : " + condition + " )");
                callback(false, null, error);
            }
            
            callback(true, docs, null);
        });
    }
}

var getCollectionAtDB = function(app, collection)
{
    return app.get("database").db.collection(collection);
}

var updateOneDocumentAtDB = function(app, collectionName, condition, updateData, callback)
{
    var collection = getCollectionAtDB(app, collectionName);
    if (!collection) {
        var error = makeError(constant.Err_Common_FailedgetCollectionAtDB,
                              "Not found collection ( " + collectionName + " )");
        callback(false, null, error);
    }
    
    var updateData = { $set: updateData };
    collection.updateOne(condition, updateData, function(err)
    {
        if (err) {
            var error = makeError(constant.Err_Common_FailedUpdateDocuments,
                                  "Failed update documents ( " + collectionName + " )");
            callback(false, null, error);
        }
        else {
            
            callback(true, updateData, null);
        }
    });
}

var deleteOneDocumentAtDB = function(app, collectionName, condition, callback)
{
    var collection = getCollectionAtDB(app, collectionName);
    if (!collection) {
        var error = makeError(constant.Err_Common_FailedgetCollectionAtDB,
                              "Not found collection ( " + collectionName + " )");
        callback(false, null, error);
    }
    
    collection.deleteOne(condition, function (err)
    {
        if (err) {
            var error = makeError(constant.Err_Common_FailedDeleteDocuments,
                                  "Failed delete documents ( " + collectionName + " : " + condition.toString() + " )");
            callback(false, null, error);
        }
        else {
            callback(true, null, null);
        }
    });
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
module.exports.getDocsAtApp = getDocsAtApp;
module.exports.getDocsAllAtDB = getDocsAllAtDB;
module.exports.getDocsOneAtDB = getDocsOneAtDB;
module.exports.getCollectionAtDB = getCollectionAtDB;
module.exports.updateOneDocumentAtDB = updateOneDocumentAtDB;
module.exports.deleteOneDocumentAtDB = deleteOneDocumentAtDB;
module.exports.makeError = makeError;
module.exports.makeWebResponse = makeWebResponse;
module.exports.makeSocketResponse = makeSocketResponse;
module.exports.checkCertificate = checkCertificate;