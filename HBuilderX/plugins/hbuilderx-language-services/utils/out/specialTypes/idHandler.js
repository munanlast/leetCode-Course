"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gotoDefinition = exports.doComplete = exports.getClassList = exports.getIDList = exports.isHTMLDocument = exports.isCSSDocument = exports.isJSDocument = void 0;
const typescript = require("typescript");
const vscode_languageserver_protocol_1 = require("vscode-languageserver-protocol");
const indexlib_1 = require("../../../indexlib");
const vscode_uri_1 = require("vscode-uri");
function getJSReference(item) {
    return item.references.filter(value => value.type === indexlib_1.ReferenceFileType.Script);
}
function getCSSReference(item) {
    return item.references.filter(value => value.type === indexlib_1.ReferenceFileType.CSS);
}
function getReferenceByType(item, type) {
    return item.references.filter(value => value.type === type);
}
function isJSDocument(document) {
    return document.languageId === 'javascript' || document.languageId === 'typescript';
}
exports.isJSDocument = isJSDocument;
function isCSSDocument(document) {
    return document.languageId === 'css' || document.languageId === 'stylus' || document.languageId === 'scss' || document.languageId === 'sass';
}
exports.isCSSDocument = isCSSDocument;
function isHTMLDocument(document) {
    return document.languageId === 'html' || document.languageId === 'html_es6' || document.languageId === 'pug';
}
exports.isHTMLDocument = isHTMLDocument;
function getList(data, category) {
    let idMaps = new Map();
    for (const [key, value] of data.allIndexData().entries()) {
        let ids = value[category] || null;
        if (ids && ids instanceof Array) {
            ids.forEach(id => {
                if (idMaps.has(id.label)) {
                    idMaps.get(id.label).add(key);
                }
                else {
                    idMaps.set(id.label, new Set([key]));
                }
            });
        }
    }
    return idMaps;
}
function getIDList(data) {
    return getList(data, indexlib_1.IndexDataCategory.ID);
}
exports.getIDList = getIDList;
function getClassList(data) {
    return getList(data, indexlib_1.IndexDataCategory.CLASS);
}
exports.getClassList = getClassList;
function doComplete(position, document, options) {
    let result = [];
    let data = indexlib_1.IndexDataStore.load({
        uri: vscode_uri_1.URI.file(options.workspaceFolder).toString(),
        name: ''
    });
    // key: name (id名称等) | value: data
    let resultIds = new Map();
    // let unReferenceIds: Map<string, string> = new Map<string, string>();
    // key: name (id名称等) | value: 引用该ID的文件集合
    let idMaps = getIDList(data);
    if (isHTMLDocument(document)) {
        let item = data.indexData(document.uri);
        let ids = item[indexlib_1.IndexDataCategory.ID] || null;
        if (ids && ids instanceof Array) {
            ids.forEach(value => {
                resultIds.set(value.label, value.description || value.label);
            });
        }
    }
    else {
        // key: uri | value: 索引数据
        let references = new Map();
        if (isJSDocument(document)) {
            for (const [key, value] of data.allIndexData().entries()) {
                if (key.endsWith('.js') || key.endsWith('.ts')) {
                    references.set(key, value);
                }
            }
        }
        else if (isCSSDocument(document)) {
            for (const [key, value] of data.allIndexData().entries()) {
                if (key.endsWith('.css') || key.endsWith('.scss') || key.endsWith('.sass') || key.endsWith('.stylus')) {
                    references.set(key, value);
                }
            }
        }
        if (references.size > 0 && references.has(document.uri)) {
            let indexData = references.get(document.uri);
            indexData.references.forEach(file => {
                for (const [key, value] of idMaps.entries()) {
                    if (value.has(file.uri)) {
                        resultIds.set(key, file.uri);
                    }
                }
            });
        }
        else {
            for (const [key, value] of idMaps.entries()) {
                let htmlFiles = [];
                value.forEach(file => {
                    if (!file.endsWith('.css')) {
                        htmlFiles.push(file);
                    }
                });
                if (htmlFiles.length > 0) {
                    resultIds.set(key, htmlFiles.join('\n'));
                }
            }
        }
    }
    // resultId
    for (const [key, value] of resultIds.entries()) {
        result.push({
            kind: vscode_languageserver_protocol_1.CompletionItemKind.Property,
            label: key,
            detail: value
        });
    }
    // unReferenceIds
    for (const [key, value] of idMaps.entries()) {
        if (!resultIds.has(key)) {
            let htmlFiles = [];
            value.forEach(file => {
                if (!file.endsWith('.css')) {
                    htmlFiles.push(file);
                }
            });
            if (htmlFiles.length > 0) {
                result.push({
                    kind: vscode_languageserver_protocol_1.CompletionItemKind.Property,
                    label: key,
                    detail: Array.from(value).join('\n')
                });
            }
        }
    }
    return result;
}
exports.doComplete = doComplete;
const HTML_FIEL_REG = /.html?/i;
function gotoDefinition(text, options) {
    if (!options.workspaceFolder || !options.fileName) {
        return undefined;
    }
    const path = options.fileName;
    let currFile = path.startsWith('file://') ? vscode_uri_1.URI.parse(path).toString() : vscode_uri_1.URI.file(path).toString();
    let uri = vscode_uri_1.URI.file(options.workspaceFolder).toString();
    let allData = indexlib_1.IndexDataStore.load({ uri, name: '' }).allIndexData();
    let searchedFile = new Set();
    let referenceChain = [currFile];
    while (referenceChain.length > 0) {
        let file = referenceChain.shift();
        let extensionPos = file.lastIndexOf('.');
        if (extensionPos <= 0) {
            continue;
        }
        let extText = file.slice(extensionPos);
        if ((extText == '.html' || extText == '.htm') && !searchedFile.has(file)) {
            let fileData = allData.get(file);
            if (fileData) {
                let items = fileData[indexlib_1.IndexDataCategory.ID];
                for (let i = 0; i < items.length; i++) {
                    let indexItem = items[i];
                    if (indexItem.type === indexlib_1.IndexItemType.DEF &&
                        indexItem.label == text &&
                        typeof indexItem.offset === 'number') {
                        let end = indexItem.position.character + indexItem.label.length;
                        let tokenPos = options.token.getStart();
                        if (options.token.kind == typescript.SyntaxKind.StringLiteral) {
                            tokenPos += options.token.getText().indexOf(text);
                        }
                        return {
                            definitions: [{
                                    resolvedDefinition: {
                                        textSpanPosition: indexItem.position
                                    },
                                    textSpan: { start: indexItem.offset, length: text.length },
                                    fileName: vscode_uri_1.URI.parse(file).fsPath,
                                    originSelectionRange: options.range,
                                }],
                            textSpan: { start: tokenPos, length: text.length }
                        };
                    }
                    ;
                }
            }
        }
        // 没有找到
        searchedFile.add(file);
        allData.forEach((data, uri) => {
            if (!searchedFile.has(uri)) {
                let has = data.references.some(ref => {
                    return ref.uri == file;
                });
                if (has) {
                    referenceChain.push(uri);
                }
            }
        });
    }
    return undefined;
}
exports.gotoDefinition = gotoDefinition;
//# sourceMappingURL=idHandler.js.map