var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Photo = mongoose.model('Photo');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET route for requesting all photos */
router.get('/home', function(req, res, next){
	Photo.find(function(err, photos){
		if(err){ return next(err); }
		res.json(photos);
	});
});

/* POST route for creating a new photo */
router.post('/home', function(req, res, next){
	var photo = new Photo(req.body);
	
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
router.put('/photos/:photo/like', function(req, res, next){
	req.photo.likePhoto(function(err, photo){
		if(err){ return next(err);}
		res.json(photo);
	});
});

module.exports = router;
