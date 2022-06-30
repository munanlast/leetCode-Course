"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const vscode = require("vscode");
const arrays_1 = require("../utils/arrays");
const vscode_uri_1 = require("vscode-uri");
const vscode_json_languageservice_1 = require("vscode-json-languageservice");
const schemaSchema_1 = require("../schemas/schemaSchema");
const pagesSchema_1 = require("../schemas/pagesSchema");
const packageSchema_1 = require("../schemas/packageSchema");
class JsonHoverProvider {
    async provideHover(document, position, token) {
        let fileName = document.uri.toString();
        const jsonLanguageService = (0, vscode_json_languageservice_1.getLanguageService)({
            schemaRequestService: (uri) => {
                uri = vscode_uri_1.URI.parse(uri).fsPath;
                if (uri === '/') {
                    return Promise.resolve(JSON.stringify(packageSchema_1.nodePackageSchema));
                }
                else if (uri === '/schema') {
                    return Promise.resolve(JSON.stringify(schemaSchema_1.schemaJson));
                }
                else if (uri === '/pages') {
                    return Promise.resolve(JSON.stringify(pagesSchema_1.schemaJson));
                }
                return Promise.reject(`Unabled to load schema at ${uri}`);
            }
        });
        if (fileName.endsWith('package.json')) {
            jsonLanguageService.configure({ allowComments: true, schemas: [{ fileMatch: ['package.json'], uri: '' }] });
        }
        else if (fileName.endsWith('.schema.json')) {
            jsonLanguageService.configure({ allowComments: true, schemas: [{ fileMatch: ['*.schema.json'], uri: 'schema' }] });
        }
        else if (fileName.endsWith('pages.json')) {
            jsonLanguageService.configure({ allowComments: true, schemas: [{ fileMatch: ['pages.json'], uri: 'pages' }] });
        }
        let textDocument = vscode_json_languageservice_1.TextDocument.create(document.uri.toString(), document.languageId, 1, document.getText());
        let jsonDocument = jsonLanguageService.parseJSONDocument(textDocument);
        let result = await jsonLanguageService.doHover(textDocument, position, jsonDocument);
        if (!result)
            return null;
        let hoverResult = new vscode.Hover(new vscode.MarkdownString(result === null || result === void 0 ? void 0 : result.contents.toString()));
        if (result.range) {
            hoverResult.range = new vscode.Range(new vscode.Position(result.range.start.line, result.range.start.character), new vscode.Position(result.range.end.line, result.range.end.character));
        }
        return hoverResult;
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
    return vscode.languages.registerHoverProvider(selector, new JsonHoverProvider());
}
exports.register = register;
//# sourceMappingURL=jsonHover.js.map