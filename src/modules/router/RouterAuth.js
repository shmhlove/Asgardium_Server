var crypto = require("crypto");
var util = require("./RouterUtil");
var constant = require("../Constant");

var signup = function(req, res)
{
    util.requestLog(req);
    
    var userEmail = req.body.email;
    var userName = req.body.name;
    var userPass = req.body.password;
    
    // 헤더 유효성 체크
    if (false == util.checkCertificate(req, false)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        res.send(util.makeResponse(req, null, error));
        return;
    }
    
    // 파라미터 유효성 체크
    if (!userEmail || !userName || !userPass) {
        var error = util.makeError(constant.Err_Common_InvalidParameter, "Invalid Parameter");
        res.send(util.makeResponse(req, null, error));
        return;
    }
    
    // instance_users 컬렉션 얻기
    var users = util.getCollection(req.app, "instance_users");
    if (!users) {
        var error = util.makeError(constant.Err_Common_FailedGetCollection, "Failed get DB collection ( 'instance_users' )");
        res.send(util.makeResponse(req, null, error));
        return;
    }
    
    // 유저 가입상태 확인 후 유저생성
    users.find({"user_email":userEmail}).toArray(function(err, docs) 
    {
        if (err) {
            var error = util.makeError(constant.Err_Common_FailedFindCollection, "Failed find DB collection ( 'instance_users' )");
            res.send(util.makeResponse(req, null, error));
            return;
        }
        
        if (0 < docs.length) {
            var error = util.makeError(constant.Err_Auth_AlreadySignupUser, "Already Singup User", docs[0]);
            res.send(util.makeResponse(req, null, error));
            return;
        }
        
        createUserId(users, function(userId)
        {
            users.insertMany(
            [{
                "user_id":userId, "user_email":userEmail, "user_name":userName, "password":userPass,
                "created_at":Date.now(), "updated_at":Date.now(), "mining_power_at":Date.now()
            }],
            function(err, result) 
            {
                if (err) {
                    var error = util.makeError(constant.Err_Common_FailedWriteDocument, "Failed Create User");
                    res.send(util.makeResponse(req, null, error));
                    return;
                }
                
                var data = result["ops"][0];
                res.send(util.makeResponse(req, data, null));
            });
        });
    });
};

var signin = function(req, res)
{
    util.requestLog(req);
    
    var userEmail = req.body.email;
    var userPass = req.body.password;
    
    // 헤더 유효성 체크
    if (false == util.checkCertificate(req, false)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        res.send(util.makeResponse(req, null, error));
        return;
    }
    
    // 파라미터 유효성 체크 : 에러발생
    if (!userEmail || !userPass) {
        var error = util.makeError(constant.Err_Common_InvalidParameter, "Invalid Parameter");
        res.send(util.makeResponse(req, null, error));
        return;
    }
    
    // 데이터 베이스 확인 : 에러발생
    var users = util.getCollection(req.app, "instance_users");
    if (!users) {
        var error = util.makeError(constant.Err_Common_FailedGetCollection, "Failed get DB collection ( 'instance_users' )");
        res.send(util.makeResponse(req, null, error));
        return;
    }
    
    // 기가입 확인 : 에러발생
    users.find({"user_email":userEmail}).toArray(function(err, docs) 
    {
        if (err) {
            var error = util.makeError(constant.Err_Common_FailedFindCollection, "Failed find DB collection ( 'instance_users' )");
            res.send(util.makeResponse(req, null, error));
            return;
        }

        if (0 == docs.length) {
            var error = util.makeError(constant.Err_Auth_NoSignupUser, "No Singup User");
            res.send(util.makeResponse(req, null, error));
            return;
        }

        if (docs[0]["password"] != userPass)
        {
            var error = util.makeError(constantModule.Err_Auth_NoMatchPassword, "No Match Password");
            res.send(util.makeResponse(req, null, error));
            return;
        }
        
        res.send(util.makeResponse(req, docs[0], null));
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