var fs = require('fs');
var async = require('async');
var Mysql = require('../includes/db_connection.js').Mysql;
var User = {
	login:function(username,password,callback){
		
		Mysql.getAll('platform_admin_user',{
			email:username,
			password:password
		},function(d){
			if(d){
			   d = d[0];
			}
			callback(d);
		});
	},
	getPassword:function(username,callback){
	    Mysql.getAll('platform_admin_user',{
			email:username
		},function(d){
			if(d){
			   d = d[0];
			}
			callback(d);
		});
	},

	changePassword:function(uid,token,oldpassword,newpassword,callback){
		User.getPassword(uid,function(d){
		  if(d){
			 var hash = require('crypto').createHash('md5');
		     var _token = hash.update('mes_platform'+uid+oldpassword).digest('hex').toUpperCase();
			 if(_token == token){
			    Mysql.query('update platform_admin_user set password='+newpassword+' where email = "'+uid+'"',function(d){
					callback(true);
				});
			 }else{
				callback(false);
			 }
		  }else{
		     callback(false);
		  }
		});

	}
}

exports.User = User;