const schedule = require('node-schedule');

var time = new Date(Date.now());

// Sun, 09 Jun 2019 10:16:38 GMT
console.log(time.toUTCString());

// 2019 M06 9, Sun
var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
console.log(time.toLocaleDateString('ko-KR', options));

//var check = "10:25"
//var checkSplit = check.split(":");
//console.log(checkSplit);
//console.log(checkSplit[0] == time.getUTCHours());
//console.log(checkSplit[1] == time.getUTCMinutes());

console.log(time.getTime());
console.log(time.getUTCHours());
console.log(time.getUTCMinutes());

var birthday = new Date('Sun, 09 Jun 2019 10:16:38 GMT');
//birthday.setUTCHours('25');
//birthday.setUTCMinutes('25');
//console.log(birthday.getUTCHours());
//console.log(birthday.getUTCMinutes());
console.log(birthday.toUTCString());

const j = schedule.scheduleJob('10 * * * *', function()
{
  console.log('매 10초에 실행');
});