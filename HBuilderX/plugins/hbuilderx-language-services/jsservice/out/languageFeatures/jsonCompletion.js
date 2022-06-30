"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const vscode = require("vscode");
const arrays_1 = require("../utils/arrays");
const schemaSchema_1 = require("../schemas/schemaSchema");
const pagesSchema_1 = require("../schemas/pagesSchema");
const packageSchema_1 = require("../schemas/packageSchema");
const vscode_uri_1 = require("vscode-uri");
const utils_1 = require("../../../utils");
const vscode_json_languageservice_1 = require("vscode-json-languageservice");
function fixString(label) {
    let isString = label.startsWith(`"`) && label.endsWith(`"`);
    return isString ? label.substring(1, label.length - 1) : label;
}
function generatorSnippetString(text) {
    if (text === null || text === void 0 ? void 0 : text.includes('{$1},')) {
        text = text.replace('{$1},', `{\n\t$1\n},`);
    }
    if (text === null || text === void 0 ? void 0 : text.includes('{$1}')) {
        text = text.replace('{$1}', `{\n\t$0\n}`);
    }
    if (text === null || text === void 0 ? void 0 : text.includes('[$1],')) {
        text = text.replace('[$1],', `[\n\t$1\n],`);
    }
    if (text === null || text === void 0 ? void 0 : text.includes('[$1]')) {
        text = text.replace('[$1]', `[\n\t$0\n],`);
    }
    for (let type of utils_1.specialTypes) {
        if (text === null || text === void 0 ? void 0 : text.includes(type)) {
            text = text.replace(type, '');
            return text;
        }
    }
    return text || '';
}
class PackageJsonProvider {
    async provideCompletionItems(document, position, token) {
        var _a, _b, _c;
        let completions = [];
        let fileName = document.uri.toString();
        let isPackageJson = fileName.endsWith('package.json');
        let textDocument = vscode_json_languageservice_1.TextDocument.create(document.uri.toString(), 'json', 1, document.getText());
        const jsonLanguageService = (0, vscode_json_languageservice_1.getLanguageService)({
            schemaRequestService: (uri) => {
                uri = vscode_uri_1.URI.parse(uri).fsPath;
                if (uri === '/' || uri == '\\') {
                    return Promise.resolve(JSON.stringify(packageSchema_1.nodePackageSchema));
                }
                else if (uri === '/schema' || uri == '\\schema') {
                    return Promise.resolve(JSON.stringify(schemaSchema_1.schemaJson));
                }
                else if (uri === '/pages' || uri == '\\pages') {
                    return Promise.resolve(JSON.stringify(pagesSchema_1.schemaJson));
                }
                return Promise.reject(`Unabled to load schema at ${uri}`);
            }
        });
        if (isPackageJson) {
            jsonLanguageService.configure({ allowComments: true, schemas: [{ fileMatch: ['package.json'], uri: '' }] });
        }
        else if (fileName.endsWith('.schema.json')) {
            jsonLanguageService.configure({ allowComments: true, schemas: [{ fileMatch: ['*.schema.json'], uri: 'schema' }] });
        }
        else if (fileName.endsWith('pages.json')) {
            jsonLanguageService.configure({ allowComments: true, schemas: [{ fileMatch: ['pages.json'], uri: 'pages' }] });
        }
        let workspaceFolder = await vscode.workspace.getWorkspaceFolder(document.uri);
        const jsonDocument = jsonLanguageService.parseJSONDocument(textDocument);
        let leftChar = textDocument.getText({ start: { line: position.line, character: position.character - 1 }, end: position });
        let rightChar = textDocument.getText({ start: position, end: { line: position.line, character: position.character + 1 } });
        let isBetweenQuotationMarks = leftChar === '"' || rightChar === '"';
        const completionResult = await jsonLanguageService.doComplete(textDocument, position, jsonDocument);
        if (((_a = completionResult === null || completionResult === void 0 ? void 0 : completionResult.items) === null || _a === void 0 ? void 0 : _a.length) && ((_b = completionResult === null || completionResult === void 0 ? void 0 : completionResult.items) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            let label = (_c = completionResult === null || completionResult === void 0 ? void 0 : completionResult.items[0]) === null || _c === void 0 ? void 0 : _c.label;
            label = fixString(label);
            if (utils_1.specialTypes.has(label)) {
                let options = {
                    jsonDocument: jsonDocument,
                    workspaceFolder: workspaceFolder
                };
                if (label === 'HBuilderX.PageURIString') {
                    options.extends = ['.vue', '.nvue'];
                }
                else if (label === 'HBuilderX.NPageURIString') {
                    options.extends = ['.nvue'];
                }
                else if (label === 'HBuilderX.ImageURIString') {
                    label = 'HBuilderX.PageURIString';
                    options.extends = ['.jpg', '.png', '.svg', '.jpeg'];
                }
                let currentToken = jsonDocument.getNodeFromOffset(textDocument.offsetAt(position));
                let tokenStart = currentToken === null || currentToken === void 0 ? void 0 : currentToken.offset;
                let tokenPosition = null;
                if (!!tokenStart) {
                    tokenPosition = textDocument.positionAt(tokenStart);
                    let items = (0, utils_1.doComplete)([label], position, textDocument, options);
                    for (let item of items) {
                        completions.push({
                            kind: item.kind,
                            label: item.label,
                            range: new vscode.Range(new vscode.Position(tokenPosition.line, tokenPosition.character + 1), new vscode.Position(tokenPosition.line, (currentToken === null || currentToken === void 0 ? void 0 : currentToken.length) ? tokenPosition.character + currentToken.length - 1 : tokenPosition.character - 1))
                        });
                    }
                }
            }
            else {
                completionResult === null || completionResult === void 0 ? void 0 : completionResult.items.forEach((item) => {
                    var _a, _b, _c, _d, _e, _f;
                    let isSnippet = (((_a = item.textEdit) === null || _a === void 0 ? void 0 : _a.newText) && ((_b = item.textEdit) === null || _b === void 0 ? void 0 : _b.newText.search(`${1}`)) != -1);
                    completions.push({
                        kind: item.kind,
                        label: item.label,
                        // @ts-ignore
                        documentation: ((_c = item.documentation) === null || _c === void 0 ? void 0 : _c.kind) ? item.documentation.value : item.documentation,
                        // insertText: { _tabstop: 1, // @ts-ignore value: item.textEdit?.newText},
                        insertText: isSnippet ? new vscode.SnippetString(generatorSnippetString((_d = item.textEdit) === null || _d === void 0 ? void 0 : _d.newText)) : (_e = item.textEdit) === null || _e === void 0 ? void 0 : _e.newText,
                        // @ts-ignore
                        range: (_f = item.textEdit) === null || _f === void 0 ? void 0 : _f.range,
                        filterText: isBetweenQuotationMarks ? `"${item.label}"` : item.label,
                        command: isSnippet ? {
                            title: 'Suggest',
                            command: 'editor.action.triggerSuggest'
                        } : undefined
                    });
                });
            }
        }
        return {
            items: completions,
            isIncomplete: false
        };
    }
    async resolveCompletionItem(item, token) {
        return item;
    }
}
function register() {
    const patterns = [
        '**/package.json',
        '**/database/*.schema.json',
        '**/pages.json'
    ];
    const languages = ['json', 'jsonc', 'json_tm'];
    const selector = (0, arrays_1.flatten)(languages.map(language => patterns.map((pattern) => ({ language, pattern }))));
    return vscode.languages.registerCompletionItemProvider(selector, new PackageJsonProvider());
}
exports.register = register;
//# sourceMappingURL=jsonCompletion.js.map