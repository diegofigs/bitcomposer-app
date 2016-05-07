var app = angular.module('app', ['ui.router']);

app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider){
		$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: '/home.html',
			controller: 'MainCtrl'
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

app.factory('photos', [ function(){
	var o = {
		photos: []
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
			$scope.photos.push({
				title: $scope.title,
				link: $scope.link,
				likes: 0,
				author: 'user'
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