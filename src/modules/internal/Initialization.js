var async = require("async");

var config = require("../Config");
var util = require("./Util");
var webRouterLoader = require("../web_router/RouterLoader");
var socketRouterLoader = require("../socket_router/RouterLoader");

var init = function(expressModule, expressApp, webServer, callback)
{
    console.log("[LSH] called initialization");

    // 테이블 프리로드
    var loadedCollectionCount = 0;
    var preLoadCollectionLen = config.pre_load_collection.length;
    for (var iLoop = 0; iLoop < preLoadCollectionLen; ++iLoop)
    {
        PreLoadCollection(expressApp, config.pre_load_collection[iLoop], function(result, collectionName)
        {
            // 실패해도 서버 실행되도록 카운팅 한다.
            ++loadedCollectionCount;
            console.log("[LSH] preload Collection : %s (%s)", collectionName, result?"Succeed":"Failed");
        });
    }
    
    async.forever(
        // 컬렉션 프리로드가 완료되기 까지 대기
        function(next) {
            next(loadedCollectionCount >= preLoadCollectionLen);
        },
        // 컬렉션 프리로드 후 처리
        function(err) {
            // DB에 인스턴스 회사 테이블 생성
            createInstanceCompanyCollection(expressApp, callback);
            
            // Web 라우터 연결
            webRouterLoader.init(expressApp, expressModule.Router());
            
            // Socket 연결
            socketRouterLoader.init(expressApp, webServer);
            
            // 후처리가 끝나고 나면 callback 주고싶은데..
        }
    );
};

var PreLoadCollection = function(app, collectionName, callback)
{
    util.getDocsAllAtDB(app, collectionName, null, function(result, docs, error)
    {
        if (result) {
            app.set(collectionName, docs);
        }
        callback(result, collectionName);
    });
};

var createInstanceCompanyCollection = function(app, callback)
{
    var instanceCompanyTable = util.getCollectionAtDB(app, "instance_mining_active_company");
    if (!instanceCompanyTable) {
        console.error("[LSH] not found collection ( instance_mining_active_company )");
        callback();
        return;
    }
    
    var globalConfigTable = util.getDocsAtApp(app, "global_config");
    if (!globalConfigTable) {
        console.error("[LSH] not found collection ( global_config )");
        callback();
        return;
    }
    
    var npcCompanyTable = util.getDocsAtApp(app, "mining_active_company_npc");
    if (!npcCompanyTable) {
        console.error("[LSH] not found collection ( mining_active_company_npc )");
        callback();
        return;
    }
    
    // NPC 회사 테이블을 기반으로 인스턴스 회사 테이블 업데이트
    var iLoadCount = 0;
    var npcLen = npcCompanyTable.length;
    for (var iLoop = 0; iLoop < npcLen; iLoop++) {
        processInstanceCompanyTable(npcCompanyTable[iLoop], globalConfigTable, instanceCompanyTable, function(isSucceed)
        {
            ++iLoadCount;
        });
    }
    
    async.forever(
        function(next) {
            next(iLoadCount >= npcLen);
        },
        function(err) {
            callback();
        }
    );
};

function processInstanceCompanyTable(npcCompany, globalConfigTable, instanceCompanyTable, callback)
{
    /*
        인스턴스 회사 테이블 업데이트 아이디어
        -> 인스턴스 회사 테이블과 기본 NPC회사 테이블간 동기화
        -> 기본 NPC회사 테이블은 추가, 수정, 삭제가 될 수 있기에 인스턴스 회사 테이블에 반영하기위한 작업

        npcCompany.instance_id로 instanceMiningActiveCompany 테이블을 find한다.
        (npcCompany.instance_id는 수동으로 생성한 랜덤해쉬로써 static하게 기록해둔 id값)

        테이블이 있을때 -> npcCompany.is_use필드가 yes면 업데이트한다.
                                            no면 제거한다.
        테이블이 없을때 -> npcCompany.is_use필드가 yes면 추가한다.
                                            no면 무시한다.
    */
    
    instanceCompanyTable.findOne({"instance_id": npcCompany.instance_id}, function(err, docs)
    {
        if (err) {
            console.error("[LSH][createInstanceCompanyTable] failed find documents ( instanceId : %s )", npcCompany.instance_id);
            callback(false);
            return;
        }
        
        if (docs) {
            if (1 == npcCompany.is_use) {
                var companyInfo = { $set: {
                    "instance_id" : npcCompany.instance_id
                    , "unit_id" : npcCompany.unit_id
                    , "name_str_id" : npcCompany.name_str_id
                    , "emblem_image" : npcCompany.emblem_image
                    , "efficiency_lv" : npcCompany.efficiency_lv
                    , "supply_count" : globalConfigTable[0].basic_active_mining_supply
                    , "is_npc_company" : true
                }};
                
                instanceCompanyTable.updateOne({"instance_id": npcCompany.instance_id}, companyInfo, function(err)
                {
                    if (err) {
                        console.log("[LSH][createInstanceCompanyTable] failed DB update ( instanceId : %s )", npcItem.instance_id);
                        callback(false);
                    }
                    else {
                        callback(true);
                    }
                });
            }
            else {
                instanceCompanyTable.delete({"instance_id": npcCompany.instance_id}, function (err)
                {
                    if (err) {
                        console.log("[LSH][createInstanceCompanyTable] failed DB delete ( instanceId : %s )", npcItem.instance_id);
                        callback(false);
                    }
                    else {
                        callback(true);
                    }
                });
            }
        }
        else {
            if (1 == npcCompany.is_use) {
                var companyInfo = {
                    "instance_id" : npcCompany.instance_id
                    , "unit_id" : npcCompany.unit_id
                    , "name_str_id" : npcCompany.name_str_id
                    , "emblem_image" : npcCompany.emblem_image
                    , "efficiency_lv" : npcCompany.efficiency_lv
                    , "supply_count" : globalConfigTable[0].basic_active_mining_supply
                    , "is_npc_company" : true
                };

                instanceCompanyTable.insertOne(companyInfo, function(err, result) 
                {
                    if (err) {
                        console.log("[LSH][createInstanceCompanyTable] failed DB insert ( instanceId : %s )", npcCompany.instance_id);
                        callback(false);
                    }
                    else {
                        callback(true);
                    }
                });
            }
        }
    });
}

module.exports.init = init;