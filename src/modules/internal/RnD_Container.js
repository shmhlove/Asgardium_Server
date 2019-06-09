var list = [];//[ {key:1, value:1}, {key:2, value:2} ];
list.push({key:1, value:1});
list.push({key:2, value:2});

var unit = list.find(function(element) { return element.key == 1; } );
unit.value = unit.value + 1;
console.dir(list);

list.push({key:3, value:3});
console.dir(list);