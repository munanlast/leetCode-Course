"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hx = void 0;
const fs = require("fs");
const path = require("path");
const ts = require("typescript/lib/tsserverlibrary");
const vscode_languageserver_1 = require("vscode-languageserver");
const vscode_uri_1 = require("vscode-uri");
const indexlib_1 = require("../../../indexlib");
const type_resolve_1 = require("../common/type-resolve");
const hxPluginCreateFactory_1 = require("./hxPluginCreateFactory");
const languageServiceProxy_1 = require("./languageServiceProxy");
const uniCloudTypeHelper_1 = require("./uniCloudTypeHelper");
const vueRefTypeHelper_1 = require("./vueRefTypeHelper");
const vueOptionTsServerPlugin_1 = require("./vueOptionTsServerPlugin");
const vue = require("./vueService");
const vueVersion_1 = require("../vueParse/vueVersion");
const baseTypes = ['Array', 'String', 'Number', 'Boolean', 'Symbol', 'Object'];
var hx;
(function (hx) {
    function computeJSResolveData(label, detail, kind, offset, textEdit, source, isJsRelated, insertTextFormat) {
        var _a;
        let uniOptionsReg = /Uni\.(.*)\(options\s*:\s*(UniNamespace|UniApp)\.(.*)Options\s*\)/;
        let uniCloudOptionsReg = /UniCloud\.(.*)\(options\s*:\s*(UniCloudNamespace|UniCloud)\.(.*)Options\s*\)/;
        let item = {};
        if (source && (0, type_resolve_1.isObjectLiteralKey)(source, offset)) {
            if (detail) {
                let triggerSnippetCommand = {
                    title: 'Suggest',
                    command: 'editor.action.triggerSnippet',
                    arguments: [
                        "_object_func_callback_method.js",
                        "_object_func_callback.js",
                        "_object_func_callback_arrow.js",
                        "_object_property_callback.js"
                    ]
                };
                let uniReg = /\s*(UniNamespace|UniApp)\.(.*)Options\s*/;
                let uniCloudReg = /\s*(UniCloudNamespace|UniCloud)\.(.*)Options\s*/;
                let uniSearchResult = detail.search(uniReg);
                let uniCloudSearchResult = detail.search(uniCloudReg);
                if (/UniNamespace\.(.*)Options\.(.*):\s*\((.*)\)\s*=>\s*/.test(detail)) {
                    item.command = triggerSnippetCommand;
                }
                else if (kind &&
                    (((kind == vscode_languageserver_1.CompletionItemKind.Function || kind == vscode_languageserver_1.CompletionItemKind.Method) && !isJsRelated) ||
                        ((kind == 2 || kind == 1) && isJsRelated))) {
                    item.command = triggerSnippetCommand;
                }
                else if (uniSearchResult !== -1 || uniCloudSearchResult !== -1) {
                    if (insertTextFormat == vscode_languageserver_1.InsertTextFormat.PlainText || isJsRelated) {
                        let { isInString, flag } = (0, type_resolve_1.isStringLiteral)(source, offset);
                        if (textEdit) {
                            if (isInString) {
                                textEdit.newText = `${flag}${label}${flag}:\$0`;
                                //@ts-ignore
                                textEdit === null || textEdit === void 0 ? void 0 : textEdit.range = { start: { line: (_a = item.textEdit) === null || _a === void 0 ? void 0 : _a.range.start.line, character: item.textEdit.range.start.character - 1 }, end: { line: item.textEdit.range.end.line, character: item.textEdit.range.start.character + 1 } };
                            }
                            else {
                                textEdit.newText = `${label}:\$0`;
                            }
                            item.textEdit = textEdit;
                        }
                        else {
                            item.insertText = `${label}:\$0`;
                        }
                    }
                    item.command = {
                        title: 'Suggest',
                        command: 'editor.action.triggerSuggest'
                    };
                    if (!isJsRelated)
                        item.insertTextFormat = vscode_languageserver_1.InsertTextFormat.Snippet;
                }
            }
        }
        else if (detail && uniOptionsReg.test(detail) || uniCloudOptionsReg.test(detail)) {
            if (insertTextFormat == vscode_languageserver_1.InsertTextFormat.PlainText || isJsRelated) {
                if (textEdit) {
                    item.textEdit = textEdit;
                    item.textEdit.newText = `${label}({\n\t\$0\n})`;
                }
                else {
                    item.insertText = `${label}({\n\t\$0\n})`;
                }
                item.command = {
                    title: 'Suggest',
                    command: 'editor.action.triggerSuggest'
                };
                if (!isJsRelated)
                    item.insertTextFormat = vscode_languageserver_1.InsertTextFormat.Snippet;
            }
        }
        else if (kind && (kind == vscode_languageserver_1.CompletionItemKind.Function || kind == vscode_languageserver_1.CompletionItemKind.Method)) {
            if (!(0, type_resolve_1.isImportElement)(source, offset)) {
                if (insertTextFormat == vscode_languageserver_1.InsertTextFormat.PlainText || isJsRelated) {
                    let _label = label;
                    _label = _label.replace(/\$/g, '\\$');
                    let insertSnippetString = `${_label}(\$1)\$0`;
                    if (textEdit) {
                        item.textEdit = textEdit;
                        item.textEdit.newText = insertSnippetString;
                    }
                    else {
                        item.insertText = insertSnippetString;
                    }
                    if (!isJsRelated)
                        item.insertTextFormat = vscode_languageserver_1.InsertTextFormat.Snippet;
                }
            }
            else {
                if (insertTextFormat == vscode_languageserver_1.InsertTextFormat.PlainText || isJsRelated) {
                    if (textEdit) {
                        item.textEdit = textEdit;
                        item.textEdit.newText = label;
                    }
                    else {
                        item.insertText = label;
                    }
                }
            }
        }
        return item;
    }
    hx.computeJSResolveData = computeJSResolveData;
    function resolveJSCompletionItem(item, source) {
        let data = computeJSResolveData(item.label, item.detail, item.kind, item === null || item === void 0 ? void 0 : item.data.offset, item.textEdit, source, false, item.insertTextFormat);
        item.command = data.command;
        item.insertText = data.insertText;
        item.insertTextFormat = data.insertTextFormat;
        item.textEdit = data.textEdit;
        return item;
    }
    hx.resolveJSCompletionItem = resolveJSCompletionItem;
    function getExtensionRootPath() {
        return path.resolve(__dirname, "../../../");
    }
    hx.getExtensionRootPath = getExtensionRootPath;
    function readFiletoString(filePath) {
        return ts.sys.readFile(filePath);
    }
    hx.readFiletoString = readFiletoString;
    function toNormalizedPath(filePath) {
        return ts.server.toNormalizedPath(filePath);
    }
    hx.toNormalizedPath = toNormalizedPath;
    function toNormalizedUri(filePath) {
        if (filePath.startsWith("file:/")) {
            let uri = vscode_uri_1.URI.parse(filePath);
            let fsPath = toNormalizedPath(uri.fsPath);
            return vscode_uri_1.URI.file(fsPath).toString();
        }
        let fsPath = toNormalizedPath(filePath);
        return vscode_uri_1.URI.file(fsPath).toString();
    }
    hx.toNormalizedUri = toNormalizedUri;
    let HXProjectKind;
    (function (HXProjectKind) {
        HXProjectKind[HXProjectKind["UniApp"] = 0] = "UniApp";
        HXProjectKind[HXProjectKind["UniApp_Cli"] = 1] = "UniApp_Cli";
        HXProjectKind[HXProjectKind["Web"] = 2] = "Web";
        HXProjectKind[HXProjectKind["App"] = 3] = "App";
        HXProjectKind[HXProjectKind["Wap2App"] = 4] = "Wap2App";
        HXProjectKind[HXProjectKind["Extension"] = 5] = "Extension";
    })(HXProjectKind = hx.HXProjectKind || (hx.HXProjectKind = {}));
    function proxyTSLanguageService(prj, tsLS, tsHost) {
        const hxPlugins = [vueOptionTsServerPlugin_1.default];
        for (let plugin of hxPlugins) {
            tsLS = plugin.create({
                project: prj,
                languageService: tsLS,
                languageServiceHost: tsHost
            });
        }
        overrideSymbolKind(ts);
        const proxy = Object.create(null);
        for (let k of Object.keys(tsLS)) {
            const x = tsLS[k];
            proxy[k] = (...args) => x.apply(tsLS, args);
        }
        tsLS = (0, languageServiceProxy_1.createTSLanguageServiceProxy)(tsLS, prj, null);
        proxy.getCompletionEntryDetails = (fileName, position, entryName, formatOptions, source, preferences, data) => {
            let program = tsLS.getProgram();
            let sourceAst = program.getSourceFile(fileName);
            if (fileName.endsWith(".vue") || fileName.endsWith(".nvue")) {
                let thisExpr = (0, type_resolve_1.findExportThisExpressionAtOffset)(sourceAst, position);
                if (thisExpr) {
                    let service = vue.getVueThisLangusgeService(prj, thisExpr);
                    if (service) {
                        return service.getCompletionEntryDetails(fileName, position, entryName, formatOptions, source, preferences, data);
                    }
                }
            }
            return tsLS.getCompletionEntryDetails(fileName, position, entryName, formatOptions, source, preferences, data);
        };
        proxy.getCompletionsAtPosition = (fileName, position, options) => {
            let program = tsLS.getProgram();
            let source = program.getSourceFile(fileName);
            if (fileName.endsWith(".vue") || fileName.endsWith(".nvue")) {
                let thisExpr = (0, type_resolve_1.findExportThisExpressionAtOffset)(source, position);
                if (thisExpr) {
                    let service = vue.getVueThisLangusgeService(prj, thisExpr);
                    if (service) {
                        let result = service.getCompletionsAtPosition(fileName, position, options);
                        let distinctKey = new Set();
                        result === null || result === void 0 ? void 0 : result.entries.forEach(item => {
                            distinctKey.add(`${item.name}::${item.kind}`);
                        });
                        let result2 = tsLS.getCompletionsAtPosition(fileName, position, options);
                        if (!result) {
                            return result2;
                        }
                        result2 === null || result2 === void 0 ? void 0 : result2.entries.forEach(item => {
                            if (!distinctKey.has(`${item.name}::${item.kind}`)) {
                                result.entries.push(item);
                            }
                        });
                        return result;
                    }
                }
            }
            const prior = tsLS.getCompletionsAtPosition(fileName, position, options);
            if (fileName.endsWith('.html') || fileName.endsWith('.htm')) {
                let uri = vscode_uri_1.URI.file(prj.sourceRoot);
                let indexDataStore = indexlib_1.IndexDataStore === null || indexlib_1.IndexDataStore === void 0 ? void 0 : indexlib_1.IndexDataStore.load({ uri: uri.toString(), name: '' });
                let indexData = indexDataStore === null || indexDataStore === void 0 ? void 0 : indexDataStore.indexData(fileName);
                if (indexData) {
                    let scriptReference = indexData === null || indexData === void 0 ? void 0 : indexData.references.filter(value => value.type == indexlib_1.ReferenceFileType.Script);
                    for (let reference of scriptReference) {
                        let referenceURI = vscode_uri_1.URI.parse(reference.uri);
                        let referencePath = referenceURI === null || referenceURI === void 0 ? void 0 : referenceURI.fsPath;
                        if (fs.existsSync(referencePath)) {
                            let sourceFile = ts.createSourceFile('', fs.readFileSync(referencePath).toLocaleString(), ts.ScriptTarget.Latest);
                            sourceFile === null || sourceFile === void 0 ? void 0 : sourceFile.forEachChild(node => {
                                var _a, _b;
                                if (node.kind === ts.SyntaxKind.VariableStatement) {
                                    for (let declaretion of (_b = (_a = node) === null || _a === void 0 ? void 0 : _a.declarationList) === null || _b === void 0 ? void 0 : _b.declarations) {
                                        if (declaretion.kind === ts.SyntaxKind.VariableDeclaration) {
                                            let declaretionName = declaretion.name;
                                            if (declaretionName.kind === ts.SyntaxKind.Identifier) {
                                                let variable = declaretionName.escapedText.toString();
                                                prior.entries.push({
                                                    name: variable,
                                                    kind: ts.ScriptElementKind.variableElement,
                                                    sortText: ''
                                                });
                                            }
                                        }
                                        console.log(declaretion);
                                    }
                                }
                                else if (node.kind === ts.SyntaxKind.FunctionDeclaration) {
                                    let functionName = node.name;
                                    if (functionName.kind === ts.SyntaxKind.Identifier) {
                                        let variable = functionName.escapedText.toString();
                                        prior.entries.push({
                                            name: variable,
                                            kind: ts.ScriptElementKind.functionElement,
                                            sortText: ''
                                        });
                                    }
                                }
                            });
                        }
                    }
                }
            }
            return prior;
        };
        proxy.getDefinitionAtPosition = (fileName, position) => {
            let program = tsLS.getProgram();
            let source = program.getSourceFile(fileName);
            if (fileName.endsWith(".vue") || fileName.endsWith(".nvue")) {
                let thisExpr = (0, type_resolve_1.findExportThisExpressionAtOffset)(source, position);
                if (thisExpr) {
                    let service = vue.getVueThisLangusgeService(prj, thisExpr);
                    if (service) {
                        return service.getDefinitionAtPosition(fileName, position);
                    }
                }
            }
            return tsLS.getDefinitionAtPosition(fileName, position);
        };
        proxy.getDefinitionAndBoundSpan = (fileName, position) => {
            let program = tsLS.getProgram();
            let source = program.getSourceFile(fileName);
            if (fileName.endsWith(".vue") || fileName.endsWith(".nvue")) {
                let thisExpr = (0, type_resolve_1.findExportThisExpressionAtOffset)(source, position);
                if (thisExpr) {
                    let service = vue.getVueThisLangusgeService(prj, thisExpr);
                    if (service) {
                        return service.getDefinitionAndBoundSpan(fileName, position);
                    }
                }
            }
            if (fileName.endsWith('.html') || fileName.endsWith('.htm')) {
                let uri = vscode_uri_1.URI.file(prj.sourceRoot);
                let indexDataStore = indexlib_1.IndexDataStore === null || indexlib_1.IndexDataStore === void 0 ? void 0 : indexlib_1.IndexDataStore.load({ uri: uri.toString(), name: '' });
                let indexData = indexDataStore === null || indexDataStore === void 0 ? void 0 : indexDataStore.indexData(fileName);
                let res = undefined;
                if (indexData) {
                    let token = (0, type_resolve_1.getTokenAtPosition)(source, position);
                    let tokenText = token === null || token === void 0 ? void 0 : token.getText();
                    let scriptReference = indexData === null || indexData === void 0 ? void 0 : indexData.references.filter(value => value.type == indexlib_1.ReferenceFileType.Script);
                    for (let reference of scriptReference) {
                        let referenceURI = vscode_uri_1.URI.parse(reference.uri);
                        let referencePath = referenceURI === null || referenceURI === void 0 ? void 0 : referenceURI.fsPath;
                        if (fs.existsSync(referencePath)) {
                            let sourceFile = ts.createSourceFile('', fs.readFileSync(referencePath).toLocaleString(), ts.ScriptTarget.Latest);
                            sourceFile === null || sourceFile === void 0 ? void 0 : sourceFile.forEachChild(node => {
                                var _a, _b;
                                if (node.kind === ts.SyntaxKind.VariableStatement) {
                                    for (let declaretion of (_b = (_a = node) === null || _a === void 0 ? void 0 : _a.declarationList) === null || _b === void 0 ? void 0 : _b.declarations) {
                                        if (declaretion.kind === ts.SyntaxKind.VariableDeclaration) {
                                            let declaretionName = declaretion.name;
                                            if (declaretionName.kind === ts.SyntaxKind.Identifier) {
                                                let variable = declaretionName.escapedText.toString();
                                                if (tokenText == variable) {
                                                    res = {
                                                        definitions: [{
                                                                kind: ts.ScriptElementKind.unknown,
                                                                name: "",
                                                                containerKind: ts.ScriptElementKind.unknown,
                                                                containerName: "",
                                                                textSpan: { start: declaretionName.pos || 0, length: 0 },
                                                                fileName: referencePath,
                                                                contextSpan: { start: 0, length: 0 }
                                                            }],
                                                        textSpan: { start: token.getStart(), length: tokenText.length }
                                                    };
                                                }
                                                else {
                                                    return false;
                                                }
                                            }
                                        }
                                    }
                                }
                                else if (node.kind === ts.SyntaxKind.FunctionDeclaration) {
                                    let functionName = node.name;
                                    if (functionName.kind === ts.SyntaxKind.Identifier) {
                                        let variable = functionName.escapedText.toString();
                                        if (tokenText == variable) {
                                            res = {
                                                definitions: [{
                                                        kind: ts.ScriptElementKind.unknown,
                                                        name: "",
                                                        containerKind: ts.ScriptElementKind.unknown,
                                                        containerName: "",
                                                        textSpan: { start: functionName.pos || 0, length: tokenText.length },
                                                        fileName: referencePath,
                                                        contextSpan: { start: 0, length: 0 }
                                                    }],
                                                textSpan: { start: token.getStart(), length: tokenText.length }
                                            };
                                        }
                                        else {
                                            return false;
                                        }
                                    }
                                }
                            });
                        }
                    }
                }
                if (res)
                    return res;
            }
            return tsLS.getDefinitionAndBoundSpan(fileName, position);
        };
        proxy.getQuickInfoAtPosition = (fileName, position) => {
            if (fileName.endsWith(".vue") || fileName.endsWith(".nvue")) {
                let program = tsLS.getProgram();
                let source = program.getSourceFile(fileName);
                let thisExpr = (0, type_resolve_1.findExportThisExpressionAtOffset)(source, position);
                if (thisExpr) {
                    let service = vue.getVueThisLangusgeService(prj, thisExpr);
                    if (service) {
                        return service.getQuickInfoAtPosition(fileName, position);
                    }
                }
            }
            return tsLS.getQuickInfoAtPosition(fileName, position);
        };
        return proxy;
    }
    function checkExpressionOverride(prj, compilerOptions, checker, node, checkMode, forceTuple) {
        const typeCheckerPlugins = [uniCloudTypeHelper_1.default, vueRefTypeHelper_1.default];
        for (let i = 0; i < typeCheckerPlugins.length; i++) {
            let typeChecker = typeCheckerPlugins[i];
            try {
                let _type = typeChecker.checkExpression(prj, compilerOptions, checker, node, checkMode, forceTuple);
                if (_type) {
                    return _type;
                }
            }
            catch (e) {
                console.error(e);
            }
        }
        return undefined;
    }
    function detectProjectKind(prjPath) {
        let rules = [
            {
                kind: HXProjectKind.UniApp_Cli,
                existsFiles: [
                    ["src/manifest.json"],
                    ["src/pages.json"],
                    ["src/App.vue", "src/App.nvue"],
                    ["src/main.js", "src/main.ts"],
                ]
            },
            {
                kind: HXProjectKind.UniApp,
                existsFiles: [
                    ["manifest.json"],
                    ["pages.json"],
                    ["App.vue", "App.nvue"],
                    ["main.js", "main.ts"],
                ]
            },
            {
                kind: HXProjectKind.Wap2App,
                existsFiles: [
                    ["manifest.json"],
                    ["sitemap.json"]
                ]
            },
            {
                kind: HXProjectKind.App,
                existsFiles: [
                    ["manifest.json"]
                ]
            },
            {
                kind: HXProjectKind.Extension,
                existsFiles: function (prjPath) {
                    var _a;
                    if (fs.existsSync(path.join(prjPath, "package.json"))) {
                        let pkgInfo = require(path.join(prjPath, "package.json"));
                        if (((_a = pkgInfo === null || pkgInfo === void 0 ? void 0 : pkgInfo.engines) === null || _a === void 0 ? void 0 : _a.HBuilderX) && (pkgInfo === null || pkgInfo === void 0 ? void 0 : pkgInfo.main) && (pkgInfo === null || pkgInfo === void 0 ? void 0 : pkgInfo.contributes)) {
                            return true;
                        }
                    }
                    return false;
                }
            }
        ];
        for (let rule of rules) {
            let kind = rule.kind;
            let checkRules = rule.existsFiles;
            let matches = true;
            if (typeof checkRules === 'function') {
                matches = checkRules(prjPath);
            }
            else {
                for (let checkRule of checkRules) {
                    let _matches = false;
                    for (let checkFile of checkRule) {
                        if (fs.existsSync(path.join(prjPath, checkFile))) {
                            _matches = true;
                            break;
                        }
                    }
                    matches = matches && _matches;
                    if (!matches) {
                        break;
                    }
                }
            }
            if (matches) {
                return kind;
            }
        }
        return HXProjectKind.Web;
    }
    function resolveModuleName(prj, moduleName, containingFile, compilerOptions, resolutionHost, cache, redirectedReference, resolutionMode) {
        let kind = HXProjectKind.Web;
        if (prj) {
            kind = prj.kind;
        }
        if (kind == HXProjectKind.UniApp || kind == HXProjectKind.UniApp_Cli) {
            if (moduleName.startsWith("@/")) {
                moduleName = path.join(prj.sourceRoot, moduleName.substring(2));
            }
        }
        let resolvedModule = undefined;
        let result = ts.resolveModuleName(moduleName, containingFile, compilerOptions, resolutionHost);
        if (result.resolvedModule) {
            resolvedModule = result.resolvedModule;
        }
        else {
            let result = ts.nodeModuleNameResolver(moduleName, containingFile, compilerOptions, resolutionHost);
            if (result.resolvedModule) {
                resolvedModule = result.resolvedModule;
            }
        }
        if (!resolvedModule) {
            //自动注入vue等相关库
            if (kind === HXProjectKind.UniApp) {
                let builtin = getBuiltinUniappModule(moduleName, prj.fsPath);
                if (builtin) {
                    resolvedModule = {
                        isExternalLibraryImport: true,
                        resolvedFileName: builtin
                    };
                }
                else {
                    let builtin_dts_path = path.join(hx.getExtensionRootPath(), "builtin-dts", "index.js");
                    let result = ts.nodeModuleNameResolver(moduleName, builtin_dts_path, compilerOptions, resolutionHost);
                    if (result.resolvedModule) {
                        resolvedModule = result.resolvedModule;
                    }
                }
                //如果还没找到，并且是uniCloud目录下的文件，则试试查找公共模块依赖
                if (!resolvedModule && prj.isUnicloudSource(containingFile)) {
                    let cFile = toNormalizedPath(containingFile);
                    let containingDir = path.dirname(cFile);
                    let depth = 10;
                    while (depth > 0 && prj.isUnicloudSource(containingDir) && fs.existsSync(containingDir)) {
                        depth--;
                        let pkgFile = path.join(containingDir, "package.json");
                        if (fs.existsSync(pkgFile)) {
                            let pkgContents = fs.readFileSync(pkgFile).toString();
                            try {
                                let pkgInfo = JSON.parse(pkgContents);
                                if (pkgInfo && pkgInfo.dependencies && pkgInfo.dependencies[moduleName]) {
                                    let depValue = pkgInfo.dependencies[moduleName];
                                    if (depValue.startsWith("file:")) {
                                        let depModule = path.resolve(containingDir, depValue.substring(5));
                                        if (fs.existsSync(path.join(depModule, "package.json"))) {
                                            let depPkgContents = fs.readFileSync(path.join(depModule, "package.json")).toString();
                                            let depPkgInfo = JSON.parse(depPkgContents);
                                            if (depPkgInfo && depPkgInfo.types) {
                                                let depModuleTypeFile = path.resolve(depModule, depPkgInfo.types);
                                                if (fs.existsSync(depModuleTypeFile)) {
                                                    resolvedModule = {
                                                        isExternalLibraryImport: true,
                                                        resolvedFileName: depModuleTypeFile
                                                    };
                                                }
                                            }
                                            else if (depPkgInfo && depPkgInfo.main) {
                                                let depModuleMainFile = path.resolve(depModule, depPkgInfo.main);
                                                resolvedModule = {
                                                    isExternalLibraryImport: true,
                                                    resolvedFileName: depModuleMainFile
                                                };
                                            }
                                        }
                                    }
                                }
                            }
                            catch (e) {
                            }
                            break;
                        }
                        containingDir = path.dirname(containingDir);
                    }
                }
            }
            //resolvedModule = libModuleResolver(moduleName,containingFile);
        }
        return resolvedModule;
    }
    hx.resolveModuleName = resolveModuleName;
    function getBuiltinUniappModule(moduleName, rootPath) {
        let extensionDir = getExtensionRootPath();
        let version = (0, vueVersion_1.vueVersion)(rootPath);
        let builtin = {
            "vuex": version === 2 ? path.join(extensionDir, "builtin-dts", "node_modules", "vuex", "types", "index.d.ts") : path.join(extensionDir, "builtin-dts", "node_modules", "vuex@4", "types", "index.d.ts"),
            "vue-router": path.join(extensionDir, "builtin-dts", "node_modules", "vue-router", "types", "index.d.ts"),
            "vue": path.join(extensionDir, "builtin-dts", "common", "vue2And3.d.ts"),
            "@dcloudio/uni-app": path.join(extensionDir, "builtin-dts", "node_modules", "@dcloudio", "uni-app", "dist", "uni-app.d.ts")
        };
        return builtin[moduleName];
    }
    hx.getBuiltinUniappModule = getBuiltinUniappModule;
    function getUnicloudServerLibs() {
        let result = [];
        let extensionDir = getExtensionRootPath();
        result.push(path.join(extensionDir, "builtin-dts", "node_modules", "node", "index.d.ts"));
        result.push(path.join(extensionDir, "builtin-dts", "node_modules", "@dcloudio", "types", "uni-cloud-server.d.ts"));
        return result;
    }
    hx.getUnicloudServerLibs = getUnicloudServerLibs;
    function getNodeLibs(extensionDir, filter) {
        let result = [];
        let nodePath = path.join(extensionDir, 'builtin-dts', 'node_modules', 'node');
        let nodePathList = fs.readdirSync(nodePath);
        nodePathList.forEach(element => {
            let isFilter = true;
            filter.forEach((filterKeyWord) => {
                if (element.includes(filterKeyWord)) {
                    isFilter = false;
                    return;
                }
            });
            if (isFilter && element.endsWith('.d.ts')) {
                result.push(path.join(nodePath, element));
            }
        });
        return result;
    }
    hx.getNodeLibs = getNodeLibs;
    function getDefaultLibs(prj) {
        let result = [];
        let extensionDir = getExtensionRootPath();
        if (prj.kind == HXProjectKind.UniApp) {
            result.push(path.join(extensionDir, "builtin-dts", "node_modules", "vue", "types", "index.d.ts"));
            result.push(path.join(extensionDir, "builtin-dts", "node_modules", "vue@3", "types", "index.d.ts"));
            result.push(path.join(extensionDir, "builtin-dts", "node_modules", "vuex", "types", "index.d.ts"));
            result.push(path.join(extensionDir, "builtin-dts", "node_modules", "vue-router", "types", "index.d.ts"));
            result.push(path.join(extensionDir, "builtin-dts", "node_modules", "@dcloudio", "types", "index.d.ts"));
            result.push(path.join(extensionDir, "frameworkdts", "wechat-miniprogram", "index.d.ts"));
        }
        else if (prj.kind == HXProjectKind.App || prj.kind == HXProjectKind.Wap2App) {
            result.push(path.join(extensionDir, "builtin-dts", "node_modules", "@dcloudio", "types", "html5plus", "plus.d.ts"));
            result.push(path.join(extensionDir, "builtin-dts", "node_modules", "jQuery", "jquery.d.ts"));
        }
        else if (prj.kind == HXProjectKind.UniApp_Cli) {
            let uniappDts = path.join(prj.fsPath, "node_modules/@dcloudio/types/index.d.ts");
            if (fs.existsSync(uniappDts)) {
                result.push(uniappDts);
            }
            result.push(path.join(extensionDir, "frameworkdts", "wechat-miniprogram", "index.d.ts"));
        }
        else if (prj.kind == HXProjectKind.Web) {
            result.push(path.join(extensionDir, "builtin-dts", "node_modules", "jQuery", "jquery.d.ts"));
        }
        else if (prj.kind == HXProjectKind.Extension) {
            result.push(path.join(extensionDir, "builtin-dts", "common", "extension_js.d.ts"));
            result.push(...getNodeLibs(extensionDir, ['globals.d.ts', 'index.d.ts']));
        }
        result.push(path.join(extensionDir, 'builtin-dts', 'node_modules', 'node', 'globals.d.ts'));
        result.push(path.join(extensionDir, 'builtin-dts', 'common', 'lib.dom2.d.ts'));
        return result;
    }
    hx.getDefaultLibs = getDefaultLibs;
    let g_resolvedProjects = new Map();
    //通过HXProject创建的语言服务下的文档一起共享；
    const documentRegs = ts.createDocumentRegistry(true, process.cwd());
    function createProject(uri, packages) {
        const projectUri = vscode_uri_1.URI.parse(uri);
        const kind = detectProjectKind(projectUri.fsPath);
        const _sourceRoot = kind == HXProjectKind.UniApp_Cli ? path.join(projectUri.fsPath, "src") : projectUri.fsPath;
        const _tsLSs = new Map();
        let newPrj = {
            kind: kind,
            fsPath: projectUri.fsPath,
            sourceRoot: _sourceRoot,
            onSettingsChanged(callback) {
            },
            isProjectOf(fileName) {
                const fileUri = toNormalizedUri(fileName);
                let fsPath = vscode_uri_1.URI.parse(fileUri).fsPath;
                let relative = path.relative(projectUri.fsPath.toLowerCase(), fsPath.toLowerCase());
                return !relative.startsWith("..");
            },
            isUnicloudSource(fileName) {
                if (kind != HXProjectKind.UniApp && kind != HXProjectKind.UniApp_Cli) {
                    return false;
                }
                const fileUri = toNormalizedUri(fileName);
                let fsPath = vscode_uri_1.URI.parse(fileUri).fsPath;
                let relative = path.relative(projectUri.fsPath.toLowerCase(), fsPath.toLowerCase());
                if (relative) {
                    relative = toNormalizedPath(relative);
                }
                let uniCloudReg = /^unicloud-(tcb|aliyun)\/|^uni_modules\/.*\/unicloud\//;
                let isJQLFile = fsPath.endsWith('.jql');
                return uniCloudReg.test(relative) && !isJQLFile;
            },
            createTSLanguageService(documents, defaultLS, defaultLSHost) {
                if (_tsLSs.has(documents)) {
                    return _tsLSs.get(documents);
                }
                if (defaultLS && defaultLSHost) {
                    // defaultLS = createTSLanguageServiceProxy(defaultLS, newPrj, null);
                    let tsservice = proxyTSLanguageService(newPrj, defaultLS, defaultLSHost);
                    _tsLSs.set(documents, tsservice);
                    return tsservice;
                }
                const defaultLibs = getDefaultLibs(newPrj);
                if (packages) {
                    defaultLibs.push(...packages);
                }
                const compilerOptions = documents.compilerOptions;
                let libPath = path.dirname(ts.getDefaultLibFilePath(compilerOptions));
                const host = {
                    getCompilationSettings: () => {
                        if (kind == HXProjectKind.UniApp || kind == HXProjectKind.UniApp_Cli) {
                            compilerOptions.moduleResolution = ts.ModuleResolutionKind.NodeJs;
                        }
                        // @ts-ignore
                        compilerOptions.checkExpressionOverride = (checker, node, checkMode, forceTuple) => {
                            return checkExpressionOverride(newPrj, compilerOptions, checker, node, checkMode, forceTuple);
                        };
                        return compilerOptions;
                    },
                    getScriptFileNames() {
                        let fileNames = [].concat(documents.getDefaultLibs ? documents.getDefaultLibs(newPrj) : defaultLibs);
                        for (let docUri of documents.documents) {
                            fileNames.push(docUri);
                        }
                        return fileNames;
                    },
                    getScriptKind(fileName) {
                        const fileUri = toNormalizedUri(fileName);
                        if (documents.getDocumentKind) {
                            return documents.getDocumentKind(fileUri);
                        }
                        return fileName.substr(fileName.length - 2) === 'ts' ? ts.ScriptKind.TS : ts.ScriptKind.JS;
                    },
                    getProjectVersion() {
                        return String(documents.version);
                    },
                    getScriptVersion(fileName) {
                        const fileUri = toNormalizedUri(fileName);
                        if (documents.hasDocument(fileUri)) {
                            return documents.getDocumentVersion(fileUri);
                        }
                        return '1'; // default lib are static
                    },
                    getScriptSnapshot(fileName) {
                        const fileUri = toNormalizedUri(fileName);
                        if (documents.hasDocument(fileUri)) {
                            return documents.getDocumentSnapshot(fileUri);
                        }
                        let text = '';
                        let fsPath = vscode_uri_1.URI.parse(fileUri).fsPath;
                        if (fs.existsSync(fsPath)) {
                            text = fs.readFileSync(fsPath).toString();
                        }
                        return {
                            getText: (start, end) => text.substring(start, end),
                            getLength: () => text.length,
                            getChangeRange: () => undefined
                        };
                    },
                    getCurrentDirectory: () => projectUri.fsPath,
                    getDefaultLibFileName: (_options) => {
                        if (_options.lib && _options.lib.length > 0) {
                            return path.join(libPath, _options.lib[0]);
                        }
                        return path.join(libPath, "lib.esnext.d.ts");
                    },
                    resolveModuleNames(moduleNames, containingFile, reusedNames, redirectedReference, options) {
                        const resolvedModules = [];
                        for (let moduleName of moduleNames) {
                            // try to use standard resolution
                            let resolutionHost = {
                                fileExists(fileName) {
                                    const fileUri = toNormalizedUri(fileName);
                                    const uri = vscode_uri_1.URI.parse(fileUri);
                                    if (documents.hasDocument(fileUri)) {
                                        return true;
                                    }
                                    return fs.existsSync(uri.fsPath);
                                },
                                readFile(fileName) {
                                    const fileUri = toNormalizedUri(fileName);
                                    if (documents.hasDocument(fileUri)) {
                                        let documentSnapshot = documents.getDocumentSnapshot(fileUri);
                                        return documentSnapshot.getText(0, documentSnapshot.getLength() - 1);
                                    }
                                    const uri = vscode_uri_1.URI.parse(fileUri);
                                    return fs.readFileSync(uri.fsPath).toString();
                                }
                            };
                            let resolvedModule;
                            if (documents.resolveModuleNameOverride) {
                                resolvedModule = documents.resolveModuleNameOverride(newPrj, moduleName, containingFile, compilerOptions, resolutionHost);
                            }
                            if (!resolvedModule) {
                                resolvedModule = resolveModuleName(newPrj, moduleName, containingFile, compilerOptions, resolutionHost);
                            }
                            resolvedModules.push(resolvedModule);
                        }
                        return resolvedModules;
                    }
                };
                // let tmpService = ts.createLanguageService(host,documentRegs,ts.LanguageServiceMode.Semantic);
                // tmpService = createTSLanguageServiceProxy(tmpService, newPrj, null);
                // let tsservice = proxyTSLanguageService(newPrj, tmpService, host);
                let tsservice = proxyTSLanguageService(newPrj, ts.createLanguageService(host, documentRegs, ts.LanguageServiceMode.Semantic), host);
                _tsLSs.set(documents, tsservice);
                return tsservice;
            }
        };
        return newPrj;
    }
    hx.createProject = createProject;
    function getProject(uri) {
        const uriStr = toNormalizedUri(uri);
        if (g_resolvedProjects.has(uriStr)) {
            return g_resolvedProjects.get(uriStr);
        }
        let newPrj = createProject(uriStr);
        g_resolvedProjects.set(uriStr, newPrj);
        return newPrj;
    }
    hx.getProject = getProject;
    function getProjectByDocumentUri(uri, workspaceFolders) {
        for (let folder of workspaceFolders) {
            let folderURI = folder.uri;
            if (!folderURI.endsWith("/")) {
                folderURI = folderURI + '/';
            }
            if (uri.startsWith(folderURI)) {
                return getProject(folder.uri);
            }
        }
        return undefined;
    }
    hx.getProjectByDocumentUri = getProjectByDocumentUri;
    function createTSServerPlugin(info) {
        return (0, hxPluginCreateFactory_1.createPlugin)(info);
    }
    hx.createTSServerPlugin = createTSServerPlugin;
    function overrideSymbolKind(tsobj) {
        if (tsobj && tsobj.SymbolDisplay
            && tsobj.SymbolDisplay.getSymbolKind
            && !tsobj.SymbolDisplay.__overridedSymbolKind) {
            let oldFn = tsobj.SymbolDisplay.getSymbolKind.bind(tsobj.SymbolDisplay);
            tsobj.SymbolDisplay.getSymbolKind = function (typeChecker, symbol, location) {
                let callSignatures = typeChecker.getTypeOfSymbolAtLocation(symbol, location).getNonNullableType().getCallSignatures();
                let hasBaseType = baseTypes.some(value => {
                    return value == symbol.escapedName;
                });
                if (hasBaseType)
                    return "property";
                if (callSignatures.length !== 0) {
                    return "function";
                }
                return oldFn(typeChecker, symbol, location);
            };
            tsobj.SymbolDisplay.__overridedSymbolKind = true;
        }
    }
    hx.overrideSymbolKind = overrideSymbolKind;
})(hx = exports.hx || (exports.hx = {}));
//# sourceMappingURL=hxproject.js.map