"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doComplete = void 0;
const vscode_languageserver_protocol_1 = require("vscode-languageserver-protocol");
const hxIconKind_1 = require("../languageserver/hxIconKind");
const htmlDataUtils_1 = require("./htmlDataUtils");
const dataProvider = (0, htmlDataUtils_1.htmlDataProvider)();
const attrsCache = [];
function getDistinctAttrs() {
    if (attrsCache.length > 0) {
        return attrsCache;
    }
    let distinctAttr = new Set();
    let tags = dataProvider.provideTags();
    for (let tag of tags) {
        let attrs = dataProvider.provideAttributes(tag.name);
        for (let attr of attrs) {
            if (!distinctAttr.has(attr.name)) {
                distinctAttr.add(attr.name);
                attrsCache.push(attr);
            }
        }
    }
    return attrsCache;
}
function doComplete(position, document, options) {
    let tags = dataProvider.provideTags();
    let attrs = getDistinctAttrs();
    const range = options === null || options === void 0 ? void 0 : options.replaceRange;
    return attrs.map((attr) => {
        return {
            label: attr.name,
            kind: vscode_languageserver_protocol_1.CompletionItemKind.Value,
            textEdit: range ? vscode_languageserver_protocol_1.TextEdit.replace(range, attr.name) : undefined,
            data: {
                hxKind: hxIconKind_1.HxIconKind.ATTRIBUTE
            }
        };
    });
}
exports.doComplete = doComplete;
//# sourceMappingURL=htmlAttrHandler.js.map