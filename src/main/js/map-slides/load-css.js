define([], function() {
    'use strict';
    var doc = document;
    var head = doc.head;

    function load(href, loadedCallback) {
        // create a link element to load the stylesheet
        var link = doc.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = href;
        // old webkit's would claim to have onload, but didn't really support it
        var webkitVersion = navigator.userAgent.match(/AppleWebKit\/(\d+\.?\d*)/);
        webkitVersion = webkitVersion && +webkitVersion[1];
        if (link.onload === null && !(webkitVersion < 536)) {
            // most browsers support this onload function now
            link.onload = function() {
                // cleanup
                link.onload = null;
                link.onerror = null;
                loadedCallback && loadedCallback({
                    url: href
                });
            };
            link.onerror = function() {
                loadedCallback && loadedCallback({
                    url: href,
                    error: href
                });
            };
        } else {
            var interval = setInterval(function() {
                if (link.style) {
                    clearInterval(interval);
                    loadedCallback && loadedCallback({
                        url: href
                    });
                }
            }, 15);
        }
        (head || doc.getElementsByTagName('head')[0]).appendChild(link);
    }
    return load;
});
