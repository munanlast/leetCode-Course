"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValues = exports.getProperties = exports.getAtRules = exports.getAllSymbols = exports.findPropertySchema = exports.getPropertyName = exports.isValue = exports.isAtRule = exports.isClassOrId = void 0;
const vscode_1 = require("vscode");
const parser_1 = require("./parser");
const utils_1 = require("./utils");
const built_in_1 = require("./built-in");
const css_built_in_1 = require("./css-built-in");
const cssSchema = require("./css-schema");
const languageFacts_1 = require("./languageFacts");
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
 * Naive check whether currentWord is value for given property
 * @param {Object} cssSchema
 * @param {String} currentWord
 * @return {Boolean}
 */
function isValue(cssSchema, currentWord) {
    const property = getPropertyName(currentWord);
    return property && Boolean(findPropertySchema(cssSchema, property));
}
exports.isValue = isValue;
/**
 * Formats property name
 * @param {String} currentWord
 * @return {String}
 */
function getPropertyName(currentWord) {
    return currentWord.trim().replace(':', ' ').split(' ')[0];
}
exports.getPropertyName = getPropertyName;
/**
 * Search for property in cssSchema
 * @param {Object} cssSchema
 * @param {String} property
 * @return {Object}
 */
function findPropertySchema(cssSchema, property) {
    return cssSchema.cssData.properties.find((item) => item.name === property);
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
    const completionItem = new vscode_1.CompletionItem(name);
    completionItem.detail = text[lineno].trim();
    completionItem.kind = vscode_1.CompletionItemKind.Variable;
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
    const completionItem = new vscode_1.CompletionItem(name);
    completionItem.kind = vscode_1.CompletionItemKind.Function;
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
    const completionItem = new vscode_1.CompletionItem(name);
    completionItem.kind = vscode_1.CompletionItemKind.Class;
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
    const completionItem = new vscode_1.CompletionItem(name);
    completionItem.kind = vscode_1.CompletionItemKind.Class;
    return completionItem;
}
/**
 * Returns completion items lists from document symbols
 * @param {String} text
 * @param {String} currentWord
 * @return {CompletionItem}
 */
function getAllSymbols(text, currentWord) {
    const ast = (0, parser_1.buildAst)(text);
    const splittedText = text.split('\n');
    const rawSymbols = (0, parser_1.flattenAndFilterAst)(ast).filter((item) => item && ['media', 'keyframes', 'atrule', 'import', 'require', 'supports', 'literal'].indexOf(item.nodeName) === -1);
    return rawSymbols.map((item) => {
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
    });
}
exports.getAllSymbols = getAllSymbols;
/**
 * Returns at rules list for completion
 * @param {Object} cssSchema
 * @param {String} currentWord
 * @return {CompletionItem}
 */
function getAtRules(cssSchema, currentWord) {
    if (!isAtRule(currentWord))
        return [];
    return cssSchema.cssData.atdirectives.map((property) => {
        const completionItem = new vscode_1.CompletionItem(property.name);
        completionItem.detail = property.desc;
        completionItem.kind = vscode_1.CompletionItemKind.Keyword;
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
function getProperties(cssSchema, currentWord, useSeparator) {
    if (isClassOrId(currentWord) || isAtRule(currentWord))
        return [];
    return cssSchema.cssData.properties.map((property) => {
        const completionItem = new vscode_1.CompletionItem(property.name);
        completionItem.insertText = property.name + (useSeparator ? ': ' : ' ');
        completionItem.documentation = (0, languageFacts_1.getPropertyDescription)(property);
        completionItem.kind = vscode_1.CompletionItemKind.Property;
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
function getValues(cssSchema, currentWord) {
    const property = getPropertyName(currentWord);
    const values = findPropertySchema(cssSchema, property).values;
    if (!values)
        return [];
    return values.map((property) => {
        const completionItem = new vscode_1.CompletionItem(property.name);
        completionItem.detail = property.desc;
        completionItem.insertText = new vscode_1.SnippetString(property.name.replace(')', '$0)'));
        completionItem.kind = vscode_1.CompletionItemKind.Value;
        return completionItem;
    });
}
exports.getValues = getValues;
class StylusCompletion {
    provideCompletionItems(document, position, token) {
        const start = new vscode_1.Position(position.line, 0);
        const range = new vscode_1.Range(start, position);
        const currentWord = document.getText(range).trim();
        const text = document.getText();
        const value = isValue(cssSchema, currentWord);
        const config = vscode_1.workspace.getConfiguration('languageStylus');
        let symbols = [], atRules = [], properties = [], values = [];
        if (value) {
            values = getValues(cssSchema, currentWord);
            symbols = (0, utils_1.compact)(getAllSymbols(text, currentWord)).filter((item) => item.kind === vscode_1.CompletionItemKind.Variable);
        }
        else {
            atRules = getAtRules(cssSchema, currentWord);
            properties = getProperties(cssSchema, currentWord, config.get('useSeparator', true));
            symbols = (0, utils_1.compact)(getAllSymbols(text, currentWord));
        }
        let completions = [].concat(symbols, atRules, properties, values, css_built_in_1.default, config.get('useBuiltinFunctions', true) ? built_in_1.default : []);
        // 新增, class开头的时候, 不提示
        if (currentWord.startsWith('.'))
            completions = completions.filter(person => person.label.startsWith(currentWord));
        return {
            isIncomplete: false,
            items: completions
        };
    }
}
exports.default = StylusCompletion;
//# sourceMappingURL=completion-item-provider.js.map