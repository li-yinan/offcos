(function(global){
    var BubleSort = global.BubleSort = extend(Base); 
    BubleSort.prototype.sort = function(arr){
        this.arr = arr;
        this.doSort();
        return this.arr;
    };
    BubleSort.prototype.doSort = function(){
        for(var i=0;i<this.arr.length;i++){
            for(var j=i;j>0;j--){
                if(this.arr[i]<this.arr[j]){
                    this.swap(i,j);
                }
            }
        }
    };
})(window);
