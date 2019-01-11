var test = function(req, res)
{
    console.log("[LSH] GET /process/test 호출됨");
    
    res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
    res.write("<h1>모듈 라우터 테스트</h1>");
    res.end();
};

module.exports.test = test;