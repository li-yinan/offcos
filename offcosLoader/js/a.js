console.log("a start");
define(function(exports){
    exports.sayHello = function(){
        console.log("a hello");
    };
    var b = require("js/b.js");
    var c = require("js/c.js");
    console.trace();
    c.sayHello();
    b.sayHello();
    console.log("a executed");
});
console.log("a end");
