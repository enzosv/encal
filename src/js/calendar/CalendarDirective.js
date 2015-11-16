(function () {
	"use strict";
	angular.module('endo')
		.directive("calendar", function () {
			return {
				templateUrl: "/html/calendar.html",
				controller: "CalendarController",
				controllerAs: "cal" 
			};
		});
})();
