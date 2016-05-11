var mongoose = require('mongoose');

var PhotoSchema = new mongoose.Schema({
	title: String,
	link: String,
	likes: {type: Number, default: 0},
	author: String,
	users: [String]
});

PhotoSchema.methods.likePhoto = function(username, cb){
	this.likes += 1;
	this.users.push(username);
	this.save(cb);
};

mongoose.model('Photo', PhotoSchema);