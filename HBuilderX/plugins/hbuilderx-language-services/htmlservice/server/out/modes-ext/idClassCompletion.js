"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdClassCompletionParticipant = void 0;
const vscode_html_languageservice_1 = require("vscode-html-languageservice");
const utils_1 = require("../../../../utils");
const strings_1 = require("../utils/strings");
const vscode_languageserver_1 = require("vscode-languageserver");
const vscode_uri_1 = require("vscode-uri");
const indexlib_1 = require("../../../../indexlib");
const path = require("path");
const whiteSpaceCharCode = [
    ' '.charCodeAt(0),
    '\n'.charCodeAt(0),
    '\t'.charCodeAt(0),
    '\f'.charCodeAt(0),
    '\r'.charCodeAt(0),
];
class IdClassCompletionParticipant {
    constructor() {
        this.atributeCompletions = [];
    }
    onHtmlAttributeValue(context) {
        if (context.attribute == 'id' || context.attribute == 'class') {
            this.atributeCompletions.push(context);
        }
    }
    beginCompletion(option) {
        this.currentWorkspace = option === null || option === void 0 ? void 0 : option.workspaceFolder;
        this.atributeCompletions = [];
    }
    collectIdIndex(context) {
        let result = [];
        let offset = context.document.offsetAt(context.position);
        let value = context.document.getText(context.range);
        let start = context.document.offsetAt(context.range.start);
        let end = start + value.length;
        const workspaceUri = this.currentWorkspace.uri;
        let addQuotes = true;
        if (offset > start && offset <= end && value && (value[0] == '"' || value[0] == '\'')) {
            if (end > start && value[0] == value[value.length - 1]) {
                end--;
            }
            start++;
            addQuotes = false;
        }
        start = Math.min(offset, start);
        let range = {
            start: context.document.positionAt(start),
            end: context.document.positionAt(end)
        };
        let dataList = [];
        indexlib_1.IndexDataStore.load(this.currentWorkspace).allIndexData().forEach((indexdata, _key) => {
            if (_key == context.document.uri) {
                dataList.unshift({ data: indexdata, uri: _key, sortText: 'a' });
            }
            else {
                dataList.push({ data: indexdata, uri: _key, sortText: 'b' });
            }
        });
        let listSet = new Map();
        dataList.forEach((dataItem) => {
            const src = vscode_uri_1.URI.parse(dataItem.uri).fsPath;
            const file = path.relative(vscode_uri_1.URI.parse(workspaceUri).fsPath, src);
            let ids = dataItem.data[indexlib_1.IndexDataCategory.ID] || [];
            ids.forEach((item) => {
                let isdef = item.type == indexlib_1.IndexItemType.DEF;
                let info = listSet.get(item.label);
                if (!info || (isdef && !info.isdef)) {
                    const insertText = addQuotes ? '"' + item.label + '"' : item.label;
                    let c = {
                        label: item.label,
                        kind: vscode_html_languageservice_1.CompletionItemKind.Text,
                        textEdit: vscode_html_languageservice_1.TextEdit.replace(range, insertText),
                        insertTextFormat: vscode_languageserver_1.InsertTextFormat.PlainText,
                        documentation: `定义于：<br><a href="file://${src}">${file}</a>`,
                        sortText: dataItem.sortText,
                        data: {
                            hxKind: utils_1.HxIconKind.ID
                        }
                    };
                    if (!info) {
                        info = { isdef, index: result.length };
                        listSet.set(item.label, info);
                        result.push(c);
                    }
                    else {
                        info.isdef = true;
                        result.splice(info.index, 1, c);
                    }
                }
            });
        });
        return result;
    }
    collectClassIndex(context) {
        let result = [];
        let offset = context.document.offsetAt(context.position);
        let value = context.document.getText(context.range);
        let start = context.document.offsetAt(context.range.start);
        let end = start + value.length;
        const workspaceUri = this.currentWorkspace.uri;
        let addQuotes = true;
        if (offset > start && offset <= end && value && (value[0] == '"' || value[0] == '\'')) {
            if (end > start && value[0] == value[value.length - 1]) {
                end--;
            }
            const innerOffset = offset - start;
            end = getWordEnd(value, innerOffset, end - start) + start;
            start = getWordStart(value, innerOffset, 1) + start;
            addQuotes = false;
        }
        start = Math.min(offset, start);
        let range = {
            start: context.document.positionAt(start),
            end: context.document.positionAt(end)
        };
        let dataList = [];
        indexlib_1.IndexDataStore.load(this.currentWorkspace).allIndexData().forEach((indexdata, _key) => {
            if (_key == context.document.uri) {
                dataList.unshift({ data: indexdata, uri: _key, sortText: 'a' });
            }
            else {
                dataList.push({ data: indexdata, uri: _key, sortText: 'b' });
            }
        });
        let listSet = new Map();
        dataList.forEach((dataItem) => {
            const src = vscode_uri_1.URI.parse(dataItem.uri).fsPath;
            const file = path.relative(vscode_uri_1.URI.parse(workspaceUri).fsPath, src);
            let classes = dataItem.data[indexlib_1.IndexDataCategory.CLASS] || [];
            classes.forEach((item) => {
                let isdef = item.type == indexlib_1.IndexItemType.DEF;
                let info = listSet.get(item.label);
                if (!info || (isdef && !info.isdef)) {
                    const insertText = addQuotes ? '"' + item.label + '"' : item.label;
                    let c = {
                        label: item.label,
                        kind: vscode_html_languageservice_1.CompletionItemKind.Text,
                        textEdit: vscode_html_languageservice_1.TextEdit.replace(range, insertText),
                        insertTextFormat: vscode_languageserver_1.InsertTextFormat.PlainText,
                        documentation: `定义于：<br><a href="file://${src}">${file}</a>`,
                        sortText: dataItem.sortText,
                        data: {
                            hxKind: utils_1.HxIconKind.CLASS
                        }
                    };
                    if (!info) {
                        info = { isdef, index: result.length };
                        listSet.set(item.label, info);
                        result.push(c);
                    }
                    else {
                        info.isdef = true;
                        result.splice(info.index, 1, c);
                    }
                }
            });
        });
        return result;
    }
    async computeCompletions(document, _htmlDocument, documentContext) {
        const result = { items: [], isIncomplete: false };
        if (!this.currentWorkspace) {
            return result;
        }
        if (this.atributeCompletions.length > 0) {
            // 一般来讲当前位置只有一个属性，所以进处理第一个
            const attributeCompletion = this.atributeCompletions[0];
            if (attributeCompletion.attribute == 'id') {
                result.items.push(...this.collectIdIndex(attributeCompletion));
            }
            else if (attributeCompletion.attribute == 'class') {
                result.items.push(...this.collectClassIndex(attributeCompletion));
            }
        }
        return result;
    }
}
exports.IdClassCompletionParticipant = IdClassCompletionParticipant;
function getWordStart(s, offset, limit) {
    while (offset > limit && !whiteSpaceCharCode.includes(s.charCodeAt(offset - 1))) {
        offset--;
    }
    return offset;
}
function getWordEnd(s, offset, limit) {
    while (offset < limit && !whiteSpaceCharCode.includes(s.charCodeAt(offset))) {
        offset++;
    }
    return offset;
}
function stripQuotes(fullValue) {
    if ((0, strings_1.startsWith)(fullValue, `'`) || (0, strings_1.startsWith)(fullValue, `"`)) {
        return fullValue.slice(1, -1);
    }
    else {
        return fullValue;
    }
}
//# sourceMappingURL=idClassCompletion.js.map