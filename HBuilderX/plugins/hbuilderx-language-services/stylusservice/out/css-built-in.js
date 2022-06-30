"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const builtIn = [
    {
        "name": "var(--css-variables)",
        "desc": "Evaluates the value of a custom variable.",
        "insertText": "var()"
    },
    {
        "name": "calc(expression)",
        "desc": "Evaluates an mathematical expression. The following operators can be used: + - * /.",
        "insertText": "calc()"
    }
];
exports.default = builtIn.map((item) => {
    const completionItem = new vscode_1.CompletionItem(item.name);
    completionItem.detail = item.desc;
    completionItem.insertText = new vscode_1.SnippetString(`${item.insertText.replace(")", "$0)")}`);
    completionItem.kind = vscode_1.CompletionItemKind.Function;
    return completionItem;
});
//# sourceMappingURL=css-built-in.js.map