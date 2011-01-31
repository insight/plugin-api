
// NOTE: The internal names of events and their arguments exchanged between this module and the
//       host environment WILL MOST LIKELY CHANGE IN FUTURE!

var PROGRAM = require("./program");
var CONSOLE = require("./console");

var status = "loading",
    listeners = {},
    callbacks = {},
    callbackIndex = 1;

exports.init = function(id) {

    status = "loaded";

    document.documentElement.addEventListener("_InsightHostEvent", function(event) {
        exports.onHostEvent(event);
    }, false);

    exports.dispatchHostEvent("load", {
        "id": id,
        "url": document.location.href,
        // TODO: This is kind of a hack. Can be removed once server helper becomes more intelligent.
        "insight-plugin-api-package-name": module["package"]
    });
}

exports.getStatus = function() {
    return status;
}

exports.dispatchHostEvent = function(name) {
    var element = document.createElement("_InsightPluginEvent");
    element.setAttribute("name", name);
    var args = [];
    // NOTE: arguments is not a normal array so we can't just shift or splice it
    for( var i=1 ; i<arguments.length ; i++ ) {
        args.push(arguments[i]);
    }
    // if last arg is a function, it is a callback that should be triggered in response
    if(args.length>0 && typeof args[args.length-1] == "function") {
        callbacks["i:" + callbackIndex] = args.pop();
        element.setAttribute("callbackid", callbackIndex);
        callbackIndex++;
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
    for( var i=0 ; i<args.length ; i++ ) {
        if(args[i]=="__PASSTHRU_OBJECTS__") {
            args[i] = event.target.passthruObjects;
        }
    }
    var callback = null;
    if(event.target.hasAttribute("callbackid")) {
        var id = "i:" + event.target.getAttribute("callbackid");
        callback = callbacks[id];
        delete callbacks[id];
    }
    event.target.parentNode.removeChild(event.target);
    switch(name) {
        case "ready":
            // container is ready to load a program
            status = "ready";
            if(args.length==1) {
                if(args[0].rootUrl) {
                    PROGRAM.setRootUrl(args[0].rootUrl);
                }
                // args may already contain a program to load
                if(args[0].program) {
                    PROGRAM.load(args[0].program);
                }
            }
            exports.dispatchEvent("ready");
            break;
        case "message":
            args[0].data = JSON.parse(args[0].data || {});
            exports.dispatchEvent("message", args);
            break;
        case "pong":
            exports.dispatchEvent("pong", args);
            break;
        case "propertyForPlugin":
            if(args[0]=="__ERROR__") {
                CONSOLE.error("Error for getPropertyForPlugin(" + args[2][0].name + "): " + args[1].message);
            } else {
                callback(args[0]);
            }
            break;
        case "forPlugin":
            if(args[0]=="__ERROR__") {
                CONSOLE.error("Error for getForPlugin(" + args[2][0].name + "): " + args[1].message);
            } else {
                callback(args[0]);
            }
            break;
        case "ajax":
            if(args[0]=="__ERROR__") {
                CONSOLE.error("Error for ajax(" + args[2][0].name + "): " + args[1].message);
            } else {
                callback(args[0]);
            }
            break;
        default:
            exports.dispatchEvent(name, args);
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
