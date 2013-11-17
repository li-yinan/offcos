(function(global){
    var MergeSort = global.MergeSort = extend(Base); 
    MergeSort.prototype.sort = function(arr){
        this.arr = arr;
        this.tempArray = [];
        this.doSort(0, arr.length);
        return this.arr;
    };
    MergeSort.prototype.doSort = function(left,right){
        if(left<right){
            var center = parseInt((left+right)/2,10);
            this.doSort(left, center);
            this.doSort(center+1, right);
            this.merge(left,center+1,right);
        }
    };
    MergeSort.prototype.merge = function(left,center,right){
        var leftStart = left;
        var leftEnd = center-1;
        var rightStart = center;
        var rightEnd = right;
        var tempStart = left;
        var numElements = rightEnd-leftStart+1;
        while(leftStart<=leftEnd && rightStart<=rightEnd){
            if(this.arr[leftStart]<this.arr[rightStart]){
                this.tempArray[tempStart++] = this.arr[leftStart++];
            }else{
                this.tempArray[tempStart++] = this.arr[rightStart++];
            }
        }
        while(leftStart<=leftEnd){
            this.tempArray[tempStart++] = this.arr[leftStart++];
        }
        while(rightStart<=rightEnd){
                this.tempArray[tempStart++] = this.arr[rightStart++];
        }
        for(var i=0;i<numElements;i++,rightEnd--){
            this.arr[rightEnd] = this.tempArray[rightEnd];
        }
    };
})(window);
