/**
 * brief 小工具类
 *
 * @param 
 */
define(function(require) {
	var exports = {};
    /**
     * brief 复制对象属性
     *
     * @param from 从这复制
     * @param to 复制到这
     * @param without 哪些属性不复制
     *
     * @return 
     */
	exports.copy = function(from, to, without) {
		var withoutArr = [];
		if (Object.prototype.toString.call(without) !== "[object Array]") {
			withoutArr.push(without);
		} else {
			withoutArr = without;
		}
		for (var i in from) {
			if ((from.hasOwnProperty && from.hasOwnProperty(i)) || (!from.hasOwnProperty)) {
				if (! (i in withoutArr)) {
					to[i] = from[i];
				}
			}
		}
	};
    /**
     * brief 为元素增加class
     *
     * @param el
     * @param className
     *
     * @return 
     */
    exports.addClass = function(el, className) {
        var regex = new RegExp(className);
        var elClassName = el.className;
        if(regex.test(elClassName)) {
            return;
        } else {
            elClassName += (" " + className);
        }
        el.className = elClassName
            .replace(/^\s+|\s+&/,"")
            .replace(/\s+/," ");
    };
    /**
     * brief 删除class
     *
     * @param el
     * @param className
     *
     * @return 
     */
    exports.removeClass = function(el, className) {
        var regex = new RegExp(className);
        el.className = el.className
            .replace(regex,"")
            .replace(/\s+/," ");
    };
    return exports;
});

