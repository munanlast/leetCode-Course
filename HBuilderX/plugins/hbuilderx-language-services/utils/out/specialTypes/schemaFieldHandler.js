"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gotoDefinition = exports.doComplete = void 0;
const vscode_languageserver_protocol_1 = require("vscode-languageserver-protocol");
function doComplete(position, document, options) {
    let completions = [];
    let jsonDocument = options.jsonDocument;
    let node = jsonDocument.getNodeFromOffset(document.offsetAt(position));
    let parentNode = node.parent;
    if ((parentNode === null || parentNode === void 0 ? void 0 : parentNode.type) === 'array') {
        parentNode = parentNode.parent;
        if ((parentNode === null || parentNode === void 0 ? void 0 : parentNode.type) === 'property') {
            parentNode = parentNode.parent;
            if (parentNode.type === 'object') {
                for (let propertyNode of parentNode.properties) {
                    if (propertyNode.keyNode.value != 'properties')
                        continue;
                    propertyNode.valueNode.children.forEach((value) => {
                        if (value.type === 'property') {
                            let property = value.keyNode.value;
                            if (property !== '_id') {
                                completions.push({
                                    label: property,
                                    kind: vscode_languageserver_protocol_1.CompletionItemKind.Property
                                });
                            }
                        }
                    });
                }
            }
        }
    }
    return completions;
}
exports.doComplete = doComplete;
function gotoDefinition() {
}
exports.gotoDefinition = gotoDefinition;
//# sourceMappingURL=schemaFieldHandler.js.map