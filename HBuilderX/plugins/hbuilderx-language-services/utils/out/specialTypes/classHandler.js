"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doComplete = void 0;
const vscode_languageserver_protocol_1 = require("vscode-languageserver-protocol");
const indexlib_1 = require("../../../indexlib");
const idHandler_1 = require("./idHandler");
const vscode_uri_1 = require("vscode-uri");
function addClassResults(filePath, classes, cssRefs, classResults) {
    let cssIndexData = cssRefs.get(filePath);
    let classFiles = new Set();
    cssIndexData.references.forEach(item => {
        classFiles.add(item.uri);
    });
    classFiles.add(filePath);
    for (const [key, value] of classes.entries()) {
        let set = new Set();
        for (let classFile of classFiles) {
            if (value.has(classFile)) {
                set.add(classFile);
            }
        }
        classResults.set(key, Array.from(set).join(`\n`));
    }
}
function addCSSResultClasses(classResults, filePath, classes) {
    for (const [key, value] of classes.entries()) {
        if (value.has(filePath)) {
            classResults.set(key, filePath);
        }
    }
}
function doComplete(position, document, options) {
    let result = [];
    let data = indexlib_1.IndexDataStore.load({
        uri: vscode_uri_1.URI.file(options.workspaceFolder).toString(),
        name: ''
    });
    // key: name (id名称等) | value: data
    let resultIds = new Map();
    // key: name (id名称等) | value: 引用该ID的文件集合
    let classes = (0, idHandler_1.getClassList)(data);
    // key: uri | value: 索引数据
    let cssRefs = new Map();
    for (const [key, value] of data.allIndexData().entries()) {
        if (key.endsWith('.css') || key.endsWith('.scss') || key.endsWith('.sass') || key.endsWith('.stylus')) {
            cssRefs.set(key, value);
        }
    }
    let classResults = new Map();
    if ((0, idHandler_1.isHTMLDocument)(document)) {
        addClassResults(document.uri, classes, cssRefs, classResults);
    }
    else if ((0, idHandler_1.isJSDocument)(document)) {
        let jsRefs = new Map();
        for (const [key, value] of data.allIndexData().entries()) {
            if (key.endsWith('.js') || key.endsWith('.ts')) {
                jsRefs.set(key, value);
            }
        }
        if (jsRefs.has(document.uri)) {
            let jsIndexData = jsRefs.get(document.uri);
            jsIndexData.references.forEach(item => {
                addClassResults(item.uri, classes, cssRefs, classResults);
            });
        }
    }
    else if ((0, idHandler_1.isCSSDocument)(document)) {
        addCSSResultClasses(classResults, document.uri, classes);
    }
    for (const [key, value] of classResults.entries()) {
        result.push({
            kind: vscode_languageserver_protocol_1.CompletionItemKind.Class,
            label: key,
            detail: value
        });
    }
    for (const [key, value] of classes.entries()) {
        if (!classResults.has(key)) {
            result.push({
                kind: vscode_languageserver_protocol_1.CompletionItemKind.Class,
                label: key,
                detail: Array.from(classResults.get(key)).join(`\n`)
            });
        }
    }
    return result;
}
exports.doComplete = doComplete;
//# sourceMappingURL=classHandler.js.map