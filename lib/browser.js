
var EVENTS = require("./events");

exports.newTab = function(url, options) {
    EVENTS.dispatchHostEvent("browserAction", {
        "name": "newTab",
        "url": url,
        "options": options
    });
}

exports.newWindow = function(url, options) {
    EVENTS.dispatchHostEvent("browserAction", {
        "name": "newWindow",
        "url": url,
        "options": options
    });
}

exports.setUrl = function(url, options) {
    EVENTS.dispatchHostEvent("browserAction", {
        "name": "setUrl",
        "url": url,
        "options": options
    });
}
