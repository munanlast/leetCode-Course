"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doComplete = void 0;
const ts = require("typescript");
const vscode_languageserver_protocol_1 = require("vscode-languageserver-protocol");
const ProjectFileFilter_1 = require("../languageserver/ProjectFileFilter");
const type_resolve_1 = require("../common/type-resolve");
function doComplete(position, document, options) {
    let token = (0, type_resolve_1.getTokenAtPosition)(options.sourceFile, document.offsetAt(position));
    let text = '';
    if (token.kind === ts.SyntaxKind.StringLiteral) {
        text = token.getText();
    }
    let fileInfoList = (0, ProjectFileFilter_1.getCompletionFilesSync)(options.workspaceFolder, {
        extensionFilters: ['.js'],
        prefixPath: text,
        timeout: 1000
    }, document.uri);
    let completionItems = [];
    fileInfoList === null || fileInfoList === void 0 ? void 0 : fileInfoList.files.forEach(file => {
        completionItems.push({
            label: file.relative,
            kind: file.isDir ? vscode_languageserver_protocol_1.CompletionItemKind.Folder : vscode_languageserver_protocol_1.CompletionItemKind.File
        });
    });
    return completionItems;
}
exports.doComplete = doComplete;
//# sourceMappingURL=jsURIHandler.js.map