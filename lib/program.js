
var CONSOLE = require("./console");

var rootUrl;

exports.setRootUrl = function(url) {
    rootUrl = url;
}

exports.getRootUrl = function() {
    return rootUrl;
}

exports.load = function(programId) {
    require([programId], function(PROGRAM) {
        require.ready(function() {
            PROGRAM.main();
        });
    });
}
