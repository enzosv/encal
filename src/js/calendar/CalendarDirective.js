(function () {
	"use strict";
	angular.module('endo')
		.directive("calendar", function () {
			return {
				restrict: "E",
				templateUrl: "/html/calendar.html",
				controller: "CalendarController",
				controllerAs: "cal" 
			};
		});
})();
