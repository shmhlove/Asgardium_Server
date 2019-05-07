var async = require("async");
var webSocket = require("socket.io");

var config = require("../Config");
var routerUtil = require("../web_router/RouterUtil");
var webRouterLoader = require("../web_router/RouterLoader");
var socketRouterLoader = require("../socket_router/RouterLoader");
var socketPolling = require("../socket_router/SocketPolling");

var init = function(express, expressApp, webServer, callback)
{
    console.log("[LSH] called initialization");

    // 테이블 프리로드
    var iLoadCount = 0;
    var preLoadTableLen = config.pre_load_table.length;
    for (var iLoop = 0; iLoop < preLoadTableLen; ++iLoop)
    {
        preLoadTable(expressApp, config.pre_load_table[iLoop], function(isSucceed, collectionName)
        {
            ++iLoadCount;
        });
    }
    
    async.forever(
        function(next) {
            // 테이블 프리로드가 완료되기 까지 대기
            next(iLoadCount >= preLoadTableLen);
        },
        function(err) {
            // DB에 인스턴스 테이블 생성
            createInstanceCompanyTable(expressApp, callback);
            
            // Web라우터 연결
            webRouterLoader.init(expressApp, express.Router());
            
            // Socket 연결
            var io = webSocket.listen(webServer);
            
//            io.set('pingTimeout', 15000);
//            io.set('PingInterval', 8000);
            
            expressApp.set("socket.io", io);
            
            io.sockets.on("connection", function(socket)
            {
                console.log("[LSH] socket connection to : ", socket.id, "->", socket.request.connection._peername);
                
//                var sockets = expressApp.get("sockets");
//                if (undefined == sockets) {
//                    sockets = [];
//                }
//                sockets.add(socket.id, socket);
//                expressApp.set("sockets", sockets);
                
                // socket 객체에 클라이언트의 Host와 Port 정보를 속성으로 추가
                socket.remoteAddress = socket.request.connection._peername.address;
                socket.remotePort = socket.request.connection._peername.port;
                
                // 연결종료
                socket.on("disconnect", function(message)
                {
                    console.log("[LSH] socket event -> disconnect(" + socket.id + ") : " + message);
                    socket = null;
                });
                
                // Socket라우터 연결
                socketRouterLoader.init(expressApp, socket);
            });
            
            // SocketPolling 시작
            startSocketPolling(expressApp);
        }
    );
};

function preLoadTable(app, collectionName, callback)
{
    var table = routerUtil.getCollection(app, collectionName);
    if (!table) {
        console.error("[LSH][loapreLoadTabledTable] not found collection ( %s )", collectionName);
        callback(false, collectionName);
        return;
    }
    
    table.find().toArray(function(err, docs) 
    {
        if (err) {
            console.error("[LSH][preLoadTable] failed find collection ( %s )", collectionName);
            callback(false, collectionName);
            return;
        }

        if (0 == docs.length) {
            console.error("[LSH][preLoadTable] empty collection ( %s )", collectionName);
            callback(false, collectionName);
            return;
        }
        
        app.set(collectionName, docs);
        callback(true, collectionName);
        console.log("[LSH] preload Table : %s", collectionName);
    });
}

var createInstanceCompanyTable = function(app, callback)
{
    var instanceMiningActiveCompany = routerUtil.getCollection(app, "instance_mining_active_company");
    if (!instanceMiningActiveCompany) {
        console.error("[LSH][createInstanceCompanyTable] not found collection ( %s )", "instance_mining_active_company");
        callback();
        return;
    }
    
    var iLoadCount = 0;
    var globalConfig = app.get("global_config");
    var miningActiveCompanyNPC = app.get("mining_active_company_npc");
    var npcLen = miningActiveCompanyNPC.length;
    
    // NPC 회사 테이블을 기반으로 인스턴스 회사 테이블 업데이트
    for (var iLoop = 0; iLoop < npcLen; iLoop++) {
        var npcItem = miningActiveCompanyNPC[iLoop];
        processInstanceCompanyTable(npcItem, globalConfig, instanceMiningActiveCompany, function(isSucceed)
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

function processInstanceCompanyTable(npcItem, globalConfig, instanceMiningActiveCompany, callback)
{
    /*
        인스턴스 회사 테이블 업데이트 아이디어
        -> 인스턴스 회사 테이블과 기본 NPC회사 테이블간 동기화
        -> 기본 NPC회사 테이블은 추가, 수정, 삭제가 될 수 있기에 인스턴스 회사 테이블에 반영하기위한 작업

        npcItem.instance_id로 instanceMiningActiveCompany 테이블을 find한다.
        (npcItem.instance_id는 수동으로 생성한 랜덤해쉬로써 static하게 기록해둔 id값)

        테이블이 있을때 -> npcItem.is_use필드가 yes면 업데이트한다.
                                            no면 제거한다.
        테이블이 없을때 -> npcItem.is_use필드가 yes면 추가한다.
                                            no면 무시한다.
    */
    
    instanceMiningActiveCompany.findOne({"instance_id": npcItem.instance_id}, function(err, instance)
    {
        if (err) {
            console.error("[LSH][createInstanceCompanyTable] failed find collection ( instanceId : %s )", npcItem.instance_id);
            callback(false);
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
                        callback(false);
                    }
                    else {
                        callback(true);
                    }
                });
            }
            else {
                instanceMiningActiveCompany.delete({"instance_id": npcItem.instance_id}, function (err)
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

function startSocketPolling(app)
{
    // 인스턴스 회사 테이블 소켓폴링
    var socketPollinginstanceMiningActiveCompany = setInterval(function(app)
    {
        socketPolling.socketPollingInstanceMiningActiveCompany(app);
    }, 1000);
    
    //clearInterval(socketPollinginstanceMiningActiveCompany);
}

module.exports.init = init;