/**
 * @file listContainer.js
 * brief 列表容器
 * @author liyinan
 * @version 1.0
 * @date 2013-11-24
 */
define(function(require) {
	var inherit = require("./inherit");
    var Control = require("./control");
    var Trigger = require("./trigger");

    var trigger = Trigger.getTrigger("offcos");

    /**
     * brief 列表容器类
     *
     * @return 
     */
    var ListContainer = function() {
        trigger.subscribe("moveUp", this.moveUp);
        trigger.subscribe("moveDown", this.moveDown);
    };
    ListContainer.prototype = {
        tagName:"ul.list-container",
        /**
         * brief 向上移动
         *
         * @param order 待移动元素的位置
         *
         * @return 
         */
        moveUp: function(order) {
            throw("moveUp function should be override!!!");
        },
        /**
         * brief 向下移动
         *
         * @param order 待移动元素的位置
         *
         * @return 
         */
        moveDown: function(order) {
            throw("moveDown function should be override!!!");
        },
        /**
         * brief 渲染列表容器
         *
         * @return 
         */
        render: function() {
        }
    };
    ListContainer.prototype.constructor = ListContainer;
    return inherit(ListContainer, Control);
});
