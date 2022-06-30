"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDataProvider = exports.HTMLDataProviderWrapper = void 0;
const vscode_html_languageservice_1 = require("vscode-html-languageservice");
const fs = require("fs");
class HTMLDataProviderWrapper {
    constructor(id, provider) {
        this.id = id;
        this._enable = true;
        this._provider = provider;
    }
    getId() {
        return this.id;
    }
    isApplicable(languageId) {
        return this._enable && this._provider.isApplicable(languageId);
    }
    get enable() {
        return this._enable;
    }
    set enable(val) {
        this._enable = val;
    }
    provideTags() {
        return this._provider.provideTags();
    }
    provideAttributes(tag) {
        return this._provider.provideAttributes(tag);
    }
    provideValues(tag, attribute) {
        return this._provider.provideValues(tag, attribute);
    }
}
exports.HTMLDataProviderWrapper = HTMLDataProviderWrapper;
function createDataProvider(id, file) {
    try {
        let content = fs.readFileSync(file, { encoding: 'utf8' });
        let rawData = JSON.parse(content);
        let provider = (0, vscode_html_languageservice_1.newHTMLDataProvider)(id, {
            version: rawData.version || 1,
            tags: rawData.tags || [],
            globalAttributes: rawData.globalAttributes || [],
            valueSets: rawData.valueSets || []
        });
        return new HTMLDataProviderWrapper(id, provider);
    }
    catch (error) {
    }
    return new HTMLDataProviderWrapper(id, (0, vscode_html_languageservice_1.newHTMLDataProvider)(id, { version: 1 }));
}
exports.createDataProvider = createDataProvider;
//# sourceMappingURL=htmlDataProviderWrapper.js.map