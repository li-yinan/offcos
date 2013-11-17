(function(global){
    window.console.log = function(text){
        var el = document.createElement("div");
        el.innerHTML = text;
        document.body.appendChild(el);
    };
    var symbol = {
        NUM:1,
        ADD:2,
        SUB:3,
        MUL:4,
        DIV:5,
        EQ:6,
        start:-1,
        statement:-2,
        end:-3
    };

    var Lexer = window.Lexer = function(input){
        this.tokenList = [];
        this.pos = -1;
        this.input = input.split("");
        this.consume();
    };

    Lexer.prototype.consume = function(){
        this.pos++;
        if(this.pos>=this.input.length){
            this.cur = null;
        }else{
            this.cur = this.input[this.pos];
            console.log("consume"+this.cur);
        }
    };

    Lexer.prototype.match = function(ch){
        if(this.cur===ch){
            this.consume();
        }else{
            throw "expect " + this.cur + " but found " + ch;
        }
    };

    Lexer.prototype.nextToken = function(){
        while(this.cur){
            switch(this.cur){
                case "+":
                    this.consume();
                    return {text:this.cur,type:symbol.ADD};
                case "-":
                    this.consume();
                    return {text:this.cur,type:symbol.SUB};
                case "*":
                    this.consume();
                    return {text:this.cur,type:symbol.MUL};
                case "/":
                    this.consume();
                    return {text:this.cur,type:symbol.DIV};
                default:
                     if(/\d/.test(this.cur)){
                         var num = "";
                         do{
                             num += this.cur;
                             this.consume();
                         }while(/\d/.test(this.cur));
                         return {text:num,type:symbol.num};
                     }
            }
        }
    };
    Lexer.prototype.match = function(ch){
        if(this.cur===ch){
            this.consume();
            return true;
        }else{
            return false;
        }
    };
    Lexer.prototype.calToken = function(){
        while(this.cur){
            switch(this.cur){
                case "+":
                    this.tokenList.push({text:this.cur,type:symbol.ADD});
                    break;
                case "-":
                    this.tokenList.push({text:this.cur,type:symbol.SUB});
                    break;
                case "*":
                    this.tokenList.push({text:this.cur,type:symbol.MUL});
                    break;
                case "/":
                    this.tokenList.push({text:this.cur,type:symbol.DIV});
                    break;
                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                    var num = "";
                    do{
                        num += this.cur;
                        this.consume();
                    }while(/\d/.test(this.cur));
                    return {text:num,type:symbol.num};
            }
        }
    };

    Lexer.prototype.lookAhead = function(k){
        if(this.pos+k<this.input.length){
            return this.input[this.pos+k];
        }else{
            return -1;
        }
    };

    Lexer.prototype.setInput = function(input){
        this.pos = 0;
        this.input = input.split("");
    };

    var Parser = function(lexer){
        this.lexer = lexer;
    };

    Parser.prototype.match = function(type){
        if(this.cur.type === type){
            var text = this.cur.text;
            this.cur = this.lexer.nextToken();
            return text;
        }else{
            throw "expecting " + type + "found" + this.cur.type;
        }
    };

    Parser.prototype.parse = function(){
        this.cur = this.lexer.nextToken();
        var lookAhead = this.lexer.lookAhead(1);
        switch(lookAhead.type){
            case symbol.ADD:this.add();break;
            case symbol.SUB:this.sub();break;
            case symbol.MUL:this.mul();break;
            case symbol.DIV:this.div();break;
        }
    };

    Parser.prototype.add = function(){
        var num1 = this.match(symbol.number);
        this.match(symbol.ADD);
        var num2 = this.match(symbol.number);
        console.log(this.lexer.input.join(""));
        console.log(parseInt(num1,10)+parseInt(num2,10));
    };

    Parser.prototype.sub = function(){
        var num1 = this.match(symbol.number);
        this.match(symbol.SUB);
        var num2 = this.match(symbol.number);
        console.log(this.lexer.input.join(""));
        console.log(parseInt(num1,10)-parseInt(num2,10));
    };

    Parser.prototype.mul = function(){
        var num1 = this.match(symbol.number);
        this.match(symbol.MUL);
        var num2 = this.match(symbol.number);
        console.log(this.lexer.input.join(""));
        console.log(parseInt(num1,10)*parseInt(num2,10));
    };

    Parser.prototype.div = function(){
        var num1 = this.match(symbol.number);
        this.match(symbol.DIV);
        var num2 = this.match(symbol.number);
        console.log(this.lexer.input.join(""));
        console.log(parseInt(num1,10)/parseInt(num2,10));
    };

    window.onload = function(){
        var str = "11+24=";
        var lex = new Lexer(str);
        var parser = new Parser(lex);
        parser.parse();
        //lex.setInput("23-3=");
        //parser.parse();
        //lex.setInput("32*4=");
        //parser.parse();
        //lex.setInput("40/5=");
        //parser.parse();
    }
})(window);
