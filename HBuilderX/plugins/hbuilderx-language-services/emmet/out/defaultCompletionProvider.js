"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultCompletionItemProvider = void 0;
const vscode = require("vscode");
const vscode_css_languageservice_1 = require("vscode-css-languageservice");
const utils_1 = require("../../utils");
const abbreviationActions_1 = require("./abbreviationActions");
const parseDocument_1 = require("./parseDocument");
const util_1 = require("./util");
class DefaultCompletionItem extends vscode.CompletionItem {
}
class DefaultCompletionItemProvider {
    provideCompletionItems(document, position, _, context) {
        const completionResult = this.provideCompletionItemsInternal(document, position, context);
        if (!completionResult) {
            this.lastCompletionType = undefined;
            return;
        }
        return completionResult.then(completionList => {
            if (!completionList || !completionList.items.length) {
                this.lastCompletionType = undefined;
                return completionList;
            }
            const item = completionList.items[0];
            const expandedText = item.documentation ? item.documentation.toString() : '';
            if (expandedText.startsWith('<')) {
                this.lastCompletionType = 'html';
            }
            else if (expandedText.indexOf(':') > 0 && expandedText.endsWith(';')) {
                this.lastCompletionType = 'css';
            }
            else {
                this.lastCompletionType = undefined;
            }
            return completionList;
        });
    }
    provideCompletionItemsInternal(document, position, context) {
        var _a, _b;
        const emmetConfig = (0, util_1.getPackageJsonConfiguration)();
        const excludedLanguages = emmetConfig['excludeLanguages'] ? emmetConfig['excludeLanguages'] : [];
        if (excludedLanguages.indexOf(document.languageId) > -1) {
            return;
        }
        // 新增判断, 如果是vue文件, 且在style标签中, 不提示emmet代码块
        if (document.languageId === 'vue' && document.getText(new vscode.Range(new vscode.Position(position.line, 0), position)).replace(/\s/g, '').includes('<style')) {
            return;
        }
        // 新增判断, 如果是vue或HTML文件, 且在{{}}中, 不提示emmet代码块
        if ((document.languageId === 'vue' || document.languageId === 'html')
            && document.getText(new vscode.Range(new vscode.Position(position.line, 0), position)).replace(/\s/g, '').includes('{{')) {
            return;
        }
        const mappedLanguages = (0, util_1.getMappingForIncludedLanguages)();
        const isSyntaxMapped = mappedLanguages[document.languageId] ? true : false;
        let emmetMode = (0, util_1.getEmmetMode)((isSyntaxMapped ? mappedLanguages[document.languageId] : document.languageId), mappedLanguages, excludedLanguages);
        if (!emmetMode
            || emmetConfig['showExpandedAbbreviation'] === 'never'
            || ((isSyntaxMapped || emmetMode === 'jsx') && emmetConfig['showExpandedAbbreviation'] !== 'always')) {
            return;
        }
        let syntax = emmetMode;
        let validateLocation = syntax === 'html' || syntax === 'jsx' || syntax === 'xml';
        let rootNode;
        let currentNode;
        const lsDoc = (0, util_1.toLSTextDocument)(document);
        position = document.validatePosition(position);
        // Don't show completions if there's a comment at the beginning of the line
        const lineRange = new vscode.Range(position.line, 0, position.line, position.character);
        if (document.getText(lineRange).trimStart().startsWith('//')) {
            return;
        }
        const helper = (0, util_1.getEmmetHelper)();
        if (syntax === 'html') {
            if (context.triggerKind === vscode.CompletionTriggerKind.TriggerForIncompleteCompletions) {
                switch (this.lastCompletionType) {
                    case 'html':
                        validateLocation = false;
                        break;
                    case 'css':
                        validateLocation = false;
                        syntax = 'css';
                        break;
                    default:
                        break;
                }
            }
            if (validateLocation) {
                const positionOffset = document.offsetAt(position);
                const emmetRootNode = (0, parseDocument_1.getRootNode)(document, true);
                const foundNode = (0, util_1.getHtmlFlatNode)(document.getText(), emmetRootNode, positionOffset, false);
                if (foundNode) {
                    if (foundNode.name === 'script') {
                        const typeNode = foundNode.attributes.find(attr => attr.name.toString() === 'type');
                        if (typeNode) {
                            const typeAttrValue = typeNode.value.toString();
                            if (typeAttrValue === 'application/javascript' || typeAttrValue === 'text/javascript') {
                                if (!(0, abbreviationActions_1.getSyntaxFromArgs)({ language: 'javascript' })) {
                                    return;
                                }
                                else {
                                    validateLocation = false;
                                }
                            }
                            else if (util_1.allowedMimeTypesInScriptTag.includes(typeAttrValue)) {
                                validateLocation = false;
                            }
                        }
                        else {
                            return;
                        }
                    }
                    else if (foundNode.name === 'style') {
                        syntax = 'css';
                        validateLocation = false;
                    }
                    else {
                        const styleNode = foundNode.attributes.find(attr => attr.name.toString() === 'style');
                        if (styleNode && ((_a = styleNode.value) === null || _a === void 0 ? void 0 : _a.start) <= positionOffset && positionOffset <= ((_b = styleNode.value) === null || _b === void 0 ? void 0 : _b.end)) {
                            syntax = 'css';
                            validateLocation = false;
                        }
                    }
                }
            }
        }
        const expandOptions = (0, util_1.isStyleSheet)(syntax) ?
            { lookAhead: false, syntax: 'stylesheet' } :
            { lookAhead: true, syntax: 'markup' };
        const extractAbbreviationResults = helper.extractAbbreviation(lsDoc, position, expandOptions);
        if (!extractAbbreviationResults || !helper.isAbbreviationValid(syntax, extractAbbreviationResults.abbreviation)) {
            return;
        }
        const offset = document.offsetAt(position);
        if ((0, util_1.isStyleSheet)(document.languageId) && context.triggerKind !== vscode.CompletionTriggerKind.TriggerForIncompleteCompletions) {
            validateLocation = true;
            let usePartialParsing = emmetConfig['optimizeStylesheetParsing'] === true;
            rootNode = usePartialParsing && document.lineCount > 1000 ? (0, util_1.parsePartialStylesheet)(document, position) : (0, parseDocument_1.getRootNode)(document, true);
            if (!rootNode) {
                return;
            }
            currentNode = (0, util_1.getFlatNode)(rootNode, offset, true);
        }
        // Fix for https://github.com/microsoft/vscode/issues/107578
        // Validate location if syntax is of styleSheet type to ensure that location is valid for emmet abbreviation.
        // For an html document containing a <style> node, compute the embeddedCssNode and fetch the flattened node as currentNode.
        if (!(0, util_1.isStyleSheet)(document.languageId) && (0, util_1.isStyleSheet)(syntax) && context.triggerKind !== vscode.CompletionTriggerKind.TriggerForIncompleteCompletions) {
            validateLocation = true;
            rootNode = (0, parseDocument_1.getRootNode)(document, true);
            if (!rootNode) {
                return;
            }
            let flatNode = (0, util_1.getFlatNode)(rootNode, offset, true);
            let embeddedCssNode = (0, util_1.getEmbeddedCssNodeIfAny)(document, flatNode, position);
            currentNode = (0, util_1.getFlatNode)(embeddedCssNode, offset, true);
        }
        if (validateLocation && !(0, abbreviationActions_1.isValidLocationForEmmetAbbreviation)(document, rootNode, currentNode, syntax, offset, toRange(extractAbbreviationResults.abbreviationRange))) {
            return;
        }
        let noiseCheckPromise = Promise.resolve();
        // Fix for https://github.com/microsoft/vscode/issues/32647
        // Check for document symbols in js/ts/jsx/tsx and avoid triggering emmet for abbreviations of the form symbolName.sometext
        // Presence of > or * or + in the abbreviation denotes valid abbreviation that should trigger emmet
        if (!(0, util_1.isStyleSheet)(syntax) && (document.languageId === 'javascript' || document.languageId === 'javascriptreact' || document.languageId === 'typescript' || document.languageId === 'typescriptreact')) {
            let abbreviation = extractAbbreviationResults.abbreviation;
            if (abbreviation.startsWith('this.')) {
                noiseCheckPromise = Promise.resolve(true);
            }
            else {
                noiseCheckPromise = vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', document.uri).then((symbols) => {
                    return symbols && symbols.find(x => abbreviation === x.name || (abbreviation.startsWith(x.name + '.') && !/>|\*|\+/.test(abbreviation)));
                });
            }
        }
        return noiseCheckPromise.then((noise) => {
            if (noise) {
                return;
            }
            const config = (0, util_1.getEmmetConfiguration)(syntax);
            const result = helper.doComplete((0, util_1.toLSTextDocument)(document), position, syntax, config);
            // https://github.com/microsoft/vscode/issues/86941
            if (result && result.items && result.items.length === 1) {
                if (result.items[0].label === 'widows: ;') {
                    return undefined;
                }
            }
            let newItems = [];
            if (result && result.items) {
                result.items.forEach((item) => {
                    var _a, _b;
                    let newItem = new DefaultCompletionItem(item.label);
                    // 此处新增逻辑
                    // 对返回的项目中的documentation, 进行转换
                    if ((_a = item.documentation) === null || _a === void 0 ? void 0 : _a.toString().startsWith('<')) {
                        let text = item.documentation.toString();
                        item.documentation = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    }
                    newItem.documentation = item.documentation;
                    newItem.detail = item.detail;
                    newItem.insertText = new vscode.SnippetString(item.textEdit.newText);
                    let oldrange = item.textEdit.range;
                    newItem.range = new vscode.Range(oldrange.start.line, oldrange.start.character, oldrange.end.line, oldrange.end.character);
                    newItem.filterText = item.filterText;
                    newItem.sortText = item.sortText;
                    if (emmetConfig['showSuggestionsAsSnippets'] === true) {
                        newItem.kind = vscode.CompletionItemKind.Snippet;
                    }
                    // 新增功能, 如果css补全项, 带有属性参数
                    // 判断属性参数是否可以写入数字, 将参数设置进data
                    const documentation = item.documentation ? item.documentation.toString() : '';
                    if (documentation.includes(':')) {
                        const offset = documentation.indexOf(':');
                        const leftText = documentation.substring(0, offset).trim();
                        let isAltMode = false;
                        const data = (0, vscode_css_languageservice_1.getDefaultCSSDataProvider)();
                        const item = data.provideProperties().find((item) => item.name === leftText);
                        if (item && item.restrictions) {
                            for (const iterator of item.restrictions) {
                                if ((0, utils_1.includesList)(iterator, utils_1.numberType))
                                    isAltMode = true;
                                break;
                            }
                            if (isAltMode) {
                                newItem.data = { hxOption: { altMode: true } };
                            }
                        }
                    }
                    if (((_b = item.documentation) === null || _b === void 0 ? void 0 : _b.toString().startsWith('&lt;')) && item.label.includes('*')) {
                        newItem.data = { hxOption: { altMode: true } };
                    }
                    newItems.push(newItem);
                });
            }
            return new vscode.CompletionList(newItems, true);
        });
    }
}
exports.DefaultCompletionItemProvider = DefaultCompletionItemProvider;
function toRange(lsRange) {
    return new vscode.Range(lsRange.start.line, lsRange.start.character, lsRange.end.line, lsRange.end.character);
}
//# sourceMappingURL=defaultCompletionProvider.js.map