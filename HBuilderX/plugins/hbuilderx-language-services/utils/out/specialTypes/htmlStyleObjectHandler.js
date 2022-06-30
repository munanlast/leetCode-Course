"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gotoDefinition = exports.doComplete = void 0;
const typescript = require("typescript");
const vscode_languageserver_protocol_1 = require("vscode-languageserver-protocol");
const vscode_css_languageservice_1 = require("vscode-css-languageservice");
var allAttributes = [];
function initData() {
    let cssProvider = (0, vscode_css_languageservice_1.getDefaultCSSDataProvider)();
    let properties = cssProvider.provideProperties();
    properties.forEach(value => {
        allAttributes.push(value);
    });
}
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
//# sourceMappingURL=htmlStyleObjectHandler.js.map