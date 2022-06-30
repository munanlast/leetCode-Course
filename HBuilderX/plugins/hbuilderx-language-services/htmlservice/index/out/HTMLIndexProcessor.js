"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFileIndexProcessor = void 0;
var vscode_html_languageservice_1 = require("vscode-html-languageservice");
var indexlib_1 = require("../../../indexlib");
var pathresolve_1 = require("./pathresolve");
var vscode_uri_1 = require("vscode-uri");
var htmlBasicTags = null;
function initHtmlBasicTags() {
    if (!htmlBasicTags) {
        htmlBasicTags = new Set();
        (0, vscode_html_languageservice_1.getDefaultHTMLDataProvider)().provideTags().forEach(function (tag) { htmlBasicTags.add(tag.name); });
    }
}
function normalizeRef(url) {
    var first = url[0];
    var last = url[url.length - 1];
    if (first === last && (first === '\'' || first === '\"')) {
        url = url.substr(1, url.length - 2);
    }
    return url;
}
function validateRef(url, languageId) {
    if (!url.length) {
        return false;
    }
    if (languageId === 'handlebars' && /{{|}}/.test(url)) {
        return false;
    }
    return /\b(w[\w\d+.-]*:\/\/)?[^\s()<>]+(?:\([\w\d]+\)|([^[:punct:]\s]|\/?))/.test(url);
}
// 该函数参考vscode-html-languageservice源码
// 仅提取属于本地文件链接
function parseReferenceUri(document, attributeValue, documentContext, base) {
    var tokenContent = normalizeRef(attributeValue);
    if (!validateRef(tokenContent, document.languageId)) {
        return undefined;
    }
    if (/^\s*javascript\:/i.test(tokenContent) || /[\n\r]/.test(tokenContent) || /^\#/i.test(tokenContent)) {
        return undefined; //包含换行、id锚点类型
    }
    if (/^\/\//i.test(tokenContent) || /^https?:\/\//i.test(tokenContent)) {
        return undefined; // 双斜杠开头是指http或https链接
    }
    if (/^file:\/\//i.test(tokenContent)) {
        // Absolute link that needs no treatment
        return tokenContent;
    }
    return documentContext.resolveReference(tokenContent, base || document.uri);
}
var HTMLFileIndexProcessor = /** @class */ (function () {
    function HTMLFileIndexProcessor(manager) {
        this.lastUri = '';
        this.lastProcTime = -1;
        this.processorMnger = manager;
        this.languageService = (0, vscode_html_languageservice_1.getLanguageService)();
    }
    HTMLFileIndexProcessor.prototype.support = function (doc, _ws) {
        if (this.lastUri && doc.uri == this.lastUri) {
            if (process.uptime() - this.lastProcTime < 1) { // 避免频繁重复调用doIndex
                return false;
            }
        }
        this.lastUri = ''; // 清除掉
        if (doc.languageId == 'vue' || doc.languageId == 'html' || doc.languageId == 'html_es6') {
            return true;
        }
        var ext = doc.uri.toLowerCase();
        return ext.endsWith('.html') || ext.endsWith('.vue');
    };
    HTMLFileIndexProcessor.prototype.doIndex = function (doc, ws) {
        var _a;
        var _this = this;
        initHtmlBasicTags();
        var htmldoc = this.languageService.parseHTMLDocument(doc);
        var support = { css: true, script: true };
        var docCtx = (0, pathresolve_1.getDocumentContext)(doc.uri, ws === null || ws === void 0 ? void 0 : ws.uri);
        var data = this.searchHtmlNode(doc, docCtx, support);
        var htmldata = data.htmlIndex;
        var res = new indexlib_1.IndexData;
        if (htmldata.id.length > 0) {
            res.categories.push(indexlib_1.IndexDataCategory.ID);
            res[indexlib_1.IndexDataCategory.ID] = htmldata.id;
        }
        if (htmldata.class.length > 0) {
            res.categories.push(indexlib_1.IndexDataCategory.CLASS);
            res[indexlib_1.IndexDataCategory.CLASS] = htmldata.class;
        }
        if (htmldata.references && htmldata.references.length > 0) {
            (_a = res.references).push.apply(_a, htmldata.references);
        }
        if (htmldata['vue-components'].length > 0) {
            res.categories.push('vue-components');
            res['vue-components'] = htmldata['vue-components'];
        }
        var allLanguages = new Set();
        ;
        data.otherLanguage.forEach(function (rang) {
            allLanguages.add(rang.language);
        });
        allLanguages.forEach(function (lang) {
            var subdoc = _this.getEmbeddedDocument(doc, data.otherLanguage, lang);
            _this.processorMnger.getProcessorForLanguage(lang).forEach(function (processor) {
                var _a;
                if (processor.support(subdoc, ws, doc)) {
                    var index_1 = processor.doIndex(subdoc, ws, doc);
                    index_1.categories.forEach((function (cate) {
                        if (res.categories.indexOf(cate) === -1) {
                            res.categories.push(cate);
                            res[cate] = [];
                        }
                        ;
                        var arr = res[cate];
                        index_1[cate].forEach(function (item) {
                            if (!item.offset && item.position) {
                                item.offset = doc.offsetAt(item.position);
                            }
                            arr.push(item);
                        });
                    }));
                    (_a = res.references).push.apply(_a, index_1.references);
                }
            });
        });
        this.lastUri = doc.uri;
        this.lastProcTime = process.uptime();
        return res;
    };
    HTMLFileIndexProcessor.prototype.getEmbeddedDocument = function (document, contents, languageId) {
        function substituteWithWhitespace(result, start, end, oldContent, before, after) {
            var accumulatedWS = 0;
            result += before;
            for (var i = start + before.length; i < end; i++) {
                var ch = oldContent[i];
                if (ch === '\n' || ch === '\r') {
                    // only write new lines, skip the whitespace
                    accumulatedWS = 0;
                    result += ch;
                }
                else {
                    accumulatedWS++;
                }
            }
            result = append(result, ' ', accumulatedWS - after.length);
            result += after;
            return result;
        }
        function append(result, str, n) {
            while (n > 0) {
                if (n & 1) {
                    result += str;
                }
                n >>= 1;
                str += str;
            }
            return result;
        }
        var currentPos = 0;
        var oldContent = document.getText();
        var result = '';
        var lastSuffix = '';
        for (var _i = 0, contents_1 = contents; _i < contents_1.length; _i++) {
            var c = contents_1[_i];
            if (c.language === languageId) {
                var prefix = (c.isAttribute && c.language == 'css') ? '__{' : '';
                result = substituteWithWhitespace(result, currentPos, c.start, oldContent, lastSuffix, prefix);
                result += oldContent.substring(c.start, c.start + c.length);
                currentPos = c.start + c.length;
                if (c.isAttribute) {
                    switch (c.language) {
                        case 'css':
                            lastSuffix = '}';
                            break;
                        case 'javascript':
                            lastSuffix = ';';
                            break;
                    }
                }
                lastSuffix = '';
            }
        }
        result = substituteWithWhitespace(result, currentPos, oldContent.length, oldContent, lastSuffix, '');
        return vscode_html_languageservice_1.TextDocument.create(document.uri, languageId, document.version, result);
    };
    HTMLFileIndexProcessor.prototype.searchHtmlNode = function (doc, documentContext, support) {
        var _a, _b, _c;
        var htmlIndex = { id: [], class: [], 'vue-components': [], references: [] };
        var others = [];
        var idSet = new Set();
        var classSet = new Set();
        var baseUrl = void 0;
        var currentTag = '';
        var currentAttr = '';
        var text = doc.getText();
        var scanner = this.languageService.createScanner(text);
        var token = scanner.scan();
        var tagAttrs = {};
        var tagPositon = null;
        var vueComponentData = { events: [] };
        while (token != vscode_html_languageservice_1.TokenType.EOS) {
            switch (token) {
                case vscode_html_languageservice_1.TokenType.StartTag:
                    tagPositon = doc.positionAt(scanner.getTokenOffset());
                    currentTag = scanner.getTokenText();
                    tagAttrs = {};
                    break;
                case vscode_html_languageservice_1.TokenType.EndTag:
                    if (currentTag && tagPositon && !(htmlBasicTags === null || htmlBasicTags === void 0 ? void 0 : htmlBasicTags.has(currentTag))) {
                        if (vueComponentData.events.length) {
                            htmlIndex['vue-components'].push({
                                label: currentTag,
                                position: tagPositon,
                                data: vueComponentData,
                            });
                        }
                    }
                    currentTag = '';
                    vueComponentData = { events: [] };
                    break;
                case vscode_html_languageservice_1.TokenType.AttributeName:
                    currentAttr = scanner.getTokenText();
                    var match = currentAttr.match(/^(@|v-on:)([^\.:\s]*)/i);
                    var func = match ? match[2] : '';
                    if (func) {
                        vueComponentData.events.push(func);
                    }
                    break;
                case vscode_html_languageservice_1.TokenType.AttributeValue:
                    var value = scanner.getTokenText();
                    if (currentTag === 'base' && currentAttr === 'href') {
                        baseUrl = normalizeRef(value);
                        if (baseUrl && documentContext) {
                            baseUrl = documentContext.resolveReference(baseUrl, doc.uri);
                        }
                    }
                    else if (currentTag == 'link') {
                        if (currentAttr === 'href' || currentAttr === 'rel') {
                            tagAttrs[currentAttr] = normalizeRef(value);
                        }
                        if (tagAttrs['rel'] === 'stylesheet' && tagAttrs['href']) {
                            var uri = parseReferenceUri(doc, tagAttrs['href'], documentContext, baseUrl);
                            if (uri) {
                                var file = vscode_uri_1.URI.parse(uri).fsPath;
                                var paramPos = file.indexOf('?');
                                if (paramPos >= 0) {
                                    uri = vscode_uri_1.URI.file(file.slice(0, paramPos)).toString();
                                }
                                (_a = htmlIndex.references) === null || _a === void 0 ? void 0 : _a.push({ uri: uri, type: indexlib_1.ReferenceFileType.CSS });
                            }
                        }
                    }
                    else if (currentTag == 'script') {
                        if ((support === null || support === void 0 ? void 0 : support.script) && currentAttr == 'src') {
                            var text_1 = normalizeRef(value);
                            var uri = parseReferenceUri(doc, text_1, documentContext, baseUrl);
                            if (uri) {
                                var file = vscode_uri_1.URI.parse(uri).fsPath;
                                var paramPos = file.indexOf('?');
                                if (paramPos >= 0) {
                                    uri = vscode_uri_1.URI.file(file.slice(0, paramPos)).toString();
                                }
                                (_b = htmlIndex.references) === null || _b === void 0 ? void 0 : _b.push({ uri: uri, type: indexlib_1.ReferenceFileType.Script });
                            }
                        }
                    }
                    else if (currentTag == 'style') {
                        if ((support === null || support === void 0 ? void 0 : support.css) && currentAttr == 'lang') {
                            tagAttrs['lang'] = scanner.getTokenText();
                        }
                    }
                    else if (currentAttr === 'id') {
                        var item = this.getIdIndexItem(doc, scanner.getTokenText(), scanner.getTokenOffset());
                        if (item.label && !idSet.has(item.label)) {
                            idSet.add(item.label);
                            htmlIndex.id.push(item);
                        }
                    }
                    else if (currentAttr === 'class') {
                        var items = this.getClassIndexItems(doc, scanner.getTokenText(), scanner.getTokenOffset());
                        items.forEach(function (item) {
                            if (!classSet.has(item.label)) {
                                htmlIndex.class.push(item);
                                classSet.add(item.label);
                            }
                        });
                    }
                    else {
                        if ((support === null || support === void 0 ? void 0 : support.css) || (support === null || support === void 0 ? void 0 : support.script)) {
                            var match_1 = currentAttr.match(/^(style)$|^(on\w+)$/i);
                            if (match_1) {
                                var language = match_1[1] ? 'css' : 'javascript';
                                var start = scanner.getTokenOffset();
                                var end = scanner.getTokenEnd();
                                var firstChar = text[start];
                                if (firstChar === '\'' || firstChar === '"') {
                                    start++;
                                    end--;
                                }
                                others.push({ language: language, start: start, length: end - start, isAttribute: true });
                            }
                        }
                    }
                    break;
                case vscode_html_languageservice_1.TokenType.Script:
                    if (support === null || support === void 0 ? void 0 : support.script) {
                        var type = tagAttrs['type'];
                        var language = 'javascript';
                        if (type && /["']text\/typescript["']/.test(type)) {
                            language = 'typescript';
                        }
                        others.push({ language: language, start: scanner.getTokenOffset(), length: scanner.getTokenLength() });
                    }
                    break;
                case vscode_html_languageservice_1.TokenType.Styles:
                    if (support === null || support === void 0 ? void 0 : support.css) {
                        var language = (_c = tagAttrs['lang']) !== null && _c !== void 0 ? _c : '';
                        language = normalizeRef(language);
                        if (!language) {
                            language = 'css';
                        }
                        others.push({ language: language, start: scanner.getTokenOffset(), length: scanner.getTokenLength() });
                    }
                    break;
                default:
                    break;
            }
            token = scanner.scan();
        }
        return { otherLanguage: others, htmlIndex: htmlIndex };
    };
    HTMLFileIndexProcessor.prototype.getIdIndexItem = function (document, valueStr, docOffset) {
        var firstChar = valueStr[0];
        var start = docOffset + ((firstChar === '\'' || firstChar === '"') ? 1 : 0);
        return {
            label: normalizeRef(valueStr),
            position: document.positionAt(start),
            type: indexlib_1.IndexItemType.DEF,
            offset: start
        };
    };
    HTMLFileIndexProcessor.prototype.getClassIndexItems = function (document, valueStr, docOffset) {
        var firstChar = valueStr[0];
        var start = docOffset + ((firstChar === '\'' || firstChar === '"') ? 1 : 0);
        var classVal = normalizeRef(valueStr);
        var partStart = start;
        var result = [];
        while (classVal.length > 0) {
            var offset = classVal.search(/\s/);
            if (offset !== 0) {
                var part = classVal.slice(0, (offset === -1 ? undefined : offset));
                if (part) {
                    result.push({
                        label: part,
                        position: document.positionAt(partStart),
                        type: indexlib_1.IndexItemType.REF,
                        offset: partStart
                    });
                }
                partStart += part.length;
            }
            if (offset == -1) {
                break;
            }
            classVal = classVal.slice(offset + 1);
            partStart++;
        }
        return result;
    };
    return HTMLFileIndexProcessor;
}());
function createFileIndexProcessor(_manager) {
    return new HTMLFileIndexProcessor(_manager);
}
exports.createFileIndexProcessor = createFileIndexProcessor;
//# sourceMappingURL=HTMLIndexProcessor.js.map