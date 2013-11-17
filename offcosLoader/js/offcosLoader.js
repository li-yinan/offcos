/**
 * @file offcosLoader.js
 * @brief 一个轻量级的js loader
 * @author liyinan
 * @version 1.0
 * @date 2013-10-16
 */
(function(global){

    var util = window.util = {

        /**
         * brief 判断是否是字符串
         *
         * @return true/false
         */
        isString: function(obj) {
            return Object.prototype.toString.call(obj) === "[object String]";
        },

        /**
         * brief 判断是否是数组
         *
         * @return true/false
         */
        isArray: function(obj) {
            return Object.prototype.toString.call(obj) === "[object Array]";
        },

        /**
         * brief 判断是否是函数
         *
         * @return true/false
         */
        isFunction: function(obj) {
            return Object.prototype.toString.call(obj) === "[object Function]";
        },

        /**
         * brief 根据url计算绝对路径
         *
         * @param url
         *
         * @return fullPath 绝对路径
         */
        calFullPath: function(url) {
            var fullPath = "";
            //判断是否是绝对路径
            if(/^http:\/\//.test(url)){
                fullPath = url;
            } else {
                var fullPath = document.location.href + url;
                //remove ./
                fullPath = fullPath.replace(/\.\//g,"");
                //replace // to /
                fullPath = fullPath.replace(/\/\//g,"/");
                //replace /aaa/../ to /
                fullPath = fullPath.replace(/\/[^\/]+\/\.\.\//g,"/");
            }
            //为没有.js的id增加后缀
            if(!/\.js$/.test(fullPath)){
                fullPath += ".js";
            }
            return fullPath;
        },

        /**
         * brief 根据url计算唯一id
         *
         * @param url
         * @param id 
         *
         * @return 
         */
        calId: function(url) {
            return encodeURIComponent(util.calFullPath(url));
        }
    };

    //脚本加载状态
    var state = {};
    //未加载
    state.notLoaded = 0;
    //加载完毕
    state.loaded = 1;
    //依赖分析完毕
    state.analyzed = 2;
    //依赖加载完毕
    state.depsReady = 3;
    //执行完毕
    state.executed = 4;

    /**
     * brief js加载器
     *
     * @return 
     */
    var OffcosLoader = function() {
        this.scripts = {};
    };

    OffcosLoader.prototype = {
        //当script执行define时，在此记录所有的define，在onload触发的时候进行处理并清空。
        tempDefineList : [],

        /**
         * brief 加载script脚本
         *
         * @param url 加载路径
         *
         * @return 
         */
        load: function(url) {
            var urlList = [];
            //将路径转化为绝对路径
            url = util.calFullPath(url);
            //计算模块id
            var scriptId = this.calId(url);
            //如果已经加载完毕，就不再加载
            if(scriptId in this.scripts) {
                return;
            }
            urlList.push(url);
            var _this = this;
            var head = document.getElementsByTagName("head")[0];
            //when loaded execute callback
            var onloadCallback = function(){
                //_this.setState(state.loaded);
                for(var i=0;i<_this.tempDefineList.length;i++){
                    var defineObj = _this.tempDefineList[i];
                    defineObj.url = util.calFullPath(defineObj.id);
                    defineObj.id = defineObj.id || util.calId(url);
                    if(scriptId in this.scripts) {
                        continue;
                    }
                    urlList.push(defineObj.url);
                    this.scripts[defineObj.id] = defineObj.url;
                }
                _this.tempDefineList = [];
            };
            while(urlList.length>0){
                var scriptTag  = this.scriptTag = document.createElement("script");
                if(scriptTag.readyState){
                    scriptTag.onreadystatechange = onloadCallback;
                }else{
                    scriptTag.onload = onloadCallback;
                }
                scriptTag.src = url;
                scriptTag.async = true;
                head.appendChild(scriptTag);
            }
        },

        /**
         * brief 分析每个define依赖
         *
         * @return 依赖的模块id
         *
         */
        analysis: function(func) {
            var regex = /require\((:?[\"\'])([^\"\']+)\1\)/g;
            var depIDs = [];
            defineFunction.toString()
                //删除单行注释
                .replace(/\/\/.*/g,"")
                //删除所有的空白
                .replace(/\s+/g,"")
                //删除多行注释
                .replace(/\/\*.*?\*\//g,"")
                .replace(regex,function($1,$2,$3){
                    //var modelName = $3;
                    depIDs.push($3);
                });
            return depIDs;
        }

    };

    var offcosLoader = new OffcosLoader();

    /**
     * brief 全局define,会在脚本加载之后，触发onload之前执行
     *
     *       define(function(){});
     *       define([a,b],function(){});
     *       define(id,[a,b],function(){});
     *
     * @return 
     */
    var define = global.define = function(arg1,arg2,arg3) {
        var id = "";
        var deps = [];
        var callback = function(){};
        if(util.isString(arg1)&&util.isArray(arg2)&&util.isFunction(arg3)){
            //define(id,[a,b],function(){});
            id = util.calId(arg1);
            deps = arg2;
            callback = arg3;
        }else if(util.isArray(arg1)&&util.isFunction(arg2)){
            //define([a,b],function(){});
            deps = arg1;
            callback = arg2;
        }else if(util.isFunction(arg1)){
            //define(function(){});
            callback = arg1;
        }else {
            console.log("unknown pattern");
            return;
        }
        offcosLoader.tempDefineList.push({id:id, deps:deps, callback:callback});
    };

    /**
     * brief 全局require，在主入口和加载依赖时调用
     *
     * @return 
     */
    var require = global.require = function(id,callback) {

    };
})(window);
