"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHTMLMode = void 0;
const htmlModeExtentsion_1 = require("../modes-ext/htmlModeExtentsion");
const out_1 = require("../../../../utils/out");
const idClassCompletion_1 = require("../modes-ext/idClassCompletion");
const documentContext_1 = require("../utils/documentContext");
const PathCompletionParticipant_1 = require("../modes-ext/PathCompletionParticipant");
function getHTMLMode(serviceOption, htmlLanguageService, htmlDocuments, workspace) {
    let htmlModeExt = (0, htmlModeExtentsion_1.getHtmlModeExt)(htmlLanguageService, htmlDocuments, workspace);
    let participants = [];
    participants.push(new idClassCompletion_1.IdClassCompletionParticipant());
    if (serviceOption.fileSystemProvider && serviceOption.fileSystemProvider.readDirectory) {
        participants.push(new PathCompletionParticipant_1.PathCompletionParticipant(serviceOption.fileSystemProvider.readDirectory));
    }
    htmlLanguageService.setCompletionParticipants(participants);
    return {
        getId() {
            return 'html';
        },
        async getSelectionRange(document, position) {
            return htmlLanguageService.getSelectionRanges(document, [position])[0];
        },
        async doComplete(document, position, documentContext, settings = workspace.settings) {
            let options = settings && settings.html && settings.html.suggest;
            let doAutoComplete = settings && settings.html && settings.html.autoClosingTags;
            if (doAutoComplete) {
                options.hideAutoCompleteProposals = true;
            }
            let rootFolder = (0, documentContext_1.getRootFolder)(document.uri, workspace.folders);
            const htmlDocument = htmlDocuments.get(document);
            const defaultCompletion = async (config) => {
                var _a;
                participants.forEach(p => { var _a; (_a = p.beginCompletion) === null || _a === void 0 ? void 0 : _a.call(p, { workspaceFolder: rootFolder }); });
                let result = await htmlLanguageService.doComplete2(document, position, htmlDocument, documentContext, config);
                for (let i = 0; i < participants.length; i++) {
                    const p = participants[i];
                    let temp = await p.computeCompletions(document, htmlDocument, documentContext);
                    result.items.push(...temp.items);
                    result.isIncomplete = result.isIncomplete || temp.isIncomplete;
                    (_a = p.endCompletion) === null || _a === void 0 ? void 0 : _a.call(p);
                }
                return result;
            };
            let completionList = await htmlModeExt.doComplete(document, position, htmlDocument, defaultCompletion, options);
            return completionList;
        },
        async doHover(document, position) {
            return htmlLanguageService.doHover(document, position, htmlDocuments.get(document));
        },
        async findDocumentHighlight(document, position) {
            return htmlLanguageService.findDocumentHighlights(document, position, htmlDocuments.get(document));
        },
        async findDocumentLinks(document, documentContext) {
            return htmlLanguageService.findDocumentLinks(document, documentContext);
        },
        async findDocumentSymbols(document) {
            let symbols = await htmlLanguageService.findDocumentSymbols(document, htmlDocuments.get(document));
            let result = symbols.map(symbol => {
                let item = { ...symbol };
                item.hxKind = out_1.HxIconKind[out_1.HxIconKind.ELEMENT];
                return item;
            });
            return result;
        },
        async format(document, range, formatParams, settings = workspace.settings) {
            let formatSettings = settings && settings.html && settings.html.format;
            if (formatSettings) {
                formatSettings = merge(formatSettings, {});
            }
            else {
                formatSettings = {};
            }
            if (formatSettings.contentUnformatted) {
                formatSettings.contentUnformatted = formatSettings.contentUnformatted + ',script';
            }
            else {
                formatSettings.contentUnformatted = 'script';
            }
            formatSettings = merge(formatParams, formatSettings);
            return htmlLanguageService.format(document, range, formatSettings);
        },
        async getFoldingRanges(document) {
            return htmlLanguageService.getFoldingRanges(document);
        },
        async doAutoClose(document, position) {
            let offset = document.offsetAt(position);
            let text = document.getText();
            if (offset > 0 && text.charAt(offset - 1).match(/[>\/]/g)) {
                return htmlLanguageService.doTagComplete(document, position, htmlDocuments.get(document));
            }
            return null;
        },
        async doRename(document, position, newName) {
            const htmlDocument = htmlDocuments.get(document);
            return htmlLanguageService.doRename(document, position, newName, htmlDocument);
        },
        async onDocumentRemoved(document) {
            htmlDocuments.onDocumentRemoved(document);
        },
        async findMatchingTagPosition(document, position) {
            const htmlDocument = htmlDocuments.get(document);
            return htmlLanguageService.findMatchingTagPosition(document, position, htmlDocument);
        },
        async doOnTypeRename(document, position) {
            const htmlDocument = htmlDocuments.get(document);
            return htmlLanguageService.findOnTypeRenameRanges(document, position, htmlDocument);
        },
        async findDefinition(document, position) {
            const htmlDocument = htmlDocuments.get(document);
            return htmlModeExt.findDefinition(document, position, htmlDocument);
        },
        updateDataProviders(providers) {
            htmlModeExt.updateDataProviders(providers);
        },
        dispose() {
            htmlDocuments.dispose();
        }
    };
}
exports.getHTMLMode = getHTMLMode;
function merge(src, dst) {
    for (const key in src) {
        if (src.hasOwnProperty(key)) {
            dst[key] = src[key];
        }
    }
    return dst;
}
//# sourceMappingURL=htmlMode.js.map