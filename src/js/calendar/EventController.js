(function () {
	"use strict";
	angular.module('endo')
		.controller("EventController", EventController);

	function EventController(Event) {
		var vm = this;
		vm.mouseenter = function () {
			vm.hover = true;
		};

		vm.mouseleave = function () {
			vm.hover = false;
		};

		vm.remove = function (ev) {
			console.log(ev);
			Event.remove(ev);
		};
	}
})();
