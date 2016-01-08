(function () {
	"use strict";
	angular.module('endo')
		.factory('Image', ImageFactory);

	function ImageFactory($http) {
		var imageLastLoadedDate = 0;
		var imageLastLoaded;
		chrome.storage.local.get(['imageLastLoadedDate', 'imageLastLoaded'], function (local) {
			imageLastLoadedDate = local.imageLastLoadedDate;
			if (!imageLastLoadedDate) {
				imageLastLoadedDate = 0;
			}
			imageLastLoaded = local.imageLastLoaded;
		});
		var service = {
			loadRandom: loadRandom
		};
		return service;

		function loadRandom(setImage) {
			var now = new Date()
				.getTime();
			if (now > imageLastLoadedDate + 86400000) {
				// $http.get("https://pixabay.com/api/?key=1765664-63654bd31c5248f3b95dc20d2&safesearch=true&category=nature&image_type=photo&orientation=horizontal&min_width=" + window.innerWidth + "&min_height="+window.innerHeight)
				// 	.then(function (response) {
				// 		document.body.style.background = "url("+response.data.hits[0].webformatURL+") no-repeat center center fixed";
				// 	}, function (error) {
				// 		console.error("load image error");
				// 		console.error(error);
				// 	});
				$http.get("http://visualhunt.com/photos/nature/2")
					.then(function (response) {
						var imageLinks = response.data.match(/photo\/\d*\//g);
						$http.get("http://visualhunt.com/"+imageLinks[0]).then(function(response){
							var images = response.data.match(/http:\/\/visualhunt\.com\/photos\/xl\/1\/.* /g);
							document.body.style.background = "url("+images[0].split('\" ')[0]+") no-repeat";
							console.log(images[0].split('\" ')[0]);
							$http.get(images[0].split('\" ')[0]).then(function(response){
								console.log(response);
							});
						});
					}, function (error) {
						console.error("load image error");
						console.error(error);
					});
			} else if (imageLastLoaded) {
				setImage(imageLastLoaded);
			}

		}
	}
})();
