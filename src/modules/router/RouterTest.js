var utilModule = require("./RouterUtil");
var constantModule = require("../Constant");

var test = function(req, res)
{
    console.log("[LSH] %s %s 요청", req.method, req.url);
    res.send({"version" : "1.0.0"});
};

var test_use_mining_power = function(req, res)
{
    console.log("[LSH] %s %s 요청", req.method, req.url);
    console.dir(req.body);
    
    // 파라미터 유효성 체크 : 에러발생
    var userId = req.body.user_id;
    if (!userId) {
        var error = {"code":constantModule.Err_Common_InvalidParam, "message":"필수 파라미터 누락"};
        res.send(utilModule.makeResponse(req, null, error));
        return;
    }
    
    // 데이터 베이스 확인 : 에러발생
    var users = req.app.get("database").db.collection("users");
    if (!users) {
        var error = {"code":constantModule.Err_Common_NotFoundCollection, "message":"users 데이터베이스 컬렉션 조회 실패"};
        res.send(utilModule.makeResponse(req, null, error));
        return;
    }
    
    // 데이터 베이스 확인 : 에러발생
    var config = req.app.get("database").db.collection("config");
    if (!config) {
        var error = {"code":constantModule.Err_Common_NotFoundCollection, "message":"config 데이터베이스 컬렉션 조회 실패"};
        res.send(utilModule.makeResponse(req, null, error));
        return;
    }
    
    // 가입 확인
    users.find({"user_id":userId}).toArray(function(err, userDocs) 
    {
        if (err) {
            var error = {"code":constantModule.Err_Auth_NotFoundUser, "message":"데이터 베이스 유저 조회 실패"};
            res.send(utilModule.makeResponse(req, null, error));
            return;
        }

        if (0 == userDocs.length) {
            var error = {"code":constantModule.Err_Auth_AlreadySignupUser, "message":"미가입유저"};
            res.send(utilModule.makeResponse(req, null, error));
            return;
        }
        
        // 컨피그 테이블 확인
        config.find().toArray(function(err, configDocs) 
        {
            if (err) {
                var error = {"code":constantModule.Err_Common_CollectionRead, "message":"데이터 베이스 쿼리 실패"};
                res.send(utilModule.makeResponse(req, null, error));
                return;
            }
            
            if (0 == configDocs.length) {
                var error = {"code":constantModule.Err_Common_EmptyCollection, "message":"비어있는 컬렉션"};
                res.send(utilModule.makeResponse(req, null, error));
                return;
            }
            
            var timeSpan = (Date.now() - userDocs[0].mining_power_at);
            var curPowerCount = timeSpan / configDocs[0].basic_charge_time;
            console.log("갯수 : " + curPowerCount);
            if (curPowerCount < configDocs[0].basic_mining_power_count) {
                userDocs[0].mining_power_at = Math.min(Date.now(), (userDocs[0].mining_power_at + configDocs[0].basic_charge_time));
            }
            else {
                userDocs[0].mining_power_at = Date.now() - (configDocs[0].basic_charge_time * (configDocs[0].basic_mining_power_count - 1));
            }
            
            // 변경사항 데이터 베이스에 저장
            /*
                users.update({ name: 'Slime' }, { $set: { hp: 30 } });
                users.findAndModify({ query: { name: 'Demon' }, update: { $set: { att: 150 } }, new: true }); // { 데몬 }
                users.updateOne({ name: 'Slime' }, { $set: { hp: 25 } });
                users.findOneAndUpdate({ name: 'Demon' }, { $set: { att: 150 } }, { returnNewDocument: true });
            */
            users.updateOne({ "user_id":userId }, { $set: { mining_power_at: userDocs[0].mining_power_at } });
            
            res.send(utilModule.makeResponse(req, userDocs[0], null));
        });
    });
};

var test_reset_mining_power = function(req, res)
{
    console.log("[LSH] %s %s 요청", req.method, req.url);
    console.dir(req.body);
    
    // 파라미터 유효성 체크 : 에러발생
    var userId = req.body.user_id;
    if (!userId) {
        var error = {"code":constantModule.Err_Common_InvalidParam, "message":"필수 파라미터 누락"};
        res.send(utilModule.makeResponse(req, null, error));
        return;
    }
    
    // 데이터 베이스 확인 : 에러발생
    var users = req.app.get("database").db.collection("users");
    if (!users) {
        var error = {"code":constantModule.Err_Common_NotFoundCollection, "message":"users 데이터베이스 컬렉션 조회 실패"};
        res.send(utilModule.makeResponse(req, null, error));
        return;
    }
    
    // 데이터 베이스 확인 : 에러발생
    var config = req.app.get("database").db.collection("config");
    if (!config) {
        var error = {"code":constantModule.Err_Common_NotFoundCollection, "message":"config 데이터베이스 컬렉션 조회 실패"};
        res.send(utilModule.makeResponse(req, null, error));
        return;
    }
    
    // 가입 확인
    users.find({"user_id":userId}).toArray(function(err, userDocs) 
    {
        if (err) {
            var error = {"code":constantModule.Err_Auth_NotFoundUser, "message":"데이터 베이스 유저 조회 실패"};
            res.send(utilModule.makeResponse(req, null, error));
            return;
        }

        if (0 == userDocs.length) {
            var error = {"code":constantModule.Err_Auth_AlreadySignupUser, "message":"미가입유저"};
            res.send(utilModule.makeResponse(req, null, error));
            return;
        }
        
        // 컨피그 테이블 확인
        config.find().toArray(function(err, configDocs) 
        {
            if (err) {
                var error = {"code":constantModule.Err_Common_CollectionRead, "message":"데이터 베이스 쿼리 실패"};
                res.send(utilModule.makeResponse(req, null, error));
                return;
            }
            
            if (0 == configDocs.length) {
                var error = {"code":constantModule.Err_Common_EmptyCollection, "message":"비어있는 컬렉션"};
                res.send(utilModule.makeResponse(req, null, error));
                return;
            }
            
            userDocs[0].mining_power_at = Date.now() - (configDocs[0].basic_charge_time * configDocs[0].basic_mining_power_count);
            
            // 변경사항 데이터 베이스에 저장
            /*
                users.update({ name: 'Slime' }, { $set: { hp: 30 } });
                users.findAndModify({ query: { name: 'Demon' }, update: { $set: { att: 150 } }, new: true }); // { 데몬 }
                users.updateOne({ name: 'Slime' }, { $set: { hp: 25 } });
                users.findOneAndUpdate({ name: 'Demon' }, { $set: { att: 150 } }, { returnNewDocument: true });
            */
            users.updateOne({ "user_id":userId }, { $set: { mining_power_at: userDocs[0].mining_power_at } });
            
            res.send(utilModule.makeResponse(req, userDocs[0], null));
        });
    });
};

module.exports.test = test;
module.exports.test_use_mining_power = test_use_mining_power;
module.exports.test_reset_mining_power = test_reset_mining_power;