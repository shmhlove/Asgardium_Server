const crypto = require('crypto');

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

var makeJWT = function()
{
    // 헤더헤더
    ///////////////////////////////////////////////////////////////
    const header = {
        "typ": "JWT",   // 헤더타입
        "alg": "HS256"  // signature에 사용할 암호알고리즘
    };
    
    const encodedHeader = new Buffer(JSON.stringify(header))
                                .toString('base64')
                                .replace('=', '');
    
    console.log('header: ', encodedHeader);
    
    
    // 정보정보
    ///////////////////////////////////////////////////////////////
    const payload = {
        // 등록된 클레임 : 이미 정해져있는 key
        "iss": "velopert.com",  // 토큰 발급자
        "sub": "MangoNight",    // 토큰 제목
        "aud": "Asgardium",     // 토큰 대상자
        "exp": "1485270000000", // 토큰의 만료시간(이 시간이 지난후 토큰은 유효하지 않음)
        "nbf": "1485270000000", // 토큰의 시작시간(이 시간이 되기전 토큰은 유효하지 않음)
        "iat": "1485270000000", // 토큰이 발급된 시간
        "jti": "temp",          // JWT의 고유식별자로 주로 중복처리방지에 사용됨(일회용토큰에 사용하기 좋다?)
        
        // 공개 클레임 : 충돌방지용으로 임의의 key (URL 형식으로 지어 사용)
        "https://mangonight.com/jwt_claims/is_admin": true,
        
        // 비공개 클레임 : 서버 - 클라 간 협의하에 사용하는 클레임?? 무슨말이지?
        "userId": "11028373727102",
        "username": "MangoNight"
    };
    
    const encodedPayload = new Buffer(JSON.stringify(payload))
                                .toString('base64')
                                .replace('=', '');
    
    console.log('payload: ', encodedPayload);
    
    
    // 서명서명
    // 서명은 헤더의 인코딩값과, 정보의 인코딩값을 합친후 주어진 비밀키로 해쉬를 하여 생성합니다.
    /*
        HMACSHA256(
          base64UrlEncode(header) + "." +
          base64UrlEncode(payload),
          secret)
    */
    ///////////////////////////////////////////////////////////////
    const signature = crypto.createHmac('sha256', 'secret')
                 .update(encodedHeader + '.' + encodedPayload)
                 .digest('base64')
                 .replace('=', '');

    console.log('signature: ', signature);
    
    // JWT 합체
    ///////////////////////////////////////////////////////////////
    console.log('JWT: ', encodedHeader + '.' + encodedPayload + '.' + signature);
}

module.exports.makeResponse = makeResponse;
module.exports.makeJWT = makeJWT;