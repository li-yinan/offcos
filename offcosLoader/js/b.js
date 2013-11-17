console.log("b start");
define(function(exports){
    require("js/c.js");
    console.log("b executed");
    //exports.sayHello = function(){
    //    console.log("b hello");
    //};
    return {
        sayHello : function(){
            console.log("b hello");
        }
    }
});
console.log("b end");
