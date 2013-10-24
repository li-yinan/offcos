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
                if(!(i in ["schema"])){
                    to[i] = from[i];
                }
            }
        }
    };
    var sort = function(list,attr){
        var swap = function(i,j){
            var temp = list[i];
            list[i] = list[j];
            list[j] = temp;
        };
        var bubbleSort = function(){
            for(var i=list.length-1;i>0;--i){
                for(var j=0;j<i;++j){
                    if(list[j][attr]>list[j+1][attr]){
                        swap(j,j+1);
                    }
                }
            }
        };
        bubbleSort();
    };

    var Model = function(options){
        var Clazz = function(){
            this.schema = options.schema;
            this.recCount = 0;
            this.records = {};
            this.init.apply(this,arguments);
        };
        Clazz.prototype.getId = function(){
            var count = this.recCount++;
            return "id"+count;
        };
        Clazz.prototype.init = function(){
        };
        Clazz.prototype.create = function(data){
            var record = {};
            var id = this.getId();
            for(var i in this.schema){
                if(this.schema.hasOwnProperty(i)){
                    if(typeof data[i] !== "undefined"){
                        record[i] = data[i];
                    }
                }
            }
            this.records[id] = record;
            return id;
        };
        Clazz.prototype.del = function(id){
            //this.records[id] = undefined;
            delete this.records[id];
        };
        Clazz.prototype.update = function(id,data){
            var record = this.read(id);
            for(var i in data){
                if(data.hasOwnProperty(i)){
                    if(i in this.schema){
                        record[i] = data[i];
                    }
                }
            }
            this.records[id] = record;
        };
        Clazz.prototype.read = function(id){
            if(!this.records[id]){
                return;
            }
            var record = {};
            for(var i in this.records[id]){
                if(this.schema.hasOwnProperty(i)){
                    record[i] = this.records[id][i];
                }
            }
            return record;
        };
        Clazz.prototype.readWithOrder = function(id,attr){
            attr = attr||"order";
            var record = this.read(id);
            var order = 1;
            for(var i in this.records){
                if(this.records.hasOwnProperty(i)){
                    if(i===id){
                        record[attr] = order;
                        return record;
                    }else{
                        order++;
                    }
                }
            }
        };
        Clazz.prototype.all = function(){
            var list = [];
            for(var i in this.records){
                if(this.records.hasOwnProperty(i)){
                    list.push(this.read(i));
                }
            }
            return list;
        };
        Clazz.prototype.allSorted = function(attr){
            var list = this.all();
            if(attr){
                sort(list,attr);
            }
            return list;
        };
        Clazz.prototype.allWithOrder = function(){
            var list = this.all();
            for(var i=0;i<list.length;i++){
                list[i].order = i;
            }
            return list;
        };
        Clazz.prototype.allSortedWithOrder = function(attr){
            var list = this.allSorted(attr);
            for(var i=0;i<list.length;i++){
                list[i].order = i;
            }
            return list;
        };
        Clazz.prototype.findByAttr = function(attr,value){
            for(var i in this.records){
                if(this.records.hasOwnProperty(i)){
                    if(this.records[i][attr]===value){
                        return i;
                    }
                }
            }
            return;
        };
        Clazz.prototype.clear = function(attr){
            this.records = {};
        };
        copy(options,Clazz.prototype);
        return Clazz;
    };
    return Model;
});
