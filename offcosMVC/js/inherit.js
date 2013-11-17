define(function(require,exports,module){
    /**
     * brief 继承,可写构造函数
     *
     * @param C 子类
     * @param P 父类
     *
     * @return 子类
     */
    exports.inherit = function(C,P){
        //临时方法
        var F = function(){};
        var cProto = C.prototype;
        //为了除去P中的实例方法与成员，如this.name等
        F.prototype = P.prototype;
        //C继承于P
        C.prototype = new F();
        //保留对父类的引用
        //C.uber = P.prototype;
        C.uber = P;
        //修复自身构造函数引用，不修复会指向父类
        C.prototype.constructor = C;
        //复原子类原型链
        for(var i in cProto){
            if(cProto.hasOwnProperty(i)){
                P.prototype[i] = cProto[i];
            }
        }
        return C;
    };

    /**
     * brief 继承,不可写构造函数,执行父类的构造函数
     *
     * @param P 父类
     *
     * @return 子类
     */
    exports.extend = function(P){
        //临时方法
        var F = function(){};
        var C = function(){};
        //为了除去P中的实例方法与成员，如this.name等
        F.prototype = P.prototype;
        //C继承于P
        C.prototype = new F();
        //保留对父类的引用
        C.uber = P.prototype;
        //修复自身构造函数引用，不修复会指向父类
        C.prototype.constructor = C;
        return C;
    };
});
