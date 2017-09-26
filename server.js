var ezmsq = require('./ezmsq');

//打开配置文件
ezmsq.config('db.json');
//链接初始化
var  con = ezmsq.init();//可以指定在db.json里面的配置 示例：ezmsq.getConfig('default2').init();


//执行的sql语句，预处理形式,防止注入
var sql ='SELECT * FROM product_detect where product_itemid = ? ';
//值
var params = ['OGTBY141223022017'];
//回调函数
var callback = function(err,res){
	var arr='';
	for(var i in res){
        arr += res[i]['product_itemid']+',';
    }
	console.log('1:'+arr);
};


var params2 = ['CTP1706190929231'];
var callback2 = function(err,res){
	var arr='';
	for(var i in res){
        arr += res[i]['product_itemid']+',';
    }
	console.log('2:'+arr);
};


con.add('demo',sql,params,callback);//添加一个sql操作

con.add('demo2',sql,params2,callback2);//添加一个sql操作

//执行同步操作，参数指定一个任务名或者多个任务名(数组),为空依次执行所有添加的sql

con.run();//例如：con.run('demo'),只会执行名为demo的sql操作



