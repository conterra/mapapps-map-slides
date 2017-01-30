define([], function() {
    'use strict';
    var doc = document;
    function has() {
        return !doc.createStyleSheet;
    }
    var head = doc.head;

    function load(resourceDef, callback, options) {
        // create a link element to load the stylesheet
        var link = doc.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = resourceDef;
        var wait = !options || options.wait !== false;
        // old webkit's would claim to have onload, but didn't really support it
        var webkitVersion = navigator.userAgent.match(/AppleWebKit\/(\d+\.?\d*)/);
        webkitVersion = webkitVersion && +webkitVersion[1];
        if (link.onload === null && !(webkitVersion < 536)) {
            // most browsers support this onload function now
            link.onload = function() {
                // cleanup
                link.onload = null;
                link.onerror = null;
                wait && callback(link);
            };
            // always add the error handler, so we can notify of any errors
            link.onerror = function() {
                // there isn't really any recourse in AMD for errors, so
                // we just output the error and continue on
                console.error('Error loading stylesheet ' + resourceDef);
                wait && callback(link);
            };
        } else if (wait) {
            var interval = setInterval(function() {
                if (link.style) {
                    // loaded
                    clearInterval(interval);
                    callback(link);
                }
            }, 15);
        }
        // add it to the head to trigger loading
        (head || doc.getElementsByTagName('head')[0]).appendChild(link);
        if (!wait) {
            // don't wait for the stylesheet to load, proceed
            callback(link);
        }
    }
    return load;
});
