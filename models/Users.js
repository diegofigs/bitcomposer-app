var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	email: String,
	firstName: String,
	password: String
});

mongoose.model('User', UserSchema);