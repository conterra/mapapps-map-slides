define([
    "require",
    "./load-css",
    "reveal-js",
    "dojo/_base/lang",
    "ct/_url",
    "reveal-js/lib/js/head.min"
], function(require, loadCss, Reveal, d_lang, ct_url) {

    var mixin = Object.assign || d_lang.mixin;


    function relativeToSlideBase(src, slidebase) {
        return src ? ct_url.resourceURL(src, slidebase) : "";
    }

    function rewriteFristAttribute(elem, attributeNames, slidebase) {
        for (var j = 0, k = attributeNames.length; j < k; ++j) {
            var attr = attributeNames[j];
            var relative = relativeToSlideBase(elem.getAttribute(attr), slidebase);
            if (relative) {
                elem.setAttribute(attr, relative);
                return;
            }
        }
    }

    function sourceToSlideBase(elemList, slidebase, attributeNames) {
        for (var i = 0, l = elemList.length; i < l; ++i) {
            var elem = elemList.item(i);
            if (elem.slideBaseChanged) {
                continue;
            }
            elem.slideBaseChanged = true;
            rewriteFristAttribute(elem, attributeNames, slidebase);
        }
    }

    function rewriteSrc(slidebase) {
        var attributeNames = ["data-markdown", "data-src", "src", "href"];
        function withTag(tag) {
            return tag + "[" + attributeNames.join("]," + tag + "[") + "]";
        }
        var search = "section[" + attributeNames[0] + "]";
        search += ",a[" + attributeNames[attributeNames.length - 1] + "]";
        search += "," + withTag("iframe");
        search += "," + withTag("img");
        search += "," + withTag("video");
        search += "," + withTag("audio");
        var elements = document.querySelectorAll(search);
        sourceToSlideBase(elements, slidebase, attributeNames);
    }

    function rewriteSrcOnHtmlChange(slidebase) {
        var observer = new MutationObserver(function(mutations) {
            rewriteSrc(slidebase);
        });
        var config = {subtree: true, childList: true};
        observer.observe(document.querySelector(".reveal"), config);
    }

    function rewriteSourcesToSlideBase(slidebase) {
        rewriteSrc(slidebase);
        rewriteSrcOnHtmlChange(slidebase);
    }

    var namesToPlugins = {
        highlight: {
            src: '',
            async: true,
            callback: function() {
                require(["reveal-js/plugin/highlight/highlight"], function() {
                    loadCss(require.toUrl("reveal-js/lib/css/zenburn.css"), function() {
                        hljs.initHighlighting();
                    });
                });
            }
        },
        zoom: {
            src: '',
            async: true,
            callback: function() {
                require(["reveal-js/plugin/zoom-js/zoom"], function() {});
            }
        },
        markdown: {
            src: "",
            condition: function() {
                return !!document.querySelector('[data-markdown]');
            },
            callback: function() {
                require(["reveal-js/plugin/markdown/marked"], function(marked) {
                    var global_require = window.require;
                    window.require = function(n) {
                        if (n === "./marked") {
                            return marked;
                        }
                        return global_require.apply(this, arguments);
                    };
                    // load markdown plugin
                    require(["reveal-js/plugin/markdown/markdown"], function() {
                        // reset patch
                        window.require = global_require;
                    });
                });
            }
        }
    };

    function pluginNamesToPlugins(names) {
        var plugins = [];
        for (var i = 0, l = names.length; i < l; ++i) {
            var n = names[i];
            if (typeof (n) === "object") {
                plugins.push(n);
                continue;
            }
            var p = namesToPlugins[names[i]];
            if (p) {
                plugins.push(p);
            }
        }
        return plugins;
    }

    function initReveal(opts) {
        var params = mixin({
            //controls: false,
            //progress: true,
            history: true,
            //center: true,
            theme: "white",
            //transition: 'default',
            dependencies: ["markdown", "highlight", "zoom"]
        }, opts);

        params.dependencies = pluginNamesToPlugins(params.dependencies);
        var theme = params.theme;
        if (theme && theme.indexOf("/") < 0) {
            theme = "reveal-js/css/theme/" + theme + ".css";
        }
        var start = function() {
            Reveal.initialize(params);
            Reveal.addEventListener('ready', function(event) {
                var config = Reveal.getConfig();
                if (config.slidebase) {
                    rewriteSourcesToSlideBase(config.slidebase);
                }
                setTimeout(function() {
                    //refresh to ensure correct sizing
                    Reveal.setState(Reveal.getState());
                }, 200);
            });
        };
        loadCss(require.toUrl("reveal-js/css/reveal.css"), function() {
            if (theme) {
                loadCss(require.toUrl(theme), start);
            } else {
                start();
            }
        });
    }

    // export for extensions
    initReveal.namesToPlugins = namesToPlugins;
    return initReveal;
});