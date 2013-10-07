(function(){
    /**
     *顶点id，自增
     */
    var vertexId = 0;
    /**
     *图的顶点
     *
     */
    var Vertex = function() {
        this.edges = [];
        this.vid = vertexId++;
    };
    /**
     *符号表集合
     *
     */
    var sym = {};

    /**
     *图的边
     *@param symbol 转移符号
     *@param from 起始点
     *@param to 中止点
     *
     */
    var Edge = function(symbol, from, to) {
        this.symbol = symbol;
        //记录所有使用过的符号;
        if(symbol&&sym[symbol]!==true) {
            sym[symbol] = true;
        }
        this.from = from;
        this.to = to;
    };

    Vertex.prototype = {
        addEdge: function(edge) {
            this.edges.push(edge);
        },
        getEdges: function() {
            return this.edges;
        }
        
    };

    /**
     *非确定有限自动机
     *@param regex 待识别的正则表达式
     *
     */
    var NFA = function(regex) {
        this.regexStr = regex||"".toString();
    };

    NFA.prototype = {

        /**
         *非确定有限自动机的ε构造方法
         *
         */
        epsilon: function() {
            var start = new Vertex();
            var end = new Vertex();
            start.addEdge(new Edge(null,start,end));
            return {start: start,end: end};
        }, 

        /**
         *非确定有限自动机的普通构造方法
         *@param symbol 转移符号
         */
        normal: function(symbol) {
            var start = new Vertex();
            var end = new Vertex();
            start.addEdge(new Edge(symbol,start,end));
            return {start: start,end: end};
        },

        /**
         *非确定有限自动机的a/b/c构造方法
         *@param subNfaArray 子状态机列表
         */
        or: function(subNfaArray) {
            var start = new Vertex();
            var end = new Vertex();
            for(var i=0;i<subNfaArray.length;i++) {
                start.addEdge(new Edge(null, start, subNfaArray[i].start));
                subNfaArray[i].end.addEdge(new Edge(null, subNfaArray[i].end, end));
            }
            return {start: start,end: end};
        },
        /**
         *非确定有限自动机的abc构造方法
         *@param subNfaArray 子状态机列表
         *
         */
        and: function(subNfaArray) {
            var start = new Vertex();
            var end = new Vertex();
            start.addEdge(new Edge(null,start,subNfaArray[0].start));
            for(var i=0;i<subNfaArray.length-1;i++) {
                subNfaArray[i]
                    .end
                    .addEdge(
                            new Edge(
                                null,
                                subNfaArray[i].end,
                                subNfaArray[i+1].start
                                )
                            );
            }
            var index = subNfaArray.length-1;
            subNfaArray[index]
                .end
                .addEdge(
                        new Edge(
                            null,
                            subNfaArray[index].end,
                            end
                            )
                        );
            return {start: start,end: end};
        },

        /**
         *非确定有限自动机的(xxx)*构造方法
         *@param subNfa 子状态机
         *
         */
        star: function(subNfa) {
            var start = new Vertex();
            var end = new Vertex();
            start.addEdge(new Edge(null,start,end));
            start.addEdge(new Edge(null,start,subNfa.start));
            subNfa.end.addEdge(new Edge(null,subNfa.end,subNfa.start));
            subNfa.end.addEdge(new Edge(null,subNfa.end,end));
            return {start: start,end: end};
        },

        /**
         *非确定有限自动机的(xxx)+构造方法
         *@param subNfa 子状态机
         *
         */
        plus: function(subNfa){
            var start = new Vertex();
            var end = new Vertex();
            start.addEdge(new Edge(null,start,subNfa.start));
            subNfa.end.addEdge(new Edge(null,subNfa.end,subNfa.start));
            subNfa.end.addEdge(new Edge(null,subNfa.end,end));
            return {start: start,end: end};
        },

        /**
         *非确定有限自动机的(xxx)?构造方法
         *@param subNfa 子状态机
         *
         */
        question: function(subNfa){
            var start = new Vertex();
            var end = new Vertex();
            start.addEdge(new Edge(null,start,subNfa.start));
            subNfa.end.addEdge(new Edge(null,subNfa.end,end));
            return {start: start,end: end};
        },

        /**
         *计算nfa的ε-closure
         *@param nfaArray 状态机集合
         *
         */
        closure: function(nfaArray) {
            var stack = [];
            if(Object.prototype.toString.call(nfaArray)==="[object Array]"){
                stack = nfaArray;
            }else{
                stack.push(nfaArray);
            }
            var res = {};
            while(stack.length>0) {
                //
                //去除栈顶元素
                var T = stack.shift();
                //先将自己加入closure结果中
                res[T.vid] = T;
                //计算空转移
                var vertexes = this.move(T,null);
                for(var i=0;i<vertexes.length;i++) {
                    if(!res[vertexes[i].vid]) {
                        //当前节点是空转移，并且不在堆栈中
                        //就把当前节点压入堆栈
                        stack.push(vertexes[i]);
                        //并且记录当前节点的序号
                        res[vertexes[i].vid] = vertexes[i];
                    }
                }
            }
            var arr = [];
            for(var key in res) {
                if(res.hasOwnProperty(key)) {
                    arr.push(res[key]);
                }
            }
            return arr.sort(function(a,b){return a.vid-b.vid;});
        },

        /**
         *nfa的状态转移函数
         *@param nfa 状态机的状态
         *@param symbol 转移符号
         *
         */
        move: function(nfa, symbol) {
            var nfaArray = [];
            var res = [];
            if(Object.prototype.toString.call(nfa)==="[object Array]"){
                nfaArray = nfa;
            }else{
                nfaArray.push(nfa);
            }
            for(var i=0;i<nfaArray.length;i++){
                var edges = nfaArray[i].edges;
                for(var j=0;j<edges.length;j++) {
                    if(edges[j].symbol === symbol){
                        res.push(edges[j].to);
                    }
                }
            }
            var distinct = {};
            var temp = [];
            for(i=0;i<res.length;i++){
                if(distinct[res[i].vid]!==true){
                    distinct[res[i].vid] = true;
                    temp.push(res[i]);
                }
            }
            return temp;
        },
        /**
         *计算一个dfa的hashcode
         *
         */
        dfaHash: function(nfaArray) {
            var res = [];
            for(var i=0;i<nfaArray.length;i++){
                res.push(nfaArray[i].vid);
            }
            return res.join("");
        },

        /**
         *获取dfa的转移矩阵
         *
         */
        getDfaMatrix: function(nfaStart) {
            var s0 = this.closure(nfaStart);
            var stack = [];
            stack.push(s0);
            var dState = {};
            var startHash = this.dfaHash(s0);
            dState[startHash] = {};
            dState.start = dState[startHash];
            while(stack.length>0){
                var state = stack.shift();
                var stateHash = this.dfaHash(state);
                for(var symbol in sym){
                    var u = this.closure(this.move(state,symbol));
                    var uHash = this.dfaHash(u);
                    if(!dState[uHash]){
                        stack.push(u);
                        dState[uHash] = {};
                        dState.end = dState[uHash];
                    }
                    dState[stateHash][symbol] = dState[uHash];
                }
            }
            return dState;
        },
        test: function(matrix,str) {
            var strArray = str.split("");
            var cur = matrix.start;
            for(var i=0;i<strArray.length;i++) {
                if(cur) {
                    cur = cur[strArray[i]];
                }else{
                    console.log("dismatch!!!");
                    return;
                }
            }
            if(cur === matrix.end) {
                console.log("match!");
            }else{
                console.log("dismatch!");
            }
        }
    };
    //var nfa = new NFA("(a|b)*abb");
    var nfa = new NFA();
    //(a|b|c)*abc
    var a = nfa.and([
            nfa.star(
                nfa.or([
                    nfa.normal("a"),
                    nfa.normal("b"),
                    nfa.normal("c")
                    ])
                ),
            nfa.normal("a"),
            nfa.normal("b"),
            nfa.normal("c")
            ]);
    //console.log(nfa.closure(a.start));
    var matrixa = nfa.getDfaMatrix(a.start);
    //console.log(matrixa);
    nfa.test(matrixa,"acbcabbabc");
})();
