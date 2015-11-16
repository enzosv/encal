(function () {
	"use strict";
	angular.module('endo')
		.directive("event", function () {
			return {
				templateUrl: "/html/event.html",
				controller: "EventController",
				controllerAs: "eventController"
			};
		});
})();
