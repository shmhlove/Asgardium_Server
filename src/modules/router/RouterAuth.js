var utilModule = require("./RouterUtil");
var ConstantModule = require("../Constant");

var signup = function(req, res)
{
    console.log("[LSH] POST /process/signup 호출됨");
    console.dir(req.body);
    
    // 파라미터 유효성 체크 : 에러발생
    var userName = req.body.name;
    var userPass = req.body.pass;
    if (!userName || !userPass)
    {
        var error = {"code":ConstantModule.Err_Common_InvalidParam, "message":"필수 파라미터 누락 오류"};
        res.send(utilModule.makeResponse(null, error));
        return;
    }
    
    // 데이터 베이스 확인 : 에러발생
    var users = req.app.get("database").db.collection("users");
    if (!users)
    {
        var error = {"code":ConstantModule.Err_Common_DatabaseFind, "message":"데이터베이스 컬렉션 조회 오류"};
        res.send(utilModule.makeResponse(null, error));
        return;
    }
    
    // 기가입 확인 : 에러발생
    users.find({"username" : userName, "password" : userPass}).toArray(function(err, docs) 
    {
        if (err)
        {
            var error = {"code":ConstantModule.Err_Auth_UserFind, "message":"데이터 베이스 유저 조회 실패"};
            res.send(utilModule.makeResponse(null, error));
            return;
        }
        else
        {
            if (0 < docs.length)
            {
                var error = {"code":ConstantModule.Err_Auth_AlreadySignupUser, "message":"기 가입된 유저"};
                res.send(utilModule.makeResponse(null, error));
                return;
            }
            else
            {
                users.insertMany([{"username" : userName, "password" : userPass}], function(err, result) 
                {
                    if (err)
                    {
                        var error = {"code":ConstantModule.Err_Common_DatabaseWrite, "message":"데이터 베이스 기록 실패"};
                        res.send(utilModule.makeResponse(null, error));
                        return;
                    }
                    else
                    {
                        var data = {"authntoken":"회원가입 성공"};
                        res.send(utilModule.makeResponse(data, null));
                        return;
                    }
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
    if (!userName || !userPass)
    {
        var error = {"code":ConstantModule.Err_Common_InvalidParam, "message":"필수 파라미터 누락 오류"};
        res.send(utilModule.makeResponse(null, error));
        return;
    }
    
    // 데이터 베이스 확인 : 에러발생
    var users = req.app.get("database").db.collection("users");
    if (!users)
    {
        var error = {"code":ConstantModule.Err_Common_DatabaseFind, "message":"데이터베이스 컬렉션 조회 오류"};
        res.send(utilModule.makeResponse(null, error));
        return;
    }
    
    // 기가입 확인 : 에러발생
    users.find({"username" : userName, "password" : userPass}).toArray(function(err, docs) 
    {
        if (err)
        {
            var error = {"code":ConstantModule.Err_Auth_UserFind, "message":"데이터 베이스 유저 조회 실패"};
            res.send(utilModule.makeResponse(null, error));
            return;
        }
        else
        {
            if (0 < docs.length)
            {
                var data = {"authntoken":"로그인 성공"};
                res.send(utilModule.makeResponse(data));
                return;
            }
            else
            {
                var error = {"code":ConstantModule.Err_Auth_AlreadySignupUser, "message":"미가입유저"};
                res.send(utilModule.makeResponse(null, error));
                return;
            }
        }
    });
}

module.exports.signup = signup;
module.exports.login = login;