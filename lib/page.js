
var EVENTS = require("./events");

exports.getWindow = function(callback) {
    EVENTS.dispatchHostEvent("getForPlugin", {
        "name": "pageWindow"
    }, callback);
}

/**
 * @see https://github.com/carhartl/jquery-cookie/blob/master/jquery.cookie.js
 */
exports.setCookie = function(key, value, options) {
    options = options || {};
    if (value === null) {
        options.expires = -1;
    }
    if (typeof options.expires === 'number') {
        var days = options.expires,
            t = options.expires = new Date();
        t.setDate(t.getDate() + days);
    }
    exports.getWindow(function(window) {
        window.document.cookie = [
            encodeURIComponent(key), '=',
//            options.raw ? String(value) : encodeURIComponent(""+value),
            encodeURIComponent(""+value),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join('');
    });
}

exports.deleteCookie = function(key, options) {
    exports.setCookie(key, null, options);
}


/**
 * @see https://github.com/carhartl/jquery-cookie/blob/master/jquery.cookie.js
 */
exports.getCookie = function(key, callback) {
    exports.getWindow(function(window) {
        var result;
        callback((result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(window.document.cookie)) ? decodeURIComponent(result[1]) : null);
    });
}
