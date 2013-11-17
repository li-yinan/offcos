(function(global){
    console.log = function(str){
        document.write("<div>"+str+"</div>");
    };
    var Base = global.Base = function(){
        this.swapCount = 0;
    };
    Base.prototype.oneTest = function(n,showArray){
        var arr = [];
        for(var i=0;i<n;i++){
            arr.push(parseInt(n*Math.random(),10));
        }
        if(showArray){
            console.log("origin Array is: "+arr);
        }
        this.swapCount = 0;
        var res = this.sort(arr);
        console.log("数组大小:"+n);
        console.log("实际总交换次数:"+this.swapCount);
        console.log("实际平均交换次数:"+this.swapCount/n);
        if(showArray){
            console.log("Array is: "+res);
        }
        return this.swapCount;
    };
    Base.prototype.test = function(n,showArray){
        showArray = showArray || false;
        var startTime = new Date();
        var allCount = 1;
        for(var i=0;i<allCount;i++){
            //var n = parseInt(1000*Math.random(),10);
            //var n = 100000;
            this.oneTest(n,showArray);
        }
        var endTime = new Date();
        console.log("time spent "+(endTime.valueOf()-startTime.valueOf()));
    };
    Base.prototype.swap = function(x,y){
        this.swapCount++;
        var temp = this.arr[x];
        this.arr[x] = this.arr[y];
        this.arr[y] = temp;
    };
})(window);
