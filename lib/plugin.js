
var CONSOLE = require("./console");
var PROGRAM = require("./program");
var EVENTS = require("./events");

exports.getImageUrl = function(path) {
    return PROGRAM.getRootUrl() + "resources/" + path;
}

exports.addCss = function(path) {

    // TODO: Load css via requirejs once it is refactored and has CSS plugin
    //       i.e. require("css!resource/" + path);

    var heads = top.document.getElementsByTagName("head");
    if(!heads || !heads.length) {
        CONSOLE.error("Cannot insert stylesheet '" + path + "' as <head> element not found in document!");
        return;
    }
    
    var style = top.document.createElementNS("http://www.w3.org/1999/xhtml", "link");
    style.setAttribute("rel","stylesheet");
    style.setAttribute("type", "text/css");
    style.setAttribute("href", PROGRAM.getRootUrl() + "resources/" + path);

    heads[0].appendChild(style);
}

exports.getHeight = function(callback) {
    EVENTS.dispatchHostEvent("getPropertyForPlugin", {
        "name": "height"
    }, callback);
}

exports.setHeight = function(height) {
    EVENTS.dispatchHostEvent("setPropertyForPlugin", {
        "name": "height",
        "value": height
    });
}
