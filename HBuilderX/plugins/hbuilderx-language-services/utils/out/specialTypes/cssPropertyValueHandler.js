"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doComplete = void 0;
const vscode_languageserver_protocol_1 = require("vscode-languageserver-protocol");
const htmlDataUtils_1 = require("./htmlDataUtils");
const hxIconKind_1 = require("../languageserver/hxIconKind");
const type_resolve_1 = require("../common/type-resolve");
const ts = require("typescript/lib/tsserverlibrary");
const { positionKeywords, repeatStyleKeywords, lineStyleKeywords, lineWidthKeywords, geometryBoxKeywords, boxKeywords, imageFunctions, transitionTimingFunctions, basicShapeFunctions } = require('vscode-css-languageservice/lib/umd/languageFacts/builtinData');
const { colors, colorKeywords, colorFunctions } = require('vscode-css-languageservice/lib/umd/languageFacts/colors');
const dataProvider = (0, htmlDataUtils_1.cssDataProvider)();
function doComplete(position, document, options) {
    var _a, _b;
    let sf = options.sourceFile;
    let offset = document.offsetAt(position);
    let token = (0, type_resolve_1.getTokenAtPosition)(sf, offset);
    if (!token) {
        return [];
    }
    let propName = '';
    let parent = token.parent;
    if (parent && parent.kind == ts.SyntaxKind.CallExpression) {
        let args = parent.arguments;
        let beforeArg = -1;
        for (let i = 0; i < args.length; i++) {
            let a = args[i];
            if (offset >= a.getStart() && offset <= a.getEnd()) {
                beforeArg = i - 1;
                break;
            }
        }
        if (beforeArg >= 0) {
            let node = args[beforeArg];
            if (node.kind == ts.SyntaxKind.StringLiteral) {
                propName = node.getText();
                if (propName[0] === `'` || propName[0] == `"`) {
                    propName = propName.slice(1, -1);
                }
            }
        }
    }
    if (propName) {
        let prop = dataProvider.provideProperties().find((prop) => { return prop.name == propName; });
        const range = options === null || options === void 0 ? void 0 : options.replaceRange;
        if (prop) {
            let result = [];
            (_a = prop.values) === null || _a === void 0 ? void 0 : _a.forEach((property) => {
                result.push({
                    label: property.name,
                    documentation: property.description,
                    kind: vscode_languageserver_protocol_1.CompletionItemKind.Value,
                    textEdit: range ? vscode_languageserver_protocol_1.TextEdit.replace(range, property.name) : undefined,
                    data: {
                        hxKind: hxIconKind_1.HxIconKind.ATTRIBUTE
                    }
                });
            });
            const restrictions = prop.restrictions;
            (_b = prop.restrictions) === null || _b === void 0 ? void 0 : _b.forEach((restriction) => {
                let participant = [];
                switch (restriction) {
                    case 'color':
                        getColorProposals(participant, range);
                        break;
                    case 'position':
                        getPositionProposals(participant, range);
                        break;
                    case 'repeat':
                        getRepeatStyleProposals(participant, range);
                        break;
                    case 'line-style':
                        getLineStyleProposals(participant, range);
                        break;
                    case 'line-width':
                        getLineWidthProposals(participant, range);
                        break;
                    case 'geometry-box':
                        getGeometryBoxProposals(participant, range);
                        break;
                    case 'box':
                        getBoxProposals(participant, range);
                        break;
                    case 'image':
                        getImageProposals(participant, range);
                        break;
                    case 'timing-function':
                        getTimingFunctionProposals(participant, range);
                        break;
                    case 'shape':
                        getBasicShapeProposals(participant, range);
                        break;
                }
                result.push(...participant);
            });
            return result;
        }
    }
    return [];
}
exports.doComplete = doComplete;
function getColorProposals(completionItemList, range) {
    for (const color in colors) {
        completionItemList.push({
            label: color,
            documentation: colors[color],
            textEdit: range ? vscode_languageserver_protocol_1.TextEdit.replace(range, color) : undefined,
            kind: vscode_languageserver_protocol_1.CompletionItemKind.Color,
        });
    }
    for (const color in colorKeywords) {
        completionItemList.push({
            label: color,
            documentation: colorKeywords[color],
            textEdit: range ? vscode_languageserver_protocol_1.TextEdit.replace(range, color) : undefined,
            kind: vscode_languageserver_protocol_1.CompletionItemKind.Value,
        });
    }
    for (const p of colorFunctions) {
        let tabStop = 1;
        const replaceFunction = (_match, p1) => '${' + tabStop++ + ':' + p1 + '}';
        const insertText = p.func.replace(/\[?\$(\w+)\]?/g, replaceFunction);
        completionItemList.push({
            label: p.func.substring(0, p.func.indexOf('(')),
            detail: p.func,
            documentation: p.desc,
            textEdit: range ? vscode_languageserver_protocol_1.TextEdit.replace(range, insertText) : undefined,
            insertTextFormat: vscode_languageserver_protocol_1.InsertTextFormat.Snippet,
            kind: vscode_languageserver_protocol_1.CompletionItemKind.Function
        });
    }
    return completionItemList;
}
function getPositionProposals(completionItemList, range) {
    for (const position in positionKeywords) {
        completionItemList.push({
            label: position,
            documentation: positionKeywords[position],
            textEdit: range ? vscode_languageserver_protocol_1.TextEdit.replace(range, position) : undefined,
            kind: vscode_languageserver_protocol_1.CompletionItemKind.Value,
        });
    }
    return completionItemList;
}
function getRepeatStyleProposals(completionItemList, range) {
    for (const repeat in repeatStyleKeywords) {
        completionItemList.push({
            label: repeat,
            documentation: repeatStyleKeywords[repeat],
            textEdit: range ? vscode_languageserver_protocol_1.TextEdit.replace(range, repeat) : undefined,
            kind: vscode_languageserver_protocol_1.CompletionItemKind.Value,
        });
    }
    return completionItemList;
}
function getLineStyleProposals(completionItemList, range) {
    for (const lineStyle in lineStyleKeywords) {
        completionItemList.push({
            label: lineStyle,
            documentation: lineStyleKeywords[lineStyle],
            textEdit: range ? vscode_languageserver_protocol_1.TextEdit.replace(range, lineStyle) : undefined,
            kind: vscode_languageserver_protocol_1.CompletionItemKind.Value,
        });
    }
    return completionItemList;
}
function getLineWidthProposals(completionItemList, range) {
    for (const lineWidth of lineWidthKeywords) {
        completionItemList.push({
            label: lineWidth,
            textEdit: range ? vscode_languageserver_protocol_1.TextEdit.replace(range, lineWidth) : undefined,
            kind: vscode_languageserver_protocol_1.CompletionItemKind.Value,
        });
    }
    return completionItemList;
}
function getGeometryBoxProposals(completionItemList, range) {
    for (const box in geometryBoxKeywords) {
        completionItemList.push({
            label: box,
            documentation: geometryBoxKeywords[box],
            textEdit: range ? vscode_languageserver_protocol_1.TextEdit.replace(range, box) : undefined,
            kind: vscode_languageserver_protocol_1.CompletionItemKind.Value,
        });
    }
    return completionItemList;
}
function getBoxProposals(completionItemList, range) {
    for (const box in boxKeywords) {
        completionItemList.push({
            label: box,
            documentation: boxKeywords[box],
            textEdit: range ? vscode_languageserver_protocol_1.TextEdit.replace(range, box) : undefined,
            kind: vscode_languageserver_protocol_1.CompletionItemKind.Value,
        });
    }
    return completionItemList;
}
function moveCursorInsideParenthesis(text) {
    return text.replace(/\(\)$/, '($1)');
}
function getImageProposals(completionItemList, range) {
    for (const image in imageFunctions) {
        const insertText = moveCursorInsideParenthesis(image);
        completionItemList.push({
            label: image,
            documentation: imageFunctions[image],
            textEdit: range ? vscode_languageserver_protocol_1.TextEdit.replace(range, insertText) : undefined,
            kind: vscode_languageserver_protocol_1.CompletionItemKind.Function,
            insertTextFormat: image !== insertText ? vscode_languageserver_protocol_1.InsertTextFormat.Snippet : void 0,
        });
    }
    return completionItemList;
}
function getBasicShapeProposals(completionItemList, range) {
    for (const shape in basicShapeFunctions) {
        const insertText = moveCursorInsideParenthesis(shape);
        completionItemList.push({
            label: shape,
            documentation: basicShapeFunctions[shape],
            textEdit: range ? vscode_languageserver_protocol_1.TextEdit.replace(range, insertText) : undefined,
            kind: vscode_languageserver_protocol_1.CompletionItemKind.Function,
            insertTextFormat: shape !== insertText ? vscode_languageserver_protocol_1.InsertTextFormat.Snippet : void 0,
        });
    }
    return completionItemList;
}
function getTimingFunctionProposals(completionItemList, range) {
    for (const timing in transitionTimingFunctions) {
        const insertText = moveCursorInsideParenthesis(timing);
        completionItemList.push({
            label: timing,
            documentation: transitionTimingFunctions[timing],
            textEdit: range ? vscode_languageserver_protocol_1.TextEdit.replace(range, insertText) : undefined,
            kind: vscode_languageserver_protocol_1.CompletionItemKind.Function,
            insertTextFormat: timing !== insertText ? vscode_languageserver_protocol_1.InsertTextFormat.Snippet : void 0,
        });
    }
    return completionItemList;
}
//# sourceMappingURL=cssPropertyValueHandler.js.map