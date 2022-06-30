"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterpolationDocProvider = void 0;
const ts = require("typescript/lib/tsserverlibrary");
class InterpolationDocProvider {
    constructor() {
        this._documents = new Map();
        this._version = 100;
    }
    get version() {
        return "" + this._version;
    }
    setDocuments(docs) {
        this._documents.clear();
        docs.forEach((doc) => {
            this._documents.set(doc.uri, doc);
        });
    }
    updateVersion() {
        this._version++;
    }
    get documents() {
        let docs = [];
        this._documents.forEach((val, key) => {
            docs.push(key);
        });
        return docs;
    }
    get compilerOptions() {
        return {
            allowNonTsExtensions: true,
            allowJs: true,
            lib: ["lib.esnext.d.ts"],
            target: ts.ScriptTarget.Latest,
            moduleResolution: ts.ModuleResolutionKind.Classic,
            experimentalDecorators: false
        };
    }
    getDocumentSnapshot(uri) {
        let text = '';
        if (this._documents.has(uri)) {
            text = this._documents.get(uri).getText();
        }
        return {
            getText: (start, end) => text.substring(start, end),
            getLength: () => text.length,
            getChangeRange: () => undefined
        };
    }
    hasDocument(uri) {
        return this._documents.has(uri);
    }
    getDocumentVersion(uri) {
        return "" + this._documents.get(uri).version;
    }
}
exports.InterpolationDocProvider = InterpolationDocProvider;
//# sourceMappingURL=interpolationDocProvider.js.map