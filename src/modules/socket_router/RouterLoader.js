var config = require("../Config");

var router_loader = {};
router_loader.init = function(app, socket)
{
	console.log("[LSH] called socket_router_loader.init(app, socket)");
    
	var infoLen = config.socket_route_info.length;
	for (var iLoop = 0; iLoop < infoLen; ++iLoop)
    {
        var curRouter = config.socket_route_info[iLoop];
        var curModule = require(curRouter.file);
        
        addSocketEvent(app, socket, curRouter.event_name, curModule[curRouter.method]);
    }
}

function addSocketEvent(app, socket, eventName, eventMethod)
{
    console.log("[LSH] added router in socket : %s", eventName);
    
    socket.on(eventName, (message) => 
    {
        console.log("[LSH] arrive socket event : %s, %s", eventName, message);
        eventMethod(app, socket, message);
    });
}

module.exports = router_loader;