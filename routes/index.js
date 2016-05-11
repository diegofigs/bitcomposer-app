var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

var Photo = mongoose.model('Photo');
var User = mongoose.model('User');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST route for registering a new user */
router.post('/register', function(req, res, next){
	if(!req.body.username || !req.body.password){
		return res.status(400).json({message: 'Please fill out all the fields'});
	}
	
	var user = new User();
	user.username = req.body.username;
	user.setPassword(req.body.password);
	
	user.save(function(err, user){
		if(err){return next(err);}
		return res.json({token: user.generateJWT()});
	});
});


router.post('/login', function(req, res, next){
	if(!req.body.username || !req.body.password){
		return res.status(400).json({message: 'Please fill out all the fields'});
	}
	passport.authenticate('local', function(err, user, info){
		if(err){return next(err);}
		if(user){
			return res.json({token: user.generateJWT()});
		}
		else{
			return res.status(401).json(info);
		}
	})(req, res, next);
});

/* GET route for requesting all photos */
router.get('/home', function(req, res, next){
	Photo.find(function(err, photos){
		if(err){ return next(err); }
		res.json(photos);
	});
});

/* POST route for creating a new photo */
router.post('/home', auth, function(req, res, next){
	var photo = new Photo(req.body);
	photo.author = req.payload.username;
	
	photo.save(function(err, photo){
		if(err){ return next(err);}
		res.json(photo);
	});
});

/* PARAM route for preloading photos by id */
router.param('photo', function(req, res, next, id){
	var query = Photo.findById(id);
	
	query.exec(function(err, photo){
		if(err){ return next(err);}
		if(!photo){ return next(new Error('No post found.'));}
		req.photo = photo;
		return next();
	});
});

/* GET route for requesting a particular photo */
router.get('/photos/:photo', function(req, res, next){
	res.json(req.photo);
});

/* PUT route for liking photos */
router.put('/photos/:photo/like/:username', auth, function(req, res, next){
	req.photo.likePhoto(req.params.username, function(err, photo){
		if(err){ return next(err);}
		res.json(photo);
	});
});

module.exports = router;
