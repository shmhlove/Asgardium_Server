/*
* async.series(테스크, 완료콜백)
-> series 함수는 비동기 함수들을 순차적으로 실행하도록 도와주는 함수이다. 
이 함수는 독립적인 작업을 순차적으로 실행하기 위해 사용된다. (이전 작업의 결과물에 상관없이 수행되는 작업일 경우)
각 테스크에서 callback으로 전달하는 결과물은 series가 모았다가 모든 작업이 완료되면 완료콜백에 전달해준다.

async.waterfall(테스크, 완료콜백)
-> waterfall 함수는 series와 같이 비동기함수를 순차적으로 실행하지만 각 작업의 결과를 다음 작업으로 넘겨줄 수 있다.
각 테스크에서 callback으로 전달하는 결과물은 다음 테스크로 전달된다.
가장 마지막 테스크의 callback 결과물이 완료콜백에 전달된다.

async.whilist(조건, 반복수행작업, 완료콜백) // 싱크한 반복
async.during(조건, 반복수행작업, 완료)  // 어싱크한 반복
->반복적인 작업을 한 후 특정 조건에서 작업을 끝낼 수 있도록 도와주는 함수이다. 
whilist는 조건문에서 다른 비동기 작업을 할 수 없어서 during을 쓰는 것이 더 편리하다.
두 함수가 같아보이지만 조건 함수에서 차이가 있다. 
whilist는 조건을 함수에서 boolean 형태로 리턴해서 루프를 제어하는 방식이고, 
during은 조건을 callback 함수로 리턴하여 루프를 제어하는 방식이다. 
따라서 whilist 에서는 비동기 작업이 불가능하고, during 에서는 비동기 작업이 가능하다.

async.forever(반복수행작업, 완료콜백)
forever는 during, whilist와 마찬가지로 루프를 생성하여 작업을 수행하는 것이지만 중단을 해주는 조건 함수가 들어가지 않아 영구적으로 루프의 작업을 수행하는 함수이다.
next(false)를 통해서 무한 반복을 수행하고 next(true)를 통해 반복을 종료할 수 있다.

async.parallel(테스크배열, 완료콜백)
비동기 작업을 동시에 수행 한 후, 모든 작업이 종료 된 후에 완료 함수를 수행하여 준다. 
waterfall 이나 whilist 등은 순차적으로 실행하지만 parallel은 동시에 실행한다.
*/

var async = require("async");

////////////////////////////////////////////////////
var tasks = [
    function (callback) {
        setTimeout(function () {
            callback(null, 'one-1', 'one-2');
        }, 200);
    },
    function (callback) {
        setTimeout(function () {
            callback(null, 'two');
        }, 100);
    },
    function (callback) {
        setTimeout(function () {
            callback(null, 'three-1', 'three-2');
        }, 100);
    }
];

async.series(tasks, function (err, results) {
    console.log(results);
    // [ [ 'one-1', 'one-2' ], 'two', [ 'three-1', 'three-2' ] ]
});
////////////////////////////////////////////////////
var tasks = [
    function (callback) {
        setTimeout(function () {
            callback(null, 'one, ');
        }, 200);
    },
    function (beforeData, callback) {
        setTimeout(function () {
            callback(null, beforeData + 'two, ');
        }, 200);
    },
    function (beforeData, callback) {
        setTimeout(function () {
            callback(null, beforeData + 'three');
        }, 100);
    }
];
async.waterfall(tasks, function (err, results) {
    console.log(results);
    // one, two, three
});
////////////////////////////////////////////////////
var iLoop = 0;
async.during(
    // 조건체크
    function (callback) {
        return callback(null, iLoop < 5);
    },
    // 반복실행코드
    function (callback) {
        console.log("async during Loop : %d", ++iLoop);
        callback(null);
    },
    // 완료(optional)
    function (err) {
        console.log("finish async Loop");
    }
);
////////////////////////////////////////////////////
iLoop = 0
async.forever(
    function(next) {
        console.log("async forever Loop : %d", ++iLoop);
        next(iLoop >= 5);
    },
    function(err) {
        // 완료
    }
);
////////////////////////////////////////////////////
// 동시에 테스크를 실행하고, 모두 완료되면 완료콜백호출,, 총 6초가 아닌 3초에 끝남
var timestamp = new Date().getTime();
async.parallel(
    [
        function (callback) {
            setTimeout(function () {
                callback(null, 'parallel one');
            }, 2000);
        },
        function (callback) {
            setTimeout(function () {
                callback(null, 'parallel two');
            }, 1000);
        },
        function (callback) {
            setTimeout(function () {
                callback(null, 'parallel three');
            }, 3000);
        }
    ], 
    function (err, results) {
        console.log(results, 'in ', new Date().getTime() - timestamp, 'ms');
    }
);