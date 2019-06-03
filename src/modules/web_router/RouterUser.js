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
    
    var inventories = util.getCollection(req.app, "instance_user_inventories");
    if (!inventories) {
        var error = util.makeError(constant.Err_Common_FailedGetCollection, "Failed get DB collection ( 'instance_user_inventories' )");
        res.send(util.makeWebResponse(req, null, error));
        return;
    }
    
    inventories.find({"user_id":userId}).toArray(function(err, docs) 
    {
        if (err) {
            var error = util.makeError(constant.Err_Common_FailedFindCollection, "Failed find DB collection ( 'instance_user_inventories' )");
            res.send(util.makeWebResponse(req, null, error));
            return;
        }
        
        if (0 == docs.length) {
            var error = util.makeError(constant.Err_User_NoHasInventory, "No has inventory");
            res.send(util.makeWebResponse(req, null, error));
            return;
        }
        
        res.send(util.makeWebResponse(req, docs[0], null));
    });
}

module.exports.instance_user_inventory = instance_user_inventory;