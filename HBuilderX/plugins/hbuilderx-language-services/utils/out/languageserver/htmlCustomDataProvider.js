"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomHTMLDataProvider = void 0;
const vscode_html_languageservice_1 = require("vscode-html-languageservice");
const rawData = {
    version: 1.1,
    tags: [
        {
            name: "meta",
            attributes: [
                {
                    name: "name",
                    values: [
                        { name: "author" },
                        { name: "description" },
                        { name: "keywords" },
                        { name: "generator" },
                        { name: "revised" },
                        { name: "viewport" }
                    ]
                },
                {
                    name: "http-equiv",
                    values: [
                        { name: "content-type" },
                        { name: "expires" },
                        { name: "refresh" },
                        { name: "set-cookie" }
                    ]
                },
                {
                    name: "charset",
                    values: [
                        { name: "UTF-8" },
                        { name: "GBK" }
                    ]
                },
            ]
        },
        {
            name: "link",
            attributes: [
                {
                    name: "rel",
                    values: [
                        { name: "alternate" },
                        { name: "author" },
                        { name: "help" },
                        { name: "icon" },
                        { name: "licence" },
                        { name: "next" },
                        { name: "pingback" },
                        { name: "prefetch" },
                        { name: "prev" },
                        { name: "search" },
                        { name: "sidebar" },
                        { name: "stylesheet" },
                        { name: "tag" }
                    ]
                },
                {
                    name: "type",
                    values: [
                        { name: "text/css" },
                    ]
                }
            ]
        },
        {
            name: "style",
            attributes: [
                {
                    name: "type",
                    values: [
                        { name: "text/css" },
                    ]
                }
            ]
        },
        {
            name: "script",
            attributes: [
                {
                    name: "type",
                    values: [
                        { name: "text/javascript" },
                    ]
                }
            ]
        },
        {
            name: "a",
            attributes: [
                {
                    name: "target",
                    valueSet: "ta"
                }
            ]
        }
    ],
    valueSets: [{
            name: "ta",
            values: [
                {
                    name: "_self",
                    description: "the current browsing context. (Default)"
                },
                {
                    name: "_blank",
                    description: "usually a new tab, but users can configure browsers to open a new window instead."
                },
                {
                    name: "_parent",
                    description: "the parent browsing context of the current one.If no parent, behaves as _self."
                },
                {
                    name: "_top",
                    description: "the topmost browsing context(the \"highest\" context that's an ancestor of the current one). If no ancestors, behaves as _self."
                }
            ]
        }]
};
function getCustomHTMLDataProvider() {
    return (0, vscode_html_languageservice_1.newHTMLDataProvider)("html5_participant", {
        version: 1,
        tags: rawData.tags || [],
        globalAttributes: [],
        valueSets: rawData.valueSets
    });
}
exports.getCustomHTMLDataProvider = getCustomHTMLDataProvider;
//# sourceMappingURL=htmlCustomDataProvider.js.map