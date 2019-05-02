var config = require("../Config");

var router_loader = {};
router_loader.init = function(app, socket)
{
	console.log("[LSH] called socket_router_loader.init(app, router)");
    
	var infoLen = config.socket_route_info.length;
	for (var iLoop = 0; iLoop < infoLen; ++iLoop)
    {
        var curRouter = config.socket_route_info[iLoop];
        var curModule = require(curRouter.file);
        
        // app, socket을 어떻게 넘겨주지??
        // curModule[curRouter.method](app, socket, message); 포인트 잃어버릴꺼같은데??
        
        socket.on(curRouter.event_name, (message) => 
        {
            curModule[curRouter.method](app, socket, message);
        });
        
        console.log("[LSH] added socket router module : %s %s", curRouter.event_name, curRouter.method);
    }
}

module.exports = router_loader;