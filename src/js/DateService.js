(function () {
	"use strict";
	angular.module('endo')
		.factory('DateService', function DateFactory($filter) {
			var now = new Date()
				.getTime();
			var isTimeless = function (date) {
				date = new Date(date);
				if ((date.getHours() === 0 && date.getMinutes() === 0) || (date.getHours() === 23 && date.getMinutes() === 59)) {
					return true;
				}

				return false;
			};
			return {
				parse: function (date) {
					var parsedDate = new Date(date)
						.getTime();
					if (parsedDate > now) {
						var format;
						var tomorrow = new Date(now);
						tomorrow.setHours(0);
						tomorrow.setMinutes(0);
						tomorrow.setDate(tomorrow.getDate() + 1);
						tomorrow = tomorrow.getTime();
						if (parsedDate < tomorrow) {
							if (isTimeless(parsedDate)) {
								format = "'Today'";
							} else {
								format = "h:mm a";
							}
						} else if (parsedDate < now + 172800000) {
							if (isTimeless(parsedDate)) {
								format = "'Tomorrow'";
							} else {
								format = "'Tomorrow' h:mm a";
							}
						} else if (parsedDate < now + 604800000) {
							format = "EEE, MMM d";
						} else if (parsedDate < now + 2592000000) {
							format = "MMM d";
						} else {
							format = "MMM yyyy";
						}
						return $filter('date')(parsedDate, format);
					} else {
						if (!timed) {
							return "Today";
						}
						return $filter('timeAgo')(date);
					}
				},
				getFullDate: function (date, timed) {
					if(timed){
						return $filter('date')(date, "yyyy MMMM EEEE d h:mm a");
					}
					return $filter('date')(date, "yyyy MMMM EEEE d");
				},
				getDateRange: function(date1, date2, timed){
					if(timed){
						return $filter('date')(date1, "MMM d h:mm a") + " - " + $filter('date')(date2, "MMM d h:mm a"); 
					}
					return $filter('date')(date1, "MMM d") + " - " + $filter('date')(date2, "MMM d");
				},
				getFullDateRange: function(date1, date2, timed){
					if(timed){
						return $filter('date')(date1, "yyyy MMMM EEEE d h:mm a") + " - " + $filter('date')(date2, "yyyy MMMM EEEE d h:mm a");
					}
					return $filter('date')(date1, "yyyy MMMM EEEE d") + " - " + $filter('date')(date2, "yyyy MMMM EEEE d");
				}
			}
		});
})();
