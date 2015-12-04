(function () {
	"use strict";
	angular.module('endo')
		.factory('DateService', function DateFactory($filter) {
			var now = new Date()
				.getTime();
			return {
				parse: function (date) {
					var parsedDate = new Date(date)
						.getTime();
					if (parsedDate >= now) {
						var format;
						var tomorrow = new Date(now);
						tomorrow.setHours(0);
						tomorrow.setMinutes(0);
						tomorrow.setDate(tomorrow.getDate() + 1);
						tomorrow = tomorrow.getTime();
						if (parsedDate < tomorrow) {
							return "Today";
						} else if (parsedDate < now + 172800000) {
							return "Tomorrow";
						} else if (parsedDate < now + 604800000) {
							format = "EEE, MMM d";
						} else if (parsedDate < now + 2592000000) {
							format = "MMM d";
						} else {
							format = "MMM yyyy";
						}
						return $filter('date')(parsedDate, format);
					} else {
						return "Today";
					}
				},
				getTime: function(date){
					return $filter('date')(date, "h:mm a");
				},
				getFullDate: function (date) {
					return $filter('date')(date, "yyyy MMMM EEEE d");
				},
				getDateRange: function (date1, date2) {
					return $filter('date')(date1, "MMM d") + " - " + $filter('date')(date2, "MMM d");
				},
				getFullDateRange: function (date1, date2) {
					return $filter('date')(date1, "yyyy MMMM EEEE d") + " - " + $filter('date')(date2, "yyyy MMMM EEEE d");
				}
			}
		});
})();
