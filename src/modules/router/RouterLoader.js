var configModule = require("../Config");

var router_loader = {};
router_loader.init = function(app, router)
{
	console.log("[LSH] router_loader.init(app, router)");
    
	var infoLen = configModule.route_info.length;
	for (var iLoop = 0; iLoop < infoLen; ++iLoop)
    {
		var curRouter = configModule.route_info[iLoop];
		var curModule = require(curRouter.file);
		
		if (curRouter.type == "get")
        {
            router.route(curRouter.path).get(curModule[curRouter.method]);
		}
        else if (curRouter.type == "post")
        {
            router.route(curRouter.path).post(curModule[curRouter.method]);
		}
        else if (curRouter.type == "put")
        {
            router.route(curRouter.path).put(curModule[curRouter.method]);
		}
        else if (curRouter.type == "delete")
        {
            router.route(curRouter.path).delete(curModule[curRouter.method]);
		}
        else
        {
            router.route(curRouter.path).post(curModule[curRouter.method]);
		}
		
		console.log("[LSH] 라우팅 모듈 추가 : " + curRouter.type + " " + curRouter.path);
	}
    
    // 라우터 객체 등록
    app.use('/', router);
}

module.exports = router_loader;