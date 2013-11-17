(function(global){
    var HeapSort = global.HeapSort = extend(Base); 
    HeapSort.prototype.sort = function(arr){
        this.swapCount = 0;
        this.arr = arr;
        this.heapSize = arr.length;
        this.build();
        this.doSort();
        this.arr.shift();
        return this.arr;
    };
    HeapSort.prototype.doSort = function(){
        //move the largest to the end of list
        for(var i=this.arr.length-1;i>0;i--){
            this.swap(1,i);
            this.heapSize--;
            this.heapify(1);
        }
    };
    HeapSort.prototype.build = function(){
        //first place is useless;
        this.arr.unshift(null);
        //from the bottom to top
        for(var i=parseInt(this.heapSize/2,10);i>0;i--){
            this.heapify(i);
        }
    };
    HeapSort.prototype.left = function(i){
        return i*2 <= this.heapSize ? i*2 : 0;
    };
    HeapSort.prototype.right = function(i){
        return i*2+1 <= this.heapSize ? i*2+1 : 0;
    };
    HeapSort.prototype.heapify = function(i){
        //l is the left side childNode
        var l = this.left(i);
        //r is the right side childNode
        var r = this.right(i);
        var largest = 0;

        //find the index of largest Node
        if(l && this.arr[l]>this.arr[i]){
            largest = l;
        }else{
            largest = i;
        }
        if(r && this.arr[r]>this.arr[largest]){
            largest = r;
        }
        //if the parentNode is not the largest,
        //swap parentNode with the largest one,
        //then recursive the largest one
        if(i!==largest){
            this.swap(i,largest);
            this.heapify(largest);
        }
    };
})(window);
