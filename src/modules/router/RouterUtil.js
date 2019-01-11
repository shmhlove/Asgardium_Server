var makeResponse = function(data, error)
{
    return {
        "result" : error ? false : true,
        "data" : data,
        "error" : error
    };
}

module.exports.makeResponse = makeResponse;