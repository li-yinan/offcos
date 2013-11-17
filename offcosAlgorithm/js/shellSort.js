(function(global){
    var ShellSort = global.ShellSort = extend(Base); 
    ShellSort.prototype.sort = function(arr){
        this.arr = arr;
        this.doSort();
        return this.arr;
    };
    ShellSort.prototype.doSort = function(){
        var hibbard = this.calHibbard(this.arr.length);
        console.log("hibbard is: "+hibbard);
        for(var i=hibbard.length;i>0;i--){
            var fraction = hibbard[i-1];
            for(var j=0;j<this.arr.length;j+=fraction){
                for(var k=0;k<j;k+=fraction){
                    if(this.arr[j]<this.arr[k]){
                        this.swap(j,k);
                    }
                }
            }
        }
    };
    /**
     * @brief calculate hibbard increment
     *
     * @param n
     *
     * @return 
     */
    ShellSort.prototype.calHibbard = function(n){
        var i = 0;
        var res = [];
        var cur = 0;
        while(true){
            cur = 9 * Math.pow(4,i) - 9 * Math.pow(2,i) + 1;
            if(cur<n){
                res.push(cur);
            }else{
                break;
            }
            i++;
        }
        return res;
    };

})(window);
