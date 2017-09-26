/**
 * mysql 数据库操作类
 * auto：lovefc
 * time：2017/09/22 16:12
 */
const async = require('async');

const mysql = require('mysql');

const fs    = require('fs');

module.exports = (function() {
    this.configName = 'default';

    this.configArray = [];

    this.obj = [];

    this.task = new Array();
	
    //判断是不是一个数组
    this.isArray = function(o) {
        return Object.prototype.toString.call(o) == '[object Array]';
    },
	//添加一个sql操作任务
    this.add = function(taskname, sql, params, callback) {
        var arr = new Array();
        arr['sql'] = sql;
        arr['params'] = params;
        arr['callback'] = callback;
        this.task[taskname] = arr;
        return this;
    };
	
    //运行任务
    this.run = function(taskname) {
        if (typeof taskname != "null") {
            var tasks = new Array();
            var i = 0;
            for (var key in this.task) {
                tasks[i] = key;
				++i;
            }
        } else {
            if (this.isArray(taskname)) var tasks = taskname;
            else var tasks = [taskname];
        }
        async.mapSeries(tasks,
        function(item, cb) {
            cb(null, this.obj[this.configName].query(this.task[item]['sql'], this.task[item]['params'], this.task[item]['callback']));
        });
    };

    //读取一个配置文件
    this.config = function(file) {
        var data = fs.readFileSync(file, "utf-8");
        var config = JSON.parse(data.toString());
        this.configArray = config;
    },

    //获取不同的配置
    this.getConfig = function(configname) {
        this.configName = configname;
        return this;
    };
	
    //初始化运行
    this.init = function() {
        var config = this.configArray[this.configName];
        var connection = mysql.createConnection({
            host: config.host,
            charset: typeof config.charset == "null" ? "UTF8_GENERAL_CI": config.charset,
            user: config.user,
            password: config.password,
            database: config.database,
            port: typeof config.port == "null" ? 3306 : config.port,
            connectTimeout: typeof config.timeou == "null" ? 0 : config.timeou,
        });
        connection.connect();
        this.obj[this.configName] = connection;
        return this;
    };
	
    return this;
})();