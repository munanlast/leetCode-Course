"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValues = exports.getProperties = exports.getAtRules = exports.getAllSymbols = exports.findPropertySchema = exports.getPropertyName = exports.isValue = exports.isAtRule = exports.isClassOrId = void 0;
const vscode_css_languageservice_1 = require("vscode-css-languageservice");
const vscode_languageserver_1 = require("vscode-languageserver");
const built_in_1 = require("./built-in");
const css_built_in_1 = require("./css-built-in");
const languageFacts_1 = require("./languageFacts");
const parser_1 = require("./parser");
const utils_1 = require("./utils");
/**
 * Naive check whether currentWord is class or id
 * @param {String} currentWord
 * @return {Boolean}
 */
function isClassOrId(currentWord) {
    return currentWord.startsWith('.') || currentWord.startsWith('#') || currentWord.startsWith('&');
}
exports.isClassOrId = isClassOrId;
/**
 * Naive check whether currentWord is at rule
 * @param {String} currentWord
 * @return {Boolean}
 */
function isAtRule(currentWord) {
    return currentWord.startsWith('@');
}
exports.isAtRule = isAtRule;
/**
 *
 * @param data
 * @param currentWord
 * @returns
 */
function isValue(data, currentWord) {
    const property = getPropertyName(currentWord);
    const value = findPropertySchema(data, property);
    if (property && value)
        return true;
    return false;
}
exports.isValue = isValue;
/**
 *
 * @param currentWord
 * @returns
 */
function getPropertyName(currentWord) {
    return currentWord.trim().replace(':', ' ').split(' ')[0];
}
exports.getPropertyName = getPropertyName;
/**
 *
 * @param data
 * @param property
 * @returns
 */
function findPropertySchema(data, property) {
    const item = data.provideProperties().find((item) => item.name === property);
    return item;
}
exports.findPropertySchema = findPropertySchema;
/**
 * Handler for variables
 * @param {Object} node
 * @param {String[]} text - text editor content splitted by lines
 * @return {SymbolInformation}
 */
function _variableSymbol(node, text, currentWord) {
    const name = node.name;
    const lineno = Number(node.val.lineno) - 1;
    const completionItem = { label: name };
    completionItem.detail = text[lineno].trim();
    completionItem.kind = vscode_languageserver_1.CompletionItemKind.Variable;
    return completionItem;
}
/**
 * Handler for function
 * @param {Object} node
 * @param {String[]} text - text editor content splitted by lines
 * @return {CompletionItem}
 */
function _functionSymbol(node, text) {
    const name = node.name;
    const completionItem = { label: name };
    completionItem.kind = vscode_languageserver_1.CompletionItemKind.Function;
    return completionItem;
}
/**
 * Handler for selectors
 * @param {Object} node
 * @param {String[]} text - text editor content splitted by lines
 * @param {String} currentWord
 * @return {CompletionItem}
 */
function _selectorSymbol(node, text, currentWord) {
    const firstSegment = node.segments[0];
    const name = firstSegment.string ? node.segments.map((s) => s.string).join('') : firstSegment.nodes.map((s) => s.name).join('');
    const completionItem = { label: name };
    completionItem.kind = vscode_languageserver_1.CompletionItemKind.Class;
    return completionItem;
}
/**
 * Handler for selector call symbols
 * @param {Object} node
 * @param {String[]} text - text editor content splitted by lines
 * @return {CompletionItem}
 */
function _selectorCallSymbol(node, text) {
    const lineno = Number(node.lineno) - 1;
    const name = (0, utils_1.prepareName)(text[lineno]);
    const completionItem = { label: name };
    completionItem.kind = vscode_languageserver_1.CompletionItemKind.Class;
    return completionItem;
}
/**
 * Returns completion items lists from document symbols
 * @param {String} text
 * @param {String} currentWord
 * @return {CompletionItem}
 */
