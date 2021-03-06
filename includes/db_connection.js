var dbName = 'mescake';
var password = '';
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password:password,
  database:dbName
});
function handleError (err) {
  if (err) {
    // 如果是连接断开，自动重新连接
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      connection = mysql.createConnection({
		  host     : 'localhost',
		  user     : 'root',
		  password:password,
		  database:dbName
		});
	   connection.on('error', handleError);
    } else {
      console.error(err.stack || err);
    }
  }
}
connection.on('error', handleError);
var Mysql = {
	connect:function(){
		return connection.connect();
	},
	close:function(){
		return connection.close();
	},
	query:function(sql,callback,error){
		//var _c = Mysql.connect();
		connection.query(sql, function(err, rows, fields) {
		  if (err) {
			  throw err;
		  }
		  callback(rows,fields);
		});
	},
	
	//m.getOne('ecs_users',{user_id:2},function(d){
	//console.log(d);
	//});
	getOne:function(table,condition,callback){
	  
	  var sql = 'SELECT * FROM {TABLE} WHERE {CONDITION} LIMIT 0,1';
	  var con = [];
	  for(var c in condition){
		  con.push(c+'='+condition[c]);
	  }
	  con = con.join(' AND ');
	  sql = sql.replace('{TABLE}',table);
	  sql = sql.replace('{CONDITION}',con);

	  this.query(sql,function(rows,fields){
		callback(rows[0]);
	  });
	},

	getAll:function(table,condition,callback,order){
	  var sql = 'SELECT * FROM {TABLE} WHERE {CONDITION}';
	  var con = [];
	  var order = order||'';
	  for(var c in condition){
		  con.push(c+'="'+condition[c]+'"');
	  }
	  con = con.join(' AND ');
	  sql = sql.replace('{TABLE}',table);
	  sql = sql.replace('{CONDITION}',con);
	  sql+=order;
	  console.log(sql);
	  this.query(sql,function(rows,fields){
		callback(rows);
	  });
	}

}
exports.Mysql = Mysql;
