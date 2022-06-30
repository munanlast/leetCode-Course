"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const builtIn = [
    {
        name: 'var(--css-variables)',
        desc: 'Evaluates the value of a custom variable.',
        insertText: 'var()',
    },
    {
        name: 'calc(expression)',
        desc: 'Evaluates an mathematical expression. The following operators can be used: + - * /.',
        insertText: 'calc()',
    },
];
exports.default = builtIn.map((item) => {
    const completionItem = { label: item.name };
    completionItem.detail = item.desc;
    completionItem.insertText = `${item.insertText.replace(')', '$0)')}`;
    completionItem.kind = vscode_languageserver_1.CompletionItemKind.Function;
    return completionItem;
});
//# sourceMappingURL=css-built-in.js.map