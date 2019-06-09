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
    util.getDocsOneAtDB(req.app, "instance_user_inventories", {"user_id":userId}, function(result, inventory, error)
    {
        if (error) {
            res.send(util.makeWebResponse(req, null, error));
            return;
        }
        
        // DB : 액티브컴퍼니
        util.getDocsOneAtDB(req.app, "instance_mining_active_company", {"instance_id":activeCompanyInstanceId}, function(result, activeCompany, error)
        {
            if (error) {
                res.send(util.makeWebResponse(req, null, error));
                return;
            }
            
            // Check : 구매 가능한 공급 물량 확인
            if (!activeCompany.supply_count || 0 >= activeCompany.supply_count) {
                var error = util.makeError(constant.Err_Mining_ZeroSupplyQuantity, "Quantity of supply is zero");
                res.send(util.makeWebResponse(req, null, error));
                return;
            }
            
            // DB : Global Config
            var condition = function(element) { return element.key == "global_config"; };
            util.getDocsAtApp(req.app, "global_config", condition, function(result, globalConfig, error)
            {
                if (error) {
                    res.send(util.makeWebResponse(req, null, error));
                    return;
                }
                
                // DB : Global Unit
                var condition = function(element) { return element.unit_id == activeCompany.unit_id; };
                util.getDocsAtApp(req.app, "global_unit_data", condition, function(result, globalUnit, error)
                {
                    if (error) {
                        res.send(util.makeWebResponse(req, null, error));
                        return;
                    }
                    
                    // Check : 재화가 충분한지 확인
                    var timeSpan = (Date.now() - inventory.mining_power_at);
                    var curPowerCount = timeSpan / globalConfig.basic_charge_time;
                    if (globalUnit.weight > curPowerCount) {
                        var error = util.makeError(constant.Err_Mining_NotEnoughMiningPower, "MiningPower is Not Enough");
                        res.send(util.makeWebResponse(req, null, error));
                        return;
                    }
                    
                    // DB : Unit Quantity
                    var condition = function(element) { return element.level == activeCompany.efficiency_lv; };
                    util.getDocsAtApp(req.app, "mining_active_quantity", condition, function(result, unitQuantity, error)
                    {
                        if (error) {
                            res.send(util.makeWebResponse(req, null, error));
                            return;
                        }
                        
                        // 마이닝 시간처리
                        var maxTime = Date.now() - (globalConfig.basic_charge_time * globalConfig.basic_mining_power_count);
                        if (inventory.mining_power_at < maxTime) {
                            inventory.mining_power_at = maxTime
                        }
                        
                        inventory.mining_power_at = Math.min(Date.now(), (inventory.mining_power_at + (globalConfig.basic_charge_time * globalUnit.weight)));
                        
                        // 유닛 물량 획득 처리
                        var unit = inventory.has_units.find(function(element) { return element.unit_id == activeCompany.unit_id; } );
                        if (unit) {
                            unit.quantity = unit.quantity + unitQuantity.quantity;
                        }
                        else {
                            unit = {unit_id:activeCompany.unit_id, quantity:unitQuantity.quantity};
                            inventory.has_units.push(unit);
                        }
                        
                        // 인벤토리 업데이트
                        util.updateOneDocumentAtDB(req.app, "instance_user_inventories", {"user_id":userId}, inventory, function(result, data, error)
                        {
                            if (error) {
                                res.send(util.makeWebResponse(req, null, error));
                                return;
                            }
                            
                            // 액티브 컴퍼니 공급물량 감소 처리
                            activeCompany.supply_count = activeCompany.supply_count - 1;
                            
                            // 액티브 컴퍼니 업데이트 (물량이 모두 감소했으면 액티브 컴퍼니 삭제처리)
                            if (0 == activeCompany.supply_count) {
                                util.deleteOneDocumentAtDB(req.app, "instance_mining_active_company", {"instance_id":activeCompanyInstanceId}, function(result, data, error)
                                {
                                    if (error) {
                                        res.send(util.makeWebResponse(req, null, error));
                                        return;
                                    }
                                    
                                    res.send(util.makeWebResponse(req, inventory, null));
                                });
                            }
                            else {
                                util.updateOneDocumentAtDB(req.app, "instance_mining_active_company", {"instance_id":activeCompanyInstanceId}, activeCompany, function(result, data, error)
                                {
                                    if (error) {
                                        res.send(util.makeWebResponse(req, null, error));
                                        return;
                                    }

                                    res.send(util.makeWebResponse(req, inventory, null));
                                });
                            }
                        });
                    });
                });
            });
        });
    });
};

module.exports.purchase_unit_at_mining_active = purchase_unit_at_mining_active;