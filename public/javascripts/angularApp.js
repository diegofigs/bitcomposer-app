var app = angular.module('postMe', []);

app.controller('MainCtrl', [
	'$scope',
	function ($scope) {
		$scope.test = 'Hello world!';
		$scope.photos = [
			{
				title: 'Boat',
				url: '/images/boat.jpg',
				likes: 0
			},
			{
				title: 'Plane',
				url: '/images/plane.jpg',
				likes: 0
			}
		];
		$scope.addPhoto = function () {
			if(!$scope.title || !$scope.url === ''){ return; }
			$scope.photos.push({
				title: $scope.title,
				url: $scope.url,
				likes: 0
			});
			$scope.title = '';
			$scope.url = '';
		};
		$scope.likePhoto = function(photo){
			photo.likes += 1;
		};
	}
]);