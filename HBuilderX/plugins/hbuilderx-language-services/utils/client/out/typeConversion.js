"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeConversion = void 0;
// 此文件用於轉換client和server兩端的數據結構
const vscode_1 = require("vscode");
const vscode_languageserver_1 = require("vscode-languageserver");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
class ClientToServer {
    CompletionItemKindConversion(completionItemKind) {
        if (completionItemKind === vscode_1.CompletionItemKind.User || completionItemKind === vscode_1.CompletionItemKind.Issue) {
            return vscode_languageserver_1.CompletionItemKind[1];
        }
        return vscode_languageserver_1.CompletionItemKind[completionItemKind + 1];
    }
    CompletionItemConversion(completionItem) {
        return {
            label: completionItem.label,
            kind: this.CompletionItemKindConversion(completionItem.kind),
            // tags: completionItem.tags,
            detail: completionItem.detail,
            documentation: completionItem.documentation.toString(),
            // deprecated: completionItem,
            preselect: completionItem.preselect,
            sortText: completionItem.sortText,
            filterText: completionItem.filterText,
            insertText: completionItem.insertText.toString(),
            // insertTextFormat: completionItem;
            textEdit: completionItem.textEdit,
            additionalTextEdits: completionItem.additionalTextEdits,
            commitCharacters: completionItem.commitCharacters,
            command: completionItem.command,
            // data: completionItem.da;
        };
    }
    CompletionListConversion(completionItemKind) {
        let completionItems = [];
        for (const iterator of completionItemKind.items) {
            completionItems.push(this.CompletionItemConversion(iterator));
        }
        return {
            isIncomplete: completionItemKind.isIncomplete,
            items: completionItems
        };
    }
    WorkspaceFolderConversion(workspaceFolder) {
        return {
            uri: workspaceFolder.uri.toString(),
            name: workspaceFolder.name,
        };
    }
    TextDocumentConversion(textdocument) {
        let serverTextDocument = vscode_languageserver_textdocument_1.TextDocument.create(textdocument.uri.toString(), textdocument.languageId, textdocument.version, textdocument.getText());
        return serverTextDocument;
    }
    LocationConversion(location) {
        let serverLocation = vscode_languageserver_1.Location.create(location.uri.toString(), location.range);
        return serverLocation;
    }
    PositionConversion(position) {
        return vscode_languageserver_1.Position.create(position.line, position.character);
    }
}
class ServerToClient {
    // public WorkspaceFolderConversion(workspaceFolder:ServerWorkspaceFolder): WorkspaceFolder{
    //     return {}
    // }
    // public TextDocumentConversion(textdocument: ServerTextDocument): TextDocument{
    //     return {}
    // }
    LocationConversion(location) {
        return {
            uri: vscode_1.Uri.file(location.uri),
            range: new vscode_1.Range(new vscode_1.Position(location.range.start.line, location.range.start.character), new vscode_1.Position(location.range.end.line, location.range.end.character)),
        };
    }
    PositionConversion(position) {
        return new vscode_1.Position(position.line, position.character);
    }
}
class TypeConversion {
    getClientToServer() {
        return new ClientToServer();
    }
    getServerToClient() {
        return new ServerToClient();
    }
}
exports.TypeConversion = TypeConversion;
//# sourceMappingURL=typeConversion.js.map