var makeResponse = function(req, data, error)
{
    var result = {
        "result" : error ? false : true,
        "data" : data,
        "error" : error
    };
    
    console.log("[LSH] %s %s 응답", req.method, req.url);
    console.log(JSON.stringify(result));
    
    return result;
}

module.exports.makeResponse = makeResponse;