(function () {
	"use strict";
	angular.module('endo')
		.factory('Event', EventFactory);

	function EventFactory(DateService, $http) {
		var events = [];
		var headers = {};
		var dateHeaders = [];
		var service = {
			processEvent: processEvent,
			getEvents: getEvents,
			remove: remove,
			prepareForDisplay: prepareForDisplay,
			clearEvents: clearEvents,
			toggleVisibility: toggleVisibility,
			addEvent: addEvent,
			setHeader: setHeader
		};
		return service;

		function processEvent(item, cal) {
			var ev = {
				"name": item.summary,
				"id": item.id,
				"cal_id": cal.id,
				"color": cal.color,
				"start": item.start,
				"end": item.end,
				"calName": cal.name,
				"visible": cal.visible
			};
			processEventTimes(ev);
			prepareForDisplay(ev);
			return ev;
		}

		function processEventTimes(ev) {
			var end;
			var fullTimeRange;
			if (ev.start.dateTime) {
				ev.parsedStart = Date.parse(ev.start.dateTime);
				ev.startTime = DateService.getTime(ev.parsedStart);
			} else {
				ev.parsedStart = Date.parse(ev.start.date) + 57540000;
				ev.startTime = "";
			}


			if (ev.end.dateTime) {
				end = Date.parse(ev.end.dateTime);
				// ev.endTime = DateService.getTime(end);

			} else {
				end = Date.parse(ev.end.date) + 57540000;
				// ev.endTime = "";
			}

			if (end - ev.parsedStart > 3600000 && end-ev.parsedStart !== 86400000) {
				ev.timeRange = DateService.getDateRange(ev.parsedStart, end);
				fullTimeRange = DateService.getFullDateRange(ev.parsedStart, end);
			} else{
				fullTimeRange = "";
			}

			ev.searchKey = DateService.getFullDate(ev.parsedStart) + " " + fullTimeRange + " " + ev.startTime + " " + ev.calName + " " + ev.name;
		}

		function prepareForDisplay(ev) {
			if (ev.dateString) {
				ev.searchKey.replace(" " + ev.dateString.toLowerCase(), "");
			}
			ev.dateString = DateService.parse(ev.parsedStart);
			ev.searchKey += " " + ev.dateString;
			ev.newDateHeader = checkNewDateHeader(ev.dateString);
			ev.searchKey = ev.searchKey.toLowerCase();
			events.push(ev);
		}

		function getEvents() {
			return events;
		}

		function remove(ev) {
			var index = events.indexOf(ev);
			if (index > -1) {
				events.splice(index, 1);
			}
			console.log(headers);
			var url = "https://www.googleapis.com/calendar/v3/calendars/" + encodeURIComponent(ev.cal_id) + "/events/" + encodeURIComponent(ev.id);
			$http({
					method: 'DELETE',
					url: url,
					headers: headers
				})
				.then(function (response) {
					console.log("DELETE SUCCESS: " + response);
					chrome.storage.local.set({
						last_fetched: 1
					});
				}, function (error) {
					console.error("DELETE EVENT ERROR: " + error);
				});
		}

		function clearEvents() {
			events = [];
			dateHeaders = [];
		}

		function toggleVisibility(id) {
			for (var i = 0; i < events.length; i++) {
				if (events[i].cal_id === id) {
					events[i].visible = !events[i].visible;
				}
			}
		}

		function setHeader(h) {
			headers = h;
		}

		function addEvent(text, calendar) {
			if (!calendar) {
				calendar = {
					"id": "primary"
				};
			}
			var url = "https://www.googleapis.com/calendar/v3/calendars/" + encodeURIComponent(calendar.id) + "/events/quickAdd?text=" + text.split(" ")
				.join("+");

			$http({
					method: 'POST',
					url: url,
					headers: headers
				})
				.then(function (response) {
					console.log(response);
					processEvent(response.data, calendar);
					chrome.storage.local.set({
						last_fetched: 1
					});
				}, function (error) {
					console.error("ADD EVENT ERROR: " + error);
				});
		}

		function checkNewDateHeader(dateString) {
			for (var i = 0; i < dateHeaders.length; i++) {
				if (dateHeaders[i] === dateString) {
					console.log(dateHeaders[i]);
					return false;
				}
			}
			console.log("new date header");
			dateHeaders.push(dateString);
			return true;
		}
	}
})();
