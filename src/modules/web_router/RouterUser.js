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
        var error = util.makeError(constant.Err_Common_InvalidParameter, "Invalid Parameter");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    // 인벤토리 정보얻어서 리턴
    util.getDocsOneAtDB(req.app, "instance_user_inventories", {"user_id":userId}, function(result, docs, error)
    {
        if (error) {
            res.send(util.makeWebResponse(req, null, error));
            return;
        }
        
        if (!docs) {
            res.send(util.makeWebResponse(req, null, 
                        util.makeError(constant.Err_User_NoHasInventory, "No has inventory")));
            return;
        }
        
        res.send(util.makeWebResponse(req, docs, error));
    });
}

module.exports.instance_user_inventory = instance_user_inventory;