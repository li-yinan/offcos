/**
 * @file trigger.js
 * brief trigger
 * @author liyinan
 * @version 1.0
 * @date 2013-11-24
 */
define(function(require) {
	//把trigger挂在window上
	window.offcosTriggers = window.offcosTriggers || {};
	/**
     * brief 消息触发器
     *
     * @return 
     */
	var Trigger = function() {
		this.eventSet = {};
	};
	Trigger.prototype = {
		/**
         * brief 订阅消息
         *
         * @return 
         */
		subscribe: function(name, func) {
            this.eventSet[name] = this.eventSet[name] || [];
            this.eventSet[name].push(func);
        },
		/**
         * brief 触发消息
         *
         * @return 
         */
		emit: function(name,data) {
            var eventList = this.eventSet[name] || [];
            for(var i=0;i<eventList.length;i++) {
                eventList[i].call(null,data);
            }
        },
	};
	Trigger.prototype.constructor = Trigger;

	return {
		getTrigger: function(triggerName) {
			if (!window.offcosTriggers[triggerName]) {
				window.offcosTriggers[triggerName] = new Trigger();
			}
			return window.offcosTriggers[triggerName];
		}
	};
});

