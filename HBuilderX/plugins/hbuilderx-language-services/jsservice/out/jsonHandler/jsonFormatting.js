"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const vscode = require("vscode");
const vscode_json_languageservice_1 = require("vscode-json-languageservice");
const arrays_1 = require("../utils/arrays");
class FormatProvider {
    provideDocumentRangeFormattingEdits(document, range, options, token) {
        let vsFormatted = [];
        let lsFormatted = [];
        let textDocument = vscode_json_languageservice_1.TextDocument.create(document.uri.toString(), 'json', 1, document.getText());
        const jsonLanguageService = (0, vscode_json_languageservice_1.getLanguageService)({});
        lsFormatted = jsonLanguageService.format(textDocument, range, options);
        if (lsFormatted.length <= 0)
            return undefined;
        for (const iterator of lsFormatted) {
            const vsRange = new vscode.Range(new vscode.Position(iterator.range.start.line, iterator.range.start.character), new vscode.Position(iterator.range.end.line, iterator.range.end.character));
            vsFormatted.push({
                range: vsRange,
                newText: iterator.newText,
            });
        }
        return vsFormatted;
        // throw new Error('Method not implemented.');
    }
}
function register() {
    const patterns = ['**/*.{json,jsonc}'];
    const languages = ['json', 'jsonc', 'json_tm'];
    const selector = (0, arrays_1.flatten)(languages.map((language) => patterns.map((pattern) => ({ language, pattern }))));
    return vscode.languages.registerDocumentRangeFormattingEditProvider(selector, new FormatProvider());
}
exports.register = register;
//# sourceMappingURL=jsonFormatting.js.map