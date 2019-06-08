var config = require("../Config");
var util = require("../internal/Util");

var socketPolling = {};
socketPolling.startSocketPolling = function(app)
{
    console.log("[LSH] called startSocketPolling(app, router)");
    
    var globalConfig = app.get("global_config");
    
    // 인스턴스 회사 테이블 소켓폴링
    var instanceMiningActiveCompany = setInterval(function()
    {
        socketPolling_InstanceMiningActiveCompany(app);
    }, globalConfig[0].socket_polling_interval);
    
    //clearInterval(instanceMiningActiveCompany);
}

// 인스턴스 회사 테이블 소켓폴링
var socketPolling_InstanceMiningActiveCompany = function(app)
{
    // 인스턴스 테이블 가져오기
    // @@ 인터벌이 짧아서 테이블 가져오기 전에 다음 요청이 또 들어오면 어쩌나?? 예외처리 해줘야하나??
    
    var response = util.getDocsAllAtDB(app, "instance_mining_active_company", null, function(result, data, error)
    {
        if (false == result) {
            console.console("error socketPollingInstanceMiningActiveCompany - " + JSON.stringify(error));
            return;
        }
        
        var subscribe_mining_active_info = app.get("subscribe_mining_active_info");
        if ((undefined == subscribe_mining_active_info) 
            || (0 == Object.keys(subscribe_mining_active_info).length)) {
            return;
        }
        
        var sockets = app.get("sockets");
        if ((undefined == sockets)
            || (0 == Object.keys(sockets).length)) {
            return;
        }
        
        var emitData = util.makeSocketResponse("polling_mining_active_info", data, error);
        for (key in subscribe_mining_active_info) {
            
            if (undefined == sockets[key]) {
                continue;
            }
            
            sockets[key].emit("polling_mining_active_info", emitData);
        }
    });
}

module.exports = socketPolling;