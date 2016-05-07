var app = angular.module('app', []);

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