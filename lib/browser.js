
var EVENTS = require("./events");

exports.newTab = function(url) {
    EVENTS.dispatchHostEvent("browserAction", {
        "name": "newTab",
        "url": url
    });
}

exports.newWindow = function(url) {
    EVENTS.dispatchHostEvent("browserAction", {
        "name": "newWindow",
        "url": url
    });
}

exports.setUrl = function(url) {
    EVENTS.dispatchHostEvent("browserAction", {
        "name": "setUrl",
        "url": url
    });
}
