var util = require("../internal/Util");
var constant = require("../Constant");

var instance_user_inventory = function(req, res)
{
    util.requestLog(req);
    
    // 헤더 유효성 체크
    if (false == util.checkCertificate(req.app, req.headers.authorization, true)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    // 파라미터 유효성 체크
    var userId = req.body.user_id;
    if (!userId) {
        var error = util.makeError(constant.Err_Common_InvalidParameter, "Invalid Parameter from RouterUser.instance_user_inventory");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    // 인벤토리 정보얻어서 리턴
    util.getDocsOneAtDB(req.app, "instance_user_inventories", {"user_id":userId}, function(result, inventory, error)
    {
        if (error) {
            res.send(util.makeWebResponse(req, null, error));
            return;
        }
        
        if (!inventory) {
            var error = util.makeError(constant.Err_Common_EmptyDocuments, "Empty User Inventory(" + userId + ")");
            res.send(util.makeWebResponse(req, null, error));
            return;
        }
        
        res.send(util.makeWebResponse(req, inventory, error));
    });
}

var instance_user_upgrade_info = function(req, res)
{
    util.requestLog(req);
    
    // 헤더 유효성 체크
    if (false == util.checkCertificate(req.app, req.headers.authorization, true)) {
        var error = util.makeError(constant.Err_Common_InvalidHeader, "Invaild Header");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    // 파라미터 유효성 체크
    var userId = req.body.user_id;
    if (!userId) {
        var error = util.makeError(constant.Err_Common_InvalidParameter, "Invalid Parameter from RouterUser.instance_user_upgrade_info");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    // 인벤토리 정보얻어서 리턴
    util.getDocsOneAtDB(req.app, "instance_user_upgrade_info", {"user_id":userId}, function(result, inventory, error)
    {
        if (error) {
            res.send(util.makeWebResponse(req, null, error));
            return;
        }
        
        if (!inventory) {
            var error = util.makeError(constant.Err_Common_EmptyDocuments, "Empty User UpgradeInfo(" + userId + ")");
            res.send(util.makeWebResponse(req, null, error));
            return;
        }
        
        res.send(util.makeWebResponse(req, inventory, error));
    });
}

module.exports.instance_user_inventory = instance_user_inventory;
module.exports.instance_user_upgrade_info = instance_user_upgrade_info;