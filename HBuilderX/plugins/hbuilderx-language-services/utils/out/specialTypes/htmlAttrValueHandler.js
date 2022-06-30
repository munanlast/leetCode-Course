"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doComplete = void 0;
const vscode_languageserver_protocol_1 = require("vscode-languageserver-protocol");
const vscode_uri_1 = require("vscode-uri");
const hxIconKind_1 = require("../languageserver/hxIconKind");
const htmlDataUtils_1 = require("./htmlDataUtils");
const vscode_json_languageservice_1 = require("vscode-json-languageservice");
const type_resolve_1 = require("../common/type-resolve");
const ts = require("typescript/lib/tsserverlibrary");
const htmlCustomDataProvider_1 = require("../languageserver/htmlCustomDataProvider");
const ProjectFileFilter_1 = require("../languageserver/ProjectFileFilter");
const idClassDataProvider_1 = require("../languageserver/idClassDataProvider");
const valuesCache = new Map();
function getDistinctAttrsValues(name) {
    var _a, _b;
    if (valuesCache.size > 0) {
        return (_a = valuesCache.get(name)) !== null && _a !== void 0 ? _a : [];
    }
    let distinckValues = new Set();
    const dataProvider = (0, htmlDataUtils_1.htmlDataProvider)();
    const customData = (0, htmlCustomDataProvider_1.getCustomHTMLDataProvider)();
    let providers = [dataProvider, customData];
    providers.forEach(provider => {
        var _a;
        let tags = provider.provideTags();
        for (let tag of tags) {
            let attrs = provider.provideAttributes(tag.name);
            for (let attr of attrs) {
                let values = provider.provideValues(tag.name, attr.name);
                let temp = [];
                values.forEach((val) => {
                    const key = `${attr.name}:${val.name}`;
                    if (!distinckValues.has(key)) {
                        temp.push(val);
                        distinckValues.add(key);
                    }
                });
                if (valuesCache.has(attr.name)) {
                    (_a = valuesCache.get(attr.name)) === null || _a === void 0 ? void 0 : _a.push(...temp);
                }
                else {
                    valuesCache.set(attr.name, temp);
                }
            }
        }
    });
    return (_b = valuesCache.get(name)) !== null && _b !== void 0 ? _b : [];
    ;
}
function getCompletionsForAttr(name, replaceRange) {
    let vlaues = getDistinctAttrsValues(name);
    return vlaues.map((value) => {
        return {
            label: value.name,
            kind: vscode_languageserver_protocol_1.CompletionItemKind.Unit,
            textEdit: replaceRange ? vscode_json_languageservice_1.TextEdit.replace(replaceRange, value.name) : undefined,
            data: {
                hxKind: hxIconKind_1.HxIconKind.ATTRIBUTE
            }
        };
    });
}
const DQ = '"'.charCodeAt(0);
const SQ = '\''.charCodeAt(0);
function getFileCompletions(document, ws, replaceRange, offset, token) {
    var _a, _b;
    const text = document.getText();
    let start = offset;
    let limit = token.getStart();
    while (start > limit) {
        let t = text.charCodeAt(start - 1);
        if (t == DQ || t == SQ) {
            break;
        }
        start--;
    }
    let prefix = text.slice(start, offset);
    let options = { extensionFilters: [], prefixPath: prefix, timeout: 200, withAllCurrentLevelFiles: true };
    let filesInfos = (_b = (_a = (0, ProjectFileFilter_1.getCompletionFilesSync)(ws, options, document.uri)) === null || _a === void 0 ? void 0 : _a.files) !== null && _b !== void 0 ? _b : [];
    let result = [];
    filesInfos.forEach((info) => {
        result.push({
            label: info.relative,
            kind: info.isDir ? vscode_languageserver_protocol_1.CompletionItemKind.Folder : vscode_languageserver_protocol_1.CompletionItemKind.File,
            data: {
                hxKind: info.isDir ? hxIconKind_1.HxIconKind.FOLDER : hxIconKind_1.HxIconKind.FILE
            }
        });
    });
    return result;
}
function getIdCompletions(document, workspaceFolder) {
    let result = [];
    (0, idClassDataProvider_1.filterIdData)(workspaceFolder, document, true).forEach((item) => {
        result.push(...item.names.map((name) => {
            return { label: name };
        }));
    });
    return result;
}
function getClassCompletions(document, workspaceFolder) {
    let result = [];
    (0, idClassDataProvider_1.filterClassData)(workspaceFolder, document, true).forEach((item) => {
        result.push(...item.names.map((name) => {
            return { label: name };
        }));
    });
    return result;
}
function doComplete(position, document, options) {
    if (!options.sourceFile) {
        return [];
    }
    let sf = options.sourceFile;
    let offset = document.offsetAt(position);
    let token = (0, type_resolve_1.getTokenAtPosition)(sf, offset);
    if (token) {
        let parent = token.parent;
        if (parent && parent.kind == ts.SyntaxKind.CallExpression) {
            let args = parent.arguments;
            let beforeArg = -1;
            for (let i = 0; i < args.length; i++) {
                let a = args[i];
                if (offset >= a.getStart() && offset <= a.getEnd()) {
                    beforeArg = i - 1;
                    break;
                }
            }
            if (beforeArg >= 0) {
                let node = args[beforeArg];
                if (node.kind == ts.SyntaxKind.StringLiteral) {
                    let name = node.getText();
                    let t = name.charCodeAt(0);
                    if (t == DQ || t == SQ) {
                        name = name.slice(1, -1);
                    }
                    let wsUri = options.workspaceFolder.toString();
                    let ws = { name: '', uri: vscode_uri_1.URI.file(wsUri).toString() };
                    if (name == 'src') {
                        return ws ? getFileCompletions(document, ws, options.replaceRange, offset, node) : [];
                    }
                    else if (name == 'id') {
                        return ws ? getIdCompletions(document, ws) : [];
                    }
                    else if (name == 'class') {
                        return ws ? getClassCompletions(document, ws) : [];
                    }
                    else {
                        return getCompletionsForAttr(name, options === null || options === void 0 ? void 0 : options.replaceRange);
                    }
                }
            }
        }
    }
    return [];
}
exports.doComplete = doComplete;
//# sourceMappingURL=htmlAttrValueHandler.js.map