var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var app = express();
var session = require('express-session');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded())

// parse application/json
app.use(bodyParser.json())

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))
app.set('port', process.env.PORT || 5001);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(cookieParser('mescakeplatform'));
app.use(session({
    secret: 'mescakeplatform',
	proxy: false // if you do SSL outside of node.
}));

app.use(compression({
 threshold: 1024
}));

var authorize = function(req, res, next){
	if (req.cookies.platformToken && req.cookies.uuid) {
	    var user = require('./lib/user').User;
		var uuid = req.cookies.uuid;
		var hash = require('crypto').createHash('md5');
		user.getPassword(uuid,function(d){
		  if(d){
		     var token = hash.update('mes_platform'+uuid+d.password).digest('hex').toUpperCase();
			 if(token == req.cookies.platformToken){
			    next&&next();
			 }else{
				res.redirect('/login');
			 }
		  }else{
		     res.redirect('/login');
		  }
		});
       
    }else{
		res.redirect('/login');
	}
    
}

var sys = require('sys');
var RES_SUCCESS = 0;
var RES_FAIL = 1;

var STATIC_DOMAIN = 'http://s1.static.mescake.com/';
var STATIC_DOMAIN = 'http://10.237.113.51/';
var Res = {
	ajax:function(res,d){
		res.send(d);
	},
	page:function(res,d){
		var d = d||{};
		d.STATIC_DOMAIN = STATIC_DOMAIN;
		res.render(d.view,d);
	}
}
app.get('/',authorize,function(req,res){
	 var data = fs.readFileSync('config.json','utf-8');
	 Res.page(res,{
			view:'main',
			data:data
	 });
	 
});

app.get('/login',function(req,res){
	 Res.page(res,{
			view:'login'
	 });
});

app.post('/doLogin',function(req,res){
	var user = require('./lib/user').User;
	var username = req.body.username||'';
	var password = req.body.password||'';
	
	if(!username||!password){
	   res.send({code:RES_FAIL});
	   return;
	}

	user.login(username,password,function(d){
		if(d){
			var email = d.email;
			var password = d.password;
			var crypto = require('crypto');
			var shasum = crypto.createHash('md5');
			var token = shasum.update('mes_platform'+email+password).digest('hex').toUpperCase();
			res.cookie('platformToken', token, { expires: new Date(Date.now() + 3600*1000), httpOnly: true });
		    res.cookie('uuid', email, { expires: new Date(Date.now() + 3600*1000), httpOnly: true });
			res.send({code:RES_SUCCESS});
		}else{
			res.send({code:RES_FAIL});
		}
	});
});


var server = http.createServer(app);
server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

