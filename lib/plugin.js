
var CONSOLE = require("./console");
var PROGRAM = require("./program");
var EVENTS = require("./events");
var PAGE = require("./page");

var readyCallbacks = [],
    ready = false,
    notifyingReady = false;
EVENTS.addListener("ready", function() {
    setTimeout(function() {
        notifyReady();
    }, 1 );
});
var DOMContentLoaded = function() {
    window.removeEventListener("load", DOMContentLoaded, false);
    setTimeout(function() {
        notifyReady(true);
    }, 1 );
};
window.addEventListener("load", DOMContentLoaded, false);
function notifyReady(skipDocumentState) {
    if(readyCallbacks.length == 0) return;
    if(!skipDocumentState && document.readyState != "complete") return;
    if(EVENTS.getStatus() != "ready") return;
    if(notifyingReady) return;
    notifyingReady = true;
    while(readyCallbacks.length>0) {
        readyCallbacks.pop()();
    }
    notifyingReady = false;
    if(ready) return;
    ready = true;
    EVENTS.dispatchHostEvent("plugin-ready");
}

exports.ready = function(callback) {
    readyCallbacks.push(callback);
    notifyReady();
}

exports.getRootElement = function() {
    return document.getElementById("content");
}

exports.getImageUrl = function(path) {
    return PROGRAM.getRootUrl() + "resources/" + path;
}

exports.getResourceUrl = function(path) {
    return PROGRAM.getRootUrl() + "resources/" + path;
}

exports.loadResourceScript = function(paths, callback) {
    if(typeof paths == "string") {
        paths = [paths];
    }
    for( var i=0,c=paths.length ; i<c ; i++ ) {
        // scripts must end in .js and we trim it here
        var m = paths[i].match(/^(.*?)\.js$/);
        if(m) {
            paths[i] = PROGRAM.getProgramId() + "/resources/" + paths[i].substring(0, paths[i].length-3);
        } else {
            CONSOLE.error("Paths passed to plugin.loadResourceScript() must end in '.js'.");
        }
    }
    require(paths, function() {
        callback();
    });
}
/*
exports.addScript = function(path) {
    var heads = top.document.getElementsByTagName("head");
    if(!heads || !heads.length) {
        CONSOLE.error("Cannot insert stylesheet '" + path + "' as <head> element not found in document!");
        return;
    }
    var script = top.document.createElementNS("http://www.w3.org/1999/xhtml", "script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", exports.getResourceUrl(path));
    heads[0].appendChild(script);
}
*/
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

    if(typeof path == "string") {
        style.setAttribute("href", PROGRAM.getRootUrl() + "resources/" + path);
    } else {
        style.setAttribute("href", PROGRAM.getRootUrl() + "pkg-resources/" + path["package"] + "/" + path["path"]);
    }

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

/**
 * @deprecated
 */
exports.getPageWindow = function(callback) {
    CONSOLE.warn("DEPRECATED: PLUGIN.getPageWindow() is deprecated. Use PAGE.getWindow() instead.");
    return PAGE.getWindow(callback);
}

exports.addListener = function(type, callback) {
    // delegate for now
    if(type=="message") {
        return EVENTS.addListener(type, callback);
    }
}

exports.removeListener = function(type, callback) {
    // delegate for now
    if(type=="message") {
        return EVENTS.removeListener(type, callback);
    }
}

var simpleMessageResponses = {},
    simpleMessageIndex = 0;

exports.sendSimpleMessage = function(message, callback) {
    callback = callback || false;
    var args = {
        "type": "simple",
// TODO: Allow sending messages to other plugins
//        "alias": this.alias,
        "data": message
    }
    if(callback) {
        args["type"] = "simple-response";
        args["callback-id"] = ++simpleMessageIndex;
        simpleMessageResponses["id:" + args["callback-id"]] = callback;
    }
    EVENTS.dispatchHostEvent("pluginMessage", args);
}

EVENTS.addListener("message", function(message) {
    if(message["type"]=="simple-response" && simpleMessageResponses["id:" + message["callback-id"]]) {
        simpleMessageResponses["id:" + message["callback-id"]](message);
        delete simpleMessageResponses["id:" + message["callback-id"]];
    }
});
