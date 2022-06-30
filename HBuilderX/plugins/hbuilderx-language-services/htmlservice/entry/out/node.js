"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTagAttributes = exports.getHtmlTags = exports.getLanguageServerExt = exports.HtmlServiceExtUtils = void 0;
const chardet = require("chardet");
const fs = require("fs");
const vscode_html_languageservice_1 = require("vscode-html-languageservice");
const indexlib_1 = require("../../../indexlib");
const serverinterface_1 = require("../../../serverinterface");
const vscode_languageserver_1 = require("vscode-languageserver");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const vscode_uri_1 = require("vscode-uri");
const utils_1 = require("./utils");
const dataProviderManager_1 = require("./dataProviderManager");
const utils_2 = require("../../../utils");
var utils_3 = require("./utils");
Object.defineProperty(exports, "HtmlServiceExtUtils", { enumerable: true, get: function () { return utils_3.HtmlServiceExtUtils; } });
const dataManager = (0, dataProviderManager_1.getDataManager)();
class HtmlLanguageServiceExt {
    constructor() {
        this.languageService = (0, vscode_html_languageservice_1.getLanguageService)();
    }
    findSymbol(source, symbol, ws) {
        if (!ws) {
            return Promise.resolve([]);
        }
        return Promise.resolve().then(() => {
            if (symbol.type != serverinterface_1.SymbolType.ElementId) {
                return [];
            }
            let allData = indexlib_1.IndexDataStore.load(ws).allIndexData();
            let result = [];
            allData.forEach((val, key) => {
                val.references.find((ref) => {
                    if (ref.uri === source.uri) {
                        let range = this.findIdInDocument(key, symbol.text);
                        if (range) {
                            result = vscode_languageserver_1.Location.create(key, range);
                            return true;
                        }
                    }
                    return false;
                });
            });
            return result;
        });
    }
    findIdInDocument(uri, text) {
        try {
            let buffer = fs.readFileSync(vscode_uri_1.URI.parse(uri).fsPath);
            let encoding = chardet.detect(buffer);
            let content = buffer.toString(encoding || 'utf-8');
            buffer = undefined;
            let document = vscode_languageserver_textdocument_1.TextDocument.create(uri, "html", 1.0, content);
            let htmlDocument = this.languageService.parseHTMLDocument(document);
            let result = null;
            utils_1.HtmlServiceExtUtils.searchHtmlNode(htmlDocument.roots, (node) => {
                let range = utils_1.HtmlServiceExtUtils.getAttributeInDocument(document, this.languageService, node, 'id');
                if (range && text == document.getText(range)) {
                    result = range;
                    return false;
                }
                return true;
            });
            return result;
        }
        catch (error) {
            console.log('find id symbol in ' + uri + ' faild:' + error);
        }
        return null;
    }
}
function getLanguageServerExt() {
    let serviceExt = new HtmlLanguageServiceExt();
    return {
        findSymbol(source, symbol, ws) {
            return serviceExt.findSymbol(source, symbol, ws);
        }
    };
}
exports.getLanguageServerExt = getLanguageServerExt;
function getHtmlTags(ws) {
    let tags = new Set();
    if (ws && (0, utils_2.getProjectType)(vscode_uri_1.URI.parse(ws.uri).fsPath) === utils_2.ProjectType.PT_UniApp_Vue) {
        dataManager.vueDataProvides().forEach(provider => {
            provider.provideTags().forEach(tag => {
                if (!tags.has(tag.name)) {
                    tags.add(tag.name);
                }
            });
        });
    }
    else {
        dataManager.defaultDataProvider().provideTags().forEach(((tag) => {
            if (!tags.has(tag.name)) {
                tags.add(tag.name);
            }
        }));
    }
    return Array.from(tags.values());
}
exports.getHtmlTags = getHtmlTags;
function getTagAttributes(ws, tag) {
    let attrNames = new Set();
    let providers = [];
    if (ws && (0, utils_2.getProjectType)(vscode_uri_1.URI.parse(ws.uri).fsPath) === utils_2.ProjectType.PT_UniApp_Vue) {
        providers = dataManager.vueDataProvides();
    }
    else {
        providers = [dataManager.defaultDataProvider()];
    }
    const attrCollector = (attr) => {
        if (!attr.name.startsWith('[event]') && !attr.name.startsWith('on') && !attrNames.has(attr.name)) {
            attrNames.add(attr.name);
        }
    };
    if (typeof tag === 'undefined') {
        providers.forEach(provider => {
            var _a, _b, _c;
            (_a = provider) === null || _a === void 0 ? void 0 : _a._tags.forEach((tag) => {
                tag.attributes.forEach(attrCollector);
            });
            (_c = (_b = provider) === null || _b === void 0 ? void 0 : _b._globalAttributes) === null || _c === void 0 ? void 0 : _c.forEach(attrCollector);
        });
    }
    else {
        providers.forEach(provider => {
            provider.provideAttributes(tag).forEach(attrCollector);
        });
    }
    return Array.from(attrNames.values());
}
exports.getTagAttributes = getTagAttributes;
//# sourceMappingURL=node.js.map