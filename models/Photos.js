var mongoose = require('mongoose');

var PhotoSchema = new mongoose.Schema({
	title: String,
	link: String,
	likes: {type: Number, default: 0},
	author: String
});

PhotoSchema.methods.likePhoto = function(cb){
	this.likes += 1;
	this.save(cb);
};

mongoose.model('Photo', PhotoSchema);