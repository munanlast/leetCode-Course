"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const vscode = require("vscode");
const vscode_json_languageservice_1 = require("vscode-json-languageservice");
const vscode_uri_1 = require("vscode-uri");
const packageSchema_1 = require("../schemas/packageSchema");
const pagesSchema_1 = require("../schemas/pagesSchema");
const schemaSchema_1 = require("../schemas/schemaSchema");
const arrays_1 = require("../utils/arrays");
const schemaMgr = require("./schemaManager");
class JsonHoverProvider {
    async provideHover(document, position, token) {
        let workspaceFolder = await vscode.workspace.getWorkspaceFolder(document.uri);
        // 注册schema
        schemaMgr.registerSchema('packageSchema', packageSchema_1.PackageSchema, ['package.json']);
        schemaMgr.registerSchema('pagesSchema', pagesSchema_1.PagesSchema, ['pages.json']);
        schemaMgr.registerSchema('schemaJsonSchema', schemaSchema_1.SchemaJsonSchema, ['*.schema.json']);
        const jsonLanguageService = (0, vscode_json_languageservice_1.getLanguageService)({
            schemaRequestService: schemaMgr.findSchema,
        });
        schemaMgr.setLanguageConfig(jsonLanguageService, vscode_uri_1.URI.parse(document.uri.toString()).fsPath, workspaceFolder);
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
    const patterns = ['**/package.json', '**/database/*.schema.json', '**/pages.json', '**/manifest.json', '**/settings.json'];
    const languages = ['json', 'jsonc', 'json_tm'];
    const selector = (0, arrays_1.flatten)(languages.map((language) => patterns.map((pattern) => ({ language, pattern }))));
    return vscode.languages.registerHoverProvider(selector, new JsonHoverProvider());
}
exports.register = register;
//# sourceMappingURL=jsonHover.js.map