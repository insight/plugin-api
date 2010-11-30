
exports.log = function() {
    if(!top.console) return;
    top.console.log.apply(null, arguments);
}

exports.info = function() {
    if(!top.console) return;
    top.console.info.apply(null, arguments);
}

exports.warn = function() {
    if(!top.console) return;
    top.console.warn.apply(null, arguments);
}

exports.error = function() {
    if(!top.console) return;
    top.console.error.apply(null, arguments);
}

exports.group = function() {
    if(!top.console) return;
    top.console.group.apply(null, arguments);
}

exports.groupEnd = function() {
    if(!top.console) return;
    top.console.groupEnd.apply(null, arguments);
}
