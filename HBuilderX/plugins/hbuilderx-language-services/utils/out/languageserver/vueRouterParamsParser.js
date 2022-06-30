"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVueRouterParamsCompletions = void 0;
const ts = require("typescript");
const vscode_uri_1 = require("vscode-uri");
const indexlib_1 = require("../../../indexlib");
function getVueRouterParamsCompletions(project) {
    let wsUri = vscode_uri_1.URI.file(project).toString();
    let allData = indexlib_1.IndexDataStore.load({ uri: wsUri, name: '' }).allIndexData();
    let result = [];
    allData.forEach((indexData) => {
        let cateData = indexData['router-path'];
        if (cateData instanceof Array) {
            cateData.forEach((item) => {
                const indexItem = item;
                if (typeof indexItem.data == 'string') {
                    let path = indexItem.data;
                    let matches = path.match(/\/:[^:\/]+/g);
                    matches === null || matches === void 0 ? void 0 : matches.forEach((part) => {
                        let tmp = part.slice(2);
                        if (tmp) {
                            result.push({
                                name: tmp,
                                kind: ts.ScriptElementKind.memberVariableElement,
                                sortText: 'aa'
                            });
                        }
                    });
                }
            });
        }
    });
    return result;
}
exports.getVueRouterParamsCompletions = getVueRouterParamsCompletions;
//# sourceMappingURL=vueRouterParamsParser.js.map