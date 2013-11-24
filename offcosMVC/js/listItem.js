/**
 * @file listItem.js
 * brief 列表元素类
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
     * brief 列表元素
     *
     * @return 
     */
    var ListItem = function() {
    };
    ListItem.prototype = {
        tagName:"li.list-item",
        event: {
            "click moveUp":"moveUp",
            "click moveDown":"moveDown",
            "click del":"destroy"
        },
        /**
         * brief 向上移动
         *
         * @param order 待移动元素的位置
         *
         * @return 
         */
        moveUp: function() {
            trigger.emit("moveUp",this.order);
        },
        /**
         * brief 向下移动
         *
         * @param order 待移动元素的位置
         *
         * @return 
         */
        moveDown: function() {
            trigger.emit("moveDown",this.order);
        },
        /**
         * brief 渲染列表容器
         *
         * @return 
         */
        render: function() {
        }
    };
    ListItem.prototype.constructor = ListItem;
    return inherit(ListItem, Control);
});
