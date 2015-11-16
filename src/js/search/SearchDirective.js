(function () {
	"use strict";
	angular.module('endo')
		.directive("searchDirective", searchDirective);

	function searchDirective() {
		var directive = {
			templateUrl: "/html/search.html",
			controller: "SearchController",
			controllerAs: "searchController",
			link: link
		};

		return directive;

		function link(scope, element, attrs) {
			element.find("input")
				.bind("focus", function () {
					this.placeholder = "Eventname tomorrow 5pm #Calendar-Name";
				})
				.bind("blur", function () {
					this.placeholder = "Search or add events";
				});
		}
	}
})();
