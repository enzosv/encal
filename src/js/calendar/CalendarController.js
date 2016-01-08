(function () {
	"use strict";
	angular.module('endo')
		.controller("CalendarController", CalendarController);

	function CalendarController(Calendar, $scope, Image) {
		var vm = this;
		Calendar.loadSaved(vm);

		vm.toggleVisibility = function (calendar) {
			Calendar.toggleVisibility(calendar);
		};

		vm.reload = function(){
			Calendar.reload();
		};

		vm.apply = function(){
			$scope.$digest();
		};

		// Image.loadRandom(function(image){
			// console.log(document.body);
			// document.body.image = image;
		// });
	}
})();
