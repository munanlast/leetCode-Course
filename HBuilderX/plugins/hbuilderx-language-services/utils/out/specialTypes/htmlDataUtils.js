"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDocumentation = exports.cssDataProvider = exports.htmlDataProvider = void 0;
const vscode_html_languageservice_1 = require("vscode-html-languageservice");
const vscode_css_languageservice_1 = require("vscode-css-languageservice");
let defaultHtmlData = null;
let defaultCssData = null;
function htmlDataProvider() {
    if (!defaultHtmlData) {
        defaultHtmlData = (0, vscode_html_languageservice_1.getDefaultHTMLDataProvider)();
    }
    return defaultHtmlData;
}
exports.htmlDataProvider = htmlDataProvider;
function cssDataProvider() {
    if (!defaultCssData) {
        defaultCssData = (0, vscode_css_languageservice_1.getDefaultCSSDataProvider)();
    }
    return defaultCssData;
}
exports.cssDataProvider = cssDataProvider;
function generateDocumentation(item) {
    const result = {
        kind: 'markdown',
        value: ''
    };
    if (item.description) {
        if (typeof item.description === 'string') {
            result.value += item.description;
        }
        else {
            result.value += item.description.value;
        }
    }
    if (item.references && item.references.length > 0) {
        if (result.value.length) {
            result.value += `\n\n`;
        }
        result.value += item.references.map(r => {
            return `[${r.name}](${r.url})`;
        }).join(' | ');
    }
    if (result.value === '') {
        return undefined;
    }
    return result;
}
exports.generateDocumentation = generateDocumentation;
//# sourceMappingURL=htmlDataUtils.js.map