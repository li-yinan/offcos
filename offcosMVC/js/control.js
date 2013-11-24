/**
 * @file controller.js
 * @brief 一个小的mvc框架，实现了简单的业务拆分
 * @author liyinan
 * @version 1.0
 * @date 2013-08-02
 */
define(function(require) {
	var util = require("./util");

	/**
     * brief 控制器
     *
     * @return 
     */
	var Controller = function() {
        var i=0;
        //解析tagName，生成根元素
        //this.tagName是这样的"div.className1.className2"
        var name = (this.tagName || "")
            .replace(/\s+/,"").split(".");
        this.el = document.createElement(name[0] || "div");
        for(i=1;i<name.length;i++) {
            util.addClass(this.el,name[i]);
        }
        //代理事件
		for (i in this.event) {
			if (this.event.hasOwnProperty(i)) {
				var eventName = i.split(" ")[0];
				var className = i.split(" ")[1];
				this.delegate(this.el, eventName, className, this[this.event[i]]);
			}
		}
        //最后渲染
		this.render();
	};

	Controller.prototype = {
		/**
         * brief 事件代理
         *
         * @param el 代理的根元素
         * @param eventName 事件名字
         * @param className 被代理的元素class
         * @param callback 事件回调
         *
         * @return 
         */
		delegate: function(el, eventName, className, callback) {
			var _this = this;
			var cb = function(e) {
				e = e || window.event;
				var target = e.srcElement || e.target;
				var reg = new RegExp(className);
				if (reg.test(target.className)) {
					callback.call(_this, e);
				}
			};
			//对blur和focus这种不冒泡事件特殊处理
			if (eventName === "blur") {
				if (el.addEventListener) {
					//利用事件捕捉
					el.addEventListener("blur", cb, true);
				} else if (el.attachEvent) {
					el.attachEvent("onfocusout", cb);
				}
				return;
			} else if (eventName === "focus") {
				if (el.addEventListener) {
					el.addEventListener("focus", cb, true);
				} else if (el.attachEvent) {
					el.attachEvent("onfocusin", cb);
				}
				return;
			}
			if (el.addEventListener) {
				el.addEventListener(eventName, cb, false);
			} else if (el.attachEvent) {
				el.attachEvent("on" + eventName, cb);
			}
		},
		destroy: function() {
			if (this.el.parentNode) {
				this.el.parentNode.removeChild(this.el);
			}
		},
		render: function() {}
	};
	return Controller;
});

