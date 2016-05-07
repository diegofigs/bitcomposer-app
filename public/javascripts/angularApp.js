var app = angular.module('postMe', []);

app.controller('MainCtrl', [
	'$scope',
	function ($scope) {
		$scope.test = 'Hello world!';
		$scope.photos = [
			{title: 'Boat', url: '/images/boat.jpg', likes: 0},
			{title: 'Plane', url: '/images/plane.jpg', likes: 0}
		];
	}
]);