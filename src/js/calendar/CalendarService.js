(function () {
	"use strict";

	angular.module('endo')
		.factory('Calendar', CalendarFactory);

	// CalendarFactory.$inject = ["EventFactory", "$http", "$rootScope"];

	function CalendarFactory($http, $rootScope, Event) {
		var headers;
		var startTime;
		var endTime;

		var calendars = [];
		var numCalendars = 0;
		var calendarVisibility = {};
		var service = {
			loadSaved: loadSaved,
			reload: reload,
			toggleVisibility: toggleVisibility,
			getCalendarWithId: getCalendarWithId,
			getCalendarWithName: getCalendarWithName
		};
		var controller;
		var primaryCalendar;
		return service;

		function loadSaved(ctrl) {
			controller = ctrl;
			// reload();
			chrome.storage.local.get(["last_fetched", "calendars", "calendarVisibility", "primaryCalendar"], function (local) {

				if (local.calendars) {
					calendars = local.calendars;
					controller.calendars = calendars;
					for (var i = 0; i < calendars.length; i++) {
						for (var j = 0; j < calendars[i].events.length; j++) {
							Event.processEventTime(calendars[i].events[j]);
						}
					}
					controller.events = Event.getEvents();
					primaryCalendar = local.primaryCalendar;
					$rootScope.$apply();
					if (local.last_fetched && local.last_fetched < new Date()
						.getTime() - 300000) {
						calendarVisibility = local.calendarVisibility;
						if (!calendarVisibility) {
							calendarVisibility = {};
						}
						reload();
					}
				} else {
					calendarVisibility = local.calendarVisibility;
					if (!calendarVisibility) {
						calendarVisibility = {};
					}
					reload();
				}
			});
		}

		function reload() {
			chrome.identity.getAuthToken({
				'interactive': true
			}, function (tkn) {

				headers = {
					'Authorization': 'Bearer ' + tkn,
					'Content-Type': 'application/json; charset=UTF-8'
				};
				Event.setHeader(headers);
				startTime = new Date();
				// startTime.setHours(0);
				// startTime.setMinutes(0);
				// startTime.setSeconds(0);
				startTime = startTime.toISOString();
				endTime = new Date();
				endTime.setDate(endTime.getDate() + 14);
				endTime = endTime.toISOString();
				fetchCalendars();
				getPrimary();
			});
		}

		function reset(ctrl) {
			var nil;
			headers = {};
			startTime = nil;
			endTime = nil;
			calendars = [];
			numCalendars = 0;
			calendarVisibility = {};
			events = [];
			controller = nil;
			primaryCalendar = nil;
			chrome.storage.local.clear();
			loadSaved(ctrl);
		}

		function getPrimary() {
			$http.get("https://www.googleapis.com/calendar/v3/calendars/primary", {
					headers: headers
				})
				.then(function (response) {
					primaryCalendar = {
						"name": response.data.summary,
						"id": response.data.id
					};
					chrome.storage.local.set({
						primaryCalendar: primaryCalendar
					});
				}, function (error) {
					console.error("GET PRIMARY ERROR: " + error);
				});
		}

		function fetchCalendars() {
			numCalendars = 0;
			$http.get("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
					headers: headers
				})
				.then(function (response) {
					calendars = [];
					Event.clearEvents();
					numCalendars = response.data.items.length;
					for (var i = 0; i < numCalendars; i++) {
						processCalendar(response.data.items[i]);
					}

				}, function (error) {
					console.error("GET CALENDARS ERROR:");
					console.error(error);
				});
		}

		function processCalendar(calendar) {
			var visible = true;
			if (calendar.id in calendarVisibility) {
				visible = calendarVisibility[calendar.id];
			}

			var cal = {
				"name": calendar.summary,
				"color": calendar.backgroundColor,
				"id": calendar.id,
				"visible": visible,
				"events": []
			};
			getEventsForCalendar(cal);
		}

		function getEventsForCalendar(cal) {
			$http.get("https://www.googleapis.com/calendar/v3/calendars/" + cal.id + "/events?timeMin=" + startTime + "&timeMax=" + endTime + "&singleEvents=true&orderBy=startTime&maxAtendees=0", {
					headers: headers
				})
				.then(function (response) {
					var eventCount = response.data.items.length;
					if (eventCount > 0) {
						for (var i = 0; i < eventCount; i++) {
							cal.events.push(Event.processEvent(response.data.items[i], cal));
						}
						calendars.push(cal);
					} else {
						numCalendars--;
					}
					saveCalendars();
				}, function () {
					numCalendars--;
					saveCalendars();
				});
		}

		function saveCalendars() {
			if (numCalendars === calendars.length) {
				controller.calendars = calendars;
				controller.events = Event.getEvents();
				chrome.storage.local.set({
					"last_fetched": new Date()
						.getTime(),
					"calendars": calendars
				}, function () {
					console.log("Calendars saved");
				});
			}
		}

		function getCalendarWithId(id) {
			if (!id) {
				id = primaryCalendar.id;
			}
			for (var i = 0; i < calendars.length; i++) {
				if (calendars[i].id === id) {
					return calendars[i];
				}
			}
		}

		function getCalendarWithName(name) {
			if (!name) {
				name = primaryCalendar.name;
			} else if (name.indexOf("-") > -1) {
				name = name.replace("-", " ");
			}
			name = name.toLowerCase();
			for (var i = 0; i < calendars.length; i++) {
				if (calendars[i].name.toLowerCase() === name) {
					return calendars[i];
				}
			}
		}

		function toggleVisibility(cal) {
			calendarVisibility[cal.id] = cal.visible;
			Event.toggleVisibility(cal.id);
			chrome.storage.local.set({
				"calendarVisibility": calendarVisibility,
				"calendars": calendars
			});
		}
	}
})();
