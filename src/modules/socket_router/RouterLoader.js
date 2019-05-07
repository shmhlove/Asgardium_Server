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
        
        connectSocketEvent(app, socket, curRouter.event_name, curModule[curRouter.method]);
        console.log("[LSH] added router in socket : %s %s", curRouter.event_name, curRouter.method);
    }
}

function connectSocketEvent(app, socket, eventName, eventMethod)
{
    socket.on(eventName, (message) => 
    {
        eventMethod(app, socket, message);
    });
}

module.exports = router_loader;