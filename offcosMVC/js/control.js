/**
 * @file controller.js
 * @brief 一个小的mvc框架，实现了简单的业务拆分
 * @author liyinan
 * @version 1.0
 * @date 2013-08-02
 */
define(function(require){
    var copy = function(from,to){
        for(var i in from){
            if((from.hasOwnProperty&&from.hasOwnProperty(i))||(!from.hasOwnProperty)){
                if(!(i in ["event"])){
                    to[i] = from[i];
                }
            }
        }
    };

    var Controller = function(options){
        var Clazz = function(){
            this.args = arguments;
            this.data = options.data;
            this.tagName = options.tagName||"li";
            this.el = document.createElement(this.tagName);
            this.eventList = options.event;
            for(var i in this.eventList){
                if(this.eventList.hasOwnProperty(i)){
                    var eventName = i.split(" ")[0];
                    var className = i.split(" ")[1];
                    this.delegate(this.el,eventName,className,this[this.eventList[i]]);
                }
            }
            //this.init();
            this.init.apply(this,arguments);
            this.render();
        };

        Clazz.prototype.delegate = function(el,eventName,className,callback){
            var _this = this;
            var cb = function(e){
                e = e||window.event;
                var target = e.srcElement||e.target;
                var reg = new RegExp(className);
                if(reg.test(target.className)){
                    callback.call(_this,e);
                }
            };
            //对blur和focus这种不冒泡事件特殊处理
            if(eventName==="blur"){
                if(el.addEventListener){
                    el.addEventListener("blur",cb,true);
                }else if(el.attachEvent){
                    el.attachEvent("onfocusout",cb);
                }
                return;
            }else if(eventName==="focus"){
                if(el.addEventListener){
                    el.addEventListener("focus",cb,true);
                }else if(el.attachEvent){
                    el.attachEvent("onfocusin",cb);
                }
                return;
            }
            if(el.addEventListener){
                el.addEventListener(eventName,cb,false);
            }else if(el.attachEvent){
                el.attachEvent("on"+eventName,cb);
            }
        };

        Clazz.prototype.destroy = function(){
            baidu.dom.remove(this.el);
        };

        Clazz.prototype.init = function(){
        };
        Clazz.prototype.render = function(){
        };
        copy(options,Clazz.prototype);
        return Clazz;
    };
    return Controller;
});
