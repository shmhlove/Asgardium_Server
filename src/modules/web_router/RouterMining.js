var util = require("../internal/Util");
var constant = require("../Constant");

// Active Company 채굴
var purchase_unit_at_mining_active = function(req, res)
{
    util.requestLog(req);
    
    // Check : 헤더 유효성 체크
    if (false == util.checkCertificate(req.app, req.headers.authorization, true)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    // Check : 파라미터 유효성 체크
    var userId = req.body.user_id;
    var activeCompanyInstanceId = req.body.active_company_instance_id;
    if (!userId || !activeCompanyInstanceId) {
        var error = util.makeError(constant.Err_Common_InvalidParameter, "Invalid Parameter");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    // DB : 인벤토리
    var inventoryTable = util.getCollectionAtDB(req.app, "instance_user_inventories");
    if (!inventoryTable) {
        var error = util.makeError(constant.Err_Common_FailedgetCollectionAtDB, "Failed get DB collection ( 'instance_user_inventories' )");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    var inventory = inventoryTable.findOne({"user_id":userId});
    if (!inventory) {
        var error = util.makeError(constant.Err_User_NoHasInventory, "No has inventory");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    // DB : 인스턴스 엑티브컴퍼니
    var activeCompanyTable = util.getCollectionAtDB(app, "instance_mining_active_company");
    if (!activeCompanyTable) {
        var error = makeError(constant.Err_Common_FailedgetCollectionAtDB, "Not found collection ( instance_mining_active_company )");
        res.send(util.makeWebResponse(req, null, error));
    }
    var activeCompany = activeCompanyTable.findOne({"instance_id":activeCompanyInstanceId});
    if (!activeCompany) {
        var error = util.makeError(constant.Err_Common_FailedgetDocsAtDB, "No Exist ActiveCompany");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    // Check : 구매 가능한 공급 물량 확인
    if (0 >= activeCompany.supply_count) {
        var error = util.makeError(constant.Err_Mining_ZeroSupplyQuantity, "Quantity of supply is zero");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    // DB : 글로벌 컨피그
    var globalConfigTable = util.getDocsAtApp(app, "global_config");
    if (!globalConfigTable) {
        var error = util.makeError(constant.Err_Common_FailedgetCollectionAtDB, "Not found collection ( global_config )");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    // DB : 글로벌 유닛
    var globalUnitTable = util.getDocsAtApp(req.app, "global_unit_data");
    if (!globalUnitTable) {
        var error = util.makeError(constant.Err_Common_FailedgetCollectionAtDB, "Not found collection ( global_unit_data )");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    var globalUnit = globalUnitTable.find(function(element) {
      return (element.unit_id == activeCompany.unit_id);
    });
    if (!globalUnit) {
        var error = util.makeError(constant.Err_Mining_NotFoundUnitIdInGlobalUnitTable, "Not found UnitID in global unit table");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    // Check : 재화가 충분한지 확인
    var timeSpan = (Date.now() - inventory.mining_power_at);
    var curPowerCount = timeSpan / globalConfigTable[0].basic_charge_time;
    if (globalUnit.weight > curPowerCount) {
        var error = util.makeError(constant.Err_Mining_NotEnoughPower, "Power is Not Enough");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    // DB : 유닛물량
    var miningActiveQuantityTable = util.getDocsAtApp(req.app, "mining_active_quantity");
    if (!miningActiveQuantityTable) {
        var error = util.makeError(constant.Err_Common_FailedgetCollectionAtDB, "Not found collection ( mining_active_quantity )");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    var miningActiveQuantity = miningActiveQuantityTable.find(function(element) {
      return (element.level == activeCompany.efficiency_lv);
    });
    if (!miningActiveQuantity) {
        var error = util.makeError(constant.Err_Mining_NotFoundLevelInActiveQuantityTable, "Not found level in mining active quantity table");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    // 구매처리
    //유닛ID
    //activeCompany.unit_id
    //획득물량
    //miningActiveQuantity.quantity
    //마이닝 시간처리
    //인벤토리 업데이트
    //액티브컴퍼니 공급물량 업데이트
    
//    var timeSpan = (Date.now() - docs[0].mining_power_at);
//    var curPowerCount = timeSpan / globalConfig[0].basic_charge_time;
//
//    if (curPowerCount < globalConfig[0].basic_mining_power_count) {
//        docs[0].mining_power_at = Math.min(Date.now(), (docs[0].mining_power_at + globalConfig[0].basic_charge_time));
//    }
//    else {
//        docs[0].mining_power_at = Date.now() - (globalConfig[0].basic_charge_time * (globalConfig[0].basic_mining_power_count - 1));
//    }
//
//    users.updateOne({ "user_id":userId }, { $set: { mining_power_at: docs[0].mining_power_at } });
//
//    res.send(util.makeWebResponse(req, docs[0], null));
};

module.exports.test_use_mining_power = test_use_mining_power;