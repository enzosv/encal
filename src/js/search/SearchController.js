(function () {
	"use strict";
	angular.module('endo')
		.controller("SearchController", SearchController);

	function SearchController(Event, Calendar, $element) {
		var vm = this;

		function add() {
			var calendarName = vm.search.split("#");
			if (calendarName.length > 1) {
				calendarName = calendarName[1].split(" ")[0];
				Event.addEvent(vm.search.replace("#" + calendarName, ""), Calendar.getCalendarWithName(calendarName));
			} else {
				Event.addEvent(vm.search, Calendar.getCalendarWithName());
			}
			vm.search = "";
		};

		Mousetrap.bind(['option+s'], function (e) {
			if (e.preventDefault) {
				e.preventDefault();
			}
			$element[0].childNodes[0]
				.focus();
			return false;
		});
		Mousetrap.bind(['option+enter'], function (e) {
			if (e.preventDefault) {
				e.preventDefault();
			}
			add();
			return false;
		});
	}
})();
