
// NOTE: These declarative requires are needed for now to have the modules included (dependency tracing via static analysis)
// TODO: Better dependency detection and inclusion into transport bundle
require("./insight");
require("./console");
require("./plugin");


var PROGRAM = require("./program");

var status = "loading",
    listeners = {};

exports.init = function(id) {

    status = "loaded";

    document.documentElement.addEventListener("_InsightHostEvent", function(event) {
        exports.onHostEvent(event);
    }, false);

    exports.dispatchHostEvent("load", {
        "id": id,
        // TODO: This is kind of a hack. Can be removed once server helper becomes more intelligent.
        "insight-plugin-api-package-name": module["package"]
    });
}


exports.dispatchHostEvent = function(name) {
    var element = document.createElement("_InsightPluginEvent");
    element.setAttribute("name", name);
    var args = [];
    // NOTE: arguments is not a normal array so we can't just shift or splice it
    for( var i=1 ; i<arguments.length ; i++ ) {
        args.push(arguments[i]);
    }
    element.setAttribute("args", JSON.stringify(args));
    document.documentElement.appendChild(element);
    var evt = document.createEvent("Events");
    evt.initEvent("_InsightPluginEvent", true, false);
    element.dispatchEvent(evt);
}


exports.onHostEvent = function(event) {
    var name = event.target.getAttribute("name");
    var args = JSON.parse(event.target.getAttribute("args"));
    event.target.parentNode.removeChild(event.target);
    switch(name) {
        case "ready":
            // container is ready to load a program
            status = "ready";
            if(args.rootUrl) {
                PROGRAM.setRootUrl(args.rootUrl);
            }
            // args may already contain a program to load
            if(args.program) {
                PROGRAM.load(args.program);
            }
            break;
        case "message":
            args[0].data = JSON.parse(args[0].data || {});
            exports.dispatchEvent("message", args);
            break;
        case "pong":
            exports.dispatchEvent("pong", args);
            break;
    }
}

exports.addListener = function(type, callback) {
    if(!listeners[type]) {
        listeners[type] = [];
    }
    if(listeners[type].indexOf(callback)>=0) {
        top.console.log("LISTENR ALREADY ADDED");
        return;
    }
    listeners[type].push(callback);
}

exports.removeListener = function(type, callback) {
    if(!listeners[type]) {
        return;
    }
    var index = listeners[type].indexOf(callback);
    if(index==-1) return;
    listeners[type].splice(index, 1);
}

exports.dispatchEvent = function(type, args) {
    if(!listeners[type]) {
        return;
    }
    for( var i=0, c=listeners[type].length ; i<c ; i++ ) {
        listeners[type][i].apply(listeners[type][i], args);
    }
}
