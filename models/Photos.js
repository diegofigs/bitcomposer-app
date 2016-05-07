var mongoose = require('mongoose');

var PhotoSchema = new mongoose.Schema({
	title: String,
	link: String,
	likes: {type: Number, default: 0}
});

mongoose.model('Photo', PhotoSchema);