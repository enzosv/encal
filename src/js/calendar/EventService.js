(function () {
	"use strict";
	angular.module('endo')
		.factory('Event', EventFactory);

	function EventFactory(DateService, $http) {
		var events = [];
		var headers = {};
		var service = {
			processEvent: processEvent,
			getEvents: getEvents,
			remove: remove,
			processEventTime: processEventTime,
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
			return processEventTime(ev);
		}

		function processEventTime(ev) {
			var start;
			var end;
			var timed = false;
			if (ev.start.dateTime) {
				timed = true;
				start = Date.parse(ev.start.dateTime);

			} else {
				start = Date.parse(ev.start.date) + 57540000;
			}

			if (ev.end.dateTime) {
				timed = true;
				end = Date.parse(ev.end.dateTime);
			} else {
				end = Date.parse(ev.end.date) + 57540000;
			}

			ev.startTime = start;
			if (end - start > 3600000 && end - start != 86400000) {
				ev.endTime = end;
				ev.dateString = DateService.getDateRange(start, end, timed);
				ev.fullDateString = DateService.getFullDateRange(start, end, timed);
			} else {
				ev.dateString = DateService.parse(start);
				ev.fullDateString = DateService.getFullDate(start);
			}

			ev.searchKey = (ev.dateString + " " + ev.fullDateString + " " + ev.calName + " " + ev.name)
				.toLowerCase();
			events.push(ev);
			return ev;
		}

		function getEvents() {
			return events;
		}

		function remove(ev) {
			var index = events.indexOf(ev);
			if (index > -1) {
				events.splice(index, 1);
			}
			var url = "https://www.googleapis.com/calendar/v3/calendars/" + encodeURIComponent(ev.cal_id) + "/events/" + encodeURIComponent(ev.id);
			$http({
					method: 'DELETE',
					url: url,
					headers: headers
				})
				.then(function (response) {
					console.log("DELETE SUCCESS: " + response);
				}, function (error) {
					console.error("DELETE EVENT ERROR: " + error);
				});
		}

		function clearEvents() {
			events = [];
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
				calendar = {"id":"primary"};
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
					processEvent(response.data, calendar)
				}, function (error) {
					console.error("ADD EVENT ERROR: " + error);
				});
		}
	}
})();
