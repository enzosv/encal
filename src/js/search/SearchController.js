(function () {
	"use strict";
	angular.module('endo')
		.controller("SearchController", SearchController);

	function SearchController(Event, Calendar) {
		var vm = this;
		vm.add = function () {
			var calendarName = vm.search.split("#");
			if (calendarName.length > 1) {
				calendarName = calendarName[1].split(" ")[0];
				Event.addEvent(vm.search.replace("#" + calendarName, ""), Calendar.getCalendarWithName(calendarName));
			} else {
				Event.addEvent(vm.search, Calendar.getCalendarWithName());
			}
			vm.search = "";
		};
	}
})();
