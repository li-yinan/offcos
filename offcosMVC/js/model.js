/**
 * @file controller.js
 * @brief 一个小的mvc框架，实现了简单的业务拆分
 * @author liyinan
 * @version 1.0
 * @date 2013-08-02
 */
define(function(require) {
    var Trigger = require("./trigger");
    var trigger = Trigger.getTrigger("offcos");

	/**
     * brief model
     *
     * @param options 初始化配置项，schema为数据模型
     *
     * @return 
     */
	var Model = function(options) {
		options = options || {};
		this.schema = options.schema || {};
		this.recCount = 0;
		this.records = {};
	};
	Model.prototype = {
		/**
         * brief 获取数据内部id
         *
         * @return 内部id号
         */
		getId: function() {
			var count = this.recCount++;
			return "id" + count;
		},
		/**
         * brief 创建一条数据
         *
         * @param data 数据对象
         *
         * @return 
         */
		create: function(data) {
            data = data || {};
			var record = {};
			var id = this.getId();
			for (var i in this.schema) {
				if (this.schema.hasOwnProperty(i)) {
					if (typeof data[i] !== "undefined") {
						record[i] = data[i];
					} else {
                        //数据项为空的时候使用schema中的默认值
						record[i] = this.schema[i];
                    }
				}
			}
			this.records[id] = record;
            trigger.emit("create",id);
			return id;
		},

		/**
         * brief 删除一条记录
         *
         * @param id
         *
         * @return 被删除的记录
         */
		del: function(id) {
			//this.records[id] = undefined;
            trigger.emit("delete",id);
			delete this.records[id];
		},
		/**
         * brief 更新一条记录
         *
         * @param id 需要更新的数据id
         * @param data 新数据对象
         *
         * @return 修改后的数据对象
         */
		update: function(id, data) {
			var record = this.read(id);
			for (var i in data) {
				if (data.hasOwnProperty(i)) {
					if (i in this.schema) {
						record[i] = data[i];
					}
				}
			}
			this.records[id] = record;
            trigger.emit("update",record);
			return record;
		},
		/**
         * brief 查询一条记录
         *
         * @param id 记录id
         *
         * @return 数据对象
         */
		read: function(id) {
			if (!this.records[id]) {
				return;
			}
			var record = {};
			for (var i in this.records[id]) {
				if (this.schema.hasOwnProperty(i)) {
					record[i] = this.records[id][i];
				}
			}
			return record;
		},
		/**
         * brief 读取全部记录
         *
         * @return 
         */
		all: function() {
			var list = [];
			for (var i in this.records) {
				if (this.records.hasOwnProperty(i)) {
					list.push(this.read(i));
				}
			}
			return list;
		},
		/**
              * brief 为数据添加序号
              *
              * @param data {Array} 数据列表
              *
              * @return 
              */
		fillOrder: function(data) {
			var count = 1;
			if (Object.prototype.toString.call(data) === "[object Array]") {
				for (var i = 0; i < data.length; i++) {
					data[i]._order = count++;
				}
			} else {
				data._order = count;
			}
			return data;
		},
		sort: function(data, attr) {
			if (Object.prototype.toString.call(data) === "[object Array]") {
				data = data.sort(function(a, b) {
					return a[attr] > b[attr];
				});
			}
			return data;
		},
		/**
         * brief 按照指定属性查找记录
         *
         * @param attr 按照此属性进行查找
         * @param value 找到与此值相等的记录
         *
         * @return 记录数据
         */
		findByAttr: function(attr, value) {
			var res = [];
			for (var i in this.records) {
				if (this.records.hasOwnProperty(i)) {
					if (this.records[i][attr] === value) {
						res.push(this.read(i));
					}
				}
			}
			return res;
		},
		/**
         * brief 删除所有记录
         *
         * @param attr
         *
         * @return 
         */
		clear: function(attr) {
			this.records = {};
            trigger.emit("clear");
		}
	};
	return Model;
});

