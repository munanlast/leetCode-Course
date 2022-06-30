"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVueStyleModeExt = exports.getCssModeExt = exports.cssModeExtensionEnv = void 0;
const vscode_html_languageservice_1 = require("vscode-html-languageservice");
const strings_1 = require("../utils/strings");
const entry_1 = require("../../../../cssservice/entry");
const vscode_languageserver_1 = require("vscode-languageserver");
const cssUtilts_1 = require("./utils/cssUtilts");
const languageModelCache_1 = require("../languageModelCache");
const interpolationService = require("../vue/interpolationService");
function isVueLanguage(document) {
    return document.languageId === 'vue' || (!document.languageId && document.uri.toLowerCase().endsWith('.vue'));
}
exports.cssModeExtensionEnv = {};
class CSSLanguageServiceExt {
    constructor(service, ws) {
        this.workspace = ws;
        this.htmlLanguageService = (0, vscode_html_languageservice_1.getLanguageService)();
        this.htmlDocuments = (0, languageModelCache_1.getLanguageModelCache)(10, 60, document => this.htmlLanguageService.parseHTMLDocument(document));
        this.cssLanguageService = service;
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
    findDefinition(source, document, position, stylesheet) {
        let astNode = stylesheet;
        let offset = document.offsetAt(position);
        return new Promise((resolve) => {
            let offsetSelector = '';
            astNode.accept((node) => {
                // 仅查找id
                if (node.type === cssUtilts_1.NodeType.IdentifierSelector) {
                    if (node.offset <= offset && node.end >= offset) {
                        offsetSelector = node.getText();
                        ;
                        return false;
                    }
                }
                return true;
            });
            if (offsetSelector.length > 0 && offsetSelector[0] == '#') {
                let result = this.findIdHtmlNode(source, offsetSelector.substr(1));
                resolve(result);
                return;
            }
            else {
                let service = (0, entry_1.getExtraServer)(document).getLanguageServiceExt();
                if (service && service.findDefinition) {
                    let ws = this.getRootFolder(document.uri);
                    let option = { workspaceFolder: ws, docStylesheet: stylesheet };
                    service.findDefinition(document, position, option).then((locations) => {
                        resolve(locations);
                    });
                    return;
                }
            }
            resolve(null);
        });
    }
    doComplete(source, document, position, stylesheet, documentContext) {
        let service = (0, entry_1.getExtraServer)(document).getLanguageServiceExt();
        if (service && service.doComplete) {
            let ws = this.getRootFolder(document.uri);
            let option = {
                workspaceFolder: ws,
                docStylesheet: stylesheet,
                documentContext: documentContext,
                serverConnection: exports.cssModeExtensionEnv.serverConnection,
                scopedSettingsSupport: exports.cssModeExtensionEnv.scopedSettingsSupport
            };
            return service.doComplete(document, position, option);
        }
        return Promise.resolve(null);
    }
    findDocumentSymbols(document, stylesheet) {
        var _a, _b;
        let service = (0, entry_1.getExtraServer)(document).getLanguageServiceExt();
        if (service && service.findDocumentSymbols) {
            let ws = this.getRootFolder(document.uri);
            let option = {
                workspaceFolder: ws,
                docStylesheet: stylesheet
            };
            return service.findDocumentSymbols(document, option);
        }
        return (_b = (_a = this.cssLanguageService) === null || _a === void 0 ? void 0 : _a.findDocumentSymbols(document, stylesheet)) !== null && _b !== void 0 ? _b : [];
    }
    findIdHtmlNode(source, id) {
        const text = source.getText();
        let scanner = this.htmlLanguageService.createScanner(source.getText());
        let token = scanner.scan();
        let isId = false;
        while (token !== vscode_html_languageservice_1.TokenType.EOS) {
            switch (token) {
                case vscode_html_languageservice_1.TokenType.AttributeName:
                    isId = scanner.getTokenText().toLocaleLowerCase() == 'id';
                    break;
                case vscode_html_languageservice_1.TokenType.AttributeValue:
                    if (isId) {
                        let len = scanner.getTokenLength();
                        if (len > 0 && len <= id.length + 2) { // 可能有双引号
                            let start = scanner.getTokenOffset();
                            let end = scanner.getTokenEnd();
                            if (text[start] === '\'' || text[start] === '"') {
                                start++;
                                end--;
                            }
                            if (text.slice(start, end) === id) {
                                let range = vscode_languageserver_1.Range.create(source.positionAt(start), source.positionAt(end));
                                return vscode_languageserver_1.Location.create(source.uri, range);
                            }
                        }
                    }
                    break;
                default:
                    break;
            }
            token = scanner.scan();
        }
        return null;
    }
}
class VueStyleLanguageService extends CSSLanguageServiceExt {
    constructor(service, ws) {
        super(service, ws);
    }
    async doComplete(source, document, position, stylesheet, documentContext) {
        // if (document.languageId === 'stylus') {
        //     return null;
        // }
        let baseCompletion = await super.doComplete(source, document, position, stylesheet, documentContext);
        if (!baseCompletion) {
            baseCompletion = { isIncomplete: false, items: [] };
        }
        function createVBindItem(replaceRange, useSnippet = true) {
            let text = useSnippet ? 'v-bind($1)' : 'v-bind';
            return {
                label: 'v-bind',
                kind: vscode_languageserver_1.CompletionItemKind.Function,
                textEdit: vscode_languageserver_1.TextEdit.replace(replaceRange, text),
                insertTextFormat: useSnippet ? vscode_languageserver_1.InsertTextFormat.Snippet : undefined
            };
        }
        const doCompleteForFunctionArg = async (source, argNode) => {
            let ws = this.getRootFolder(source.uri);
            if (ws) {
                const docText = document.getText();
                let start = argNode.offset;
                let end = argNode.end;
                if (docText[start] == '\'' || docText[start] == '"') {
                    start++;
                }
                if (docText[end - 1] == '\'' || docText[end] == '"') {
                    end--;
                }
                let range = vscode_languageserver_1.Range.create(document.positionAt(start), document.positionAt(end));
                let htmlDocument = this.htmlDocuments.get(source);
                return interpolationService.doCompletion2(source, htmlDocument, range, position, ws);
            }
            return null;
        };
        let offset = document.offsetAt(position);
        let result = vscode_languageserver_1.CompletionList.create();
        let currentNode = (0, cssUtilts_1.getNodeAtOffset)(stylesheet, offset);
        let node = currentNode;
        let finished = false;
        while (node && !finished) {
            switch (node.type) {
                case cssUtilts_1.NodeType.FunctionArgument:
                    if (node.offset <= offset && offset <= node.end) {
                        let funcNode = node;
                        while (funcNode && funcNode.type !== cssUtilts_1.NodeType.Function) {
                            funcNode = funcNode.parent;
                        }
                        if ((funcNode === null || funcNode === void 0 ? void 0 : funcNode.getName()) == 'v-bind') {
                            // v-bind script提示
                            return doCompleteForFunctionArg(source, node);
                        }
                        finished = true;
                    }
                    break;
                case cssUtilts_1.NodeType.Function:
                    let nameNode = node.getIdentifier();
                    if (nameNode && nameNode.offset <= offset && offset <= nameNode.end) {
                        const start = document.positionAt(nameNode.offset);
                        const end = document.positionAt(nameNode.end);
                        baseCompletion.items.push(createVBindItem(vscode_languageserver_1.Range.create(start, end), false));
                        finished = true;
                        break;
                    }
                case cssUtilts_1.NodeType.Declarations:
                    let declaration = node.findFirstChildBeforeOffset(offset);
                    if (declaration && (0, cssUtilts_1.isDefined)(declaration.colonPosition) && offset > declaration.colonPosition) {
                        if (!(0, cssUtilts_1.isDefined)(declaration.semicolonPosition) || offset <= declaration.semicolonPosition) {
                            let valueNode = declaration.getValue();
                            if (valueNode) {
                                let valueText = valueNode.getText();
                                if (offset < valueNode.offset) {
                                    // 在冒号与值之间，直接插入
                                    baseCompletion.items.push(createVBindItem(vscode_languageserver_1.Range.create(position, position)));
                                }
                                else if (offset <= valueNode.end) {
                                    const start = document.positionAt(valueNode.offset);
                                    let endOffset = valueNode.end !== -1 ? valueNode.end : offset;
                                    let i = offset - valueNode.offset;
                                    let j = endOffset - valueNode.offset;
                                    while ((i < j) && !strings_1.whiteSpaceCharCode.includes(valueText.charCodeAt(i))) {
                                        i++;
                                    }
                                    const end = document.positionAt(i + valueNode.offset);
                                    baseCompletion.items.push(createVBindItem(vscode_languageserver_1.Range.create(start, end)));
                                }
                            }
                            else {
                                const docText = document.getText();
                                let i = offset - 1;
                                while (i >= 0 && ' \t\n\r":{[()]},*>+'.indexOf(docText.charAt(i)) === -1) {
                                    i--;
                                }
                                let range = vscode_languageserver_1.Range.create(document.positionAt(i + 1), position);
                                baseCompletion.items.push(createVBindItem(range));
                            }
                        }
                    }
                    finished = true;
                default:
                    break;
            }
            node = node.parent;
        }
        return baseCompletion;
    }
    async findDefinition(source, document, position, stylesheet) {
        if (document.languageId === 'stylus' || !stylesheet) {
            return null;
        }
        let result = await super.findDefinition(source, document, position, stylesheet);
        if (!result) {
            const findDefinitionForFunctionArg = async (source, argNode) => {
                let ws = this.getRootFolder(source.uri);
                if (ws) {
                    const docText = document.getText();
                    let start = argNode.offset;
                    let end = argNode.end;
                    if (docText[start] == '\'' || docText[start] == '"') {
                        start++;
                    }
                    if (docText[end - 1] == '\'' || docText[end] == '"') {
                        end--;
                    }
                    let range = vscode_languageserver_1.Range.create(document.positionAt(start), document.positionAt(end));
                    let htmlDocument = this.htmlDocuments.get(source);
                    return interpolationService.findDefinition(source, htmlDocument, range, position, ws);
                }
                return null;
            };
            let offset = document.offsetAt(position);
            let currentNode = (0, cssUtilts_1.getNodeAtOffset)(stylesheet, offset);
            let node = currentNode;
            let finished = false;
            while (node && !finished) {
                switch (node.type) {
                    case cssUtilts_1.NodeType.FunctionArgument:
                        if (node.offset <= offset && offset <= node.end) {
                            let funcNode = node;
                            while (funcNode && funcNode.type !== cssUtilts_1.NodeType.Function) {
                                funcNode = funcNode.parent;
                            }
                            if ((funcNode === null || funcNode === void 0 ? void 0 : funcNode.getName()) == 'v-bind') {
                                // v-bind script提示
                                return findDefinitionForFunctionArg(source, node);
                            }
                            finished = true;
                        }
                        break;
                    default:
                        break;
                }
                node = node.parent;
            }
        }
        return result;
    }
}
// function getModeExt(service: CSSLanguageServiceExt) {
//     return {
//         findDefinition(source: TextDocument, document: TextDocument, position: Position, stylesheet: Stylesheet | undefined): Promise<Location | null> {
//             return service.findDefinition(source, document, position, stylesheet);
//         },
//         doComplete(source: TextDocument, document: TextDocument, position: Position, stylesheet: Stylesheet | undefined): Promise<CompletionList | null> {
//             return service.doComplete(source, document, position, stylesheet);
//         }
//     }
// }
function getCssModeExt(cssLanguageService, workspace) {
    return new CSSLanguageServiceExt(cssLanguageService, workspace);
}
exports.getCssModeExt = getCssModeExt;
function getVueStyleModeExt(cssLanguageService, workspace) {
    return new VueStyleLanguageService(cssLanguageService, workspace);
}
exports.getVueStyleModeExt = getVueStyleModeExt;
//# sourceMappingURL=cssModeExtension.js.map