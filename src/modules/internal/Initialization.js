var config = require("../Config");
var crypto = require("crypto");
var routerUtil = require("../router/RouterUtil");

var initialization = function(app, callback)
{
    console.log("[LSH] called initialization");
    
    var preLoadTableLen = config.pre_load_table.length;
    for (var iLoop = 0; iLoop < preLoadTableLen; ++iLoop)
    {
        preLoadTable(app, config.pre_load_table[iLoop]);
    }
    
    var retryCount = 0;
    var createInstance = setInterval(function()
    {
        var isLoaded = true;
        for (var iLoop = 0; iLoop < preLoadTableLen; ++iLoop)
        {
            if (undefined == app.get(config.pre_load_table[iLoop]))
            {
                isLoaded = false;
                break;
            }
        }
        
        if (true == isLoaded)
        {
            createInstanceCompanyTable(app);
            clearInterval(createInstance);
            callback();
        }
        
        // @@@ 테이블이 없으면 무한루프인데... 서버 종료시켜야겠다.
        
    }, 100);
};

function preLoadTable(app, collectionName)
{
    console.log("try preload : %s", collectionName);
    
    var table = routerUtil.getCollection(app, collectionName);
    if (!table) {
        console.error("[LSH][loapreLoadTabledTable] not found collection ( %s )", collectionName);
        return;
    }
    
    table.find().toArray(function(err, docs) 
    {
        if (err) {
            console.error("[LSH][preLoadTable] failed find collection ( %s )", collectionName);
            return;
        }

        if (0 == docs.length) {
            console.error("[LSH][preLoadTable] empty collection ( %s )", collectionName);
            return;
        }
        
        app.set(collectionName, docs);
    });
}

var createInstanceCompanyTable = function(app)
{
    var instanceMiningActiveCompany = routerUtil.getCollection(app, "instance_mining_active_company");
    if (!instanceMiningActiveCompany) {
        console.error("[LSH][createInstanceCompanyTable] not found collection ( %s )", "instance_mining_active_company");
        return;
    }
    
    var globalConfig = app.get("global_config");
    var miningActiveCompanyNPC = app.get("mining_active_company_npc");
    var npcLen = miningActiveCompanyNPC.length;
    
    for (var iLoop = 0; iLoop < npcLen; iLoop++) {
        var npcItem = miningActiveCompanyNPC[iLoop];
        processInstanceCompanyTable(npcItem, globalConfig, instanceMiningActiveCompany);
    }
};

function processInstanceCompanyTable(npcItem, globalConfig, instanceMiningActiveCompany)
{
        /*
            인스턴스 회사 테이블 업데이트 아이디어

            instance_id로 instanceMiningActiveCompany 테이블을 find한다.

            있을때 -> is_use가 yes면 업데이트한다.
                             no면 제거한다.
            없을때 -> is_use가 yes면 추가한다.
                             no면 무시한다.
        */
    
    instanceMiningActiveCompany.findOne({"instance_id": npcItem.instance_id}, function(err, instance)
    {
        if (err) {
            console.error("[LSH][createInstanceCompanyTable] failed find collection ( instanceId : %s )", npcItem.instance_id);
            return;
        }

        if (instance) {
            if (1 == npcItem.is_use) {
                var npcCompanyInfo = { $set: {
                    "instance_id" : npcItem.instance_id
                    , "unit_id" : npcItem.unit_id
                    , "name_str_id" : npcItem.name_str_id
                    , "emblem_image" : npcItem.emblem_image
                    , "efficiency_lv" : npcItem.efficiency_lv
                    , "supply_count" : globalConfig[0].basic_active_mining_supply
                    , "is_basic_company" : true
                }};

                instanceMiningActiveCompany.updateOne({"instance_id": npcItem.instance_id}, npcCompanyInfo, function(err)
                {
                    if (err) {
                        console.log("[LSH][createInstanceCompanyTable] failed DB update ( instanceId : %s )", npcItem.instance_id);
                    }
                });
            }
            else {
                instanceMiningActiveCompany.delete({"instance_id": npcItem.instance_id}, function (err)
                {
                    if (err) {
                        console.log("[LSH][createInstanceCompanyTable] failed DB delete ( instanceId : %s )", npcItem.instance_id);
                    }
                });
            }
        }
        else {
            if (1 == npcItem.is_use) {
                var npcCompanyInfo = {
                    "instance_id" : npcItem.instance_id
                    , "unit_id" : npcItem.unit_id
                    , "name_str_id" : npcItem.name_str_id
                    , "emblem_image" : npcItem.emblem_image
                    , "efficiency_lv" : npcItem.efficiency_lv
                    , "supply_count" : globalConfig[0].basic_active_mining_supply
                    , "is_basic_company" : true
                };

                instanceMiningActiveCompany.insertOne(npcCompanyInfo, function(err, result) 
                {
                    if (err) {
                        console.log("[LSH][createInstanceCompanyTable] failed DB insert ( instanceId : %s )", item.instance_id);
                    }
                });
            }
        }
    });
}

module.exports.initialization = initialization;