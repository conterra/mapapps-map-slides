define([
    "require",
    "./load-css",
    "reveal-js",
    "reveal-js/lib/js/head.min"
], function(require, loadCss, Reveal) {

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
        var params = Object.assign({
            //controls: false,
            //progress: true,
            history: true,
            //center: true,
            theme: "white",
            //transition: 'default',
            dependencies: ["markdown", "highlight", "zoom"]//["markdown", "zoom", "highlight"]
        }, opts);

        params.dependencies = pluginNamesToPlugins(params.dependencies);
        var theme = params.theme;
        if (theme && theme.indexOf("/") < 0) {
            theme = "reveal-js/css/theme/" + theme + ".css";
        }
        var start = function() {
            Reveal.initialize(params);
            Reveal.addEventListener('ready', function(event) {
                setTimeout(function() {
                    //refresh to ensure correct sizing
                    Reveal.setState(Reveal.getState());
                }, 200)
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