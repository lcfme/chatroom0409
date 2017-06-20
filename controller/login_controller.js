const formidable = require('formidable');
const login_db_manipulate = require('../models/login_db_manipulate');

// 呈递登录页面
module.exports.render_view = function(req, res) {
	res.render('login.ejs');
}

// 登录
module.exports.doLogin = function(req, res, next) {
	var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
 		if (err) {
 			res.send("0");
 			return;
 		}

 		var user = {
 			user_id: fields.user_id,
 			user_password: fields.user_password,
 		};

 		login_db_manipulate.getUserById(user.user_id, function(err) {
 			if (err) {
 				res.send("0");
 				return;
 			}
 			var result = this;
 			if (!result instanceof Array || result.length === 0) {
 				res.send("0");
 				return;
 			}
 			if (result[0].user_password != user.user_password) {
 				res.send("0");
 				return;
 			}
 			req.session.isloggedin = user.user_id;
 			res.send("1");
 		});
    });
}

// 注册
module.exports.register = function(req, res, next) {
	var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
 		if (err) {
 			res.send("0");
 			return;
 		}
 		if (!fields.user_id || !fields.user_password || !fields.user_nickname) {
 			res.send("0");
 			return;
 		}
 		var user = {
 			user_id: !/[<>]/.test(fields.user_id) ? fields.user_id : false,
 			user_password: !/[<>]/.test(fields.user_password) ? fields.user_password : false,
 			user_nickname: !/[<>]/.test(fields.user_nickname) ? fields.user_nickname : false,
 		};

 		if (!fields.user_id || !fields.user_password || !fields.user_nickname) {
 			res.send("0");
 			return;
 		}

 		login_db_manipulate.addUser(user.user_id, user.user_password, user.user_nickname, function(err) {
			if(err) {
				res.send("0");
				return;
			}
				res.send("1");
			});
    });
}