"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchActivateTextEditor = void 0;
const vscode_1 = require("vscode");
const request_1 = require("./request");
const hx = require('hbuilderx');
function watchActivateTextEditor(client) {
    const activeEditorListener = vscode_1.window.onDidChangeActiveTextEditor(async (e) => {
        let uri = e === null || e === void 0 ? void 0 : e.document.uri;
        let uriStr = uri ? uri.toString() : '';
        client.sendNotification(request_1.EditorActivatedNofity.type, uriStr);
    });
    hx.window.getActiveTextEditor().then((editor) => {
        let uri = editor === null || editor === void 0 ? void 0 : editor.document.uri;
        let uriStr = uri ? uri.toString() : '';
        client.sendNotification(request_1.EditorActivatedNofity.type, uriStr);
    });
    return activeEditorListener;
}
exports.watchActivateTextEditor = watchActivateTextEditor;
//# sourceMappingURL=editorWatch.js.map