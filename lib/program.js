
var CONSOLE = require("./console");

var rootUrl,
    programId;

exports.setRootUrl = function(url) {
    rootUrl = url;
}

exports.getRootUrl = function() {
    return rootUrl;
}

exports.getProgramId = function() {
    return programId;
}

// NOTE: This should only be called once
exports.load = function(id) {
    programId = id;
    require([id], function(PROGRAM) {
        require.ready(function() {
            PROGRAM.main();
        });
    });
}
