(function () {
	"use strict";
	angular.module('endo', ['angular-stringcontains', 'yaru22.angular-timeago'])
		.config(config);

	function config() {
		Mousetrap.bind(['option+s'], function (e) {
			if (e.preventDefault) {
				e.preventDefault();
			}
			document.getElementById("searchField")
				.focus();
			return false;
		});
		Mousetrap.bind(['option+enter'], function (e) {
			if (e.preventDefault) {
				e.preventDefault();
			}
			var scope = angular.element(document.getElementById('SearchController'))
				.scope().searchController;
			console.log(scope);
			if (scope.search.length > 0) {
				scope.add();
			}
			return false;
		});
	}
})();
