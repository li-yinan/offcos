define(function(require){
    /**
     * brief 继承,可写构造函数
     *
     * @param C 子类
     * @param P 父类
     *
     * @return 子类
     */
    var inherit = function(C,P){
        //临时方法
        var F = function(){};
        var cProto = C.prototype;
        //实现自动调用父类构造函数
        var ChildConstructor = function(){
            P.apply(this,Array.prototype.slice.call(arguments));
            C.apply(this,Array.prototype.slice.call(arguments));
        };
        //为了除去P中的实例方法与成员，如this.name等
        F.prototype = P.prototype;
        //C继承于P
        ChildConstructor.prototype = new F();

        //保留对父类的引用
        //C.uber = P.prototype;
        //ChildConstructor.uber = P;
        //修复自身构造函数引用，不修复会指向父类
        //复原子类原型链
        for(var i in cProto){
            if(cProto.hasOwnProperty(i)){
                ChildConstructor.prototype[i] = cProto[i];
            }
        }
        ChildConstructor.prototype.constructor = C;
        return ChildConstructor;
    };
    return inherit;
});
