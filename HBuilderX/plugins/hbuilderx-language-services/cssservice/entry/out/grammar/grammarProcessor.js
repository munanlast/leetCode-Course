"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGrammarCompletionData = void 0;
const vscode_languageserver_1 = require("vscode-languageserver");
const vscode_uri_1 = require("vscode-uri");
const entry_1 = require("../../../../htmlservice/entry");
const utils_1 = require("../../../../utils");
const util_1 = require("../utils/util");
// 语法库处理类
// 主要功能: 根据项目类型, 返回相应的语法库数据
// 判断项目类型, 获取相应的语法库数据, 生成对应的代码提示数据
async function getGrammarCompletionData(workspaceFolder, document, position, completionType, completionList) {
    // 传入补全项, 根据语法库数据, 对补全项进行删除和增加
    const isRightCompletion = (0, util_1.isRightCompletionType)(completionType, undefined, [util_1.NodeType.ClassSelector, util_1.NodeType.IdentifierSelector, util_1.NodeType.ElementNameSelector], util_1.NodeType.Selector);
    if (!isRightCompletion) {
        return completionList;
    }
    let completionItems = completionList.items;
    // 删除原本的标签项
    for (var i = completionItems.length - 1; i >= 0; --i) {
        if (util_1.html5Tags.includes(completionItems[i].label)) {
            completionItems.splice(i, 1);
        }
    }
    // 删除重复的标签项
    let addDates = (0, entry_1.getHtmlTags)(workspaceFolder);
    for (var i = completionItems.length - 1; i >= 0; --i) {
        if (addDates.includes(completionItems[i].label)) {
            completionItems.splice(i, 1);
        }
    }
    // 增加新的项目
    let offset = document.offsetAt(position);
    let currentWord = (0, util_1.getCurrentWord)(document, offset);
    let start = vscode_languageserver_1.Position.create(position.line, position.character - currentWord.length);
    for (let addData of addDates) {
        if (addData.length > 0) {
            completionItems.push({
                label: addData,
                textEdit: vscode_languageserver_1.TextEdit.replace(vscode_languageserver_1.Range.create(start, position), addData),
                kind: vscode_languageserver_1.CompletionItemKind.Keyword,
                data: {
                    hxKind: utils_1.HxIconKind.ELEMENT,
                },
            });
        }
    }
    if (!workspaceFolder) {
        console.error('getGrammarCompletionData.workspaceFolder is undefined');
        return completionList;
    }
    // 判断项目类型, 如果是特殊的项目, 增加page项
    let filePath = vscode_uri_1.URI.parse(document.uri).fsPath;
    let workspaceFolderPath = vscode_uri_1.URI.parse(workspaceFolder.uri).fsPath;
    if ((0, utils_1.getProjectType)(workspaceFolderPath) === utils_1.ProjectType.PT_UniApp_Vue &&
        (filePath.endsWith('.vue') || filePath.endsWith('.css') || filePath.endsWith('.scss') || filePath.endsWith('.less') || filePath.endsWith('.styl'))) {
        completionItems.push({
            label: 'page',
            textEdit: vscode_languageserver_1.TextEdit.replace(vscode_languageserver_1.Range.create(start, position), 'page'),
            documentation: { kind: 'markdown', value: 'Equivalent to the body node' },
            kind: vscode_languageserver_1.CompletionItemKind.Keyword,
            data: {
                hxKind: utils_1.HxIconKind.ELEMENT,
            },
        });
    }
    return completionList;
}
exports.getGrammarCompletionData = getGrammarCompletionData;
//# sourceMappingURL=grammarProcessor.js.map