function getAllSymbols(text, currentWord) {
    var _a;
    const ast = (0, parser_1.buildAst)(text);
    const splittedText = text.split('\n');
    const rawSymbols = (_a = (0, parser_1.flattenAndFilterAst)(ast)) === null || _a === void 0 ? void 0 : _a.filter((item) => item && ['media', 'keyframes', 'atrule', 'import', 'require', 'supports', 'literal'].indexOf(item.nodeName) === -1);
    const value = rawSymbols === null || rawSymbols === void 0 ? void 0 : rawSymbols.map((item) => {
        if ((0, parser_1.isVariableNode)(item)) {
            return _variableSymbol(item, splittedText, currentWord);
        }
        if ((0, parser_1.isFunctionNode)(item)) {
            return _functionSymbol(item, splittedText);
        }
        if ((0, parser_1.isSelectorNode)(item)) {
            return _selectorSymbol(item, splittedText, currentWord);
        }
        if ((0, parser_1.isSelectorCallNode)(item)) {
            return _selectorCallSymbol(item, splittedText);
        }
        return undefined;
    });
    if (value && value[0] !== undefined) {
        return value;
    }
    return undefined;
}
exports.getAllSymbols = getAllSymbols;
/**
 *
 * @param data
 * @param currentWord
 * @returns
 */
function getAtRules(data, currentWord) {
    if (!isAtRule(currentWord))
        return [];
    return data.provideAtDirectives().map((property) => {
        var _a;
        const completionItem = { label: property.name };
        completionItem.detail = (_a = property.description) === null || _a === void 0 ? void 0 : _a.toString();
        completionItem.kind = vscode_languageserver_1.CompletionItemKind.Keyword;
        return completionItem;
    });
}
exports.getAtRules = getAtRules;
/**
 * Returns property list for completion
 * @param {Object} cssSchema
 * @param {String} currentWord
 * @return {CompletionItem}
 */
function getProperties(data, currentWord, useSeparator) {
    if (isClassOrId(currentWord) || isAtRule(currentWord))
        return [];
    return data.provideProperties().map((property) => {
        const completionItem = { label: property.name };
        completionItem.insertText = property.name + (useSeparator ? ': ' : ' ');
        completionItem.documentation = (0, languageFacts_1.getPropertyDescription)(property).value;
        completionItem.kind = vscode_languageserver_1.CompletionItemKind.Property;
        return completionItem;
    });
}
exports.getProperties = getProperties;
/**
 * Returns values for current property for completion list
 * @param {Object} cssSchema
 * @param {String} currentWord
 * @return {CompletionItem}
 */
function getValues(data, currentWord) {
    const property = getPropertyName(currentWord);
    const values = findPropertySchema(data, property);
    if (!values || !values.values)
        return [];
    return values.values.map((property) => {
        var _a;
        const completionItem = { label: property.name };
        completionItem.detail = (_a = property.description) === null || _a === void 0 ? void 0 : _a.toString();
        completionItem.insertText = property.name.replace(')', '$0)');
        completionItem.kind = vscode_languageserver_1.CompletionItemKind.Value;
        return completionItem;
    });
}
exports.getValues = getValues;
class StylusServerCompletion {
    provideCompletionItems(document, position) {
        const start = vscode_languageserver_1.Position.create(position.line, 0);
        const data = (0, vscode_css_languageservice_1.getDefaultCSSDataProvider)();
        const range = vscode_languageserver_1.Range.create(start, position);
        const currentWord = document.getText(range).trim();
        const text = document.getText();
        const value = isValue(data, currentWord);
        // const config = workspace.getConfiguration('languageStylus');
        let symbols = [];
        let atRules = [];
        let properties = [];
        let values = [];
        let symbolsList = [];
        if (value) {
            values = getValues(data, currentWord);
            symbolsList = getAllSymbols(text, currentWord);
            if (symbolsList)
                symbols = (0, utils_1.compact)(symbolsList).filter((item) => item.kind === vscode_languageserver_1.CompletionItemKind.Variable);
        }
        else {
            atRules = getAtRules(data, currentWord);
            properties = getProperties(data, currentWord, true);
            // properties = getProperties(cssSchema, currentWord, config.get('useSeparator', true));
            symbolsList = getAllSymbols(text, currentWord);
            if (symbolsList)
                symbols = (0, utils_1.compact)(symbolsList);
        }
        let completions = [];
        completions = completions.concat(symbols, atRules, properties, values, css_built_in_1.default, built_in_1.default);
        // const completions = [].concat(symbols, atRules, properties, values, cssBuiltIn, config.get('useBuiltinFunctions', true) ? builtIn : []);
        if (currentWord.startsWith('.'))
            completions = completions.filter(person => person.label.startsWith(currentWord));
        return {
            isIncomplete: false,
            items: completions,
        };
    }
}
exports.default = StylusServerCompletion;
//# sourceMappingURL=serverCompletion.js.map