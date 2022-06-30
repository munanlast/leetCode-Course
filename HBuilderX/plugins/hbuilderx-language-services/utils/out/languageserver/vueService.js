"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVueThisLangusgeService = void 0;
const ts = require("typescript");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const path = require("path");
const vscode_uri_1 = require("vscode-uri");
const type_resolve_1 = require("../common/type-resolve");
const indexlib_1 = require("../../../indexlib");
const ParseUtil_1 = require("../languageserver/ParseUtil");
const string_1 = require("../common/string");
const vueVersion_1 = require("../vueParse/vueVersion");
const cVueDataString = 'VueDataString';
const cVueEventString = 'VueEventString';
const cVuexCommitString = `Store<any>.commit: Commit
(type: string, payload?: any, options?: CommitOptions)`;
const cVuexDispatchString = `Store<any>.dispatch: Dispatch
(type: string, payload?: any, options?: DispatchOptions)`;
let currentTextDocument = vscode_languageserver_textdocument_1.TextDocument.create('init', 'javascript', 0, ``);
let vueThisDocVersion = 1;
const vueThisDocProvider = (function () {
    let documents = new Map();
    return {
        get version() {
            return "" + vueThisDocVersion;
        },
        setDocuments(docs) {
            documents.clear();
            docs.forEach((doc) => {
                documents.set(doc.uri, doc);
            });
        },
        get documents() {
            let docs = [];
            documents.forEach((val, key) => {
                docs.push(key);
            });
            docs.push();
            return docs;
        },
        compilerOptions: {
            allowNonTsExtensions: true,
            allowJs: true,
            lib: ["lib.esnext.d.ts"],
            target: ts.ScriptTarget.Latest,
            moduleResolution: ts.ModuleResolutionKind.Classic,
            experimentalDecorators: false
        },
        getDocumentSnapshot(uri) {
            let text = '';
            if (documents.has(uri)) {
                text = documents.get(uri).getText();
            }
            return {
                getText: (start, end) => text.substring(start, end),
                getLength: () => text.length,
                getChangeRange: () => undefined
            };
        },
        hasDocument(uri) {
            return documents.has(uri);
        },
        getDocumentVersion(uri) {
            return "" + documents.get(uri).version;
        }
    };
})();
function makeFilePath(projectPath, filePath) {
    return vscode_uri_1.URI.file(path.join(projectPath, filePath)).toString();
}
function getVueThisLangusgeService(prj, node) {
    var _a;
    let tsLS = prj.createTSLanguageService(vueThisDocProvider);
    const proxy = Object.create(null);
    for (let k of Object.keys(tsLS)) {
        const x = tsLS[k];
        proxy[k] = (...args) => x.apply(tsLS, args);
    }
    let rootPath = prj.fsPath;
    let exprText = node.getText();
    let thatAlias = false;
    let program = tsLS.getProgram();
    if (!program)
        return undefined;
    let identifierLen = 0;
    let isDirectThisExpr = false;
    if (node && node.expression) {
        let expression = node.expression;
        let tc = program.getTypeChecker();
        if (expression.kind == ts.SyntaxKind.ThisKeyword) {
            isDirectThisExpr = true;
        }
        else {
            let level = 0;
            while (expression.kind == ts.SyntaxKind.PropertyAccessExpression) {
                level++;
                expression = expression.expression;
            }
            let symbol = tc.getSymbolAtLocation(expression);
            if (symbol && symbol.valueDeclaration) {
                if (symbol.valueDeclaration.kind == ts.SyntaxKind.VariableDeclaration) {
                    identifierLen = ((_a = expression === null || expression === void 0 ? void 0 : expression.getText()) === null || _a === void 0 ? void 0 : _a.length) || 0;
                    let initializer = symbol.valueDeclaration.initializer;
                    if ((initializer === null || initializer === void 0 ? void 0 : initializer.kind) == ts.SyntaxKind.ThisKeyword) {
                        thatAlias = true;
                        isDirectThisExpr = (level == 0);
                    }
                }
            }
        }
    }
    if (!exprText.startsWith('this.') && !thatAlias) {
        return undefined;
    }
    let exportNode = node.getSourceFile().statements.find(ts.isExportAssignment);
    if (!exportNode || !ts.isObjectLiteralExpression(exportNode.expression)) {
        return undefined;
    }
    let vueInstance = `import { ComponentPublicInstance } from 'vue';
	import VueRouter, { Route } from 'vue-router';
	import { Store } from 'vuex';
	let _vue: ComponentPublicInstance & {	$route: Route; $router: VueRouter; } & { $store: Store<any>; };`;
    if ((0, vueVersion_1.vueVersion)(rootPath) === 2) {
        vueInstance =
            `import Vue from 'vue';
		import VueRouter from 'vue-router';
		import Vuex from 'vuex';
		let _vue: Vue;`;
    }
    let interpolationText = `import scriptExport from './__virtual-script.vue';
	${vueInstance}
	let $$_dataType = scriptExport.data();
	let $$_setupType = scriptExport.setup();
	let $$_methods = scriptExport.methods;
	let $$_props = scriptExport.props;
	let $$_computed = scriptExport.computed;
	$$_dataType.;\n`;
    let dataTypePos = interpolationText.length - 2;
    let replaceLen = 5;
    identifierLen = identifierLen == 0 ? replaceLen : identifierLen + 1;
    let vueInstanceOffset = interpolationText.length;
    interpolationText += "_vue." + exprText.slice(identifierLen) + ';\r\n';
    let prefixLength = interpolationText.length;
    let thisReplaceVar = "$e$t";
    let letExprsRange = { start: prefixLength, end: prefixLength };
    vueThisDocVersion++;
    const vueScriptText = node.getSourceFile().getFullText();
    let vueScriptDocUri = makeFilePath(rootPath, '__virtual-script.vue.ts');
    let vueScriptDocument = vscode_languageserver_textdocument_1.TextDocument.create(vueScriptDocUri, 'typescript', vueThisDocVersion, vueScriptText);
    let interpolationScriptUri = makeFilePath(rootPath, 'interpolation-script.ts');
    let currentTextDocument = vscode_languageserver_textdocument_1.TextDocument.create(interpolationScriptUri, 'typescript', vueThisDocVersion, interpolationText);
    vueThisDocProvider.setDocuments([vueScriptDocument, currentTextDocument]);
    program = tsLS.getProgram();
    if (program) {
        let tc = program.getTypeChecker();
        let sf = program.getSourceFile(currentTextDocument.uri);
        if (sf) {
            let symbols = tc.getSymbolsInScope(sf, ts.SymbolFlags.Variable);
            if (symbols) {
                let generateVariables = [];
                let propNames = [];
                for (let sym of symbols) {
                    let symName = sym.escapedName.toString();
                    if (symName.startsWith("$$_")) {
                        let symType = tc.getTypeOfSymbolAtLocation(sym, sym.valueDeclaration);
                        let properties = tc.getPropertiesOfType(symType);
                        for (let targetProp of properties) {
                            let propName = targetProp.escapedName.toString();
                            generateVariables.push(`let ${propName} = ${symName}.${propName};`);
                            propNames.push(propName);
                        }
                    }
                }
                interpolationText += generateVariables.join("\r\n");
                letExprsRange.end = interpolationText.length;
                interpolationText += `\r\nconst ${thisReplaceVar}={\r\n` + propNames.join(',') + '\r\n};\r\n';
                prefixLength = interpolationText.length;
                interpolationText += `${thisReplaceVar}.` + exprText.slice(identifierLen); //使用特殊变量，偏移保持一致
                vueThisDocVersion++;
                currentTextDocument = vscode_languageserver_textdocument_1.TextDocument.create(interpolationScriptUri, 'typescript', vueThisDocVersion, interpolationText);
                vueThisDocProvider.setDocuments([vueScriptDocument, currentTextDocument]);
            }
        }
    }
    if (prefixLength === interpolationText.length) {
        interpolationText += exprText;
        vueThisDocVersion++;
        currentTextDocument = vscode_languageserver_textdocument_1.TextDocument.create(interpolationScriptUri, 'typescript', vueThisDocVersion, interpolationText);
        vueThisDocProvider.setDocuments([vueScriptDocument, currentTextDocument]);
    }
    proxy.getCompletionsAtPosition = (fileName, position, options) => {
        let prefixLen = `this.`.length;
        const innerOffset = position - node.getStart() - identifierLen + replaceLen;
        let callExpression = null;
        if (node.kind === ts.SyntaxKind.CallExpression) {
            callExpression = node;
            let expression = node.expression;
            let expressionText = expression === null || expression === void 0 ? void 0 : expression.getText();
            if (expressionText) {
                prefixLen = expressionText.length - 1;
            }
        }
        let info = tsLS.getQuickInfoAtPosition(currentTextDocument.uri, prefixLen + vueInstanceOffset);
        if ((info === null || info === void 0 ? void 0 : info.kind) === 'method') {
            let signature = ts.displayPartsToString(info.displayParts);
            if (signature === null || signature === void 0 ? void 0 : signature.includes(cVueDataString)) {
                let result = tsLS.getCompletionsAtPosition(currentTextDocument.uri, dataTypePos, options);
                if (!!result)
                    return result;
            }
            else if (signature === null || signature === void 0 ? void 0 : signature.includes(cVueEventString)) {
                return getVueComponentEventCompletions(node.getSourceFile(), position, rootPath);
            }
        }
        else if ((info === null || info === void 0 ? void 0 : info.kind) === 'property') {
            if (callExpression) {
                let method = checkVuexStoreMethod(position, info, callExpression);
                if (method) {
                    return getVuexMethodsCompletions(method, rootPath);
                }
            }
        }
        let allResults = [];
        allResults.push(tsLS.getCompletionsAtPosition(currentTextDocument.uri, innerOffset + prefixLength, options));
        allResults.push(tsLS.getCompletionsAtPosition(currentTextDocument.uri, innerOffset + vueInstanceOffset, options));
        if (isDirectThisExpr) {
            allResults.push(getVuexMapStateCompletion(node.getSourceFile()));
        }
        let result = undefined;
        allResults.forEach((info) => {
            if (info) {
                if (!result) {
                    result = info;
                }
                else {
                    result.entries.push(...info.entries);
                }
            }
        });
        return result;
    };
    proxy.getCompletionEntryDetails = (fileName, position, entryName, formatOptions, source, preferences, data) => {
        const innerOffset = position - node.getStart() - identifierLen + replaceLen;
        let completePos = innerOffset + prefixLength;
        let result = tsLS.getCompletionEntryDetails(currentTextDocument.uri, completePos, entryName, formatOptions, source, preferences, data);
        if (!result) {
            let vueInsPos = innerOffset + vueInstanceOffset;
            return tsLS.getCompletionEntryDetails(currentTextDocument.uri, vueInsPos, entryName, formatOptions, source, preferences, data);
        }
        return result;
    };
    const getDefinition = (fileName, position) => {
        var _a;
        let currNode = (0, type_resolve_1.getTouchingPropertyName)(node.getSourceFile(), position);
        let textSpan = ts.createTextSpan(currNode.getStart(), currNode.getWidth());
        if (node.kind === ts.SyntaxKind.CallExpression) {
            // 特殊处理vuex store方法参数
            let callExpression = node;
            let expression = callExpression.expression;
            if (expression && expression.kind === ts.SyntaxKind.PropertyAccessExpression) {
                let info = tsLS.getQuickInfoAtPosition(currentTextDocument.uri, vueInstanceOffset + ((_a = expression.getText()) === null || _a === void 0 ? void 0 : _a.length));
                if ((info === null || info === void 0 ? void 0 : info.kind) === 'property') {
                    let signature = ts.displayPartsToString(info.displayParts);
                    let method = checkVuexStoreMethod(position, info, callExpression);
                    if (method && (currNode === null || currNode === void 0 ? void 0 : currNode.kind) === ts.SyntaxKind.StringLiteral) {
                        let defs = findVuexMethodsDefinition(fileName, method, currNode.getText(), rootPath);
                        return { textSpan, definitions: defs };
                    }
                }
            }
        }
        let completePos = position - node.getStart() - identifierLen + replaceLen + prefixLength;
        let defs = tsLS.getDefinitionAtPosition(currentTextDocument.uri, completePos);
        if ((defs === null || defs === void 0 ? void 0 : defs.length) > 0) {
            let definitionStack = [];
            definitionStack.push(...defs);
            while (definitionStack.length > 0) {
                let info = definitionStack.pop();
                if (info.fileName == interpolationScriptUri) {
                    if ((info.kind == ts.ScriptElementKind.memberVariableElement ||
                        info.kind == ts.ScriptElementKind.functionElement) &&
                        info.containerName == thisReplaceVar) {
                        let finalDefs = tsLS.getDefinitionAtPosition(currentTextDocument.uri, info.textSpan.start);
                        if (finalDefs) {
                            definitionStack.push(...finalDefs);
                        }
                    }
                    else if (info.kind == ts.ScriptElementKind.letElement || info.kind == ts.ScriptElementKind.functionElement) {
                        // 限定是在特定范围
                        if (letExprsRange.start < info.textSpan.start && info.textSpan.start + info.textSpan.length < letExprsRange.end) {
                            let finalDefs = tsLS.getDefinitionAtPosition(currentTextDocument.uri, info.contextSpan.start + info.contextSpan.length - 1);
                            if (finalDefs) {
                                definitionStack.push(...finalDefs);
                            }
                        }
                    }
                }
                else if (info.fileName === vueScriptDocUri) {
                    info.fileName = node.getSourceFile().fileName;
                    return { textSpan, definitions: [info] };
                }
            }
        }
        if (defs) {
            return { textSpan, definitions: defs };
        }
        return undefined;
    };
    proxy.getDefinitionAtPosition = (fileName, position) => {
        var _a;
        return (_a = getDefinition(fileName, position)) === null || _a === void 0 ? void 0 : _a.definitions;
    };
    proxy.getDefinitionAndBoundSpan = getDefinition;
    proxy.getQuickInfoAtPosition = (fileName, position) => {
        let suboffset = position - node.getStart() - identifierLen + replaceLen;
        if (suboffset > 4) {
            let info = tsLS.getQuickInfoAtPosition(currentTextDocument.uri, suboffset + prefixLength);
            if (!info || !info.kind) {
                info = tsLS.getQuickInfoAtPosition(currentTextDocument.uri, suboffset + vueInstanceOffset);
            }
            return info;
        }
        return undefined;
    };
    return proxy;
}
exports.getVueThisLangusgeService = getVueThisLangusgeService;
function getVueComponentEventCompletions(sourceFile, position, projectFolder) {
    function getExportNameValue() {
        let exportAssignNode = sourceFile.statements.find(ts.isExportAssignment);
        if (exportAssignNode) {
            let optArg = exportAssignNode.getChildren().find(ts.isObjectLiteralExpression);
            if (optArg) {
                let nameProp = optArg.properties.find((prop) => {
                    if (prop.kind == ts.SyntaxKind.PropertyAssignment) {
                        return /['\"]?name['\"]?/.test(prop.name.getText());
                    }
                    return false;
                });
                if (nameProp) {
                    let initializer = nameProp.initializer;
                    if (ts.isStringLiteral(initializer)) {
                        let text = initializer.text;
                        let first = text[0];
                        if (first == '\'' || first == '"') {
                            text = text.slice(0);
                        }
                        ;
                        let last = text[text.length - 1];
                        if (last == '\'' || last == '"') {
                            text = text.slice(0, -1);
                        }
                        ;
                        return text;
                    }
                }
            }
        }
        return '';
    }
    let componentName = getExportNameValue();
    if (componentName) {
        // 转换成标准component标签名
        const UPPER_REG = /[A-Z]/;
        let i = componentName.search(UPPER_REG);
        let regularName = '';
        while (i >= 0) {
            regularName += componentName.slice(0, i);
            regularName += '-' + componentName[i].toLocaleLowerCase();
            componentName = componentName.slice(i + 1);
            i = componentName.search(UPPER_REG);
        }
        regularName += componentName;
        let wsuri = vscode_uri_1.URI.file(projectFolder).toString();
        const dataStore = indexlib_1.IndexDataStore.load({ uri: wsuri, name: '' });
        let entries = [];
        let result = { entries, isGlobalCompletion: false, isMemberCompletion: true, isNewIdentifierLocation: false };
        dataStore.allIndexData().forEach((data, uri) => {
            var _a;
            let vuedata = data['vue-components'];
            if (vuedata instanceof Array) {
                for (let i = 0; i < vuedata.length; i++) {
                    const indexItem = vuedata[i];
                    if (indexItem.label == regularName) {
                        const events = (_a = indexItem === null || indexItem === void 0 ? void 0 : indexItem.data) === null || _a === void 0 ? void 0 : _a.events;
                        if (events instanceof Array) {
                            events.forEach((e) => {
                                if (typeof e == 'string') {
                                    entries.push({
                                        name: e,
                                        kind: ts.ScriptElementKind.functionElement,
                                        sortText: 'aa'
                                    });
                                }
                            });
                        }
                        break;
                    }
                }
            }
        });
        return result;
    }
    return undefined;
}
function checkVuexStoreMethod(position, info, callExpression) {
    let args = callExpression.arguments;
    let first = (args && args.length > 0) ? args[0] : undefined;
    if (first) {
        if (first.kind === ts.SyntaxKind.StringLiteral &&
            first.pos <= position &&
            position <= first.end) {
            const signature = ts.displayPartsToString(info.displayParts);
            if (signature.includes(cVuexCommitString)) {
                return 'commit';
            }
            else if (signature.includes(cVuexDispatchString)) {
                return 'dispatch';
            }
        }
    }
    return '';
}
function getVuexMethodsCompletions(method, projectFolder) {
    let wsuri = vscode_uri_1.URI.file(projectFolder).toString();
    const dataStore = indexlib_1.IndexDataStore.load({ uri: wsuri, name: '' });
    let entries = [];
    let result = { entries, isGlobalCompletion: false, isMemberCompletion: true, isNewIdentifierLocation: false };
    let commit = method == 'commit';
    let dispatch = !commit && method == 'dispatch';
    dataStore.allIndexData().forEach((data, uri) => {
        var _a, _b;
        let vuedata = data['vuex-construct'];
        if (vuedata instanceof Array) {
            for (let i = 0; i < vuedata.length; i++) {
                const indexItem = vuedata[i];
                if (indexItem.label == 'construct-args') {
                    let data = undefined;
                    if (commit) {
                        data = (_a = indexItem.data) === null || _a === void 0 ? void 0 : _a.mutations;
                    }
                    else if (dispatch) {
                        data = (_b = indexItem.data) === null || _b === void 0 ? void 0 : _b.actions;
                    }
                    if (data instanceof Array) {
                        data.forEach(item => {
                            var _a;
                            let name = (_a = item === null || item === void 0 ? void 0 : item.name) !== null && _a !== void 0 ? _a : '';
                            if (name) {
                                entries.push({
                                    name: name,
                                    kind: ts.ScriptElementKind.memberVariableElement,
                                    sortText: 'aa'
                                });
                            }
                        });
                    }
                }
            }
        }
    });
    if (result.entries.length > 0) {
        return result;
    }
    return undefined;
}
function findVuexMethodsDefinition(fileName, method, firstArg, projectFolder) {
    let methodName = (0, string_1.removeQuote)(firstArg);
    if (!methodName) {
        return [];
    }
    let wsuri = vscode_uri_1.URI.file(projectFolder).toString();
    const dataStore = indexlib_1.IndexDataStore.load({ uri: wsuri, name: '' });
    let result = [];
    let commit = method == 'commit';
    let dispatch = !commit && method == 'dispatch';
    dataStore.allIndexData().forEach((data, uri) => {
        var _a, _b;
        let vuedata = data['vuex-construct'];
        let file = vscode_uri_1.URI.parse(uri).fsPath;
        if (vuedata instanceof Array) {
            let defs = [];
            for (let i = 0; i < vuedata.length; i++) {
                const indexItem = vuedata[i];
                if (indexItem.label == 'construct-args') {
                    let data = undefined;
                    if (commit) {
                        data = (_a = indexItem.data) === null || _a === void 0 ? void 0 : _a.mutations;
                    }
                    else if (dispatch) {
                        data = (_b = indexItem.data) === null || _b === void 0 ? void 0 : _b.actions;
                    }
                    if (data instanceof Array) {
                        data.forEach(item => {
                            var _a, _b;
                            let name = (_a = item === null || item === void 0 ? void 0 : item.name) !== null && _a !== void 0 ? _a : '';
                            let offset = (_b = item === null || item === void 0 ? void 0 : item.offset) !== null && _b !== void 0 ? _b : -1;
                            if (name == methodName && offset >= 0) {
                                result.push({
                                    name: name,
                                    kind: ts.ScriptElementKind.memberVariableElement,
                                    fileName: file,
                                    textSpan: { start: offset, length: methodName.length },
                                    containerName: '',
                                    containerKind: ts.ScriptElementKind.unknown
                                });
                            }
                        });
                    }
                }
            }
        }
    });
    return result;
}
function getVuexMapStateCompletion(sourceFile) {
    let entries = [];
    let result = { entries, isGlobalCompletion: false, isMemberCompletion: true, isNewIdentifierLocation: false };
    ParseUtil_1.ParseUtil.getVuexState(sourceFile).forEach((item) => {
        entries.push({
            name: item,
            kind: ts.ScriptElementKind.memberVariableElement,
            sortText: item
        });
    });
    // actions, mutations提示内容，语法服务能自动推断，暂时不额外补充
    // let actions = ParseUtil.getVuexActions(sourceFile);
    // let mutations = ParseUtil.getVuexMutations(sourceFile);
    return result;
}
//# sourceMappingURL=vueService.js.map