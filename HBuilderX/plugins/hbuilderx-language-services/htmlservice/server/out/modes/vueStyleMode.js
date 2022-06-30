"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVueCSSMode = void 0;
const vscode_css_languageservice_1 = require("vscode-css-languageservice");
const languageModelCache_1 = require("../languageModelCache");
const languageModes_1 = require("./languageModes");
const embeddedSupport_1 = require("./embeddedSupport");
const cssModeExtension_1 = require("../modes-ext/cssModeExtension");
const embeddedCssFormatting_1 = require("./embeddedCssFormatting");
const server_1 = require("../../../../stylusservice/server");
function getVueStyleModelCache(documentRegions, language) {
    let vueid = 'vue:' + language;
    let cache = (0, languageModelCache_1.getLanguageModelCache)(10, 60, document => documentRegions.get(document).getEmbeddedDocument(vueid));
    return {
        get(document) {
            let doc = cache.get(document);
            return languageModes_1.TextDocument.create(doc.uri, language, doc.version, doc.getText());
        },
        onDocumentRemoved(document) {
            cache.onDocumentRemoved(document);
        },
        dispose() {
            cache.dispose();
        }
    };
}
function getCSSLanguageMode(cssLanguageService, documentRegions, language, workspace) {
    let embeddedCSSDocuments = getVueStyleModelCache(documentRegions, language);
    let cssStylesheets = (0, languageModelCache_1.getLanguageModelCache)(10, 60, document => cssLanguageService.parseStylesheet(document));
    let cssModeExt = (0, cssModeExtension_1.getVueStyleModeExt)(cssLanguageService, workspace);
    let formatting = (0, embeddedCssFormatting_1.getCssFormatting)(documentRegions, 'vue:' + language);
    return {
        getId() {
            return language;
        },
        async doValidation(document, settings = workspace.settings) {
            let embedded = embeddedCSSDocuments.get(document);
            return cssLanguageService.doValidation(embedded, cssStylesheets.get(embedded), settings && settings.css);
        },
        async doComplete(document, position, documentContext, _settings = workspace.settings) {
            let embedded = embeddedCSSDocuments.get(document);
            const stylesheet = cssStylesheets.get(embedded);
            let addition = await cssModeExt.doComplete(document, embedded, position, stylesheet, documentContext);
            return addition !== null && addition !== void 0 ? addition : { isIncomplete: true, items: [] };
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
            //     if (definition.uri == document.uri) {
            //         let start = definition.range.start;
            //         let end = definition.range.end;
            //         reLocation = start.line == position.line &&
            //             start.character <= position.character &&
            //             end.character >= position.character;
            //     }
            // }
            // if (!definition || reLocation) {
            return cssModeExt.findDefinition(document, embedded, position, stylesheet);
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
        async format(document, range, formatParams, settings) {
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
function getStylusMode(documentRegions, workspace) {
    let embeddedCSSDocuments = getVueStyleModelCache(documentRegions, 'stylus');
    let cssModeExt = (0, cssModeExtension_1.getVueStyleModeExt)(undefined, workspace);
    let stylusService = new server_1.ExposedStylusServer();
    return {
        getId() {
            return '';
        },
        async doComplete(document, position, documentContext, _settings = workspace.settings) {
            let embedded = embeddedCSSDocuments.get(document);
            let serverApi = stylusService.getLanguageServiceExt();
            if (serverApi && serverApi.doComplete) {
                return serverApi.doComplete(embedded, position);
            }
            return languageModes_1.CompletionList.create();
        },
        async findDefinition(document, position) {
            return [];
        },
        onDocumentRemoved(document) {
            embeddedCSSDocuments.onDocumentRemoved(document);
        },
        dispose() {
            embeddedCSSDocuments.dispose();
        }
    };
}
function getVueCSSMode(serviceOption, documentRegions, workspace) {
    const cssService = (0, vscode_css_languageservice_1.getCSSLanguageService)(serviceOption);
    const scssService = (0, vscode_css_languageservice_1.getSCSSLanguageService)(serviceOption);
    const lessService = (0, vscode_css_languageservice_1.getLESSLanguageService)(serviceOption);
    const cssMode = getCSSLanguageMode(cssService, documentRegions, 'css', workspace);
    const scssMode = getCSSLanguageMode(scssService, documentRegions, 'scss', workspace);
    const lessMode = getCSSLanguageMode(lessService, documentRegions, 'less', workspace);
    const stylusMode = getStylusMode(documentRegions, workspace);
    let allModes = new Map();
    allModes.set('vue:css', cssMode);
    allModes.set('vue:scss', scssMode);
    allModes.set('vue:less', lessMode);
    allModes.set('vue:stylus', stylusMode);
    function modeAtPosition(document, position) {
        let language = documentRegions.get(document).getLanguageAtPosition(position);
        return language ? allModes.get(language) : undefined;
    }
    function getModesInRange(document, range) {
        return documentRegions.get(document).getLanguageRanges(range).map(r => {
            return {
                start: r.start,
                end: r.end,
                mode: r.languageId && allModes.get(r.languageId),
                attributeValue: r.attributeValue
            };
        });
    }
    return {
        getId() {
            return languageModes_1.VueLanguageModeId.Style;
        },
        async doComplete(document, position, documentContext, _settings = workspace.settings) {
            let mode = modeAtPosition(document, position);
            if (mode && mode.doComplete) {
                return mode.doComplete(document, position, documentContext, _settings);
            }
            return { isIncomplete: true, items: [] };
        },
        async doHover(document, position) {
            var _a, _b;
            let mode = modeAtPosition(document, position);
            return (_b = (await ((_a = mode === null || mode === void 0 ? void 0 : mode.doHover) === null || _a === void 0 ? void 0 : _a.call(mode, document, position)))) !== null && _b !== void 0 ? _b : null;
        },
        async findDocumentHighlight(document, position) {
            var _a, _b;
            let mode = modeAtPosition(document, position);
            return (_b = (await ((_a = mode === null || mode === void 0 ? void 0 : mode.findDocumentHighlight) === null || _a === void 0 ? void 0 : _a.call(mode, document, position)))) !== null && _b !== void 0 ? _b : [];
        },
        async findDocumentSymbols(document) {
            let result = [];
            let modeResult = Array.from(allModes.values()).map(async (mode) => {
                var _a, _b;
                return (_b = (await ((_a = mode === null || mode === void 0 ? void 0 : mode.findDocumentSymbols) === null || _a === void 0 ? void 0 : _a.call(mode, document)))) !== null && _b !== void 0 ? _b : [];
            });
            (await Promise.all(modeResult)).forEach(l => { result.push(...l); });
            return result;
        },
        async findDefinition(document, position) {
            var _a, _b;
            let mode = modeAtPosition(document, position);
            return (_b = (await ((_a = mode === null || mode === void 0 ? void 0 : mode.findDefinition) === null || _a === void 0 ? void 0 : _a.call(mode, document, position)))) !== null && _b !== void 0 ? _b : null;
        },
        async findReferences(document, position) {
            var _a, _b;
            let mode = modeAtPosition(document, position);
            return (_b = (await ((_a = mode === null || mode === void 0 ? void 0 : mode.findReferences) === null || _a === void 0 ? void 0 : _a.call(mode, document, position)))) !== null && _b !== void 0 ? _b : [];
        },
        async findDocumentColors(document) {
            let result = [];
            let modeResult = Array.from(allModes.values()).map(async (mode) => {
                var _a, _b;
                return (_b = (_a = mode.findDocumentColors) === null || _a === void 0 ? void 0 : _a.call(mode, document)) !== null && _b !== void 0 ? _b : [];
            });
            (await Promise.all(modeResult)).forEach(l => { result.push(...l); });
            return result;
        },
        async getColorPresentations(document, color, range) {
            let result = [];
            let modeResult = Array.from(allModes.values()).map(async (mode) => {
                var _a, _b;
                return (_b = (_a = mode === null || mode === void 0 ? void 0 : mode.getColorPresentations) === null || _a === void 0 ? void 0 : _a.call(mode, document, color, range)) !== null && _b !== void 0 ? _b : [];
            });
            (await Promise.all(modeResult)).forEach(l => { if (l) {
                result.push(...l);
            } });
            return result;
        },
        async format(document, range, formatParams, settings) {
            let embeddedRanges = getModesInRange(document, range);
            let embeddedEdits = [];
            for (let r of embeddedRanges) {
                let mode = r.mode;
                if (mode && mode.format && !r.attributeValue && mode.getId() == 'css') {
                    let edits = await mode.format(document, r, formatParams, settings);
                    for (let edit of edits) {
                        embeddedEdits.push(edit);
                    }
                }
            }
            if (embeddedEdits.length <= 1) {
                return embeddedEdits;
            }
            let resultContent = languageModes_1.TextDocument.applyEdits(document, embeddedEdits);
            let newDocument = languageModes_1.TextDocument.create(document.uri + '.style.tmp', document.languageId, document.version, resultContent);
            let afterFormatRangeLength = document.getText().length - document.offsetAt(range.end); // length of unchanged content after replace range
            let resultReplaceText = resultContent.substring(document.offsetAt(range.start), resultContent.length - afterFormatRangeLength);
            let result = languageModes_1.TextEdit.replace(range, resultReplaceText);
            return [result];
        },
        async getFoldingRanges(document) {
            let result = [];
            let modeResult = Array.from(allModes.values()).map(async (mode) => { var _a, _b; return (_b = (_a = mode === null || mode === void 0 ? void 0 : mode.getFoldingRanges) === null || _a === void 0 ? void 0 : _a.call(mode, document)) !== null && _b !== void 0 ? _b : []; });
            (await Promise.all(modeResult)).forEach(l => { result.push(...l); });
            return result;
        },
        async getSelectionRange(document, position) {
            var _a;
            let mode = modeAtPosition(document, position);
            let range = (await ((_a = mode === null || mode === void 0 ? void 0 : mode.getSelectionRange) === null || _a === void 0 ? void 0 : _a.call(mode, document, position)));
            if (range) {
                return range;
            }
            return vscode_css_languageservice_1.SelectionRange.create(languageModes_1.Range.create(position, position));
        },
        onDocumentRemoved(document) {
            allModes.forEach(val => { val.onDocumentRemoved(document); });
        },
        dispose() {
            allModes.forEach(val => { val.dispose(); });
        }
    };
}
exports.getVueCSSMode = getVueCSSMode;
//# sourceMappingURL=vueStyleMode.js.map