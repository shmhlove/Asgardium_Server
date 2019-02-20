var crypto = require("crypto");
var utilModule = require("./RouterUtil");
var constantModule = require("../Constant");

var signup = function(req, res)
{
    console.log("[LSH] %s %s 요청", req.method, req.url);
    console.dir(req.body);
    
    var userEmail = req.body.email;
    var userName = req.body.name;
    var userPass = req.body.password;
    
    // 데이터 베이스 확인 : 에러발생
    var users = req.app.get("database").db.collection("users");
    if (!users) {
        var error = {"code":constantModule.Err_Common_NotFoundCollection, "message":"데이터베이스 컬렉션 조회 실패"};
        res.send(utilModule.makeResponse(req, null, error));
        return;
    }
    
    // 기가입 확인 : 에러발생
    users.find({"userEmail":userEmail}).toArray(function(err, docs) 
    {
        if (err) {
            var error = {"code":constantModule.Err_Auth_NotFoundUser, "message":"데이터 베이스 유저 조회 실패"};
            res.send(utilModule.makeResponse(req, null, error));
            return;
        }
        
        if (0 < docs.length) {
            var error = {"code":constantModule.Err_Auth_AlreadySignupUser, "message":"기 가입된 유저", "extras":docs[0]};
            res.send(utilModule.makeResponse(req, null, error));
            return;
        }

        // 파라미터 유효성 체크 : 에러발생
        if (!userEmail || !userName || !userPass) {
            var error = {"code":constantModule.Err_Common_InvalidParam, "message":"필수 파라미터 누락"};
            res.send(utilModule.makeResponse(req, null, error));
            return;
        }
        
        createUserId(users, function(userId)
        {
            users.insertMany(
            [{
                "userId":userId, "userEmail":userEmail, "userName":userName, "password":userPass,
                "createdAt":Date.now(), "updatedAt":Date.now(), "miningPowerAt":Date.now()
            }],
            function(err, result) 
            {
                if (err) {
                    var error = {"code":constantModule.Err_Common_DatabaseWrite, "message":"데이터 베이스 기록 실패"};
                    res.send(utilModule.makeResponse(req, null, error));
                    return;
                }

                var data = result["ops"][0];
                res.send(utilModule.makeResponse(req, data, null));
            });
        });
    });
};

var login = function(req, res)
{
    console.log("[LSH] %s %s 요청", req.method, req.url);
    console.dir(req.body);
    
    // 파라미터 유효성 체크 : 에러발생
    var userEmail = req.body.email;
    var userPass = req.body.password;
    if (!userEmail || !userPass) {
        var error = {"code":constantModule.Err_Common_InvalidParam, "message":"필수 파라미터 누락"};
        res.send(utilModule.makeResponse(req, null, error));
        return;
    }
    
    // 데이터 베이스 확인 : 에러발생
    var users = req.app.get("database").db.collection("users");
    if (!users) {
        var error = {"code":constantModule.Err_Common_NotFoundCollection, "message":"데이터베이스 컬렉션 조회 실패"};
        res.send(utilModule.makeResponse(req, null, error));
        return;
    }
    
    // 기가입 확인 : 에러발생
    users.find({"userEmail":userEmail}).toArray(function(err, docs) 
    {
        if (err) {
            var error = {"code":constantModule.Err_Auth_NotFoundUser, "message":"데이터 베이스 유저 조회 실패"};
            res.send(utilModule.makeResponse(req, null, error));
            return;
        }

        if (0 == docs.length) {
            var error = {"code":constantModule.Err_Auth_AlreadySignupUser, "message":"미가입유저"};
            res.send(utilModule.makeResponse(req, null, error));
            return;
        }

        if (docs[0]["password"] != userPass)
        {
            var error = {"code":constantModule.Err_Auth_InvalidPassword, "message":"일치하지 않는 비밀번호"};
            res.send(utilModule.makeResponse(req, null, error));
            return;
        }
        
        res.send(utilModule.makeResponse(req, docs[0], null));
    });
}

var createUserId = function(users, callback)
{
    var userId = crypto.randomBytes(20).toString('hex');
    users.find({"userId":userId}).toArray(function(err, docs)
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
module.exports.login = login;