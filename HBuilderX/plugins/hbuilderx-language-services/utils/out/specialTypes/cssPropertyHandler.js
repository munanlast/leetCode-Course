"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doComplete = void 0;
const vscode_languageserver_protocol_1 = require("vscode-languageserver-protocol");
const htmlDataUtils_1 = require("./htmlDataUtils");
const dataProvider = (0, htmlDataUtils_1.cssDataProvider)();
function doComplete(position, document, options) {
    let properties = dataProvider.provideProperties();
    const range = options === null || options === void 0 ? void 0 : options.replaceRange;
    return properties.map((prop) => {
        return {
            label: prop.name,
            kind: vscode_languageserver_protocol_1.CompletionItemKind.Property,
            textEdit: range ? vscode_languageserver_protocol_1.TextEdit.replace(range, prop.name) : undefined
        };
    });
}
exports.doComplete = doComplete;
//# sourceMappingURL=cssPropertyHandler.js.map