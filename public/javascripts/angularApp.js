var app = angular.module('app', ['ui.router']);

app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider){
		$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: '/home.html',
			controller: 'MainCtrl',
			resolve: {
				photoPromise: ['photos', function(photos){
					return photos.getAll();
				}]
			}
		})
		.state('photos', {
			url: '/photos/{id}',
			templateUrl: '/photos.html',
			controller: 'PhotosCtrl',
			resolve: {
				photo: ['$stateParams', 'photos', function($stateParams, photos){
					return photos.get($stateParams.id);
				}]
			}
		})
		.state('popular', {
			url: '/popular',
			templateUrl: '/popular.html',
			controller: 'MainCtrl'
		})
		.state('favorite', {
			url: '/favorites',
			templateUrl: '/favorites.html',
			controller: 'MainCtrl'
		})
		.state('login', {
			url: '/login',
			templateUrl: '/login.html',
			controller: 'AuthCtrl',
			onEnter: ['$state', 'auth', function($state, auth){
				if(auth.isLoggedIn()){
				  $state.go('home');
				}
			}]			
		})
		.state('register', {
			url: '/register',
			templateUrl: '/register.html',
			controller: 'AuthCtrl',
			onEnter: ['$state', 'auth', function($state, auth){
				if(auth.isLoggedIn()){
				  $state.go('home');
				}
			}]
		});
		
		$urlRouterProvider.otherwise('home');
	}
]);

app.factory('auth', ['$http', '$window', function($http, $window){
	var auth = {};
	auth.saveToken = function(token){
		$window.localStorage['handy-token'] = token;
	};
	auth.getToken = function(token){
		return $window.localStorage['handy-token'];
	};
	auth.isLoggedIn = function(){
		var token = auth.getToken();
		if(token){
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return payload.exp > Date.now() / 1000;
		}
		else {
			return false;
		}
	};
	auth.currentUser = function(){
		if(auth.isLoggedIn()){
			var token = auth.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			
			return payload.username;
		}
	};
	auth.register = function(user){
		return $http.post('/register', user).success(function(data){
			auth.saveToken(data.token);
		});
	};
	auth.logIn = function(user){
		return $http.post('/login', user).success(function(data){
			auth.saveToken(data.token);
		});
	};
	auth.logOut = function(){
		$window.localStorage.removeItem('handy-token');
	};
	return auth;
}]);

app.factory('photos', ['$http', 'auth', function($http, auth){
	var o = {
		photos: []
	};
	o.getAll = function(){
		return $http.get('/home').success(function(data){
			angular.copy(data, o.photos);
		});
	};
	o.create = function(photo){
		return $http.post('/home', photo, {
			headers: {Authorization: 'Bearer '+auth.getToken()}
		}).success(function(data){
			o.photos.push(data);
		});
	};
	o.like = function(photo){
		return $http.put('/photos/'+ photo._id +'/like/'+ auth.currentUser(), null, {
			headers: {Authorization: 'Bearer '+auth.getToken()}
		}).success(function(data){
			angular.copy(data, photo);
		});
	};
	o.get = function(id){
		return $http.get('/photos/'+ id).then(function(res){
			return res.data;
		});
	};
	return o;
}]);

app.controller('AuthCtrl', [
	'$scope',
	'$state',
	'auth',
	function($scope, $state, auth){
		$scope.user = {};
		$scope.register = function(){
			auth.register($scope.user).error(function(error){
				$scope.error = error;
			})
			.then(function(){
				$state.go('home');
			});
		};
		$scope.logIn = function(){
			auth.logIn($scope.user).error(function(error){
				$scope.error = error;
			})
			.then(function(){
				$state.go('home');
			});
		};
	}
]);

app.controller('NavCtrl', [
	'$scope',
	'auth',
	function ($scope, auth) {
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.currentUser = auth.currentUser;
		$scope.logOut = auth.logOut;
	}
]);

app.controller('MainCtrl', [
	'$scope',
	'photos',
	'auth',
	function ($scope, photos, auth) {
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.photos = photos.photos;
		$scope.addPhoto = function () {
			if(!$scope.title || !$scope.link === ''){ return; }
			photos.create({
				title: $scope.title,
				link: $scope.link
			});
			$scope.title = '';
			$scope.link = '';
		};
		$scope.isLiked = function(photo){
			if(photo.users.indexOf(auth.currentUser()) > -1){
				return true;
			}
			else
				return false;
		};
		$scope.likePhoto = function(photo){
			photos.like(photo);
		};
	}
]);

app.controller('PhotosCtrl', [
	'$scope',
	'photo',
	'photos',
	function($scope, photo, photos){
		$scope.photos = photos.photos;
		$scope.photo = photo;
	}
]);
