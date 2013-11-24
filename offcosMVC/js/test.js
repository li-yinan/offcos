/**
 * @file test.js
 * brief 测试文件
 * @author liyinan
 * @version 1.0
 * @date 2013-11-24
 */
define(function(require) {
	//对继承的验证
	var inherit = require("./inherit");
	var A = function() {
		console.log("a");
	};
	A.prototype.sayHello = function(str) {
		console.log("sayHelloA" + str);
	};
	var B = function() {
		console.log("b");
	};
	B.prototype.sayHello = function(str) {
		console.log("sayHelloB" + str);
	};
	var C = inherit(B, A);
	var c = new C();

	//对model的验证
	var Model = require("./model");
	var model = new Model({
		schema: {
			name: "lyn",
			code: "js"
		}
	});
	var id1 = model.create({
		name: "qhx",
		sex: "female",
		code: "js"
	});
	var id2 = model.create({
		name: "lyn",
		sex: "male",
		code: "js"
	});
	var all = model.all();
	console.log(JSON.stringify(all));
	var sortedAll = model.sort(all, "name");
	console.log(JSON.stringify(sortedAll));
	var filledAll = model.fillOrder(sortedAll);
	console.log(JSON.stringify(filledAll));
	var res = model.findByAttr("name", "lyn");
	console.log(JSON.stringify(res));

	//对control的验证
	var Control = require("./control");
	var MyControl = function() {};
	MyControl.prototype = {
		tagName: "div.ok.error.login",
		event: {
			"click ok": "click"
		},
		click: function() {
			console.log("click");
		},
		render: function() {
			document.body.appendChild(this.el);
		}
	};
	MyControl.prototype.constructor = MyControl;
	MyControl = inherit(MyControl, Control);
	var control = new MyControl();

    //对trigger的验证
    var Trigger = require("./trigger");
    var trigger1 = Trigger.getTrigger("hello1");
    trigger1.subscribe("sayHello",function(data){
        console.log(data);
    });
    trigger1.emit("sayHello","hello1");

    var trigger2 = Trigger.getTrigger("hello2");
    trigger2.subscribe("sayHello",function(data){
        console.log(data);
    });
    trigger2.emit("sayHello","hello2");

    //在model中增加了增删改的trigger，属于offcos作用于下
    var offcosTrigger = Trigger.getTrigger("offcos");
    offcosTrigger.subscribe("delete",function(data){
        console.log("delete");
        console.log(data);
    });
    offcosTrigger.subscribe("create",function(data){
        console.log("create");
        console.log(data);
    });
    offcosTrigger.subscribe("update",function(data){
        console.log("update");
        console.log(data);
    });
    model.create({
        name:"other"
    });
    model.del(id1);
});
