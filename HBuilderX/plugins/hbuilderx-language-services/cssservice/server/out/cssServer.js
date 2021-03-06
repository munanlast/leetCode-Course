"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
const vscode_css_languageservice_1 = require("vscode-css-languageservice");
const vscode_languageserver_1 = require("vscode-languageserver");
const vscode_uri_1 = require("vscode-uri");
const entry_1 = require("../../entry");
const customData_1 = require("./customData");
const languageModelCache_1 = require("./languageModelCache");
const requests_1 = require("./requests");
const documentContext_1 = require("./utils/documentContext");
const runner_1 = require("./utils/runner");
var CustomDataChangedNotification;
(function (CustomDataChangedNotification) {
    CustomDataChangedNotification.type = new vscode_languageserver_1.NotificationType('css/customDataChanged');
})(CustomDataChangedNotification || (CustomDataChangedNotification = {}));
function startServer(connection, runtime) {
    // Create a text document manager.
    const documents = new vscode_languageserver_1.TextDocuments(vscode_css_languageservice_1.TextDocument);
    // Make the text document manager listen on the connection
    // for open, change and close text document events
    documents.listen(connection);
    const stylesheets = (0, languageModelCache_1.getLanguageModelCache)(10, 60, document => getLanguageService(document).parseStylesheet(document));
    documents.onDidClose(e => {
        stylesheets.onDocumentRemoved(e.document);
    });
    connection.onShutdown(() => {
        stylesheets.dispose();
    });
    let scopedSettingsSupport = false;
    let foldingRangeLimit = Number.MAX_VALUE;
    let workspaceFolders;
    let workspaceFoldersSupport = false;
    let dataProvidersReady = Promise.resolve();
    const languageServices = {};
    const notReady = () => Promise.reject('Not Ready');
    let requestService = { getContent: notReady, stat: notReady, readDirectory: notReady };
    // After the server has started the client sends an initialize request. The server receives
    // in the passed params the rootPath of the workspace plus the client capabilities.
    connection.onInitialize((params) => {
        workspaceFolders = params.workspaceFolders;
        if (!Array.isArray(workspaceFolders)) {
            workspaceFolders = [];
            if (params.rootPath) {
                workspaceFolders.push({ name: '', uri: vscode_uri_1.URI.file(params.rootPath).toString() });
            }
        }
        requestService = (0, requests_1.getRequestService)(params.initializationOptions.handledSchemas || ['file'], connection, runtime);
        function getClientCapability(name, def) {
            const keys = name.split('.');
            let c = params.capabilities;
            for (let i = 0; c && i < keys.length; i++) {
                if (!c.hasOwnProperty(keys[i])) {
                    return def;
                }
                c = c[keys[i]];
            }
            return c;
        }
        const snippetSupport = !!getClientCapability('textDocument.completion.completionItem.snippetSupport', false);
        scopedSettingsSupport = !!getClientCapability('workspace.configuration', false);
        foldingRangeLimit = getClientCapability('textDocument.foldingRange.rangeLimit', Number.MAX_VALUE);
        workspaceFoldersSupport = getClientCapability('workspace.workspaceFolders', false);
        languageServices.css = (0, vscode_css_languageservice_1.getCSSLanguageService)({ fileSystemProvider: requestService, clientCapabilities: params.capabilities });
        languageServices.scss = (0, vscode_css_languageservice_1.getSCSSLanguageService)({ fileSystemProvider: requestService, clientCapabilities: params.capabilities });
        languageServices.less = (0, vscode_css_languageservice_1.getLESSLanguageService)({ fileSystemProvider: requestService, clientCapabilities: params.capabilities });
        const capabilities = {
            textDocumentSync: vscode_languageserver_1.TextDocumentSyncKind.Incremental,
            completionProvider: snippetSupport ? { resolveProvider: false, triggerCharacters: ['/', '-'] } : undefined,
            hoverProvider: true,
            documentSymbolProvider: true,
            referencesProvider: true,
            definitionProvider: true,
            documentHighlightProvider: true,
            documentLinkProvider: {
                resolveProvider: false
            },
            codeActionProvider: true,
            renameProvider: true,
            colorProvider: {},
            foldingRangeProvider: true,
            selectionRangeProvider: true,
            workspace: {
                workspaceFolders: {
                    supported: true
                }
            }
        };
        return { capabilities };
    });
    connection.onInitialized(() => {
        if (workspaceFoldersSupport) {
            connection.client.register(vscode_languageserver_1.DidChangeWorkspaceFoldersNotification.type);
            connection.onNotification(vscode_languageserver_1.DidChangeWorkspaceFoldersNotification.type, e => {
                const toAdd = e.event.added;
                const toRemove = e.event.removed;
                const updatedFolders = [];
                if (workspaceFolders) {
                    for (const folder of workspaceFolders) {
                        if (!toRemove.some(r => r.uri === folder.uri) && !toAdd.some(r => r.uri === folder.uri)) {
                            updatedFolders.push(folder);
                        }
                    }
                }
                workspaceFolders = updatedFolders.concat(toAdd);
                documents.all().forEach(triggerValidation);
            });
        }
    });
    function getLanguageService(document) {
        let service = languageServices[document.languageId];
        if (!service) {
            connection.console.log('Document type is ' + document.languageId + ', using css instead.');
            service = languageServices['css'];
        }
        return service;
    }
    let documentSettings = {};
    // remove document settings on close
    documents.onDidClose(e => {
        delete documentSettings[e.document.uri];
    });
    function getDocumentSettings(textDocument) {
        if (scopedSettingsSupport) {
            let promise = documentSettings[textDocument.uri];
            if (!promise) {
                const configRequestParam = { items: [{ scopeUri: textDocument.uri, section: textDocument.languageId }] };
                promise = connection.sendRequest(vscode_languageserver_1.ConfigurationRequest.type, configRequestParam).then(s => s[0]);
                documentSettings[textDocument.uri] = promise;
            }
            return promise;
        }
        return Promise.resolve(undefined);
    }
    // The settings have changed. Is send on server activation as well.
    connection.onDidChangeConfiguration(change => {
        updateConfiguration(change.settings);
    });
    function updateConfiguration(settings) {
        for (const languageId in languageServices) {
            languageServices[languageId].configure(settings[languageId]);
        }
        // reset all document settings
        documentSettings = {};
        // Revalidate any open text documents
        documents.all().forEach(triggerValidation);
    }
    const pendingValidationRequests = {};
    const validationDelayMs = 500;
    // The content of a text document has changed. This event is emitted
    // when the text document first opened or when its content has changed.
    documents.onDidChangeContent(change => {
        triggerValidation(change.document);
    });
    // a document has closed: clear all diagnostics
    documents.onDidClose(event => {
        cleanPendingValidation(event.document);
        connection.sendDiagnostics({ uri: event.document.uri, diagnostics: [] });
    });
    function cleanPendingValidation(textDocument) {
        const request = pendingValidationRequests[textDocument.uri];
        if (request) {
            clearTimeout(request);
            delete pendingValidationRequests[textDocument.uri];
        }
    }
    function triggerValidation(textDocument) {
        cleanPendingValidation(textDocument);
        pendingValidationRequests[textDocument.uri] = setTimeout(() => {
            delete pendingValidationRequests[textDocument.uri];
            validateTextDocument(textDocument);
        }, validationDelayMs);
    }
    function validateTextDocument(textDocument) {
        const settingsPromise = getDocumentSettings(textDocument);
        Promise.all([settingsPromise, dataProvidersReady]).then(async ([settings]) => {
            const stylesheet = stylesheets.get(textDocument);
            // const diagnostics = getLanguageService(textDocument).doValidation(textDocument, stylesheet, settings);
            // Send the computed diagnostics to VSCode.
            // connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
        }, e => {
            connection.console.error((0, runner_1.formatError)(`Error while validating ${textDocument.uri}`, e));
        });
    }
    function updateDataProviders(dataPaths) {
        dataProvidersReady = (0, customData_1.fetchDataProviders)(dataPaths, requestService).then(customDataProviders => {
            for (const lang in languageServices) {
                languageServices[lang].setDataProviders(true, customDataProviders);
            }
        });
    }
    connection.onCompletion((textDocumentPosition, token) => {
        return (0, runner_1.runSafeAsync)(async () => {
            const document = documents.get(textDocumentPosition.textDocument.uri);
            if (document) {
                await dataProvidersReady;
                const styleSheet = stylesheets.get(document);
                const documentContext = (0, documentContext_1.getDocumentContext)(document.uri, workspaceFolders);
                // ??????????????????
                // ??????????????????????????????
                let completionList = await getLanguageService(document).doComplete2(document, textDocumentPosition.position, styleSheet, documentContext);
                const workspaceFolder = (0, entry_1.getCurrentWorkspaceFolder)(workspaceFolders, document)[0];
                const completionClass = (0, entry_1.getExtraServer)(document);
                const position = textDocumentPosition.position;
                const astNode = styleSheet;
                // ??????: ????????????offset?????????????????????(????????????????????????)
                const isErrorAstNode = completionClass.isErrorAstNode(document, position, astNode);
                let type = completionClass.getCompletionTypeFromAstNode(document, position, astNode);
                if (isErrorAstNode) {
                    type = completionClass.getCompletionTypeFromScanner(document, position);
                    completionList = await completionClass.getCompletionDataFromScanner(document, position, type);
                }
                // ????????????????????????????????????, ???????????????
                completionList = await completionClass.getHxKindConvertedCompletionData(completionList);
                completionList = await completionClass.getExtraCompletionData(workspaceFolder, document, position, type, completionList);
                completionList = await completionClass.getGrammarCompletionData(workspaceFolder, document, position, type, completionList);
                completionList = await completionClass.getPxConversionCompletionData(workspaceFolder, document, position, type, connection, scopedSettingsSupport, completionList);
                completionList = await completionClass.getIndexIdSelectorsCompletionData(workspaceFolder, document, position, type, completionList);
                completionList = await completionClass.getIndexClassSelectorsCompletionData(workspaceFolder, document, position, type, completionList);
                completionList = await completionClass.getPropertySelectorCompletionData(workspaceFolder, document, position, type, completionList);
                completionList = await completionClass.getDeduplicationData(completionList);
                completionList = await completionClass.getMoveCursorData(document, position, type, completionList);
                completionList = await completionClass.getFiltrationPseudoData(document, position, type, completionList);
                completionList = await completionClass.getAltMode(document, position, completionList);
                return completionList;
                // ??????????????????
                // return getLanguageService(document).doComplete2(document, textDocumentPosition.position, styleSheet, documentContext);
            }
            return null;
        }, null, `Error while computing completions for ${textDocumentPosition.textDocument.uri}`, token);
    });
    connection.onHover((textDocumentPosition, token) => {
        return (0, runner_1.runSafeAsync)(async () => {
            const document = documents.get(textDocumentPosition.textDocument.uri);
            if (document) {
                await dataProvidersReady;
                const styleSheet = stylesheets.get(document);
                return getLanguageService(document).doHover(document, textDocumentPosition.position, styleSheet);
            }
            return null;
        }, null, `Error while computing hover for ${textDocumentPosition.textDocument.uri}`, token);
    });
    connection.onDocumentSymbol((documentSymbolParams, token) => {
        return (0, runner_1.runSafeAsync)(async () => {
            const document = documents.get(documentSymbolParams.textDocument.uri);
            if (document) {
                await dataProvidersReady;
                const stylesheet = stylesheets.get(document);
                // ??????????????????
                // ??????????????????????????????
                let symbolInformationList = getLanguageService(document).findDocumentSymbols(document, stylesheet);
                let workspaceFolder = (0, entry_1.getCurrentWorkspaceFolder)(workspaceFolders, document)[0];
                let hxSymbolInformationList = ((0, entry_1.getExtraServer)(document).getHxKindConvertedSymbolsData(workspaceFolder, symbolInformationList));
                return hxSymbolInformationList;
                // ??????????????????
                // return getLanguageService(document).findDocumentSymbols(document, stylesheet);
            }
            return [];
        }, [], `Error while computing document symbols for ${documentSymbolParams.textDocument.uri}`, token);
    });
    connection.onDefinition((documentDefinitionParams, token) => {
        return (0, runner_1.runSafeAsync)(async () => {
            const document = documents.get(documentDefinitionParams.textDocument.uri);
            if (document) {
                await dataProvidersReady;
                const stylesheet = stylesheets.get(document);
                // ???????????????
                // ??????????????????????????????
                let location = getLanguageService(document).findDefinition(document, documentDefinitionParams.position, stylesheet);
                // ?????????????????????????????????
                let workspace = (0, entry_1.getCurrentWorkspaceFolder)(workspaceFolders, document)[0];
                // ??????????????????????????????????????????(??????ID???????????????)
                let definitionDataList = await ((0, entry_1.getExtraServer)(document).getDefinitionData(workspace, document, documentDefinitionParams.position, stylesheet, location));
                if (definitionDataList.length <= 0) {
                    return null;
                }
                return definitionDataList;
                // ???????????????
                // return getLanguageService(document).findDefinition(document, documentDefinitionParams.position, stylesheet);
            }
            return null;
        }, null, `Error while computing definitions for ${documentDefinitionParams.textDocument.uri}`, token);
    });
    connection.onDocumentHighlight((documentHighlightParams, token) => {
        return (0, runner_1.runSafeAsync)(async () => {
            const document = documents.get(documentHighlightParams.textDocument.uri);
            if (document) {
                await dataProvidersReady;
                const stylesheet = stylesheets.get(document);
                return getLanguageService(document).findDocumentHighlights(document, documentHighlightParams.position, stylesheet);
            }
            return [];
        }, [], `Error while computing document highlights for ${documentHighlightParams.textDocument.uri}`, token);
    });
    connection.onDocumentLinks(async (documentLinkParams, token) => {
        return (0, runner_1.runSafeAsync)(async () => {
            const document = documents.get(documentLinkParams.textDocument.uri);
            if (document) {
                await dataProvidersReady;
                const documentContext = (0, documentContext_1.getDocumentContext)(document.uri, workspaceFolders);
                const stylesheet = stylesheets.get(document);
                return getLanguageService(document).findDocumentLinks2(document, stylesheet, documentContext);
            }
            return [];
        }, [], `Error while computing document links for ${documentLinkParams.textDocument.uri}`, token);
    });
    connection.onReferences((referenceParams, token) => {
        return (0, runner_1.runSafeAsync)(async () => {
            const document = documents.get(referenceParams.textDocument.uri);
            if (document) {
                await dataProvidersReady;
                const stylesheet = stylesheets.get(document);
                return getLanguageService(document).findReferences(document, referenceParams.position, stylesheet);
            }
            return [];
        }, [], `Error while computing references for ${referenceParams.textDocument.uri}`, token);
    });
    connection.onDocumentFormatting((formatParams, token) => {
        return (0, runner_1.runSafeAsync)(async () => {
            const document = documents.get(formatParams.textDocument.uri);
            if (document) {
                await dataProvidersReady;
                const definitionDataList = await ((0, entry_1.getExtraServer)(document).getFormattingData(document, formatParams.options, connection, scopedSettingsSupport));
                return definitionDataList;
            }
            return [];
        }, [], `Error while formatting for ${formatParams.textDocument.uri}`, token);
    });
    connection.onCodeAction((codeActionParams, token) => {
        return (0, runner_1.runSafeAsync)(async () => {
            const document = documents.get(codeActionParams.textDocument.uri);
            if (document) {
                await dataProvidersReady;
                const stylesheet = stylesheets.get(document);
                return getLanguageService(document).doCodeActions(document, codeActionParams.range, codeActionParams.context, stylesheet);
            }
            return [];
        }, [], `Error while computing code actions for ${codeActionParams.textDocument.uri}`, token);
    });
    connection.onDocumentColor((params, token) => {
        return (0, runner_1.runSafeAsync)(async () => {
            const document = documents.get(params.textDocument.uri);
            if (document) {
                await dataProvidersReady;
                const stylesheet = stylesheets.get(document);
                return getLanguageService(document).findDocumentColors(document, stylesheet);
            }
            return [];
        }, [], `Error while computing document colors for ${params.textDocument.uri}`, token);
    });
    connection.onColorPresentation((params, token) => {
        return (0, runner_1.runSafeAsync)(async () => {
            const document = documents.get(params.textDocument.uri);
            if (document) {
                await dataProvidersReady;
                const stylesheet = stylesheets.get(document);
                return getLanguageService(document).getColorPresentations(document, stylesheet, params.color, params.range);
            }
            return [];
        }, [], `Error while computing color presentations for ${params.textDocument.uri}`, token);
    });
    connection.onRenameRequest((renameParameters, token) => {
        return (0, runner_1.runSafeAsync)(async () => {
            const document = documents.get(renameParameters.textDocument.uri);
            if (document) {
                await dataProvidersReady;
                const stylesheet = stylesheets.get(document);
                return getLanguageService(document).doRename(document, renameParameters.position, renameParameters.newName, stylesheet);
            }
            return null;
        }, null, `Error while computing renames for ${renameParameters.textDocument.uri}`, token);
    });
    connection.onFoldingRanges((params, token) => {
        return (0, runner_1.runSafeAsync)(async () => {
            const document = documents.get(params.textDocument.uri);
            if (document) {
                await dataProvidersReady;
                return getLanguageService(document).getFoldingRanges(document, { rangeLimit: foldingRangeLimit });
            }
            return null;
        }, null, `Error while computing folding ranges for ${params.textDocument.uri}`, token);
    });
    connection.onSelectionRanges((params, token) => {
        return (0, runner_1.runSafeAsync)(async () => {
            const document = documents.get(params.textDocument.uri);
            const positions = params.positions;
            if (document) {
                await dataProvidersReady;
                const stylesheet = stylesheets.get(document);
                return getLanguageService(document).getSelectionRanges(document, positions, stylesheet);
            }
            return [];
        }, [], `Error while computing selection ranges for ${params.textDocument.uri}`, token);
    });
    connection.onNotification(CustomDataChangedNotification.type, updateDataProviders);
    // Listen on the connection
    connection.listen();
}
exports.startServer = startServer;
//# sourceMappingURL=cssServer.js.map