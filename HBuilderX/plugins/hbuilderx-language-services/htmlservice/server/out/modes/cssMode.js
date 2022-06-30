"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCSSMode = void 0;
const languageModelCache_1 = require("../languageModelCache");
const embeddedSupport_1 = require("./embeddedSupport");
const cssModeExtension_1 = require("../modes-ext/cssModeExtension");
const embeddedCssFormatting_1 = require("./embeddedCssFormatting");
function getCSSMode(cssLanguageService, documentRegions, workspace) {
    let embeddedCSSDocuments = (0, languageModelCache_1.getLanguageModelCache)(10, 60, document => documentRegions.get(document).getEmbeddedDocument('css'));
    let cssStylesheets = (0, languageModelCache_1.getLanguageModelCache)(10, 60, document => cssLanguageService.parseStylesheet(document));
    let cssModeExt = (0, cssModeExtension_1.getCssModeExt)(cssLanguageService, workspace);
    let formatting = (0, embeddedCssFormatting_1.getCssFormatting)(documentRegions, 'css');
    let globalSettings = {};
    return {
        getId() {
            return 'css';
        },
        async doValidation(document, settings = workspace.settings) {
            let embedded = embeddedCSSDocuments.get(document);
            return cssLanguageService.doValidation(embedded, cssStylesheets.get(embedded), settings && settings.css);
        },
        async doComplete(document, position, documentContext, _settings = workspace.settings) {
            let embedded = embeddedCSSDocuments.get(document);
            const stylesheet = cssStylesheets.get(embedded);
            let result = await cssModeExt.doComplete(document, embedded, position, stylesheet, documentContext);
            if (!result) {
                return await cssLanguageService.doComplete2(embedded, position, stylesheet, documentContext);
            }
            return result;
        },
        async doHover(document, position) {
            let embedded = embeddedCSSDocuments.get(document);
            return cssLanguageService.doHover(embedded, position, cssStylesheets.get(embedded));
        },
        async findDocumentHighlight(document, position) {
            let embedded = embeddedCSSDocuments.get(document);
            return cssLanguageService.findDocumentHighlights(embedded, position, cssStylesheets.get(embedded));
        },
        async findDocumentSymbols(document) {
            let embedded = embeddedCSSDocuments.get(document);
            return cssModeExt.findDocumentSymbols(embedded, cssStylesheets.get(embedded)).filter(s => s.name !== embeddedSupport_1.CSS_STYLE_RULE);
        },
        async findDefinition(document, position) {
            let embedded = embeddedCSSDocuments.get(document);
            let stylesheet = cssStylesheets.get(embedded);
            // let definition = await cssLanguageService.findDefinition(embedded, position, stylesheet);
            // let reLocation = false;
            // if (definition) {
            // 	if (definition.uri == document.uri) {
            // 		let start = definition.range.start;
            // 		let end = definition.range.end;
            // 		reLocation = start.line == position.line &&
            // 			start.character <= position.character &&
            // 			end.character >= position.character;
            // 	}
            // }
            // if (!definition || reLocation) {
            return await cssModeExt.findDefinition(document, embedded, position, stylesheet);
            // }
            // return definition;
        },
        async findReferences(document, position) {
            let embedded = embeddedCSSDocuments.get(document);
            return cssLanguageService.findReferences(embedded, position, cssStylesheets.get(embedded));
        },
        async findDocumentColors(document) {
            let embedded = embeddedCSSDocuments.get(document);
            return cssLanguageService.findDocumentColors(embedded, cssStylesheets.get(embedded));
        },
        async getColorPresentations(document, color, range) {
            let embedded = embeddedCSSDocuments.get(document);
            return cssLanguageService.getColorPresentations(embedded, cssStylesheets.get(embedded), color, range);
        },
        async format(document, range, formatParams, settings = globalSettings) {
            return formatting.doFormatting(document, range, formatParams, settings);
        },
        async getFoldingRanges(document) {
            let embedded = embeddedCSSDocuments.get(document);
            return cssLanguageService.getFoldingRanges(embedded, {});
        },
        async getSelectionRange(document, position) {
            let embedded = embeddedCSSDocuments.get(document);
            return cssLanguageService.getSelectionRanges(embedded, [position], cssStylesheets.get(embedded))[0];
        },
        onDocumentRemoved(document) {
            embeddedCSSDocuments.onDocumentRemoved(document);
            cssStylesheets.onDocumentRemoved(document);
        },
        dispose() {
            embeddedCSSDocuments.dispose();
            cssStylesheets.dispose();
        }
    };
}
exports.getCSSMode = getCSSMode;
//# sourceMappingURL=cssMode.js.map