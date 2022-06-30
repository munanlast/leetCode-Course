"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIndexedCompletionItem = void 0;
const indexlib_1 = require("../../../../indexlib");
const vscode_html_languageservice_1 = require("vscode-html-languageservice");
function getIndexedCompletionItem(_uri, _ws) {
    let result = [];
    indexlib_1.IndexDataStore.load(_ws).allIndexData().forEach((indexdata, _key) => {
        indexdata.categories.forEach(cate => {
            let htmldata = indexdata[cate];
            if (htmldata) {
                htmldata.forEach((item) => {
                    result.push({
                        label: item.label,
                        kind: vscode_html_languageservice_1.CompletionItemKind.Text
                    });
                });
            }
        });
    });
    return result;
}
exports.getIndexedCompletionItem = getIndexedCompletionItem;
//# sourceMappingURL=htmlIndexData.js.map