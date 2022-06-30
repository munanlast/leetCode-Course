"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJQLLanguageService = void 0;
const ts = require("typescript");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const uniCloudPath_1 = require("../common/uniCloudPath");
let documentVersion = 1;
let jqlHelperFileName = `jql-helper-docs.ts`;
let currentTextDocument = vscode_languageserver_textdocument_1.TextDocument.create(jqlHelperFileName, 'typescript', 1, ``);
let proxyService = null;
let tsService = null;
const jqlDocProvider = {
    get version() {
        return "" + documentVersion;
    },
    compilerOptions: {
        allowNonTsExtensions: true,
        allowJs: true,
        lib: ["lib.esnext.d.ts"],
        target: ts.ScriptTarget.Latest,
        moduleResolution: ts.ModuleResolutionKind.Classic,
        experimentalDecorators: false
    },
    documents: [currentTextDocument.uri],
    getDocumentSnapshot(uri) {
        let text = "";
        if (uri.indexOf(jqlHelperFileName) >= 0) {
            text = currentTextDocument.getText();
        }
        return {
            getText: (start, end) => text.substring(start, end),
            getLength: () => text.length,
            getChangeRange: () => undefined
        };
    },
    getDocumentVersion(uri) {
        if (uri.indexOf(jqlHelperFileName) >= 0) {
            return "" + currentTextDocument.version;
        }
        return "1";
    },
    hasDocument(uri) {
        if (uri.indexOf(jqlHelperFileName) >= 0) {
            return true;
        }
        return false;
    }
};
function getJQLService(prj) {
    if (tsService && proxyService) {
        return {
            proxy: proxyService,
            tsLS: tsService
        };
    }
    tsService = prj.createTSLanguageService(jqlDocProvider);
    proxyService = Object.create(null);
    for (let k of Object.keys(tsService)) {
        const x = tsService[k];
        proxyService[k] = (...args) => x.apply(tsService, args);
    }
    return {
        proxy: proxyService,
        tsLS: tsService
    };
}
function getJQLLanguageService(prj, text) {
    const { proxy, tsLS } = getJQLService(prj);
    documentVersion++;
    currentTextDocument = vscode_languageserver_textdocument_1.TextDocument.create(jqlHelperFileName, `typescript`, documentVersion, uniCloudPath_1.jqlPrefix + text);
    proxy.getCompletionsAtPosition = (fileName, position, options) => {
        return tsLS.getCompletionsAtPosition(currentTextDocument.uri, uniCloudPath_1.jqlPrefix.length + position, options);
    };
    proxy.getCompletionEntryDetails = (fileName, position, entryName, formatOptions, source, preferences, data) => {
        return tsLS.getCompletionEntryDetails(currentTextDocument.uri, uniCloudPath_1.jqlPrefix.length + position, entryName, formatOptions, source, preferences, data);
    };
    proxy.getDefinitionAndBoundSpan = (fileName, position) => {
        return tsLS.getDefinitionAndBoundSpan(currentTextDocument.uri, uniCloudPath_1.jqlPrefix.length + position);
    };
    return proxy;
}
exports.getJQLLanguageService = getJQLLanguageService;
//# sourceMappingURL=jqlService.js.map