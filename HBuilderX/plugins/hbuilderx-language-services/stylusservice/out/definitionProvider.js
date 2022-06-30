"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StylusDefinitionProvider = void 0;
const vscode_1 = require("vscode");
const parser_1 = require("./parser");
const utils_1 = require("./utils");
class StylusDefinitionProvider {
    // 由于数据结构不一样, 此处将部分已经写过的功能抄过来
    getCurrentWorkspaceFolder(workspaceFolders, document) {
        let workSpaceList = [];
        for (const workspaceFolder of workspaceFolders) {
            if (document.uri.toString().startsWith(workspaceFolder.uri.toString())) {
                workSpaceList.push(workspaceFolder);
            }
        }
        workSpaceList.sort((a, b) => {
            return a.uri.toString().length - b.uri.toString().length;
        });
        return workSpaceList;
    }
    isVariableReferenceNode(node, position) {
        return (node.nodeName === 'property' &&
            node.expr &&
            node.expr.nodeName === 'expression' &&
            node.expr.nodes[0].nodeName === 'ident' &&
            node.expr.column <= position.character);
    }
    isFunctionReferenceNode(node, position) {
        return ((node.nodeName === 'call' && node.name !== 'selector') ||
            (node.nodeName === 'property' &&
                node.expr &&
                node.expr.nodeName === 'expression' &&
                node.expr.nodes[0].nodeName === 'call' &&
                node.expr.column <= position.character));
    }
    getCurrentWordAtPosition(rawSymbols, position) {
        let currentWord = { word: '', type: '' };
        for (const iterator of rawSymbols) {
            if (iterator.lineno !== position.line + 1) {
                continue;
            }
            if (iterator.column > position.character) {
                continue;
            }
            // 此处需要对所在文本进行判断
            // 对选择器进行处理
            if ((0, parser_1.isSelectorNode)(iterator)) {
                let word = '';
                for (const select of iterator.segments) {
                    word += select.string;
                }
                currentWord.type = 'selector';
                currentWord.word = word;
            }
            // 对变量进行处理
            if (this.isVariableReferenceNode(iterator, position)) {
                currentWord.type = 'variable';
                currentWord.word = iterator.expr.nodes[0].name;
            }
            // 对函数进行处理
            if (this.isFunctionReferenceNode(iterator, position)) {
                currentWord.type = 'function';
                currentWord.word = iterator.name;
                if (!currentWord.word) {
                    currentWord.word = iterator.expr.nodes[0].name;
                }
            }
        }
        return currentWord;
    }
    // // 调用html接口, 获取html中的全部ID
    // public async getDefinitionDataFromHTML(workspaceFolder: WorkspaceFolder, document: TextDocument,position: Position, currentText: string): Promise<Location[] | null> {
    //     let definitionDataList: Location[] = [];
    //     let symbol: SearchedSymbol = { text: currentText.substring(1), type: SymbolType.ElementId };
    //     let htmlService = getLanguageServerExt();
    //     if (!htmlService) {
    //         await Promise.resolve();
    //         return null;
    //     }
    //     let typeConversion = new TypeConversion();
    //     let serverTextDocument = typeConversion.getClientToServer().TextDocumentConversion(document);
    //     let serverWorkspaceFolder = typeConversion.getClientToServer().WorkspaceFolderConversion (workspaceFolder);
    //     let extDefinitionData = await htmlService.findSymbol(
    //         serverTextDocument,
    //         symbol,
    //         serverWorkspaceFolder
    //     );
    //     if (!extDefinitionData) {
    //         await Promise.resolve();
    //         const text = document.getText();
    //         const ast = buildAst(text);
    //         const rawSymbols: StylusNode[] = compact(flattenAndFilterAst(ast));
    //         let currentWord: CurrentWord = this.getCurrentWordAtPosition(rawSymbols, position);
    //         return await this.getDefinitionDataFromSelf(document, rawSymbols, currentWord);
    //     }
    //     let lspLocations: LSPLocation[] = [];
    //     lspLocations.push(...(extDefinitionData instanceof Array ? extDefinitionData : [extDefinitionData]));
    //     for (const iterator of lspLocations) {
    //         definitionDataList.push(typeConversion.getServerToClient().LocationConversion(iterator));
    //     }
    //     return definitionDataList;
    // }
    // 遍历语法树, 自己获取转到定义信息
    getDefinitionDataFromSelf(document, rawSymbols, currentText) {
        return __awaiter(this, void 0, void 0, function* () {
            let definitionDataList = [];
            for (const iterator of rawSymbols) {
                if (iterator.nodeName === 'ident' && currentText.type === 'function') {
                    if (iterator.name === currentText.word) {
                        let start = new vscode_1.Position(iterator.val.lineno - 1, iterator.val.column - 1);
                        let end = new vscode_1.Position(iterator.val.lineno - 1, currentText.word.length);
                        definitionDataList.push({
                            uri: document.uri,
                            range: new vscode_1.Range(start, end),
                        });
                    }
                }
                else if (iterator.nodeName === 'ident' && currentText.type === 'variable') {
                    if (iterator.name === currentText.word) {
                        let start = new vscode_1.Position(iterator.val.lineno - 1, iterator.column - 1);
                        let end = new vscode_1.Position(iterator.val.lineno - 1, currentText.word.length);
                        definitionDataList.push({
                            uri: document.uri,
                            range: new vscode_1.Range(start, end),
                        });
                    }
                }
                else if (iterator.nodeName === 'selector' && currentText.type === 'selector') {
                    let word = '';
                    for (const select of iterator.segments) {
                        word += select.string;
                    }
                    if (word === currentText.word) {
                        let start = new vscode_1.Position(iterator.lineno - 1, iterator.column - 1);
                        let end = new vscode_1.Position(iterator.lineno - 1, currentText.word.length);
                        definitionDataList.push({
                            uri: document.uri,
                            range: new vscode_1.Range(start, end),
                        });
                    }
                }
            }
            if (definitionDataList.length > 0) {
                return definitionDataList;
            }
            return null;
        });
    }
    provideDefinition(document, position, token) {
        // 添加原本没有的转到定义功能
        // 支持功能有: 变量转到定义\相同选择器转到定义\函数转到定义
        const text = document.getText();
        const ast = (0, parser_1.buildAst)(text);
        const rawSymbols = (0, utils_1.compact)((0, parser_1.flattenAndFilterAst)(ast));
        // 此处是实现的关键点, 需要根据现有的pos, 找到对应的文本和类型
        let currentWord = this.getCurrentWordAtPosition(rawSymbols, position);
        // const start = new Position(position.line, 0);
        // const range = new Range(start, position);
        // const workspacePath = this.getCurrentWorkspaceFolder(workspace.workspaceFolders, document)[0];
        // 先去索引里面, 找到HTML的ID相关信息
        // if (currentWord.word.startsWith('#')) {
        //     return Promise.resolve().then(() => {
        //         return this.getDefinitionDataFromHTML(workspacePath, document, position, currentWord.word);
        //     });
        // }
        return Promise.resolve().then(() => {
            return this.getDefinitionDataFromSelf(document, rawSymbols, currentWord);
        });
    }
}
exports.StylusDefinitionProvider = StylusDefinitionProvider;
//# sourceMappingURL=definitionProvider.js.map