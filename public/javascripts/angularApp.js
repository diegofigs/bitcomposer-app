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
			controller: 'PhotosCtrl'
		})
		.state('popular', {
			url: '/popular',
			templateUrl: '/popular.html',
			controller: 'PopularCtrl'
		})
		.state('favorite', {
			url: '/favorites',
			templateUrl: '/favorites.html',
			controller: 'FavoritesCtrl'
		});
		
		$urlRouterProvider.otherwise('home');
	}
]);

app.factory('photos', ['$http', function($http){
	var o = {
		photos: []
	};
	o.getAll = function(){
		return $http.get('/home').success(function(data){
			angular.copy(data, o.photos);
		});
	};
	o.create = function(photo){
		return $http.post('/home', photo).success(function(data){
			o.photos.push(photo);
		});
	};
	return o;
}]);

app.controller('MainCtrl', [
	'$scope',
	'photos',
	function ($scope, photos) {
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
		$scope.likePhoto = function(photo){
			photo.likes += 1;
		};
	}
]);

app.controller('PhotosCtrl', [
	'$scope',
	'$stateParams',
	'photos',
	function($scope, $stateParams, photos){
		$scope.photo = photos.photos[$stateParams.id];
	}
]);

app.controller('PopularCtrl', [
	'$scope',
	'photos',
	function($scope, photos){
		$scope.photos = photos.photos;
	}
]);

app.controller('FavoritesCtrl', [
	'$scope',
	'photos',
	function($scope, photos){
		$scope.photos = photos.photos;
	}
]);