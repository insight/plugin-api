
// TODO: This module needs to be replaced with a proper insight-lib

var EVENTS = require("./events");

exports.to = function(context) {
    if(context=="plugin") {
        return new PluginPlugin();
    }
}

var PluginPlugin = function() {
}

PluginPlugin.prototype.plugin = function(alias) {
    this.alias = alias;
    return this;
}

PluginPlugin.prototype.sendSimpleMessage = function(message) {
    EVENTS.dispatchHostEvent("pluginMessage", {
        "type": "simple",
// TODO: Allow sending messages to other plugins
//        "alias": this.alias,
        "data": message
    });
}
