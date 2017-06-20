const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const posts_db_interface = require('../models/posts_db_interface.js');
const login_db_manipulate = require('../models/login_db_manipulate');

module.exports.render_view = function(req, res) {
	res.render("index.ejs", {
		user_id : req.session.isloggedin,
	});
}

module.exports.retrieve_posts_data = function(req, res) {
	posts_db_interface.getPosts(function(err) {
		if (err) {
			res.send("0");
			return;
		}
		var self = this;
		var count = 0;
		self.forEach(function(item, index, array) {
			login_db_manipulate.getUserById(item.user_id, function(err) {
				if (err) {
					res.write("0");
					return;
				}
				item.user_nickname = this[0].user_nickname;
				count += 1;
				if (count === self.length) {
					// console.log(self);
					res.send(JSON.stringify(self));
				}
			});
		});
	});
}

module.exports.add_posts_data = function(req, res) {
	var form = new formidable.IncomingForm();
	form.uploadDir = "./temp";
    form.parse(req, function(err, fields, files) {
 		if (err) {
 			res.send("0");
 			return;
 		}
 		// console.log(fields, files);
 		if (files.post_img.size == 0 && files.post_img.size > 99999 || files.post_img.name == "") {
 			fs.unlink(files.post_img.path, function() {});
 		}
 		

 		var ext_name = path.extname(files.post_img.name);
 		

 		
 		posts_db_interface.getTotalCount(function(err) {
 			if (err) {
 				res.send("0");
 				return;
 			}
 			var post_id = new Number(this);
 			var tempObj = {
 				user_id: req.session.isloggedin,
 				post_id: post_id + 1,
 				post_title: !/[<>]/.test(fields.post_title) ? fields.post_title : false,
 				post_body: !/[<>]/.test(fields.post_body) ? fields.post_body : false,
 				post_time: new Number(new Date()),
 			}

 			if (!tempObj.user_id || typeof tempObj.post_id === 'undefined' || !tempObj.post_title || !tempObj.post_body || !tempObj.post_time) {
 				res.send("0");
 				return;
 			}
 			if (/\.jpg$/i.test(ext_name) || /\.jpeg$/i.test(ext_name) || /\.png$/i.test(ext_name) || /\.gif$/i.test(ext_name) || /\.tiff$/i.test(ext_name) || /\.tif$/i.test(ext_name)) {
 				fs.rename(files.post_img.path , './public/uploads/' + files.post_img.name, function (err){
 					if (err) {
 						res.send("0");
 						return;
 					}
 					tempObj.post_img = 'uploads/' + files.post_img.name;
 					posts_db_interface.newPost(tempObj, function(err) {
 						if (err) {
 							res.send("0");
 							return;
 						}
 						res.redirect('/html/submit.html');
 						return;
 					});
				});
				return;
 			}
 			posts_db_interface.newPost(tempObj, function(err) {
 				if (err) {
 					res.send("0");
 					return;
 				}
 				res.redirect('/html/submit.html');
 				return;
 			});
 		});
    });
}