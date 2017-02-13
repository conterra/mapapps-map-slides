define([
    "./init-reveal", "require"
], function(init, require) {

    var removeStartedInterval;
    function removeStartedClass(root) {
        //TODO: remove this function if init.js of map.apps does not create problems
        clearInterval(removeStartedInterval);
        if (root.className.indexOf("start") > -1) {
            removeStartedInterval = setInterval(function() {
                if (root.className.indexOf("started") > -1) {
                    root.className = root.className.replace("started", "");
                    clearInterval(removeStartedInterval);
                }
            }, 100);
        }
    }

    function injectSlidesIntoIndexHtml(appCtx, slideHtml) {
        if (slideHtml) {
            var root = appCtx.getApplicationRootNode();
            root.innerHTML = "<div class='reveal'>" + slideHtml + "</div>";
            removeStartedClass(root);
        }
    }

    function start(appCtx, config) {
        var slidebase = config.slidebase;
        if (slidebase) {
            require(["dojo/text!" + slidebase + "/slides.html"], function(html) {
                injectSlidesIntoIndexHtml(appCtx, html);
                init(config);
            });
        } else {
            init(config);
        }
    }

    return function() {
        return {
            _startSlideShow: function() {
                var bCtx = this._componentContext.getBundleContext();
                var appLoc = bCtx.getProperty("Application-Location");
                var appCtx = this._appCtx;
                var config = this._properties;
                if (config.slidebase === undefined) {
                    config.slidebase = appLoc;
                }
                start(appCtx, config);
            }
        };
    };
});