var socketPolling = {};

socketPolling.startSocketPolling = function(app)
{
    console.log("[LSH] called startSocketPolling(app, router)");
    
    // 인스턴스 회사 테이블 소켓폴링
    var socketPollinginstanceMiningActiveCompany = setInterval(function()
    {
        socketPollingInstanceMiningActiveCompany(app);
    }, 1000);
    
    //clearInterval(socketPollinginstanceMiningActiveCompany);
}

var socketPollingInstanceMiningActiveCompany = function(app)
{
    // 인스턴스회사테이블
    // 구독요청클라정보
    // 클라소켓정보
    // DB가 준비되기 전까지 초기화 대기
//    var sockets = app.get("sockets");
//    for (var key in sockets) {
//        sockets[key].emit("test_message", "test polling");
//    }
//    var subscribe_mining_active_info = app.get("subscribe_mining_active_info");
//    if (sockets && subscribe_mining_active_info) {
//        var subscribeLen = subscribe_mining_active_info.length;
//        for (var iLoop = 0; iLoop < subscribeLen; ++iLoop) {
//            var userId = subscribe_mining_active_info[iLoop];
//        }
//        console.log("연결된 소켓 수 : " + Object.keys(sockets).length);
//    }
}

module.exports = socketPolling;