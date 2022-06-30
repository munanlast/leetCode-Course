"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHtmlModeExt = exports.ModeExtension = void 0;
const vscode_html_languageservice_1 = require("vscode-html-languageservice");
const strings_1 = require("../utils/strings");
const entry_1 = require("../../../../cssservice/entry");
const serverinterface_1 = require("../../../../serverinterface");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const dataProviderUtils_1 = require("./utils/dataProviderUtils");
const vueScanner_1 = require("../vue/vueScanner");
const interpolationService = require("../vue/interpolationService");
const easycomService = require("../vue/easycomService");
const path = require("path");
const fs = require("fs");
const vscode_uri_1 = require("vscode-uri");
const vueModifierData_1 = require("./dataprovider/vueModifierData");
const utils_1 = require("../../../../utils");
const utils_2 = require("../../../../utils");
let iconKindMap = new Map();
iconKindMap.set(vscode_html_languageservice_1.CompletionItemKind.Property, utils_2.HxIconKind.ELEMENT);
iconKindMap.set(vscode_html_languageservice_1.CompletionItemKind.Value, utils_2.HxIconKind.ATTRIBUTE);
iconKindMap.set(vscode_html_languageservice_1.CompletionItemKind.Function, utils_2.HxIconKind.EVENT);
iconKindMap.set(vscode_html_languageservice_1.CompletionItemKind.Unit, utils_2.HxIconKind.ATTRIBUTE);
var ModeExtension;
(function (ModeExtension) {
    ModeExtension.VueEventPrefix = '[event]';
})(ModeExtension = exports.ModeExtension || (exports.ModeExtension = {}));
const dotCharCode = '.'.charCodeAt(0);
const vueModifierProvider = (0, vueModifierData_1.getModifierProvider)();
var VueDirectiveType;
(function (VueDirectiveType) {
    VueDirectiveType[VueDirectiveType["Empty"] = 0] = "Empty";
    VueDirectiveType[VueDirectiveType["String"] = 1] = "String";
    VueDirectiveType[VueDirectiveType["Event"] = 2] = "Event";
    VueDirectiveType[VueDirectiveType["Attribute"] = 3] = "Attribute";
})(VueDirectiveType || (VueDirectiveType = {}));
const selfColsingTags = ['br', 'hr', 'img', 'link', 'base', 'area', 'input', 'source'];
function vueDirectiveType(directive) {
    if (directive == 'v-on' || directive == '@') {
        return VueDirectiveType.Event;
    }
    else if (directive == 'v-bind' || directive == ':') {
        return VueDirectiveType.Attribute;
    }
    else if (directive == 'v-pre'
        || directive == 'v-cloak'
        || directive == 'v-once'
        || directive == 'v-else') {
        return VueDirectiveType.Empty;
    }
    return VueDirectiveType.String;
}
function checkVueBindOrOnDirective(text) {
    if (text.startsWith('v-on:')) {
        return 'v-on';
    }
    if (text.startsWith('@')) {
        return '@';
    }
    if (text.startsWith('v-bind:')) {
        return 'v-bind';
    }
    if (text.startsWith(':')) {
        return ':';
    }
    if (text.startsWith('v-model')) {
        return 'v-model';
    }
    return '';
}
function getWordStart(s, offset, limit) {
    while (offset > limit && !strings_1.whiteSpaceCharCode.includes(s.charCodeAt(offset - 1))) {
        offset--;
    }
    return offset;
}
function getWordEnd(s, offset, limit) {
    while (offset < limit && !strings_1.whiteSpaceCharCode.includes(s.charCodeAt(offset))) {
        offset++;
    }
    return offset;
}
function getModifierRange(text, offset, limit) {
    let start = offset, end = offset;
    while (start > limit.start && text.charCodeAt(start - 1) !== dotCharCode) {
        start--;
    }
    while (end < limit.end && text.charCodeAt(end) !== dotCharCode) {
        end++;
    }
    return { start, end };
}
function isFollowedBy(input, offset, intialState, expectedToken) {
    var scanner = (0, vueScanner_1.createScanner)(input, offset, intialState);
    var token = scanner.scan();
    while (token === vueScanner_1.TokenType.Whitespace) {
        token = scanner.scan();
    }
    return token === expectedToken;
}
class HTMLLanguageServiceExt {
    constructor(languageService, documenCache, workspace, option) {
        var _a;
        this.vueEnable = false;
        this.service = languageService;
        this.workspace = workspace;
        this.dataProviders = [];
        this.vueDirectives = new Set();
        this.vueEnable = (_a = option === null || option === void 0 ? void 0 : option.vueEnable) !== null && _a !== void 0 ? _a : false;
        this.htmlDocuments = documenCache;
    }
    getRootFolder(uri) {
        for (let folder of this.workspace.folders) {
            let folderURI = folder.uri;
            if (!(0, strings_1.endsWith)(folderURI, '/')) {
                folderURI = folderURI + '/';
            }
            if ((0, strings_1.startsWith)(uri, folderURI)) {
                return folder;
            }
        }
        return undefined;
    }
    getClassText(text, searchStart, limit, offset) {
        let index = offset > limit ? -1 : text.slice(offset, limit).search(/\s/);
        let start = searchStart;
        let end = index == -1 ? limit : index + offset;
        for (let i = offset - 1; i >= searchStart; i--) {
            if (text.charAt(i).trimLeft() === '') {
                start = i + 1;
                break;
            }
        }
        return { start, end };
    }
    getStyleTagContents(document, htmlDocument) {
        var _a, _b;
        let result = [];
        let queue = [...htmlDocument.roots];
        while (queue.length > 0) {
            let node = queue.splice(0, 1)[0];
            if (node.tag === 'style') {
                let lang = (_b = (_a = node.attributes) === null || _a === void 0 ? void 0 : _a['lang']) !== null && _b !== void 0 ? _b : "css";
                if (lang[0] == '\'' || lang[0] == '"') {
                    lang = lang.slice(1, -1);
                }
                const offset = node.startTagEnd ? node.startTagEnd : node.start;
                let start = document.positionAt(offset);
                let end = document.positionAt(node.endTagStart ? node.endTagStart : node.end);
                const text = document.getText({ start, end });
                let styleDocument = vscode_languageserver_textdocument_1.TextDocument.create(document.uri, lang, 1.0, text);
                result.push({ offset, document: styleDocument });
            }
            queue.push(...node.children);
        }
        return result;
    }
    getTextDocument(fsPath, preferLanguage = '') {
        var _a;
        const uri = vscode_uri_1.URI.file(fsPath).toString();
        let ret = (_a = this.documents) === null || _a === void 0 ? void 0 : _a.get(uri);
        if (!ret) {
            ret = vscode_languageserver_textdocument_1.TextDocument.create(uri, preferLanguage, 1.0, fs.readFileSync(fsPath, { encoding: 'utf-8' }));
        }
        return ret;
    }
    async findCssClass(document, htmlDocument, symbleRange) {
        let ws = this.getRootFolder(document.uri);
        if (!ws) {
            return null;
        }
        const originSelectionRange = vscode_html_languageservice_1.Range.create(document.positionAt(symbleRange.start), document.positionAt(symbleRange.end));
        const text = document.getText(originSelectionRange);
        let symbol = { text: text, type: serverinterface_1.SymbolType.StyleClass };
        const findClassInDocument = async (doc, htmlDoc) => {
            if (!htmlDoc) {
                htmlDoc = this.htmlDocuments.get(doc);
            }
            let styleContents = this.getStyleTagContents(doc, htmlDoc);
            for (let i = 0; i < styleContents.length; i++) {
                let c = styleContents[i];
                let service = (0, entry_1.getExtraServer)(c.document).getLanguageServiceExt();
                if (service && service.findSymbol) {
                    let ret = await service.findSymbol(c.document, symbol, ws);
                    let temp = (ret instanceof Array) ? ret : [ret];
                    let linkTemp = temp.map((location) => {
                        if (location.uri == c.document.uri) {
                            location.uri = doc.uri;
                            let start = c.document.offsetAt(location.range.start) + c.offset;
                            let end = c.document.offsetAt(location.range.end) + c.offset;
                            location.range = vscode_html_languageservice_1.Range.create(doc.positionAt(start), doc.positionAt(end));
                        }
                        return vscode_html_languageservice_1.LocationLink.create(location.uri, location.range, location.range, originSelectionRange);
                    });
                    if (linkTemp.length > 0) {
                        return linkTemp;
                    }
                }
            }
            return [];
        };
        symbol.sourceDocument = document;
        let ret = await findClassInDocument(document, htmlDocument);
        if (ret.length > 0) {
            return ret;
        }
        if (this.vueEnable && document.languageId === 'vue') {
            let rootPath = vscode_uri_1.URI.parse(ws.uri).fsPath;
            let appVuePath = '';
            if ((0, utils_1.isUniAppCli)(rootPath)) {
                appVuePath = path.join(rootPath, 'src', 'App.vue');
            }
            else if ((0, utils_1.isUniAppVue)(rootPath)) {
                appVuePath = path.join(rootPath, 'App.vue');
            }
            if (appVuePath && fs.existsSync(appVuePath)) {
                let appDoc = this.getTextDocument(appVuePath, 'vue');
                symbol.sourceDocument = appDoc;
                return findClassInDocument(appDoc);
            }
            return null;
        }
        else if (document.languageId == 'html' || document.languageId == 'html_es6' || document.uri.endsWith('.html')) {
            let service = (0, entry_1.getExtraServer)('css').getLanguageServiceExt();
            if (service && service.findSymbol) {
                let ret = await service.findSymbol(vscode_languageserver_textdocument_1.TextDocument.create("temp.css", 'css', 1.0, ""), symbol, ws);
                let temp = (ret instanceof Array) ? ret : [ret];
                return temp.map((location) => {
                    return vscode_html_languageservice_1.LocationLink.create(location.uri, location.range, location.range, originSelectionRange);
                });
            }
        }
        return null;
    }
    findDefinition(document, position, htmlDocument) {
        var _a;
        let offset = document.offsetAt(position);
        let node = htmlDocument.findNodeAt(offset);
        if (!node) {
            return Promise.resolve(null);
        }
        const workspaceFolder = this.getRootFolder(document.uri);
        let scanEnd = offset;
        let text = document.getText();
        let currentInterpolationBegin = -1;
        const scanner = (0, vueScanner_1.createScanner)(text, node.start);
        let token = scanner.scan();
        let currentAttribute = '';
        while (token !== vueScanner_1.TokenType.EOS && scanner.getTokenOffset() <= scanEnd) {
            switch (token) {
                case vueScanner_1.TokenType.StartTag:
                case vueScanner_1.TokenType.EndTag:
                    if (offset >= scanner.getTokenOffset() && offset <= scanner.getTokenEnd()) {
                        let tagName = scanner.getTokenText();
                        let coms = easycomService.collectEasycoms(document, htmlDocument, workspaceFolder);
                        let easycom = coms.find(com => com.name == tagName);
                        if (easycom && easycom.filePath) {
                            let result = {
                                uri: vscode_uri_1.URI.file(easycom.filePath).toString(),
                                range: {
                                    start: {
                                        line: 0,
                                        character: 0
                                    },
                                    end: {
                                        line: 0,
                                        character: 0
                                    }
                                }
                            };
                            return Promise.resolve(result);
                        }
                    }
                    break;
                case vueScanner_1.TokenType.StartInterpolation:
                    currentInterpolationBegin = scanner.getTokenEnd();
                    scanEnd = Math.max(offset, (_a = node.endTagStart) !== null && _a !== void 0 ? _a : node.end);
                    break;
                case vueScanner_1.TokenType.EndInterpolation:
                    if (currentInterpolationBegin != -1 && scanner.getTokenOffset() >= offset) {
                        let endInterpolationOffset = scanner.getTokenOffset();
                        if (workspaceFolder) {
                            let start = document.positionAt(currentInterpolationBegin);
                            let end = document.positionAt(endInterpolationOffset);
                            return interpolationService.findDefinition(document, htmlDocument, { start, end }, position, workspaceFolder);
                        }
                        currentInterpolationBegin = -1;
                    }
                    break;
                case vueScanner_1.TokenType.AttributeName:
                    // 仅处理class属性
                    currentAttribute = scanner.getTokenText().toLowerCase();
                    break;
                case vueScanner_1.TokenType.AttributeValue:
                    if (scanner.getTokenOffset() <= offset && offset <= scanner.getTokenEnd()) {
                        let start = scanner.getTokenOffset();
                        let end = scanner.getTokenEnd();
                        if (text[start] === '\'' || text[start] === '"') {
                            start++;
                            end--;
                        }
                        if (currentAttribute === 'class') {
                            // 如果左右两边都是空白符则忽略
                            let char = text.charAt(offset).trimLeft();
                            let before = text.charAt(offset - 1).trimLeft();
                            if (char !== '' || before !== '') {
                                let range = this.getClassText(text, start, end, offset);
                                return this.findCssClass(document, htmlDocument, range);
                            }
                        }
                        else if (this.vueEnable && workspaceFolder) {
                            if (/^(v-|[:@])\S+/.test(currentAttribute) || (currentAttribute == 'collection')) {
                                let s = document.positionAt(start);
                                let e = document.positionAt(end);
                                return interpolationService.findDefinition(document, htmlDocument, { start: s, end: e }, position, workspaceFolder);
                            }
                        }
                    }
                    break;
                default:
                    break;
            }
            token = scanner.scan();
        }
        return Promise.resolve(null);
    }
    async doHover(document, pos, htmlDocument) {
        var _a, _b, _c;
        let offset = document.offsetAt(pos);
        let node = htmlDocument.findNodeAt(offset);
        if (!node) {
            return Promise.resolve(null);
        }
        const workspaceFolder = this.getRootFolder(document.uri);
        if (!workspaceFolder) {
            return Promise.resolve(null);
        }
        let scanEnd = offset;
        let text = document.getText();
        let currentInterpolationBegin = -1;
        const scanner = (0, vueScanner_1.createScanner)(text, node.start);
        let token = scanner.scan();
        let isClassAttribute = false;
        while (token !== vueScanner_1.TokenType.EOS && scanner.getTokenOffset() <= scanEnd) {
            switch (token) {
                case vueScanner_1.TokenType.StartInterpolation:
                    currentInterpolationBegin = scanner.getTokenEnd();
                    scanEnd = Math.max(offset, (_a = node.endTagStart) !== null && _a !== void 0 ? _a : node.end);
                    break;
                case vueScanner_1.TokenType.EndInterpolation:
                    if (currentInterpolationBegin != -1 && scanner.getTokenOffset() >= offset) {
                        let endInterpolationOffset = scanner.getTokenOffset();
                        if (workspaceFolder) {
                            let start = document.positionAt(currentInterpolationBegin);
                            let end = document.positionAt(endInterpolationOffset);
                            //TODO interpolationService.doHover();
                            //return interpolationService.findDefinition(document, htmlDocument, {start, end}, position, workspaceFolder);
                        }
                        currentInterpolationBegin = -1;
                    }
                    break;
                case vueScanner_1.TokenType.AttributeName:
                    let currentAttribute = scanner.getTokenText();
                    if (scanner.getTokenOffset() <= offset && offset <= scanner.getTokenEnd()) {
                        let tagName = node.tag;
                        let coms = easycomService.collectEasycoms(document, htmlDocument, workspaceFolder);
                        let easycom = coms.find(com => com.name == tagName);
                        if (easycom) {
                            let comInfo = easycomService.fetchVueComponentInfo(easycom.filePath);
                            if (comInfo) {
                                let propInfo = (_b = comInfo.properties) === null || _b === void 0 ? void 0 : _b.find(prop => {
                                    return currentAttribute == prop.name
                                        || currentAttribute == ":" + prop.name
                                        || currentAttribute == "v-bind:" + prop.name;
                                });
                                let eventInfo = (_c = comInfo.events) === null || _c === void 0 ? void 0 : _c.find(prop => {
                                    return currentAttribute == prop.name
                                        || currentAttribute == "@" + prop.name
                                        || currentAttribute == "v-on:" + prop.name;
                                });
                                if (propInfo) {
                                    let contentValues = [];
                                    contentValues.push(`**${propInfo.name}**`);
                                    contentValues.push(`<hr>`);
                                    if (propInfo.description) {
                                        contentValues.push(`${propInfo.description}`);
                                        contentValues.push("<br />");
                                        contentValues.push("<br />");
                                    }
                                    contentValues.push(`<b>定义于：</b> <a href='file://${comInfo.filePath}'>${path.relative(vscode_uri_1.URI.parse(workspaceFolder === null || workspaceFolder === void 0 ? void 0 : workspaceFolder.uri).fsPath, comInfo.filePath)}</a>`);
                                    return {
                                        range: {
                                            start: document.positionAt(scanner.getTokenOffset()),
                                            end: document.positionAt(scanner.getTokenEnd())
                                        },
                                        contents: {
                                            kind: 'markdown',
                                            value: contentValues.join('\n')
                                        }
                                    };
                                }
                                else if (eventInfo) {
                                    let contentValues = [];
                                    contentValues.push(`**${eventInfo.name}**`);
                                    contentValues.push(`<hr>`);
                                    if (eventInfo.description) {
                                        contentValues.push(`${eventInfo.description}`);
                                        contentValues.push("<br />");
                                        contentValues.push("<br />");
                                    }
                                    contentValues.push(`<b>定义于：</b> <a href='file://${comInfo.filePath}'>${path.relative(vscode_uri_1.URI.parse(workspaceFolder === null || workspaceFolder === void 0 ? void 0 : workspaceFolder.uri).fsPath, comInfo.filePath)}</a>`);
                                    return {
                                        range: {
                                            start: document.positionAt(scanner.getTokenOffset()),
                                            end: document.positionAt(scanner.getTokenEnd())
                                        },
                                        contents: {
                                            kind: 'markdown',
                                            value: contentValues.join('\n')
                                        }
                                    };
                                }
                            }
                        }
                    }
                    break;
                case vueScanner_1.TokenType.StartTag:
                case vueScanner_1.TokenType.EndTag:
                    if (offset >= scanner.getTokenOffset() && offset <= scanner.getTokenEnd()) {
                        let tagName = scanner.getTokenText();
                        let coms = easycomService.collectEasycoms(document, htmlDocument, workspaceFolder);
                        let easycom = coms.find(com => com.name == tagName);
                        if (easycom) {
                            let comInfo = easycomService.fetchVueComponentInfo(easycom.filePath);
                            if (comInfo) {
                                let contentValues = [];
                                contentValues.push(`**${tagName}**`);
                                contentValues.push(`<hr>`);
                                if (comInfo.description) {
                                    contentValues.push(`${comInfo.description}`);
                                    contentValues.push("<br />");
                                    contentValues.push("<br />");
                                }
                                contentValues.push(`<b>定义于：</b> <a href='file://${comInfo.filePath}'>${path.relative(vscode_uri_1.URI.parse(workspaceFolder === null || workspaceFolder === void 0 ? void 0 : workspaceFolder.uri).fsPath, comInfo.filePath)}</a>`);
                                if (comInfo.tutorial) {
                                    contentValues.push("<br />");
                                    contentValues.push(`<b>文档：</b><a data-kind='tutorial' href='${comInfo.tutorial}'>${comInfo.tutorial}</a>`);
                                }
                                return {
                                    range: {
                                        start: document.positionAt(scanner.getTokenOffset()),
                                        end: document.positionAt(scanner.getTokenEnd())
                                    },
                                    contents: {
                                        kind: 'markdown',
                                        value: contentValues.join('\n')
                                    }
                                };
                            }
                        }
                    }
                    break;
                default:
                    break;
            }
            token = scanner.scan();
        }
        return Promise.resolve(null);
    }
    async doResolve(document, item, htmlDocument) {
        if (item.data && item.data.kind) {
            const data = item.data;
            if (data.kind === 'vue-component') {
                if (data.filePath) {
                    let comInfo = easycomService.fetchVueComponentInfo(data.filePath);
                    if (comInfo) {
                        item.detail = comInfo.description;
                        item.documentation = comInfo.description;
                    }
                }
            }
            else if (data.kind === 'vue-mustache') {
                if ((item.kind == vscode_html_languageservice_1.CompletionItemKind.Function || item.kind == vscode_html_languageservice_1.CompletionItemKind.Method) &&
                    item.insertTextFormat == vscode_html_languageservice_1.InsertTextFormat.PlainText) {
                    let _label = item.label;
                    _label = _label.replace(/\$/g, '\\$');
                    let insertSnippetString = `${_label}(\$1)\$0`;
                    if (item.textEdit) {
                        item.textEdit.newText = insertSnippetString;
                    }
                    else {
                        item.insertText = insertSnippetString;
                    }
                    item.insertTextFormat = vscode_html_languageservice_1.InsertTextFormat.Snippet;
                    delete item.data;
                    return Promise.resolve(item);
                }
            }
        }
        return Promise.resolve(item);
    }
    async doComplete(document, position, htmlDocument, next, option) {
        var _a;
        let offset = document.offsetAt(position);
        let node = htmlDocument.findNodeAt(offset);
        if (!node) {
            return Promise.resolve(vscode_languageserver_types_1.CompletionList.create());
        }
        const result = {
            isIncomplete: false,
            items: []
        };
        let scanEnd = offset;
        let currentTag = '';
        let currentAttribute = '';
        const text = document.getText();
        let vueDirectives = this.vueDirectives;
        const workspaceFolder = this.getRootFolder(document.uri);
        let vueVersion = -1;
        if (this.vueEnable) {
            vueVersion = 2;
            if (workspaceFolder) {
                vueVersion = (0, utils_1.vueVersion)(vscode_uri_1.URI.parse(workspaceFolder.uri).fsPath);
            }
        }
        option = option !== null && option !== void 0 ? option : {};
        option["vue_html"] = vueVersion === 2;
        option["vue3_html"] = vueVersion === 3;
        const dataProviders = this.dataProviders.filter(p => p.isApplicable(document.languageId) && (!option || option[p.getId()] !== false));
        function getReplaceRange(replaceStart, replaceEnd = offset) {
            if (replaceStart > offset) {
                replaceStart = offset;
            }
            return { start: document.positionAt(replaceStart), end: document.positionAt(replaceEnd) };
        }
        function collectVueDeirectiveSuggestions(directive, nameStart, nameEnd = offset) {
            if (dataProviders.length === 0) {
                return result;
            }
            let attributeText = text.slice(nameStart, nameEnd);
            let textBefore = text.slice(nameStart, offset);
            let replaceEnd = nameEnd;
            while (replaceEnd < nameEnd && text[replaceEnd] !== '<') {
                replaceEnd++;
            }
            const command = {
                title: 'Suggest',
                command: 'editor.action.triggerSuggest'
            };
            function addModifier(modifiers, replaceRange) {
                const range = getReplaceRange(replaceRange.start, replaceRange.end);
                modifiers.forEach((modifier) => {
                    result.items.push({
                        label: modifier.label,
                        kind: vscode_html_languageservice_1.CompletionItemKind.Method,
                        textEdit: vscode_html_languageservice_1.TextEdit.replace(range, modifier.label),
                        insertTextFormat: vscode_html_languageservice_1.InsertTextFormat.PlainText,
                        documentation: (0, dataProviderUtils_1.normalizeMarkupContent)(modifier.documentation),
                        data: {
                            hxKind: utils_2.HxIconKind.ATTRIBUTE
                        }
                    });
                });
            }
            function addBindAttributes(prefix, replaceRange) {
                let tempProviders = [...dataProviders];
                let totalText = document.getText();
                let hasValue = isFollowedBy(totalText, replaceRange.end, vueScanner_1.ScannerState.AfterAttributeName, vueScanner_1.TokenType.DelimiterAssign);
                let triggerCommand = hasValue ? undefined : command;
                const range = getReplaceRange(replaceRange.start, replaceRange.end);
                tempProviders.forEach(provider => {
                    provider.provideAttributes(currentTag).forEach(attr => {
                        if (attr.name) {
                            if (!attr.name.startsWith(ModeExtension.VueEventPrefix) && !attr.name.startsWith('on') && !attr.name.startsWith('v-')) {
                                let replaceText = prefix + attr.name + (hasValue ? '' : '="$1"');
                                result.items.push({
                                    label: prefix + attr.name,
                                    kind: vscode_html_languageservice_1.CompletionItemKind.Value,
                                    documentation: (0, dataProviderUtils_1.generateDocumentation)(attr, undefined, true),
                                    textEdit: vscode_html_languageservice_1.TextEdit.replace(range, replaceText),
                                    insertTextFormat: vscode_html_languageservice_1.InsertTextFormat.Snippet,
                                    command: triggerCommand
                                });
                            }
                        }
                    });
                });
                let coms = easycomService.collectEasycoms(document, htmlDocument, workspaceFolder);
                let com = coms.find(com => com.name == currentTag);
                if (com) {
                    let comInfo = easycomService.fetchVueComponentInfo(com.filePath);
                    if (comInfo && comInfo.properties) {
                        comInfo.properties.forEach(attr => {
                            if (attr.name) {
                                let replaceText = prefix + attr.name + (hasValue ? '' : '="$1"');
                                result.items.push({
                                    label: prefix + attr.name,
                                    kind: vscode_html_languageservice_1.CompletionItemKind.Value,
                                    documentation: attr.description,
                                    textEdit: vscode_html_languageservice_1.TextEdit.replace(range, replaceText),
                                    insertTextFormat: vscode_html_languageservice_1.InsertTextFormat.Snippet,
                                    command: triggerCommand
                                });
                            }
                        });
                    }
                }
            }
            function addOnEvent(prefix, replaceRange) {
                let tempProviders = [...dataProviders];
                let hasValue = isFollowedBy(text, replaceRange.end, vueScanner_1.ScannerState.AfterAttributeName, vueScanner_1.TokenType.DelimiterAssign);
                let triggerCommand = hasValue ? undefined : command;
                const range = getReplaceRange(replaceRange.start, replaceRange.end);
                dataProviders.forEach(provider => {
                    provider.provideAttributes(currentTag).forEach(attr => {
                        var _a, _b;
                        let eventFlag = 0;
                        if ((_a = attr.name) === null || _a === void 0 ? void 0 : _a.startsWith(ModeExtension.VueEventPrefix)) {
                            eventFlag = ModeExtension.VueEventPrefix.length;
                        }
                        else if ((_b = attr.name) === null || _b === void 0 ? void 0 : _b.startsWith('on')) {
                            eventFlag = 2;
                        }
                        if (eventFlag > 0) {
                            const label = attr.name.slice(eventFlag);
                            let replaceText = prefix + label + (hasValue ? '' : '="$1"');
                            result.items.push({
                                label: prefix + label,
                                kind: vscode_html_languageservice_1.CompletionItemKind.Function,
                                documentation: (0, dataProviderUtils_1.generateDocumentation)(attr, undefined, true),
                                textEdit: vscode_html_languageservice_1.TextEdit.replace(range, replaceText),
                                insertTextFormat: vscode_html_languageservice_1.InsertTextFormat.Snippet,
                                command: triggerCommand,
                                data: { hxKind: utils_2.HxIconKind.EVENT }
                            });
                        }
                    });
                });
                let coms = easycomService.collectEasycoms(document, htmlDocument, workspaceFolder);
                let com = coms.find(com => com.name == currentTag);
                if (com) {
                    let comInfo = easycomService.fetchVueComponentInfo(com.filePath);
                    if (comInfo && comInfo.events) {
                        comInfo.events.forEach(attr => {
                            if (attr.name) {
                                let replaceText = prefix + attr.name + (hasValue ? '' : '="$1"');
                                result.items.push({
                                    label: prefix + attr.name,
                                    kind: vscode_html_languageservice_1.CompletionItemKind.Function,
                                    documentation: attr.description,
                                    textEdit: vscode_html_languageservice_1.TextEdit.replace(range, replaceText),
                                    insertTextFormat: vscode_html_languageservice_1.InsertTextFormat.Snippet,
                                    command: triggerCommand,
                                    data: { hxKind: utils_2.HxIconKind.EVENT }
                                });
                            }
                        });
                    }
                }
            }
            if (directive === '@' || directive == 'v-on') {
                let preffix = directive.length === 1 ? directive : 'v-on:';
                let eventEnd = preffix.length + nameStart;
                while (eventEnd < nameEnd && text.charCodeAt(eventEnd) !== dotCharCode) {
                    eventEnd++;
                }
                if (offset <= eventEnd) {
                    // 替换内容包含“v-on:”
                    addOnEvent(preffix, { start: nameStart, end: eventEnd });
                }
                else if (eventEnd < nameEnd) {
                    const eventName = text.slice(preffix.length + nameStart, eventEnd);
                    let range = getModifierRange(text, offset, { start: eventEnd + 1, end: nameEnd });
                    const keyEvents = ['keydown', 'keypress', 'keyup'];
                    const mouseEvent = ['click', 'dblclick', 'mouseup', 'mousedown'];
                    //const touchEvent = ['touchstart', 'touchmove', 'touchcancel', 'touchend', 'tap', 'longpress', 'longtap']
                    addModifier(vueModifierProvider.eventModifiers, range);
                    if (keyEvents.includes(eventName)) {
                        addModifier(vueModifierProvider.keyModifiers, range);
                        addModifier(vueModifierProvider.systemModifiers, range);
                    }
                    else if (mouseEvent.includes(eventName)) {
                        addModifier(vueModifierProvider.mouseModifiers, range);
                        addModifier(vueModifierProvider.systemModifiers, range);
                    }
                }
            }
            else if (directive === ':' || directive === "v-bind") {
                let preffix = directive.length === 1 ? directive : 'v-bind:';
                let propEnd = preffix.length + nameStart;
                while (propEnd < nameEnd && text.charCodeAt(propEnd) !== dotCharCode) {
                    propEnd++;
                }
                if (offset <= propEnd) {
                    // 替换内容包含“v-bind:”
                    addBindAttributes(preffix, { start: nameStart, end: replaceEnd });
                }
                else if (propEnd < nameEnd) {
                    let range = getModifierRange(text, offset, { start: propEnd + 1, end: nameEnd });
                    addModifier(vueModifierProvider.propsModifiers, range);
                }
            }
            else if (directive === 'v-model') {
                if (textBefore.length <= directive.length) {
                    return result;
                }
                if (textBefore[directive.length] === '.') {
                    let range = getModifierRange(text, offset, { start: offset, end: replaceEnd });
                    addModifier(vueModifierProvider.propsModifiers, range);
                    addModifier(vueModifierProvider.vModelModifiers, range);
                }
            }
            return result;
        }
        function collectOpenTagSuggestions(afterOpenBracket, tagNameEnd) {
            if (workspaceFolder) {
                //第一步，先检测当前vue手动引入的组件
                //第二步，根据uniapp easycom规则自动引入的组件
                let easycoms = easycomService.collectEasycoms(document, htmlDocument, workspaceFolder);
                let range = getReplaceRange(afterOpenBracket, tagNameEnd);
                easycoms.forEach(item => {
                    result.items.push({
                        label: item.name,
                        kind: vscode_html_languageservice_1.CompletionItemKind.Property,
                        data: {
                            hxKind: utils_2.HxIconKind.ELEMENT,
                            languageId: 'vue-template',
                            uri: document.uri,
                            kind: "vue-component",
                            filePath: item.filePath
                        },
                        textEdit: vscode_html_languageservice_1.TextEdit.replace(range, item.name + '$0></' + item.name + '>'),
                        insertTextFormat: vscode_html_languageservice_1.InsertTextFormat.Snippet,
                    });
                });
            }
            return result;
        }
        let currentInterpolationBegin = -1;
        const scanner = (0, vueScanner_1.createScanner)(text, node.start);
        let finished = false;
        let token = scanner.scan();
        let finishScan = false;
        let insideCloseTag = false;
        while (token !== vueScanner_1.TokenType.EOS && scanner.getTokenOffset() <= scanEnd && !finishScan) {
            switch (token) {
                case vueScanner_1.TokenType.StartTagOpen:
                    if (scanner.getTokenEnd() === offset) {
                        let endPos = offset;
                        token = scanner.scan();
                        if (token === vueScanner_1.TokenType.StartTag && scanner.getTokenOffset() === offset) {
                            endPos = scanner.getTokenEnd();
                        }
                        collectOpenTagSuggestions(offset, endPos);
                        finishScan = true;
                    }
                    break;
                case vueScanner_1.TokenType.StartTag:
                    if (scanner.getTokenOffset() <= offset && offset <= scanner.getTokenEnd()) {
                        collectOpenTagSuggestions(scanner.getTokenOffset(), scanner.getTokenEnd());
                        finishScan = true;
                    }
                    currentTag = scanner.getTokenText();
                    break;
                case vueScanner_1.TokenType.EndTagOpen:
                case vueScanner_1.TokenType.EndTag:
                    insideCloseTag = true;
                    break;
                case vueScanner_1.TokenType.EndTagClose:
                    insideCloseTag = false;
                    break;
                case vueScanner_1.TokenType.StartInterpolation:
                    currentInterpolationBegin = scanner.getTokenEnd();
                    scanEnd = Math.max(offset, (_a = node.endTagStart) !== null && _a !== void 0 ? _a : node.end);
                    break;
                case vueScanner_1.TokenType.EndInterpolation:
                    if (this.vueEnable && currentInterpolationBegin != -1 && scanner.getTokenOffset() >= offset) {
                        let endInterpolationOffset = scanner.getTokenOffset();
                        if (workspaceFolder) {
                            let start = document.positionAt(currentInterpolationBegin);
                            let end = document.positionAt(endInterpolationOffset);
                            return interpolationService.doCompletion2(document, htmlDocument, { start, end }, position, workspaceFolder);
                        }
                        currentInterpolationBegin = -1;
                    }
                    break;
                case vueScanner_1.TokenType.AttributeName:
                    currentAttribute = scanner.getTokenText();
                    if (currentTag && scanner.getTokenOffset() <= offset && offset <= scanner.getTokenEnd()) {
                        let tagName = currentTag;
                        let coms = easycomService.collectEasycoms(document, htmlDocument, workspaceFolder);
                        let easycom = coms.find(com => com.name == tagName);
                        if (easycom) {
                            let comInfo = easycomService.fetchVueComponentInfo(easycom.filePath);
                            if (comInfo && comInfo.properties) {
                                var valueAppend = isFollowedBy(text, scanner.getTokenEnd(), vueScanner_1.ScannerState.AfterAttributeName, vueScanner_1.TokenType.DelimiterAssign) ? '' : '="$1"';
                                let command = {
                                    title: 'Suggest',
                                    command: 'editor.action.triggerSuggest'
                                };
                                let r = getReplaceRange(scanner.getTokenOffset(), scanner.getTokenEnd());
                                let propInfo = comInfo.properties.forEach((value, key) => {
                                    result.items.push({
                                        label: value.name,
                                        kind: vscode_html_languageservice_1.CompletionItemKind.Property,
                                        documentation: value.description,
                                        textEdit: vscode_html_languageservice_1.TextEdit.replace(r, value.name + valueAppend),
                                        insertTextFormat: vscode_html_languageservice_1.InsertTextFormat.Snippet,
                                        command: valueAppend.length > 0 ? command : undefined
                                    });
                                });
                            }
                        }
                        if (this.vueEnable) {
                            if (!/^s(cript|tyle)/.test(currentTag)) {
                                let nameStart = scanner.getTokenOffset();
                                let nameEnd = scanner.getTokenEnd();
                                let directive = checkVueBindOrOnDirective(text.slice(nameStart, offset));
                                if (directive.length > 0) {
                                    return collectVueDeirectiveSuggestions(directive, nameStart, nameEnd);
                                }
                            }
                            else {
                                option['html5'] = false; // 直接禁用html5提示，避免一些无意义全局属性的提示
                            }
                        }
                        finishScan = true;
                        break;
                    }
                    break;
                case vueScanner_1.TokenType.AttributeValue:
                    if (this.vueEnable && /^(v-|[:@])\S+/.test(currentAttribute)) {
                        if (currentTag != 'unicloud-db' || currentAttribute != 'v-slot:default') {
                            let start = scanner.getTokenOffset();
                            let end = scanner.getTokenEnd();
                            if (text[start] === '\'' || text[start] === '"') {
                                start++;
                            }
                            if (end > start && (text[end - 1] === '\'' || text[end - 1] === '"')) {
                                end--;
                            }
                            if (start <= offset && offset <= end && workspaceFolder) {
                                let posStart = document.positionAt(start);
                                let posEnd = document.positionAt(end);
                                return interpolationService.doCompletion2(document, htmlDocument, { start: posStart, end: posEnd }, position, workspaceFolder);
                            }
                        }
                    }
                    else {
                        let tagName = node.tag;
                        let coms = easycomService.collectEasycoms(document, htmlDocument, workspaceFolder);
                        let easycom = coms.find(com => com.name == tagName);
                        if (easycom) {
                            let comInfo = easycomService.fetchVueComponentInfo(easycom.filePath);
                            if (comInfo && comInfo.properties) {
                                let propInfo = comInfo.properties.find(prop => {
                                    return currentAttribute == prop.name;
                                });
                                if (propInfo && propInfo.values) {
                                    propInfo.values.forEach((value, key) => {
                                        result.items.push({
                                            label: key,
                                            detail: value.description
                                        });
                                    });
                                }
                            }
                        }
                    }
                    break;
                case vueScanner_1.TokenType.Whitespace:
                    if (offset <= scanner.getTokenEnd()) {
                        const state = scanner.getScannerState();
                        finishScan = (state == vueScanner_1.ScannerState.WithinTag || state == vueScanner_1.ScannerState.AfterAttributeName);
                        if (finishScan && this.vueEnable && /^s(cript|tyle)/.test(currentTag)) {
                            option['html5'] = false;
                        }
                    }
                    break;
                default:
                    break;
            }
            token = scanner.scan();
        }
        let filterDirective = /^s(cript|tyle)/.test(currentTag);
        let completionList = await next(option);
        let repaceItems = [];
        completionList.items.forEach(item => {
            var _a, _b;
            // 需要过滤掉event，html语法库支持问题
            if (!item.label || item.label.startsWith(ModeExtension.VueEventPrefix)) {
                return;
            }
            if (item.kind === vscode_html_languageservice_1.CompletionItemKind.Property) {
                // 需要修改标签的代码块
                if (item.label.search(/^<?\//) === -1 && item.textEdit && item.textEdit.newText) {
                    if (selfColsingTags.includes(item.label)) {
                        let hasattr = item.label !== 'br';
                        item.insertTextFormat = hasattr ? vscode_html_languageservice_1.InsertTextFormat.Snippet : vscode_html_languageservice_1.InsertTextFormat.PlainText;
                        item.textEdit.newText = item.label + (hasattr ? ' $1/>' : ' />');
                    }
                    else {
                        item.insertTextFormat = vscode_html_languageservice_1.InsertTextFormat.Snippet;
                        item.textEdit.newText = item.label + '$0></' + item.label + '>';
                    }
                }
                if (!insideCloseTag && item.label.startsWith("/")) {
                    return;
                }
            }
            else if (this.vueDirectives.has(item.label)) {
                if (filterDirective) {
                    return;
                }
                let type = vueDirectiveType(item.label);
                if (type == VueDirectiveType.Event || type == VueDirectiveType.Attribute) {
                    if (item.textEdit) {
                        item.textEdit.newText = item.label + ":";
                    }
                }
                if (type != VueDirectiveType.Empty) {
                    item.command = {
                        title: 'Suggest',
                        command: 'editor.action.triggerSuggest'
                    };
                }
            }
            else if (item.kind === vscode_html_languageservice_1.CompletionItemKind.Function || item.kind === vscode_html_languageservice_1.CompletionItemKind.Value) {
                if (this.vueEnable && document.languageId == 'vue') {
                    if (item.label == 'data-' || item.label.startsWith('on')) {
                        return;
                    }
                }
                if (!item.command && (item === null || item === void 0 ? void 0 : item.insertTextFormat) === vscode_html_languageservice_1.InsertTextFormat.Snippet && ((_b = (_a = item.textEdit) === null || _a === void 0 ? void 0 : _a.newText) === null || _b === void 0 ? void 0 : _b.includes('$1'))) {
                    item.command = {
                        title: 'Suggest',
                        command: 'editor.action.triggerSuggest'
                    };
                }
            }
            if (!item.data || typeof item.data.hxKind == 'undefined') {
                if (item.kind === vscode_html_languageservice_1.CompletionItemKind.Value && item.label.startsWith('on')) {
                    item.data = { hxKind: utils_2.HxIconKind.EVENT, data: item.data };
                }
                else if (item.kind && iconKindMap.has(item.kind)) {
                    item.data = { hxKind: iconKindMap.get(item.kind), data: item.data };
                }
            }
            repaceItems.push(item);
        });
        completionList.items = repaceItems;
        result.items.push(...completionList.items);
        result.isIncomplete = completionList.isIncomplete;
        return result;
    }
    updateDataProviders(providers) {
        this.dataProviders = [];
        this.vueDirectives.clear();
        this.dataProviders.push(...providers);
        this.dataProviders.forEach(p => {
            if (p.getId() == 'vue_html' || p.getId() == 'vue3_html') {
                p.provideAttributes('').forEach((a) => {
                    if (a.name.startsWith('v-')) {
                        this.vueDirectives.add(a.name);
                    }
                });
            }
        });
    }
    setHtmlDocuments(documents) {
        this.documents = documents;
    }
}
function getHtmlModeExt(languageService, documentCache, workspace, option) {
    return new HTMLLanguageServiceExt(languageService, documentCache, workspace, option);
}
exports.getHtmlModeExt = getHtmlModeExt;
//# sourceMappingURL=htmlModeExtentsion.js.map