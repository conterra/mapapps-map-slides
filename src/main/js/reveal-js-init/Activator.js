/* 
 *  Copyright (C) con terra GmbH (http://www.conterra.de)
 *  All rights reserved
 */
define(["./init-reveal", "require"], function(init, require) {

    function injectSlides(ctx, slideHtml) {
        if (slideHtml) {
            var ref = ctx.getServiceReferences("ct.framework.api.ApplicationContext")[0];
            var appCtx = ctx.getService(ref);
            var root = appCtx.getApplicationRootNode();
            root.innerHTML = "<div class='reveal'>" + slideHtml + "</div>";
        }
    }

    function start(ctx, config) {
        var slidebase = config.slidebase;
        if (slidebase) {
            require(["dojo/text!" + slidebase + "/slides.html"], function(slides) {
                injectSlides(ctx, slides);
                init(config);
            });
        } else {
            init(config);
        }
    }

    return function() {
        return {
            start: function(ctx) {
                var config;
                ctx.addBundleListener(function(evt) {
                    var b = evt.getBundle();
                    if (evt.getTypeName() !== "STARTED") {
                        return;
                    }
                    var headers = b.getHeaders();
                    if (!headers.get("reveal-js-slides")) {
                        return;
                    }
                    config = Object.assign({}, headers.get("reveal-js-config") || {});
                    config.slidebase = b.getNamespace();
                });
                ctx.addFrameworkListener(function(evt) {
                    if (evt.getTypeName() !== "STARTED") {
                        return;
                    }
                    // hack... better config service?
                    var appconfig = ctx.getProperty("Application-Config");
                    var loc = ctx.getProperty("Application-Location");
                    var bconfig = appconfig && appconfig.bundles;
                    bconfig = bconfig && bconfig["reveal-js-init"];
                    var appConfig = (bconfig && bconfig.Config) || {};
                    if (!config) {
                        config = appConfig;
                        if (config.slidebase === undefined) {
                            config.slidebase = loc;
                        }
                    } else {
                        Object.assign(config, appConfig);
                    }
                    start(ctx, config);
                });
            }
        };
    };
});