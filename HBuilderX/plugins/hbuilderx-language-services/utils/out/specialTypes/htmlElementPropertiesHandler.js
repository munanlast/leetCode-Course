"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gotoDefinition = exports.doComplete = void 0;
const typescript = require("typescript");
const vscode_languageserver_protocol_1 = require("vscode-languageserver-protocol");
const vscode_html_languageservice_1 = require("vscode-html-languageservice");
var allAttributes = [];
function initData() {
    let htmlProviders = (0, vscode_html_languageservice_1.getDefaultHTMLDataProvider)();
    let tags = htmlProviders.provideTags();
    tags.forEach(value => {
        htmlProviders.provideAttributes(value.name).forEach(attributes => {
            allAttributes.push(value);
        });
    });
}
initData();
function doComplete(position, document, options) {
    let result;
    let sourceFile = typescript.createSourceFile('', document.getText(), typescript.ScriptTarget.Latest);
    allAttributes.forEach(value => {
        result.push({
            kind: vscode_languageserver_protocol_1.CompletionItemKind.Property,
            label: value.name
        });
    });
    return result;
}
exports.doComplete = doComplete;
function gotoDefinition() {
}
exports.gotoDefinition = gotoDefinition;
//# sourceMappingURL=htmlElementPropertiesHandler.js.map