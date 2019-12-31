var util = require("../internal/Util");
var constant = require("../Constant");

var instance_user_inventory = async function(req, res)
{
    util.requestLog(req);
    
    // 헤더 유효성 체크
    if (false == util.checkCertificate(req.app, req.headers.authorization)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    // AccessToken 체크
    var userId = util.getUserIdFromJWT(req.headers.authorization);
    if (!userId) {
        var error = util.makeError(constant.Err_Common_InvalidAccessToken, "Invalid User AccessToken");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    // 인벤토리 정보얻어서 리턴
    try {
        var userInventory = await getUserInventory(req, userId);
        res.send(util.makeWebResponse(req, userInventory, null));
    } catch(error) {
        res.send(util.makeWebResponse(req, null, error)); 
    }
}

var instance_user_upgrade_info = async function(req, res)
{
    util.requestLog(req);
    
    // 헤더 유효성 체크
    if (false == util.checkCertificate(req.app, req.headers.authorization)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    // AccessToken 체크
    var userId = util.getUserIdFromJWT(req.headers.authorization);
    if (!userId) {
        var error = util.makeError(constant.Err_Common_InvalidAccessToken, "Invalid User AccessToken");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    // 업그레이드 정보 얻어서 리턴
    try {
        var userUpgradeInfo = await getUserUpgradeInfo(req, userId);
        res.send(util.makeWebResponse(req, userUpgradeInfo, null));
    } catch(error) {
        res.send(util.makeWebResponse(req, null, error)); 
    }
}

var instance_user_upgrade_active_power = async function(req, res)
{
    util.requestLog(req);
    
    // 헤더 유효성 체크
    if (false == util.checkCertificate(req.app, req.headers.authorization)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    // AccessToken 체크
    var userId = util.getUserIdFromJWT(req.headers.authorization);
    if (!userId) {
        var error = util.makeError(constant.Err_Common_InvalidAccessToken, "Invalid User AccessToken");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    // 파워 레벨 업그레이드 Process
    try {
        var userInventory = await getUserInventory(req, userId);
        var userUpgradeInfo = await getUserUpgradeInfo(req, userId);
        
        // Check : Upgrade 레벨이 Max인가?
        var nextPowerLv = userUpgradeInfo.mining_power_lv + 1;
        var nextPowerInfo = await getUpgradePowerTable(req, function(element) { return element.level == nextPowerLv; });
        if (!nextPowerInfo) {
            var error = util.makeError(constant.Err_Upgrade_MaxLevel, "The user's power level is the maximum value.");
            res.send(util.makeWebResponse(req, null, error));
            return;
        }
        
        // Check : 다음 레벨로 업그레이드 할 수 있는 충분한 재화가 있는가?
        if (userInventory.gold < nextPowerInfo.cost_gold) {
            var error = util.makeError(constant.Err_Upgrade_NotEnoughGold, "There is not enough gold for the user.");
            res.send(util.makeWebResponse(req, null, error));
            return;
        }
        
        // Upgrade Process
        userUpgradeInfo.mining_power_lv = nextPowerLv;
        userInventory.gold = (userInventory.gold - nextPowerInfo.cost_gold);
        var newUserUpgradeInfo = await setUserUpgradeInfo(req, userId, userUpgradeInfo);
        var newUserInventory = await setUserInventory(req, userId, userInventory);
        
        // return
        var returnData = {};
        res.send(util.makeWebResponse(req, newUserUpgradeInfo, null));
        
    } catch(error) {
        res.send(util.makeWebResponse(req, null, error)); 
    }
}

var instance_user_upgrade_active_time = async function(req, res)
{
    util.requestLog(req);
    
    // 헤더 유효성 체크
    if (false == util.checkCertificate(req.app, req.headers.authorization)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    // AccessToken 체크
    var userId = util.getUserIdFromJWT(req.headers.authorization);
    if (!userId) {
        var error = util.makeError(constant.Err_Common_InvalidAccessToken, "Invalid User AccessToken");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    // 시간 레벨 업그레이드 Process
    try {
        var userInventory = await getUserInventory(req, userId);
        var userUpgradeInfo = await getUserUpgradeInfo(req, userId);
        
        // Check : Upgrade 레벨이 Max인가?
        var nextTimeLv = userUpgradeInfo.charge_time_lv + 1;
        var nextTimeInfo = await getUpgradeTimeTable(req, function(element) { return element.level == nextTimeLv; });
        if (!nextTimeInfo) {
            var error = util.makeError(constant.Err_Upgrade_MaxLevel, "The user's time level is the maximum value.");
            res.send(util.makeWebResponse(req, null, error));
            return;
        }
        
        // Check : 다음 레벨로 업그레이드 할 수 있는 충분한 재화가 있는가?
        if (userInventory.gold < nextTimeInfo.cost_gold) {
            var error = util.makeError(constant.Err_Upgrade_NotEnoughGold, "There is not enough gold for the user.");
            res.send(util.makeWebResponse(req, null, error));
            return;
        }
        
        // Upgrade Process
        userUpgradeInfo.charge_time_lv = nextTimeLv;
        userInventory.gold = (userInventory.gold - nextTimeInfo.cost_gold);
        var newUserUpgradeInfo = await setUserUpgradeInfo(req, userId, userUpgradeInfo);
        var newUserInventory = await setUserInventory(req, userId, userInventory);
        
        // return
        res.send(util.makeWebResponse(req, newUserUpgradeInfo, null));
        
    } catch(error) {
        res.send(util.makeWebResponse(req, null, error)); 
    }
}

var getUserInventory = function(req, userId)
{
    return new Promise(function(resolve, reject) {
        
        console.log("[LSH] called getUserInventory : " + userId);
        
        // 인벤토리 정보얻어서 리턴
        util.getDocsOneAtDB(req.app, "instance_user_inventories", {"user_id":userId}, function(result, inventory, error)
        {
            if (!result) {
                reject(error);
                return;
            }
            
            if (!inventory) {
                var error = util.makeError(constant.Err_Common_EmptyDocuments, "Empty User Inventory(" + userId + ")");
                reject(error);
                return;
            }
            
            resolve(inventory);
        });
        
    });
}

var getUserUpgradeInfo = function(req, userId)
{
    return new Promise(function(resolve, reject) {
        
        console.log("[LSH] called getUserUpgradeInfo : " + userId);
        
        util.getDocsOneAtDB(req.app, "instance_user_upgrade_info", {"user_id":userId}, function(result, upgradeInfo, error)
        {
            if (!result) {
                reject(error);
                return;
            }
            
            if (!upgradeInfo) {
                var error = util.makeError(constant.Err_Common_EmptyDocuments, "Empty User UpgradeInfo(" + userId + ")");
                reject(error);
                return;
            }
            
            resolve(upgradeInfo);
        });
        
    });
}

var getUpgradePowerTable = function(req, condition)
{
    return new Promise(function(resolve, reject) {
        
        util.getDocsAtApp(req.app, "mining_active_max_mp", null, function(result, upgradePowerTable, error)
        {
            if (!result) {
                reject(error);
                return;
            }
            
            resolve(upgradePowerTable.find(condition));
        });
        
    });
}

var getUpgradeTimeTable = function(req, condition)
{
    return new Promise(function(resolve, reject) {
        
        console.log("[LSH] called getUpgradeTimeTable");
        
        util.getDocsAtApp(req.app, "mining_active_recharge_delay", null, function(result, upgradeTimeTable, error)
        {
            if (!result) {
                reject(error);
                return;
            }
            
            resolve(upgradeTimeTable.find(condition));
        });
        
    });
}

var setUserInventory = function(req, userId, inventoryInfo)
{
    return new Promise(function(resolve, reject) {
        
        console.log("[LSH] called setUserInventory");
        
        util.updateOneDocumentAtDB(req.app, "instance_user_inventories", {"user_id":userId}, inventoryInfo, function(result, data, error)
        {
            if (!result) {
                reject(error);
                return;
            }
            
            resolve(data);
        });
        
    });
}

var setUserUpgradeInfo = function(req, userId, upgradeInfo)
{
    return new Promise(function(resolve, reject) {
        
        console.log("[LSH] called setUserUpgradeInfo");
        
        util.updateOneDocumentAtDB(req.app, "instance_user_upgrade_info", {"user_id":userId}, upgradeInfo, function(result, data, error)
        {
            if (!result) {
                reject(error);
                return;
            }
            
            resolve(data);
        });
        
    });
}

module.exports.instance_user_inventory = instance_user_inventory;
module.exports.instance_user_upgrade_info = instance_user_upgrade_info;
module.exports.instance_user_upgrade_active_power = instance_user_upgrade_active_power;
module.exports.instance_user_upgrade_active_time = instance_user_upgrade_active_time;