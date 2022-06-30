"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doComplete = void 0;
const vscode_languageserver_protocol_1 = require("vscode-languageserver-protocol");
const htmlDataUtils_1 = require("./htmlDataUtils");
const dataProvider = (0, htmlDataUtils_1.htmlDataProvider)();
const eventsCache = [];
function doComplete(position, document, options) {
    if (eventsCache.length > 0)
        return eventsCache;
    let attrData = dataProvider.provideAttributes('body');
    attrData.forEach(data => {
        if (data === null || data === void 0 ? void 0 : data.name.startsWith('on')) {
            eventsCache.push({
                label: data.name.substring(2),
                kind: vscode_languageserver_protocol_1.CompletionItemKind.Event
            });
        }
    });
    return eventsCache;
}
exports.doComplete = doComplete;
//# sourceMappingURL=htmlEventHandler.js.map