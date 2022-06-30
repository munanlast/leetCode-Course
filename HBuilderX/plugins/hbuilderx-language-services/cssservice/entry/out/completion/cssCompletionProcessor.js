"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CssCompletionProcessor = void 0;
const vscode_languageserver_1 = require("vscode-languageserver");
const vscode_uri_1 = require("vscode-uri");
const utils_1 = require("../../../../utils");
const util_1 = require("../utils/util");
const baseCompletionProcessor_1 = require("./baseCompletionProcessor");
// 此类为CSS解析器
// 获取当前css文件的部分信息, 用于后续索引
class CssCompletionProcessor extends baseCompletionProcessor_1.BaseCompletionProcessor {
    constructor() {
        super(...arguments);
        this.baseCompletionProcessor = new baseCompletionProcessor_1.BaseCompletionProcessor();
    }
    // 支持在vue中, 特殊的伪类
    async getScopedCompletionData(workspaceFolder, document, position, completionType, completionList) {
        completionType = this.baseCompletionProcessor.getCompletionTypeFromScanner(document, position);
        const isRightType = (0, util_1.isRightCompletionType)(completionType, [util_1.NodeType.PseudoSelector], [util_1.NodeType.PseudoSelector], util_1.NodeType.PseudoSelector);
        if (!isRightType || !workspaceFolder)
            return completionList;
        const offset = document.offsetAt(position);
        const currentWord = (0, util_1.getCurrentWord)(document, offset);
        // let selectWord = getCurrentWord(document, currentAstNode.parent.offset);
        // let tagList = getHtmlTags(workspaceFolder);
        const lineOffset = position.character;
        const wordRight = completionType && completionType.context && completionType.context.length > 0 ? completionType.context.length : 0;
        let start = vscode_languageserver_1.Position.create(position.line, lineOffset - currentWord.length - wordRight);
        let filePath = vscode_uri_1.URI.parse(document.uri).fsPath;
        if (filePath.endsWith('.vue')) {
            for (const iterator of utils_1.vueStyleScoped) {
                completionList.items.push({
                    label: iterator,
                    textEdit: vscode_languageserver_1.TextEdit.replace(vscode_languageserver_1.Range.create(start, position), iterator),
                    kind: vscode_languageserver_1.CompletionItemKind.Function,
                    data: {
                        hxKind: utils_1.HxIconKind.CLASS,
                    },
                });
            }
        }
        return completionList;
    }
    async getExtraCompletionData(workspaceFolder, document, position, completionType, completionList) {
        completionList = await this.baseCompletionProcessor.getExtraCompletionData(workspaceFolder, document, position, completionType, completionList);
        completionList = await this.getScopedCompletionData(workspaceFolder, document, position, completionType, completionList);
        return completionList;
    }
}
exports.CssCompletionProcessor = CssCompletionProcessor;
//# sourceMappingURL=cssCompletionProcessor.js.map