var test = function(req, res)
{
    
    console.log("[LSH] " + req.method + " /process/test 호출됨");
    res.send({"version" : "1.0.0"});
};

module.exports.test = test;