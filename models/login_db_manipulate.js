const mongoose = require('mongoose');
mongoose.connect('mongodb://tom:20042217@ds030500.mlab.com:30500/chatroom');

var userSchema = new mongoose.Schema({
	user_id: String,
	user_nickname: String,
	user_password: String,
});
// 查询有无指定用户
userSchema.statics.getUserById = function(user_id, callback) {
	var self = this;
	self.find({user_id: user_id}, function(err, result) {
		if (err) {
			callback && callback(err);
			return;
		}
		callback && callback.call(result);
	});
}

userSchema.statics.addUser = function(user_id, user_password, user_nickname, callback) {
	User.getUserById(user_id, function(err) {
		if (err || this.length !== 0) {
			callback && callback(err || true);
			return;
		}
		new User({
			user_id: user_id,
			user_nickname: user_nickname,
			user_password: user_password,
		}).save(function(err) {
			if (err) {
				callback && callback(err);
				return;
			}
			callback && callback();
		});
	});
}


var User = mongoose.model('User', userSchema);
//TEST UNIT
// User.getUserById("tom", function() {
// 	console.log(this);
// })

// User.addUser("Kalvin", "123456", "凯文", function(err) {
// 	if(err) {
// 		console.log('error');
// 		return;
// 	}
// 	console.log('OK');
// })
module.exports = User;


