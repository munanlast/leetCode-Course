"use strict";
// import { StylusNode, buildAst, flattenAndFilterAst, isAtRuleNode, isFunctionNode, isSelectorCallNode, isSelectorNode, isVariableNode } from '../parser';
// import { compact, prepareName } from '../utils';
// import { TypeConversion } from '../../../utils/client/out/typeConversion'
// import { Location ,Range, Position, WorkspaceFolder } from 'vscode-languageserver';
// import { TextDocument } from 'vscode-languageserver-textdocument';
// import { SearchedSymbol, SymbolType } from '../../../serverinterface';
// import { getLanguageServerExt } from '../../../htmlservice/entry';
// export interface CurrentWord {
//     word: string;
//     type: string;
// }
// export class StylusServerDefinition{
//     public isVariableReferenceNode(node: any, position: Position): boolean {
//         return (
//             node.nodeName === 'property' &&
//             node.expr &&
//             node.expr.nodeName === 'expression' &&
//             node.expr.nodes[0].nodeName === 'ident' &&
//             node.expr.column <= position.character
//         );
//     }
//     public isFunctionReferenceNode(node: any, position: Position): boolean {
//         return (
//             (node.nodeName === 'call' && node.name !== 'selector') ||
//             (node.nodeName === 'property' &&
//                 node.expr &&
//                 node.expr.nodeName === 'expression' &&
//                 node.expr.nodes[0].nodeName === 'call' &&
//                 node.expr.column <= position.character)
//         );
//     }
//     public getCurrentWordAtPosition(rawSymbols: StylusNode[], position: Position): CurrentWord {
//         let currentWord: CurrentWord = { word: '', type: '' };
//         for (const iterator of rawSymbols) {
//             if (iterator.lineno !== position.line + 1) {
//                 continue;
//             }
//             if (iterator.column > position.character) {
//                 continue;
//             }
//             // 此处需要对所在文本进行判断
//             // 对选择器进行处理
//             if (isSelectorNode(iterator)) {
//                 let word = '';
//                 for (const select of iterator.segments) {
//                     word += select.string;
//                 }
//                 currentWord.type = 'selector';
//                 currentWord.word = word;
//             }
//             // 对变量进行处理
//             if (this.isVariableReferenceNode(iterator, position)) {
//                 currentWord.type = 'variable';
//                 currentWord.word = iterator.expr.nodes[0].name;
//             }
//             // 对函数进行处理
//             if (this.isFunctionReferenceNode(iterator, position)) {
//                 currentWord.type = 'function';
//                 currentWord.word = iterator.name;
//                 if (!currentWord.word) {
//                     currentWord.word = iterator.expr.nodes[0].name;
//                 }
//             }
//         }
//         return currentWord;
//     }
//     // 遍历语法树, 自己获取转到定义信息
//     public async getDefinitionDataFromSelf(document: TextDocument, rawSymbols: any[], currentText: CurrentWord): Promise<Location[] | null> {
//         let definitionDataList: Location[] = [];
//         for (const iterator of rawSymbols) {
//             if (iterator.nodeName === 'ident' && currentText.type === 'function') {
//                 if (iterator.name === currentText.word) {
//                     let start:Position =  {line:iterator.val.lineno - 1, character: iterator.val.column - 1};
//                     let end :Position =  {line:iterator.val.lineno - 1, character: currentText.word.length};
//                     definitionDataList.push({
//                         uri: document.uri,
//                         range: new Range(start, end),
//                     });
//                 }
//             } else if (iterator.nodeName === 'ident' && currentText.type === 'variable') {
//                 if (iterator.name === currentText.word) {
//                     let start:Position =  {line:iterator.val.lineno - 1, character: iterator.column - 1};
//                     let end :Position =  {line:iterator.val.lineno - 1, character: currentText.word.length};
//                     definitionDataList.push({
//                         uri: document.uri,
//                         range: new Range(start, end),
//                     });
//                 }
//             } else if (iterator.nodeName === 'selector' && currentText.type === 'selector') {
//                 let word = '';
//                 for (const select of iterator.segments) {
//                     word += select.string;
//                 }
//                 if (word === currentText.word) {
//                     let start:Position =  {line:iterator.lineno - 1, character: iterator.column - 1};
//                     let end :Position =  {line:iterator.lineno - 1, character: currentText.word.length};
//                     definitionDataList.push({
//                         uri: document.uri,
//                         range: new Range(start, end),
//                     });
//                 }
//             }
//         }
//         if (definitionDataList.length > 0) {
//             return definitionDataList;
//         }
//         return null;
//     }
//     public provideDefinition(document: TextDocument, position: Position): ProviderResult<Definition | DefinitionLink[]> {
//         // 添加原本没有的转到定义功能
//         // 支持功能有: 变量转到定义\相同选择器转到定义\函数转到定义
//         const text = document.getText();
//         const ast = buildAst(text);
//         const rawSymbols = compact(flattenAndFilterAst(ast));
//         // 此处是实现的关键点, 需要根据现有的pos, 找到对应的文本和类型
//         let currentWord: CurrentWord = this.getCurrentWordAtPosition(rawSymbols, position);
//         return Promise.resolve().then(() => {
//             return this.getDefinitionDataFromSelf(document, rawSymbols, currentWord);
//         });
//     }
// }
//# sourceMappingURL=serverDefinition.js.map