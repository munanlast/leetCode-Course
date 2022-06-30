"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activateEmmetExtension = exports.expandEmmetAbbreviation = void 0;
const vscode = require("vscode");
const defaultCompletionProvider_1 = require("./defaultCompletionProvider");
const abbreviationActions_1 = require("./abbreviationActions");
Object.defineProperty(exports, "expandEmmetAbbreviation", { enumerable: true, get: function () { return abbreviationActions_1.expandEmmetAbbreviation; } });
const removeTag_1 = require("./removeTag");
const updateTag_1 = require("./updateTag");
const matchTag_1 = require("./matchTag");
const balance_1 = require("./balance");
const splitJoinTag_1 = require("./splitJoinTag");
const mergeLines_1 = require("./mergeLines");
const toggleComment_1 = require("./toggleComment");
const editPoint_1 = require("./editPoint");
const selectItem_1 = require("./selectItem");
const evaluateMathExpression_1 = require("./evaluateMathExpression");
const incrementDecrement_1 = require("./incrementDecrement");
const util_1 = require("./util");
const reflectCssValue_1 = require("./reflectCssValue");
const parseDocument_1 = require("./parseDocument");
function activateEmmetExtension(context) {
    (0, util_1.migrateEmmetExtensionsPath)();
    registerCompletionProviders(context);
    (0, util_1.updateEmmetExtensionsPath)();
    context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.wrapWithAbbreviation', (args) => {
        (0, abbreviationActions_1.wrapWithAbbreviation)(args);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('emmet.expandAbbreviation', (args) => {
        (0, abbreviationActions_1.expandEmmetAbbreviation)(args);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.removeTag', () => {
        return (0, removeTag_1.removeTag)();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.updateTag', (inputTag) => {
        if (inputTag && typeof inputTag === 'string') {
            return (0, updateTag_1.updateTag)(inputTag);
        }
        return (0, updateTag_1.updateTag)(undefined);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.matchTag', () => {
        (0, matchTag_1.matchTag)();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.balanceOut', () => {
        (0, balance_1.balanceOut)();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.balanceIn', () => {
        (0, balance_1.balanceIn)();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.splitJoinTag', () => {
        return (0, splitJoinTag_1.splitJoinTag)();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.mergeLines', () => {
        (0, mergeLines_1.mergeLines)();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.toggleComment', () => {
        (0, toggleComment_1.toggleComment)();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.nextEditPoint', () => {
        (0, editPoint_1.fetchEditPoint)('next');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.prevEditPoint', () => {
        (0, editPoint_1.fetchEditPoint)('prev');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.selectNextItem', () => {
        (0, selectItem_1.fetchSelectItem)('next');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.selectPrevItem', () => {
        (0, selectItem_1.fetchSelectItem)('prev');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.evaluateMathExpression', () => {
        (0, evaluateMathExpression_1.evaluateMathExpression)();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.incrementNumberByOneTenth', () => {
        return (0, incrementDecrement_1.incrementDecrement)(0.1);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.incrementNumberByOne', () => {
        return (0, incrementDecrement_1.incrementDecrement)(1);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.incrementNumberByTen', () => {
        return (0, incrementDecrement_1.incrementDecrement)(10);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.decrementNumberByOneTenth', () => {
        return (0, incrementDecrement_1.incrementDecrement)(-0.1);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.decrementNumberByOne', () => {
        return (0, incrementDecrement_1.incrementDecrement)(-1);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.decrementNumberByTen', () => {
        return (0, incrementDecrement_1.incrementDecrement)(-10);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.reflectCSSValue', () => {
        return (0, reflectCssValue_1.reflectCssValue)();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('workbench.action.showEmmetCommands', () => {
        vscode.commands.executeCommand('workbench.action.quickOpen', '>Emmet: ');
    }));
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration('emmet.includeLanguages')) {
            registerCompletionProviders(context);
        }
        if (e.affectsConfiguration('emmet.extensionsPath')) {
            (0, util_1.updateEmmetExtensionsPath)();
        }
    }));
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument((e) => {
        const basefileName = (0, util_1.getPathBaseName)(e.fileName);
        if (basefileName.startsWith('snippets') && basefileName.endsWith('.json')) {
            (0, util_1.updateEmmetExtensionsPath)(true);
        }
    }));
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument((e) => {
        var _a;
        const emmetMode = (_a = (0, util_1.getEmmetMode)(e.languageId, {}, [])) !== null && _a !== void 0 ? _a : '';
        const syntaxes = (0, util_1.getSyntaxes)();
        if (syntaxes.markup.includes(emmetMode) || syntaxes.stylesheet.includes(emmetMode)) {
            (0, parseDocument_1.addFileToParseCache)(e);
        }
    }));
    context.subscriptions.push(vscode.workspace.onDidCloseTextDocument((e) => {
        var _a;
        const emmetMode = (_a = (0, util_1.getEmmetMode)(e.languageId, {}, [])) !== null && _a !== void 0 ? _a : '';
        const syntaxes = (0, util_1.getSyntaxes)();
        if (syntaxes.markup.includes(emmetMode) || syntaxes.stylesheet.includes(emmetMode)) {
            (0, parseDocument_1.removeFileFromParseCache)(e);
        }
    }));
}
exports.activateEmmetExtension = activateEmmetExtension;
/**
 * Holds any registered completion providers by their language strings
 */
const languageMappingForCompletionProviders = new Map();
const completionProvidersMapping = new Map();
function registerCompletionProviders(context) {
    let completionProvider = new defaultCompletionProvider_1.DefaultCompletionItemProvider();
    let includedLanguages = (0, util_1.getMappingForIncludedLanguages)();
    Object.keys(includedLanguages).forEach(language => {
        if (languageMappingForCompletionProviders.has(language) && languageMappingForCompletionProviders.get(language) === includedLanguages[language]) {
            return;
        }
        if (languageMappingForCompletionProviders.has(language)) {
            const mapping = completionProvidersMapping.get(language);
            if (mapping) {
                mapping.dispose();
            }
            languageMappingForCompletionProviders.delete(language);
            completionProvidersMapping.delete(language);
        }
        const provider = vscode.languages.registerCompletionItemProvider({ language, scheme: '*' }, completionProvider, ...util_1.LANGUAGE_MODES[includedLanguages[language]]);
        context.subscriptions.push(provider);
        languageMappingForCompletionProviders.set(language, includedLanguages[language]);
        completionProvidersMapping.set(language, provider);
    });
    Object.keys(util_1.LANGUAGE_MODES).forEach(language => {
        if (!languageMappingForCompletionProviders.has(language)) {
            const provider = vscode.languages.registerCompletionItemProvider({ language, scheme: '*' }, completionProvider, ...util_1.LANGUAGE_MODES[language]);
            context.subscriptions.push(provider);
            languageMappingForCompletionProviders.set(language, language);
            completionProvidersMapping.set(language, provider);
        }
    });
}
function deactivate() {
    completionProvidersMapping.clear();
    (0, parseDocument_1.clearParseCache)();
}
exports.deactivate = deactivate;
//# sourceMappingURL=emmetCommon.js.map