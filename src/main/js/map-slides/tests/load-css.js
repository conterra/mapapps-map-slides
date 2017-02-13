/* 
 *  Copyright (C) con terra GmbH (http://www.conterra.de)
 *  All rights reserved
 */
define([
    "intern!object",
    "intern/chai!assert",
    "module",
    "require",
    "../load-css"
], function(registerSuite, assert, md, require, loadCss) {

    function addDiv(id) {
        var d = document.createElement("div");
        d.setAttribute("id", id || "test-div");
        document.body.appendChild(d);
        return d;
    }

    function getWidth(testDiv) {
        return window.getComputedStyle(testDiv, null).getPropertyValue("width");
    }

    var testDiv;

    registerSuite({
        name: md.id,
        "before": function() {
            testDiv = addDiv();
        },
        "after": function() {
            if (testDiv) {
                document.body.removeChild(testDiv);
                testDiv = undefined;
            }
        },
        "expect load css waits for loading of css": function() {
            assert.notEqual("100px", getWidth(testDiv));
            loadCss(require.toUrl("./test.css"), this.async().callback(function(obj) {
                assert.equal("100px", getWidth(testDiv));
                assert(!obj.error);
                assert(obj.url);
            }));
        },
        "expect load failure is transported as error": function() {
            loadCss(require.toUrl("./wrong.css"), this.async().callback(function(obj) {
                assert(obj.error);
                assert(obj.url);
            }));
        }
    });
});