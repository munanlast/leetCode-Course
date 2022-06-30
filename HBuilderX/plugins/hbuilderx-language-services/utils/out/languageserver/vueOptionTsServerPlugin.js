"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hxproject_1 = require("./hxproject");
const ts = require("typescript");
const path = require("path");
const type_resolve_1 = require("../common/type-resolve");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
let optionTextDocument = vscode_languageserver_textdocument_1.TextDocument.create('', 'typescript', 1, ``);
const vueOptionDocProvider = {
    get version() {
        return "" + optionTextDocument.version;
    },
    compilerOptions: {
        allowNonTsExtensions: true,
        allowJs: true,
        lib: ["lib.esnext.d.ts"],
        target: ts.ScriptTarget.Latest,
        moduleResolution: ts.ModuleResolutionKind.NodeJs,
        experimentalDecorators: false
    },
    getDefaultLibs(prj) {
        let result = [];
        let extensionDir = hxproject_1.hx.getExtensionRootPath();
        result.push(path.join(extensionDir, "builtin-dts", "node_modules", "vue", "types", "index.d.ts"));
        //builtin-dts/node_modules/@vue/composition-api/dist/vue-composition-api.d.ts
        result.push(path.join(extensionDir, "builtin-dts", "node_modules", "@vue", "composition-api/dist/vue-composition-api.d.ts"));
        result.push(path.join(extensionDir, "builtin-dts", "node_modules", "vue@3", "types", "index.d.ts"));
        result.push(path.join(extensionDir, "builtin-dts", "node_modules", "vuex", "types", "index.d.ts"));
        if (prj.kind === hxproject_1.hx.HXProjectKind.UniApp || prj.kind === hxproject_1.hx.HXProjectKind.UniApp_Cli) {
            result.push(path.join(extensionDir, "builtin-dts", "node_modules", "@dcloudio", "types", "index.d.ts"));
        }
        return result;
    },
    get documents() {
        return [optionTextDocument.uri];
    },
    getDocumentSnapshot(uri) {
        let text = "";
        if (uri == optionTextDocument.uri) {
            text = optionTextDocument.getText();
        }
        return {
            getText: (start, end) => text.substring(start, end),
            getLength: () => text.length,
            getChangeRange: () => undefined
        };
    },
    getDocumentVersion(uri) {
        if (uri == optionTextDocument.uri) {
            return "" + optionTextDocument.version;
        }
        return "1";
    },
    hasDocument(uri) {
        if (uri == optionTextDocument.uri) {
            return true;
        }
        return false;
    },
    resolveModuleNameOverride(prj, moduleName, containingFile, compilerOptions, resolutionHost, cache, redirectedReference, resolutionMode) {
        if (moduleName == 'vue') {
            let extensionDir = hxproject_1.hx.getExtensionRootPath();
            return {
                isExternalLibraryImport: true,
                resolvedFileName: path.join(extensionDir, "builtin-dts", "node_modules", "vue", "types", "index.d.ts")
            };
        }
        return undefined;
    }
};
function createOptionHelperDocument(fileName, objectExprText, objectNodeStart, version) {
    let newDoc = `import Vue from 'vue';
			  new Vue(
			`;
    let offsetDelta = newDoc.length - objectNodeStart - 1;
    newDoc += objectExprText;
    newDoc += `)`;
    let doc = vscode_languageserver_textdocument_1.TextDocument.create(fileName, "typescript", version, newDoc);
    return {
        doc,
        offsetDelta
    };
}
function getVueLanguageService(prj, doc) {
    let tsLS = prj.createTSLanguageService(vueOptionDocProvider);
    optionTextDocument = doc;
    return tsLS;
}
function create(info) {
    const tsLS = info.languageService;
    const tsHost = info.languageServiceHost;
    const prj = info.project;
    const proxy = Object.create(null);
    for (let k of Object.keys(tsLS)) {
        const x = tsLS[k];
        proxy[k] = (...args) => x.apply(tsLS, args);
    }
    proxy.getCompletionEntryDetails = (fileName, position, entryName, formatOptions, source, preferences, data) => {
        let program = tsLS.getProgram();
        let sourceAst = program.getSourceFile(fileName);
        if (fileName.endsWith(".vue") || fileName.endsWith(".nvue")) {
            let objectExpr = (0, type_resolve_1.findExportDefaultObjectExpressionAtKeyOffset)(sourceAst, position);
            if (objectExpr) {
                let { doc, offsetDelta } = createOptionHelperDocument(fileName + ".ts", objectExpr.getText(sourceAst), objectExpr.pos, parseInt(tsHost === null || tsHost === void 0 ? void 0 : tsHost.getProjectVersion()));
                return getVueLanguageService(prj, doc).getCompletionEntryDetails(doc.uri, position + offsetDelta, entryName, formatOptions, source, preferences, data);
            }
        }
        return tsLS.getCompletionEntryDetails(fileName, position, entryName, formatOptions, source, preferences, data);
    };
    proxy.getCompletionsAtPosition = (fileName, position, options) => {
        let program = tsLS.getProgram();
        let source = program.getSourceFile(fileName);
        if (fileName.endsWith(".vue") || fileName.endsWith(".nvue")) {
            let objectExpr = (0, type_resolve_1.findExportDefaultObjectExpressionAtKeyOffset)(source, position);
            if (objectExpr) {
                let { doc, offsetDelta } = createOptionHelperDocument(fileName + ".ts", objectExpr.getText(source), objectExpr.pos, parseInt(tsHost === null || tsHost === void 0 ? void 0 : tsHost.getProjectVersion()));
                return getVueLanguageService(prj, doc).getCompletionsAtPosition(doc.uri, position + offsetDelta, options);
            }
        }
        return tsLS.getCompletionsAtPosition(fileName, position, options);
    };
    proxy.getDefinitionAtPosition = (fileName, position) => {
        if (fileName.endsWith(".vue") || fileName.endsWith(".nvue")) {
            let program = tsLS.getProgram();
            let source = program.getSourceFile(fileName);
            let objectExpr = (0, type_resolve_1.findExportDefaultObjectExpressionAtKeyOffset)(source, position);
            if (objectExpr) {
                let { doc, offsetDelta } = createOptionHelperDocument(fileName + ".ts", objectExpr.getText(source), objectExpr.pos, parseInt(tsHost === null || tsHost === void 0 ? void 0 : tsHost.getProjectVersion()));
                return getVueLanguageService(prj, doc).getDefinitionAtPosition(doc.uri, position + offsetDelta);
            }
        }
        return tsLS.getDefinitionAtPosition(fileName, position);
    };
    proxy.getQuickInfoAtPosition = (fileName, position) => {
        if (fileName.endsWith(".vue") || fileName.endsWith(".nvue")) {
            let program = tsLS.getProgram();
            let source = program.getSourceFile(fileName);
            let objectExpr = (0, type_resolve_1.findExportDefaultObjectExpressionAtKeyOffset)(source, position);
            if (objectExpr) {
                let { doc, offsetDelta } = createOptionHelperDocument(fileName + ".ts", objectExpr.getText(source), objectExpr.pos, parseInt(tsHost === null || tsHost === void 0 ? void 0 : tsHost.getProjectVersion()));
                return getVueLanguageService(prj, doc).getQuickInfoAtPosition(doc.uri, position + offsetDelta);
            }
        }
        return tsLS.getQuickInfoAtPosition(fileName, position);
    };
    proxy.getDefinitionAndBoundSpan = (fileName, position) => {
        return tsLS.getDefinitionAndBoundSpan(fileName, position);
    };
    return proxy;
}
exports.default = {
    create
};
//# sourceMappingURL=vueOptionTsServerPlugin.js.map