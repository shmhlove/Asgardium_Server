var crypto = require("crypto");
var util = require("../internal/Util");
var constant = require("../Constant");

var signup = function(req, res)
{
    util.requestLog(req);
    
    // 헤더 유효성 체크
    if (false == util.checkCertificate(req.app, req.headers.authorization, false)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    // 파라미터 유효성 체크
    var userEmail = req.body.email;
    var userName = req.body.name;
    var userPass = req.body.password;
    if (!userEmail || !userName || !userPass) {
        var error = util.makeError(constant.Err_Common_InvalidParameter, "Invalid Parameter");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    // instance_users 컬렉션 얻기
    var users = util.getCollectionAtDB(req.app, "instance_users");
    if (!users) {
        var error = util.makeError(constant.Err_Common_FailedgetCollectionAtDB,
                                   "Failed get DB collection ( 'instance_users' )");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    // instance_user_inventories 컬렉션 얻기
    var inventories = util.getCollectionAtDB(req.app, "instance_user_inventories");
    if (!inventories) {    
        var error = util.makeError(constant.Err_Common_FailedgetCollectionAtDB,
                                   "Failed get DB collection ( 'instance_user_inventories' )");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    // 유저 가입상태 확인 후 유저생성
    users.find({"user_email":userEmail}).toArray(function(err, docs) 
    {
        if (err) {
            var error = util.makeError(constant.Err_Common_FailedgetDocsAtDB,
                                       "Failed find documents ( 'instance_users' )");
            res.send(util.makeWebResponse(req, null, error));
            return;
        }
        
        if (0 < docs.length) {
            var error = util.makeError(constant.Err_Auth_AlreadySignupUser,
                                       "Already Singup User", docs[0]);
            res.send(util.makeWebResponse(req, null, error));
            return;
        }
        
        createUserId(users, function(userId)
        {                
            var userInfo = {
                "user_id" : userId
                , "user_email" : userEmail
                , "user_name" : userName
                , "password" : userPass
                , "created_at" : Date.now()
                , "updated_at" : Date.now()
            };
            
            users.insertOne(userInfo, function(err, result)
            {
                if (err) {
                    var error = util.makeError(constant.Err_Common_FailedWriteDB, "Failed Create User");
                    res.send(util.makeWebResponse(req, null, error));
                    return;
                }
                
                var inventoryInfo = {
                    "user_id" : userId
                    , "mining_power_at" : 0
                    , "has_units" : [ ]
                };
                
                var userInfo = result["ops"][0];
                inventories.insertOne(inventoryInfo, function(err, result) 
                {
                    if (err) {
                        var error = util.makeError(constant.Err_Common_FailedWriteDB, "Failed Create User Inventory");
                        res.send(util.makeWebResponse(req, null, error));
                        return;
                    }
                    
                    var inventoryInfo = {"inventory":result["ops"][0]};
                    var data = Object.assign({}, userInfo, inventoryInfo);
                    res.send(util.makeWebResponse(req, data, null));
                });
            });
        });
    });
};

var signin = function(req, res)
{
    util.requestLog(req);
    
    // 헤더 유효성 체크
    if (false == util.checkCertificate(req.app, req.headers.authorization, false)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    // 파라미터 유효성 체크
    var userEmail = req.body.email;
    var userPass = req.body.password;
    if (!userEmail || !userPass) {
        var error = util.makeError(constant.Err_Common_InvalidParameter, "Invalid Parameter");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    // 가입 확인
    util.getDocsOneAtDB(req.app, "instance_users", {"user_email":userEmail}, function(result, docs, error)
    {
        if (error) {
            res.send(util.makeWebResponse(req, null, error));
            return;
        }
        
        if (!docs) {
            var error = util.makeError(constant.Err_Auth_NoSignupUser, "No Singup User")
            res.send(util.makeWebResponse(req, null, error));
            return;
        }
        
        if (docs.password != userPass)
        {
            var error = util.makeError(constantModule.Err_Auth_NoMatchPassword, "No Match Password");
            res.send(util.makeWebResponse(req, null, error));
            return;
        }
        
        res.send(util.makeWebResponse(req, docs, null));
    });
}

var createUserId = function(users, callback)
{
    var userId = crypto.randomBytes(20).toString('hex');
    users.find({"user_id":userId}).toArray(function(err, docs)
    {
        if (0 == docs.length) {
            callback(userId);
        }
        else {
            createUserId(users, callback);
        }
    });
}

module.exports.signup = signup;
module.exports.signin = signin;