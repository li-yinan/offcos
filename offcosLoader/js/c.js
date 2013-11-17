console.log("c start");
define(function(exports){
    require("js/a.js");
    exports.sayHello = function(){
        console.log("c hello");
    };
    console.log("c executed");
});
console.log("c end");
