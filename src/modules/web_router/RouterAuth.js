var crypto = require("crypto");
var util = require("../internal/Util");
var constant = require("../Constant");

var is_signup = function(req, res)
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
        var error = util.makeError(constant.Err_Common_InvalidParameter, "Invalid Parameter from RouterAuth.is_signup");
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
        
        var result = {
            "is_signup" : true
        };
        
        if (!docs) {
            result["is_signup"] = false
        }
        
        res.send(util.makeWebResponse(req, result, null));
    });
};

var signup = async function(req, res)
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
        var error = util.makeError(constant.Err_Common_InvalidParameter, "Invalid Parameter from RouterAuth.signup");
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
    
    // 유저 가입상태 확인 후 유저생성
    users.find({"user_email":userEmail}).toArray(async function(err, docs) 
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

        createUserId(users, async function(userId)
        {
            try {
                var userInfo = await createUser(users, userId, userEmail, userName, userPass);
                var userInventory = await createInventory(req, userId);
                var userUpgradeInfo = await createUpgradeInfo(req, userId);
                
                var outData = {};
                Object.assign(outData, userInfo, userInventory, userUpgradeInfo);
                res.send(util.makeWebResponse(req, outData, null));
            } catch(error) {
                util.deleteOneDocumentAtDB(req.app, "instance_users", {"user_id":userId}, function(result, data, error){});
                util.deleteOneDocumentAtDB(req.app, "instance_user_inventories", {"user_id":userId}, function(result, data, error){});
                util.deleteOneDocumentAtDB(req.app, "instance_user_upgrade_info", {"user_id":userId}, function(result, data, error){});
                
                res.send(util.makeWebResponse(req, null, error)); 
            }
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
        var error = util.makeError(constant.Err_Common_InvalidParameter, "Invalid Parameter from RouterAuth.signin");
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

var createUser = function(users, userId, userEmail, userName, userPass)
{
    return new Promise(function(resolve, reject) {
        
        console.log("[LSH] called Create User : " + userEmail);
        
        // Parameter 검증
        if (!users || !userId || !userEmail || !userName || !userPass) {
            reject(util.makeError(constant.Err_Common_InvalidParameter, "Invelid Parameter from RouterAuth.createUser"));
            return;
        }

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
                reject(util.makeError(constant.Err_Common_FailedWriteDB, "Failed Create User"))
            }
            else {
                resolve(result["ops"][0]);
            }
        });
    });
}

var createInventory = function(req, userId)
{
    return new Promise(function(resolve, reject) {
        
        console.log("[LSH] called Create User Inventory : " + userId);

        // Parameter 검증
        if (!req || !userId) {
            reject(util.makeError(constant.Err_Common_InvalidParameter, "Invelid Parameter from RouterAuth.createInventory"));
            return;
        }
        
        // instance_user_inventories 컬렉션 얻기
        var inventories = util.getCollectionAtDB(req.app, "instance_user_inventories");
        if (!inventories) {
            reject(util.makeError(constant.Err_Common_FailedgetCollectionAtDB,
                                       "Failed get DB collection ( 'instance_user_inventories' )"));
        }
        else {
            // 인벤토리 추가
            var inventoryInfo = {
                "user_id" : userId
                , "mining_power_at" : 0
                , "has_units" : [ ]
            };
            
            inventories.insertOne(inventoryInfo, function(err, result) 
            {
                if (err) {
                    reject(util.makeError(constant.Err_Common_FailedWriteDB, "Failed Create User Inventory"));
                }
                else {
                    resolve({"inventory":result["ops"][0]});
                }
            });
        }
    });
}

var createUpgradeInfo = function(req, userId)
{
    return new Promise(function(resolve, reject) {
        
        console.log("[LSH] called Create User UgradeInfo : " + userId);
        
        // 파라미터 유효성 체크
        if (!req || !userId) {
            reject(util.makeError(constant.Err_Common_InvalidParameter, "Invelid Parameter from RouterAuth.createUpgradeInfo"));
            return;
        }

        // instance_user_upgrade_info 컬렉션 얻기
        var upgradeInfo = util.getCollectionAtDB(req.app, "instance_user_upgrade_info");
        if (!upgradeInfo) {
            reject(util.makeError(constant.Err_Common_FailedgetCollectionAtDB,
                                    "Failed get DB collection ( 'instance_user_upgrade_info' )"));
        }
        else {
            // 업그레이드 정보 추가
            var myUpgradeInfo = {
                "user_id" : userId
                , "mining_power_lv" : 0
                , "charge_time_lv" : 0
            };
            upgradeInfo.insertOne(myUpgradeInfo, function(err, result) 
            {
                if (err) {
                    reject(util.makeError(constant.Err_Common_FailedWriteDB, "Failed Create User UpgradeInfo"));
                }
                else {
                    resolve({"upgrade_info":result["ops"][0]});
                }
            });
        }
    });
}

module.exports.is_signup = is_signup;
module.exports.signup = signup;
module.exports.signin = signin;