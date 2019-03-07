var crypto = require("crypto");

var Initialization = function(app)
{
    setCompanyForMiningTable(app);
};

var loadServerConfig = function(app, callback)
{
    var serverConfig = app.get("database").db.collection("config");
    if (!serverConfig) {
        console.log("[LSH] 심각한 오류 : config 테이블이 없음");
        callback(null);
        return;
    }
    
    serverConfig.find().toArray(function(err, docs) 
    {
        if (err) {
            var error = {"code":constantModule.Err_Common_CollectionRead, "message":"config 데이터 베이스 쿼리 실패"};
            res.send(utilModule.makeResponse(req, null, error));
            callback(null);
            return;
        }

        if (0 == docs.length) {
            var error = {"code":constantModule.Err_Common_EmptyCollection, "message":"config 비어있는 컬렉션"};
            res.send(utilModule.makeResponse(req, null, error));
            callback(null);
            return;
        }
        
        callback(docs[0]);
    });
};

var setCompanyForMiningTable = function(app)
{
    var oracleCompanyAM = app.get("database").db.collection("oracle_company_am");
    if (!oracleCompanyAM) {
        console.log("[LSH] 심각한 오류 : oracle_company_am 테이블이 없음");
        return;
    }
    
    var companyForMining = app.get("database").db.collection("company_for_mining");
    if (!companyForMining) {
        console.log("[LSH] 심각한 오류 : company_for_mining 테이블이 없음");
        return;
    }
    
    loadServerConfig(app, function(serverConfig)
    {
        oracleCompanyAM.find().toArray(function(err, docs) 
        {
            if (err) {
                console.log("[LSH] 심각한 오류 : oracle_company_am find가 안됨");
                return;
            }

            if (0 == docs.length) {
                console.log("[LSH] 심각한 오류 : oracle_company_am 비어있음");
                return;
            }

            for (var iLoop = 0; iLoop < docs.length; iLoop++) {
                processCompanyForMiningTable(companyForMining, serverConfig, docs[iLoop]);
            }
        });
    });
};

var processCompanyForMiningTable = function(companyForMining, serverConfig, item)
{
    /*
    마이닝 회사 테이블 업데이트 알고리즘

    instance_id로 companyForMining테이블을 find한다.

    있을때 -> docs의 is_use가 yes면 업데이트한다.
                           no면 제거한다.
    없을때 -> docs의 is_use가 yes면 추가한다.
                           no면 무시한다.
    */
    companyForMining.findOne({"instance_id": item.instance_id}, function(err, bots)
    {
        if (err) {
            console.log("[LSH] 심각한 오류 : company_for_mining find가 안됨(%s)", item.instance_id);
            return;
        }
        
        if (bots) {
            if (1 == item.is_use) {
                var basicCompanyInfo = { $set: {
                    "resource_id" : item.resource_id
                    , "name_strid" : item.name_strid
                    , "emblem_id" : item.emblem_id
                    , "efficiency_lv" : item.efficiency_lv
                    , "supply_count" : serverConfig.basic_active_mining_supply
                    , "is_basic_company" : true
                }};

                companyForMining.update({ instance_id: item.instance_id }, basicCompanyInfo, function(err)
                {
                    if (err) {
                        console.log("[LSH] 심각한 오류 : company_for_mining update 안됨(%s)", item.instance_id);
                    }
                });
            }
            else {
                companyForMining.delete({ instance_id: item.instance_id }, function (err) {

                    if (err) {
                        console.log("[LSH] 심각한 오류 : company_for_mining delete 안됨(%s)", item.instance_id);
                    }
                });
            }
        }
        else {
            if (1 == item.is_use) {
                var basicCompanyInfo = {
                    "instance_id" : item.instance_id
                    , "resource_id" : item.resource_id
                    , "name_strid" : item.name_strid
                    , "emblem_id" : item.emblem_id
                    , "efficiency_lv" : item.efficiency_lv
                    , "supply_count" : serverConfig.basic_active_mining_supply
                    , "is_basic_company" : true
                };
                
                companyForMining.insertOne(basicCompanyInfo, function(err, result) 
                {
                    if (err) {
                        console.log("[LSH] 심각한 오류 : company_for_mining insert 안됨(%s)", item.instance_id);
                        return;
                    }
                });
            }
        }
    });
}

module.exports.Initialization = Initialization;