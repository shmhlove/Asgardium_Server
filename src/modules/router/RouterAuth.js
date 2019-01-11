var crypto = require("crypto");
var utilModule = require("./RouterUtil");
var constantModule = require("../Constant");

var signup = function(req, res)
{
    console.log("[LSH] POST /process/signup 호출됨");
    console.dir(req.body);
    
    // 파라미터 유효성 체크 : 에러발생
    var userName = req.body.name;
    var userPass = req.body.pass;
    if (!userName || !userPass) {
        var error = {"code":constantModule.Err_Common_InvalidParam, "message":"필수 파라미터 누락 오류"};
        res.send(utilModule.makeResponse(null, error));
        return;
    }
    
    // 데이터 베이스 확인 : 에러발생
    var users = req.app.get("database").db.collection("users");
    if (!users) {
        var error = {"code":constantModule.Err_Common_DatabaseFind, "message":"데이터베이스 컬렉션 조회 오류"};
        res.send(utilModule.makeResponse(null, error));
        return;
    }
    
    // 기가입 확인 : 에러발생
    users.find({"userName":userName}).toArray(function(err, docs) 
    {
        if (err) {
            var error = {"code":constantModule.Err_Auth_UserFind, "message":"데이터 베이스 유저 조회 실패"};
            res.send(utilModule.makeResponse(null, error));
            return;
        }
        else {
            if (0 < docs.length) {
                var error = {"code":constantModule.Err_Auth_AlreadySignupUser, "message":"기 가입된 유저", "extras":docs[0]};
                console.dir(error);
                res.send(utilModule.makeResponse(null, error));
                return;
            }
            else {
                createUserId(users, function(userId)
                {
                    users.insertMany([{"userId":userId, "userName":userName, "password":userPass}], function(err, result) 
                    {
                        if (err) {
                            var error = {"code":constantModule.Err_Common_DatabaseWrite, "message":"데이터 베이스 기록 실패"};
                            res.send(utilModule.makeResponse(null, error));
                            return;
                        }
                        else {
                            var data = result["ops"][0];
                            res.send(utilModule.makeResponse(data, null));
                            return;
                        }
                    });
                });
            }
        }
    });
};

var login = function(req, res)
{
    console.log("[LSH] POST /process/login 호출됨");
    console.dir(req.body);
    
    // 파라미터 유효성 체크 : 에러발생
    var userName = req.body.name;
    var userPass = req.body.pass;
    if (!userName || !userPass) {
        var error = {"code":constantModule.Err_Common_InvalidParam, "message":"필수 파라미터 누락 오류"};
        res.send(utilModule.makeResponse(null, error));
        return;
    }
    
    // 데이터 베이스 확인 : 에러발생
    var users = req.app.get("database").db.collection("users");
    if (!users) {
        var error = {"code":constantModule.Err_Common_DatabaseFind, "message":"데이터베이스 컬렉션 조회 오류"};
        res.send(utilModule.makeResponse(null, error));
        return;
    }
    
    // 기가입 확인 : 에러발생
    users.find({"userName":userName, "password":userPass}).toArray(function(err, docs) 
    {
        if (err) {
            var error = {"code":constantModule.Err_Auth_UserFind, "message":"데이터 베이스 유저 조회 실패"};
            res.send(utilModule.makeResponse(null, error));
            return;
        }
        else {
            if (0 < docs.length) {
                var data = docs[0];
                res.send(utilModule.makeResponse(data));
                return;
            }
            else {
                var error = {"code":constantModule.Err_Auth_AlreadySignupUser, "message":"미가입유저"};
                res.send(utilModule.makeResponse(null, error));
                return;
            }
        }
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