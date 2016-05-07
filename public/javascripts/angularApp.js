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
				likes: 0
			});
			$scope.title = '';
			$scope.link = '';
		};
		$scope.likePhoto = function(photo){
			photo.likes += 1;
		};
	}
]);