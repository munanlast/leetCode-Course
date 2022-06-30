"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTSLanguageServiceProxy = void 0;
const ts = require("typescript");
const path = require("path");
const fs = require("fs");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const index_1 = require("../specialTypes/index");
const type_resolve_1 = require("../common/type-resolve");
const vscode_languageserver_protocol_1 = require("vscode-languageserver-protocol");
const ParseUtil_1 = require("./ParseUtil");
const vueRouterParamsParser_1 = require("./vueRouterParamsParser");
const jql = require("./jqlService");
function languuage() {
    return 'zh_cn';
}
function getNlsFilePath(key) {
    if (typeof key != 'string')
        return undefined;
    let parts = key.split('.');
    let languageId = null;
    let version = null;
    if (parts.length > 2) {
        languageId = parts[0];
        version = parts[1];
    }
    let dirPath = path.resolve(__dirname, '../../nls');
    if (languageId && version) {
        let nlsPath = path.join(dirPath, languuage(), languageId, `${languageId}.${version}.js`);
        if (fs.existsSync(nlsPath)) {
            return nlsPath;
        }
    }
    return undefined;
}
function translate(nlsPath, key) {
    let content = require(nlsPath);
    if (content.hasOwnProperty(key)) {
        return content[key];
    }
    return undefined;
}
function translateText(text) {
    let nlsPath = getNlsFilePath(text);
    if (nlsPath) {
        let res = translate(nlsPath, text);
        if (res) {
            text = res;
        }
    }
    return text;
}
function getSignatures(position, currentToken, service) {
    let signatures = [];
    let types = ParseUtil_1.ParseUtil.getTypesAtLocation(currentToken, service);
    if (types && types.length > 0) {
        types.forEach(type => {
            if (type === 'Document') {
                let parent = currentToken.parent;
                if ((parent === null || parent === void 0 ? void 0 : parent.kind) === ts.SyntaxKind.CallExpression) {
                    let callExpression = currentToken.parent;
                    let rightExperss = callExpression.expression.getChildAt(2);
                    if (rightExperss && rightExperss.kind === ts.SyntaxKind.Identifier) {
                        let functionName = rightExperss.escapedText;
                        if (functionName === 'getElementById') {
                            signatures = ['HBuilderX.IDString'];
                        }
                        else if (functionName === 'getElementByClassName') {
                            signatures = ['HBuilderX.ClassString'];
                        }
                    }
                }
            }
            else if (type === 'NodeRequire') {
                signatures = ['HBuilderX.RequireCommonString'];
            }
            else {
                signatures.push(...types);
            }
        });
    }
    return Array.from(new Set(signatures));
}
function createTSLanguageServiceProxy(service, prj, uniCloudServerLS) {
    const proxy = Object.create(null);
    for (let k of Object.keys(service)) {
        const x = service[k];
        proxy[k] = (...args) => x.apply(service, args);
    }
    proxy.getDefinitionAtPosition = (fileName, position) => {
        let result = null;
        if (prj && prj.isUnicloudSource && uniCloudServerLS) {
            if (prj.isUnicloudSource(fileName)) {
                result = uniCloudServerLS.getDefinitionAtPosition(fileName, position);
            }
        }
        if (fileName.endsWith('.jql')) {
            let program = service.getProgram();
            let source = program.getSourceFile(fileName);
            return jql.getJQLLanguageService(prj, source.text).getDefinitionAtPosition(fileName, position);
        }
        if (!!result)
            return result;
        result = service.getDefinitionAtPosition(fileName, position);
        if (!!result)
            return result;
        let program = service.getProgram();
        let source = program.getSourceFile(fileName);
        const tokens = (0, type_resolve_1.getRelevantTokens)(position, source);
        const previousToken = tokens.previousToken;
        const currentToken = tokens.contextToken;
        if ((0, type_resolve_1.isInString)(source, position, previousToken)) {
            let parameterTypes = getSignatures(position, currentToken, service);
            for (let type of parameterTypes) {
                if (index_1.specialTypes.has(type.trim()) || index_1.specialTypes.has(`HBuilderX.${type.trim()}`)) {
                    const { line, character } = service.toLineColumnOffset(fileName, currentToken.getStart() + 1);
                    return (0, index_1.gotoDefinition)(type.includes(`HBuilderX.`) ? type.trim() : `HBuilderX.${type.trim()}`, currentToken.text, {
                        workspaceFolder: prj.fsPath,
                        range: {
                            start: {
                                line: line,
                                character: character
                            },
                            end: {
                                line: line,
                                character: character + currentToken.getText().length
                            }
                        },
                        offset: position - currentToken.getStart() - 1,
                        token: currentToken,
                        fileName: fileName
                    });
                }
            }
        }
        return null;
    };
    proxy.getDefinitionAndBoundSpan = (fileName, position) => {
        let result = null;
        if (prj && prj.isUnicloudSource && uniCloudServerLS) {
            if (prj.isUnicloudSource(fileName)) {
                result = uniCloudServerLS.getDefinitionAndBoundSpan(fileName, position);
            }
        }
        if (fileName.endsWith('.jql')) {
            let program = service.getProgram();
            let source = program.getSourceFile(fileName);
            return jql.getJQLLanguageService(prj, source.text).getDefinitionAndBoundSpan(fileName, position);
        }
        if (!!result)
            return result;
        result = service.getDefinitionAndBoundSpan(fileName, position);
        if (!!result)
            return result;
        let program = service.getProgram();
        let source = program.getSourceFile(fileName);
        const tokens = (0, type_resolve_1.getRelevantTokens)(position, source);
        const previousToken = tokens.previousToken;
        const currentToken = tokens.contextToken;
        if ((0, type_resolve_1.isInString)(source, position, previousToken)) {
            let parameterTypes = getSignatures(position, currentToken, service);
            for (let type of parameterTypes) {
                if (index_1.specialTypes.has(type.trim()) || index_1.specialTypes.has(`HBuilderX.${type.trim()}`)) {
                    const { line, character } = service.toLineColumnOffset(fileName, currentToken.getStart() + 1);
                    return (0, index_1.gotoDefinition)(type.includes(`HBuilderX.`) ? type.trim() : `HBuilderX.${type.trim()}`, currentToken.text, {
                        workspaceFolder: prj.fsPath,
                        range: {
                            start: {
                                line: line,
                                character: character
                            },
                            end: {
                                line: line,
                                character: character + currentToken.getText().length
                            }
                        },
                        offset: position - currentToken.getStart() - 1,
                        token: currentToken,
                        fileName: fileName
                    });
                }
            }
        }
        return null;
    };
    proxy.getTypeDefinitionAtPosition = (fileName, position) => {
        if (prj && prj.isUnicloudSource && uniCloudServerLS) {
            if (prj.isUnicloudSource(fileName)) {
                return uniCloudServerLS.getTypeDefinitionAtPosition(fileName, position);
            }
        }
        return service.getTypeDefinitionAtPosition(fileName, position);
    };
    proxy.getQuickInfoAtPosition = (fileName, position) => {
        if (prj && prj.isUnicloudSource && uniCloudServerLS) {
            if (prj.isUnicloudSource(fileName)) {
                return uniCloudServerLS.getQuickInfoAtPosition(fileName, position);
            }
        }
        let quickInfo = service.getQuickInfoAtPosition(fileName, position);
        let doc = ts.displayPartsToString(quickInfo === null || quickInfo === void 0 ? void 0 : quickInfo.documentation);
        if (quickInfo)
            quickInfo.documentation = [{ kind: 'text', text: translateText(doc) }];
        return quickInfo;
    };
    proxy.getCompletionEntryDetails = (fileName, position, entryName, formatOptions, source, preferences, data) => {
        if (prj && prj.isUnicloudSource && uniCloudServerLS) {
            if (prj.isUnicloudSource(fileName)) {
                return uniCloudServerLS.getCompletionEntryDetails(fileName, position, entryName, formatOptions, source, preferences, data);
            }
        }
        if (fileName.endsWith('.jql')) {
            let program = service.getProgram();
            let sourceFile = program.getSourceFile(fileName);
            return jql.getJQLLanguageService(prj, sourceFile.text).getCompletionEntryDetails(fileName, position, entryName, formatOptions, source, preferences, data);
        }
        let entryDetails = service.getCompletionEntryDetails(fileName, position, entryName, formatOptions, source, preferences, data);
        let doc = ts.displayPartsToString(entryDetails === null || entryDetails === void 0 ? void 0 : entryDetails.documentation);
        if (entryDetails)
            entryDetails.documentation = [{ kind: 'text', text: translateText(doc) }];
        return entryDetails;
    };
    proxy.getCompletionsAtPosition = (fileName, position, options) => {
        let prior = null;
        if (prj && prj.isUnicloudSource && uniCloudServerLS) {
            if (prj.isUnicloudSource(fileName)) {
                prior = uniCloudServerLS.getCompletionsAtPosition(fileName, position, options);
            }
        }
        if (fileName.endsWith('.jql')) {
            let program = service.getProgram();
            let source = program.getSourceFile(fileName);
            return jql.getJQLLanguageService(prj, source.text).getCompletionsAtPosition(fileName, position, options);
        }
        if (!!prior)
            return prior;
        prior = service.getCompletionsAtPosition(fileName, position, options);
        if (!prior)
            return undefined;
        let program = service.getProgram();
        let source = program.getSourceFile(fileName);
        const tokens = (0, type_resolve_1.getRelevantTokens)(position, source);
        const previousToken = tokens.previousToken;
        const currentToken = tokens.contextToken;
        if ((0, type_resolve_1.isInString)(source, position, previousToken)) {
            let parameterTypes = ParseUtil_1.ParseUtil.getParamTypes(fileName, position, service);
            if (!includeSpecialType(parameterTypes))
                parameterTypes = getSignatures(position, currentToken, service);
            for (let type of parameterTypes) {
                if (index_1.specialTypes.has(type.trim()) || index_1.specialTypes.has(`HBuilderX.${type.trim()}`)) {
                    let textDocument = vscode_languageserver_textdocument_1.TextDocument.create(fileName, fileName.endsWith('.html') || fileName.endsWith('.htm') ? 'html' : 'typescript', 1, source.text);
                    let pos = textDocument.positionAt(position);
                    let completions = (0, index_1.doComplete)([type.includes(`HBuilderX.`) ? type.trim() : `HBuilderX.${type.trim()}`], pos, textDocument, {
                        workspaceFolder: prj === null || prj === void 0 ? void 0 : prj.fsPath,
                        sourceFile: source,
                        pos: position
                    });
                    completions === null || completions === void 0 ? void 0 : completions.forEach(item => {
                        var _a, _b;
                        const insertText = (_a = item.insertText) !== null && _a !== void 0 ? _a : undefined;
                        prior.entries.push({
                            name: item.label,
                            kind: convertKind(item.kind) ? convertKind(item.kind) : ts.ScriptElementKind.string,
                            sortText: (_b = item.sortText) !== null && _b !== void 0 ? _b : item.label,
                            insertText
                        });
                    });
                }
            }
        }
        else {
            let types = getSignatures(position, currentToken, service);
            if (types.includes('VueRouterParams') && prior) {
                prior.entries.unshift(...(0, vueRouterParamsParser_1.getVueRouterParamsCompletions)(prj === null || prj === void 0 ? void 0 : prj.fsPath));
            }
        }
        prior.entries.forEach(entry => {
            if (entry.kind == 'class') {
                entry.kind = 'property';
            }
        });
        return prior;
    };
    return proxy;
}
exports.createTSLanguageServiceProxy = createTSLanguageServiceProxy;
function convertKind(kind) {
    if (kind === vscode_languageserver_protocol_1.CompletionItemKind.File) {
        return 'file';
    }
    else if (kind === vscode_languageserver_protocol_1.CompletionItemKind.Folder) {
        return 'folder';
    }
    else {
        return '';
    }
}
function includeSpecialType(types) {
    for (let type of types) {
        if (index_1.specialTypes.has(type.trim()) || index_1.specialTypes.has(`HBuilderX.${type.trim()}`)) {
            return true;
        }
    }
    return false;
}
//# sourceMappingURL=languageServiceProxy.js.map