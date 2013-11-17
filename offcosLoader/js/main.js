(function(global){
    
    var ScriptManager = function(){
        this.manager = {};
        this.curScript = null;
        this.curDefine = null;
    };
    ScriptManager.prototype.get = function(url){
        var moduleId = this.calModuleId(url);
        if(this.manager[moduleId]){
            return this.manager[moduleId];
        }else{
            this.manager[moduleId] = new ScriptLoader(url);
            this.manager[moduleId].moduleId = moduleId;
            return this.manager[moduleId];
        }
    };

    ScriptManager.prototype.setCurScriptLoader = function(loader){
        this.curScript = loader;
    };

    ScriptManager.prototype.getCurScriptLoader = function(){
        return this.curScript;
    };

    ScriptManager.prototype.setCurDefine = function(func){
        this.curDefine = func;
    };

    ScriptManager.prototype.getCurDefine = function(){
        return this.curDefine;
    };

    ScriptManager.prototype.generateTree = function(rootLoader){
        var recorder = {};
        var walk = function(loader){
            for(var i=0;i<loader.deps.length;i++){
                var scriptId = loader.deps[i].moduleId;
                if(recorder[scriptId]===1){
                    // has circle
                    if(loader.state === state.analyzed){
                        //set scriptLoader state depsReady
                        //setTimeout(function(){
                            loader.setState(state.depsReady);
                        //},0);
                    }
                }else{
                    //set loader walk state "deps walking"
                    recorder[scriptId] = 1;
                    walk(loader.deps[i]);
                }
                //set parent loader walk state "deps walked"
                recorder[loader.moduleId] = 2;
            }
        };
        walk(rootLoader);
    };

    ScriptManager.prototype.calModuleId = function(url){
        var fullPath = "";
        if(/^\.{0,2}(\/|\\)/.test(url)){
            fullPath = document.location.href+url;
        }else{
            fullPath = url;
        }
        //remove ./
        fullPath = fullPath.replace(/\.\//g,"");
        //replace // to /
        fullPath = fullPath.replace(/\/\//g,"/");
        //replace /aaa/../ to /
        while(/\.\./.test(fullPath)){
            fullPath = fullPath.replace(/\/[^\/]+\/\.\.\//g,"/");
        }
        return encodeURIComponent(fullPath);
    };
    var scriptManager = new ScriptManager();

    var state = {};
    state.notLoaded = 0;
    state.loaded = 1;
    state.analyzed = 2;
    state.depsReady = 3;
    state.executed = 4;

    var stateStr = {};
    stateStr[0] = "notLoaded";
    stateStr[1]="loaded";
    stateStr[2]="analyzed";
    stateStr[3]="depsReady";
    stateStr[4]="executed";


    /**
     * @brief dynamic load js using script tag
     *
     * @param url 
     *
     * @return 
     */
    var ScriptLoader = function(url){
        this.url = url;
        this.deps = [];
        this.parents = [];
        this.state = -1;
        this.setState(state.notLoaded);
    };

    ScriptLoader.prototype.setState = function(state){
        var _this = this;
        if(this.state<state){
            console.log(this.url +":"+ stateStr[state]);
            this.state = state;
            this.onStateChange();
        }
    };

    ScriptLoader.prototype.onStateChange = function(){
        switch(this.state) {
            case state.notLoaded: this.load();break;
            case state.loaded: this.analysis();break;
            case state.analyzed: this.isDepsReady();break;
            case state.depsReady: this.execute();break;
            case state.executed: this.removeScriptTag();break;
        }
    };

    ScriptLoader.prototype.removeScriptTag = function(){
        if(this.scriptTag){
            this.scriptTag.parentNode.removeChild(this.scriptTag);
            delete this.scriptTag;
        }
    };

    ScriptLoader.prototype.execute = function(){
        var exports = {};
        console.log("before execute"+this.url);
        this.exports = this.defineFunction.call(null,exports) || exports;
        console.log("after execute"+this.url);
        this.setState(state.executed);
    };

    ScriptLoader.prototype.isDepsReady = function(){
        if(this.state>=state.depsReady){
            return;
        }
        scriptManager.generateTree(this);
        for(var i=0;i<this.deps.length;i++){
            if(this.deps[i].state < state.depsReady){
                return;
            }
        }
        this.setState(state.depsReady);
        for(i=0;i<this.parents.length;i++){
            this.parents[i].isDepsReady();
        }
        return;
    };

    ScriptLoader.prototype.addParent = function(parentLoader){
        this.parents.push(parentLoader);
    };

    ScriptLoader.prototype.addDep = function(childLoader){
        this.deps.push(childLoader);
    };

    ScriptLoader.prototype.analysis = function(){
        var _this = this;
        var defineFunction = scriptManager.getCurDefine();
        this.defineFunction = defineFunction;
        var regex = /require\((:?[\"\'])([^\"\']+)\1\)/g;
        defineFunction.toString()
            //remove single line commet
            .replace(/\/\/.*/g,"")
            //remove space
            .replace(/\s+/g,"")
            //remove multi commet
            .replace(/\/\*.*?\*\//g,"")
            .replace(regex,function($1,$2,$3){
            var modelName = $3;
            var scriptLoader = scriptManager.get(modelName);
            scriptLoader.addParent(_this);
            _this.addDep(scriptLoader);
        });
        this.setState(state.analyzed);

        return;
    };

    ScriptLoader.prototype.load = function(){
        var _this = this;
        var scriptTag  = this.scriptTag = document.createElement("script");
        var head = document.getElementsByTagName("head")[0];
        //when loaded execute callback
        var onloadCallback = function(){
            _this.setState(state.loaded);
        };
        if(scriptTag.readyState){
            scriptTag.onreadystatechange = onloadCallback;
        }else{
            scriptTag.onload = onloadCallback;
        }
        scriptTag.src = this.url;
        scriptTag.async = true;
        head.appendChild(scriptTag);
    };


    global.define = function(func){
        scriptManager.setCurDefine(func);
    };

    global.require = function(url){
        var scriptLoader = scriptManager.get(url);
        if(scriptLoader){
            return scriptLoader.exports;
        }else{
            return {};
        }
    };
    scriptManager.get("js/a.js");
})(window);
