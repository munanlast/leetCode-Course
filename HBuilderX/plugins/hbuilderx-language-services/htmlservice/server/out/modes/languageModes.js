"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLanguageModes = exports.VueLanguageModeId = void 0;
const vscode_css_languageservice_1 = require("vscode-css-languageservice");
const vscode_html_languageservice_1 = require("vscode-html-languageservice");
const languageModelCache_1 = require("../languageModelCache");
const cssMode_1 = require("./cssMode");
const embeddedSupport_1 = require("./embeddedSupport");
const htmlMode_1 = require("./htmlMode");
const javascriptMode_1 = require("./javascriptMode");
const vueTemplateMode_1 = require("./vueTemplateMode");
const vueStyleMode_1 = require("./vueStyleMode");
const htmlDataProviderParticipant_1 = require("./htmlDataProviderParticipant");
__exportStar(require("vscode-html-languageservice"), exports);
var VueLanguageModeId;
(function (VueLanguageModeId) {
    VueLanguageModeId["Style"] = "vue-style";
    VueLanguageModeId["Script"] = "vue-script";
    VueLanguageModeId["Template"] = "vue-template";
})(VueLanguageModeId = exports.VueLanguageModeId || (exports.VueLanguageModeId = {}));
function getLanguageModes(supportedLanguages, workspace, clientCapabilities, requestService) {
    const htmlLanguageService = (0, vscode_html_languageservice_1.getLanguageService)({ clientCapabilities });
    const cssLanguageService = (0, vscode_css_languageservice_1.getCSSLanguageService)({ clientCapabilities });
    const vueLanguageService = (0, vscode_html_languageservice_1.getLanguageService)({ clientCapabilities });
    let htmlDocuments = (0, languageModelCache_1.getLanguageModelCache)(10, 60, document => htmlLanguageService.parseHTMLDocument(document));
    let documentRegions = (0, languageModelCache_1.getLanguageModelCache)(10, 60, document => (0, embeddedSupport_1.getDocumentRegions)(htmlLanguageService, document));
    let modelCaches = [];
    modelCaches.push(documentRegions);
    let modes = Object.create(null);
    modes['html'] = (0, htmlMode_1.getHTMLMode)({ clientCapabilities, fileSystemProvider: requestService }, htmlLanguageService, htmlDocuments, workspace);
    if (supportedLanguages['css']) {
        modes['css'] = (0, cssMode_1.getCSSMode)(cssLanguageService, documentRegions, workspace);
    }
    if (supportedLanguages['javascript']) {
        modes['javascript'] = (0, javascriptMode_1.getJavaScriptMode)(documentRegions, htmlDocuments, 'javascript', workspace);
        modes['typescript'] = (0, javascriptMode_1.getJavaScriptMode)(documentRegions, htmlDocuments, 'typescript', workspace);
    }
    // vue中的 css, scss less等特殊语言在内部判断
    modes[VueLanguageModeId.Style] = (0, vueStyleMode_1.getVueCSSMode)({ clientCapabilities, fileSystemProvider: requestService }, documentRegions, workspace);
    modes[VueLanguageModeId.Template] = (0, vueTemplateMode_1.getVueTemplateMode)({ clientCapabilities, fileSystemProvider: requestService }, vueLanguageService, workspace);
    function modeIdFromLanguage(language) {
        if (language) {
            if (language === 'vue:css' ||
                language === 'vue:scss' ||
                language === 'vue:less' ||
                language === 'vue:stylus') {
                return VueLanguageModeId.Style;
            }
            return language;
        }
        return undefined;
    }
    const providerParticipant = (0, htmlDataProviderParticipant_1.getHTMLDataProviderParticipant)();
    return {
        async updateDataProviders(dataProviders) {
            dataProviders.push(providerParticipant);
            htmlLanguageService.setDataProviders(true, dataProviders);
            // let mode = modes['html'];
            // if (mode && mode.updateDataProviders) {
            // 	dataProviders.push(getDefaultHTMLDataProvider());
            // 	mode.updateDataProviders(dataProviders);
            // }
        },
        getModeAtPosition(document, position) {
            let languageId = documentRegions.get(document).getLanguageAtPosition(position);
            let modeId = modeIdFromLanguage(languageId);
            return modeId ? modes[modeId] : undefined;
            ;
        },
        getModesInRange(document, range) {
            return documentRegions.get(document).getLanguageRanges(range).map(r => {
                let modeId = modeIdFromLanguage(r.languageId);
                return {
                    start: r.start,
                    end: r.end,
                    mode: modeId && modes[modeId],
                    attributeValue: r.attributeValue
                };
            });
        },
        getAllModesInDocument(document) {
            let result = [];
            for (let languageId of documentRegions.get(document).getLanguagesInDocument()) {
                let modeId = modeIdFromLanguage(languageId);
                let mode = modeId ? modes[modeId] : undefined;
                if (mode) {
                    result.push(mode);
                }
            }
            return result;
        },
        getAllModes() {
            let result = [];
            for (let languageId in modes) {
                let mode = modes[languageId];
                if (mode) {
                    result.push(mode);
                }
            }
            return result;
        },
        getMode(languageId) {
            return modes[languageId];
        },
        onDocumentRemoved(document) {
            modelCaches.forEach(mc => mc.onDocumentRemoved(document));
            for (let mode in modes) {
                modes[mode].onDocumentRemoved(document);
            }
        },
        dispose() {
            modelCaches.forEach(mc => mc.dispose());
            modelCaches = [];
            for (let mode in modes) {
                modes[mode].dispose();
            }
            modes = {};
        }
    };
}
exports.getLanguageModes = getLanguageModes;
//# sourceMappingURL=languageModes.js.map