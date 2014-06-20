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
	}
}

exports.User = User;