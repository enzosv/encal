(function () {
	"use strict";
	angular.module('endo')
		.controller("CalendarController", CalendarController);

	function CalendarController(Calendar, $scope) {
		var vm = this;
		Calendar.loadSaved(vm);

		vm.toggleVisibility = function (calendar) {
			Calendar.toggleVisibility(calendar);
		}

		vm.reload = function(){
			Calendar.reload();
		}
	}
})();
