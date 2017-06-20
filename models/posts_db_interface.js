const mongoose = require('mongoose');
mongoose.connect('mongodb://tom:20042217@ds030500.mlab.com:30500/chatroom');

var postSchema = new mongoose.Schema({
	user_id: String,
	post_id: Number,
	post_title: String,
	post_body: String,
	post_review: Array,
	post_time: Number,
	post_img: String,
	user_nickname: String,
});

postSchema.statics.getPosts = function(callback) {
	var self = this;
	self.find({}).sort({post_id: -1}).limit(10).exec(function(err, result) {
		if (err) {
			callback && callback(err);
			return;
		}
		callback && callback.call(result);
	});
}

postSchema.statics.getTotalCount = function(callback) {
	var self = this;
	self.count({}, function(err, count) {
		if(err) {
			callback && callback(err);
			return;
		}
		callback && callback.call(count);
	});
}

postSchema.statics.newPost = function(options, callback) {
	new Post(options).save(function(err) {
		if (err) {
			callback && callback(err);
			return;
		}
		callback && callback();
	});
}
var Post = mongoose.model('Post', postSchema);
//TEST UNIT
// Post.getPosts(function() {
// 	console.log(this);
// })
module.exports = Post;


