"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScssCompletionProcessor = void 0;
const vscode_languageserver_1 = require("vscode-languageserver");
const entry_1 = require("../../../../htmlservice/entry");
const utils_1 = require("../../../../utils");
const util_1 = require("../utils/util");
const baseCompletionProcessor_1 = require("./baseCompletionProcessor");
const { SCSSScanner } = require('vscode-css-languageservice/lib/umd/parser/scssScanner');
class ScssCompletionProcessor extends baseCompletionProcessor_1.BaseCompletionProcessor {
    constructor() {
        super(...arguments);
        this.baseCompletionProcessor = new baseCompletionProcessor_1.BaseCompletionProcessor();
    }
    // 支持嵌套写法
    async getTagCompletionData(workspaceFolder, document, position, completionType, completionList) {
        const isRightType = (0, util_1.isRightCompletionType)(completionType, [util_1.NodeType.Media, util_1.NodeType.MediaQuery], undefined, util_1.NodeType.Media);
        if (!isRightType) {
            return completionList;
        }
        const offset = document.offsetAt(position);
        const currentWord = (0, util_1.getCurrentWord)(document, offset);
        // let selectWord = getCurrentWord(document, currentAstNode.parent.offset);
        // 从html获取数据, 生成补全数据
        let tagList = (0, entry_1.getHtmlTags)(workspaceFolder);
        let start = vscode_languageserver_1.Position.create(position.line, position.character - currentWord.length);
        for (const iterator of tagList) {
            completionList.items.push({
                label: iterator,
                textEdit: vscode_languageserver_1.TextEdit.replace(vscode_languageserver_1.Range.create(start, position), iterator),
                kind: vscode_languageserver_1.CompletionItemKind.Keyword,
                data: {
                    hxKind: utils_1.HxIconKind.ELEMENT,
                },
            });
        }
        return completionList;
    }
    async getExtraCompletionData(workspaceFolder, document, position, completionType, completionList) {
        completionList = await this.baseCompletionProcessor.getExtraCompletionData(workspaceFolder, document, position, completionType, completionList);
        completionList = await this.getTagCompletionData(workspaceFolder, document, position, completionType, completionList);
        return completionList;
    }
}
exports.ScssCompletionProcessor = ScssCompletionProcessor;
//# sourceMappingURL=scssCompletionProcessor.js.map