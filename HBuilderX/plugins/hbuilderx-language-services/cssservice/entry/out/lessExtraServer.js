"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFileIndexProcessor = exports.LessExtraServer = void 0;
const vscode_css_languageservice_1 = require("vscode-css-languageservice");
const baseExtraServer_1 = require("./baseExtraServer");
const lessCompletionProcessor_1 = require("./completion/lessCompletionProcessor");
const gotoDefinition_1 = require("./goto/gotoDefinition");
const lessIndexProcessor_1 = require("./index/lessIndexProcessor");
const symbolProcessor_1 = require("./symbol/symbolProcessor");
class LessExtraServer extends baseExtraServer_1.BaseExtraServer {
    constructor() {
        super(...arguments);
        this.completionClass = new lessCompletionProcessor_1.LessCompletionProcessor();
        this.getExtraCompletionData = this.completionClass.getExtraCompletionData.bind(this.completionClass);
    }
    support(doc, _ws) {
        if (doc.languageId === 'less' || doc.uri.endsWith('.less')) {
            return true;
        }
        return false;
    }
    doIndex(doc, ws) {
        return new lessIndexProcessor_1.LessIndexProcessor().createIndexData(ws, doc);
    }
    getLanguageServiceExt() {
        return {
            async findSymbol(document, symbol, ws) {
                return Promise.resolve().then(() => {
                    return new gotoDefinition_1.GotoDefinition().getDefinitionFromClass(ws, document, symbol);
                });
            },
            async doComplete(document, position, option) {
                let astNode = option === null || option === void 0 ? void 0 : option.docStylesheet;
                if (!option || !option.workspaceFolder || !option.documentContext) {
                    return { isIncomplete: false, items: [] };
                }
                if (!option.docStylesheet) {
                    astNode = (0, vscode_css_languageservice_1.getLESSLanguageService)().parseStylesheet(document);
                }
                let completionList = await (0, vscode_css_languageservice_1.getLESSLanguageService)().doComplete2(document, position, astNode, option.documentContext);
                return Promise.resolve().then(async () => {
                    let completionClass = new lessCompletionProcessor_1.LessCompletionProcessor();
                    const workspaceFolder = option.workspaceFolder;
                    const connection = option.serverConnection;
                    const support = option.scopedSettingsSupport;
                    const isErrorAstNode = completionClass.isErrorAstNode(document, position, astNode);
                    let type = completionClass.getCompletionTypeFromAstNode(document, position, astNode);
                    if (isErrorAstNode) {
                        type = completionClass.getCompletionTypeFromScanner(document, position);
                        completionList = await completionClass.getCompletionDataFromScanner(document, position, type);
                    }
                    completionList = await completionClass.getHxKindConvertedCompletionData(completionList);
                    completionList = await completionClass.getExtraCompletionData(workspaceFolder, document, position, type, completionList);
                    completionList = await completionClass.getGrammarCompletionData(workspaceFolder, document, position, type, completionList);
                    completionList = await completionClass.getPxConversionCompletionData(workspaceFolder, document, position, type, connection, support, completionList);
                    completionList = await completionClass.getIndexIdSelectorsCompletionData(workspaceFolder, document, position, type, completionList);
                    completionList = await completionClass.getIndexClassSelectorsCompletionData(workspaceFolder, document, position, type, completionList);
                    completionList = await completionClass.getPropertySelectorCompletionData(workspaceFolder, document, position, type, completionList);
                    completionList = await completionClass.getDeduplicationData(completionList);
                    completionList = await completionClass.getMoveCursorData(document, position, type, completionList);
                    completionList = await completionClass.getFiltrationPseudoData(document, position, type, completionList);
                    completionList = await completionClass.getAltMode(document, position, completionList);
                    return completionList;
                });
            },
            findDocumentSymbols(document, option) {
                let astNode = option === null || option === void 0 ? void 0 : option.docStylesheet;
                if (!option) {
                    return [];
                }
                if (!option.docStylesheet) {
                    astNode = (0, vscode_css_languageservice_1.getLESSLanguageService)().parseStylesheet(document);
                }
                let symbolInformationList = (0, vscode_css_languageservice_1.getLESSLanguageService)().findDocumentSymbols(document, astNode);
                let workspaceFolder = option.workspaceFolder;
                symbolInformationList = (0, symbolProcessor_1.getHxKindConvertedSymbolsData)(workspaceFolder, symbolInformationList);
                return symbolInformationList;
            },
            async findDefinition(document, position, option) {
                let astNode = option === null || option === void 0 ? void 0 : option.docStylesheet;
                if (!option || !option.docStylesheet) {
                    astNode = (0, vscode_css_languageservice_1.getLESSLanguageService)().parseStylesheet(document);
                }
                let location = (0, vscode_css_languageservice_1.getLESSLanguageService)().findDefinition(document, position, astNode);
                return Promise.resolve().then(async () => {
                    return new gotoDefinition_1.GotoDefinition().getBaseLocationLink(option === null || option === void 0 ? void 0 : option.workspaceFolder, document, position, astNode, location);
                });
            },
        };
    }
}
exports.LessExtraServer = LessExtraServer;
function createFileIndexProcessor(_manager) {
    return new LessExtraServer();
}
exports.createFileIndexProcessor = createFileIndexProcessor;
//# sourceMappingURL=lessExtraServer.js.map