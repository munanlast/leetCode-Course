"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gotoDefinition = exports.doComplete = void 0;
const typescript = require("typescript");
const vscode_languageserver_protocol_1 = require("vscode-languageserver-protocol");
const index_1 = require("./index");
const nodes_1 = require("../common/nodes");
const commonHandler_1 = require("../common/commonHandler");
function calcFieldPropsals(collections, projectPath) {
    let result = [];
    let collectionNames = collections.split(',');
    collectionNames.forEach(value => {
        let clientDBCollection = (0, commonHandler_1.parseSchema)(value.trim(), projectPath);
        if (clientDBCollection) {
            for (const [key, value] of clientDBCollection.getProperties().entries()) {
                result.push({
                    kind: vscode_languageserver_protocol_1.CompletionItemKind.Property,
                    label: key,
                    detail: value.desc
                });
            }
        }
    });
    return result;
}
function doComplete(position, document, options) {
    var _a;
    if (options && options.locationType === index_1.SpecialValueLocationType.IN_HTML) {
        return doDBComponentComplete(position, document, options);
    }
    let result = [];
    let sourceFile = options.sourceFile;
    let nodePaths = (0, nodes_1.findNodePathByOffset)(sourceFile, document.offsetAt(position));
    let index = nodePaths.length - 1;
    let currentNode = nodePaths[index] || null;
    if (currentNode) {
        index -= 1;
        currentNode = nodePaths[index] || null;
        if (currentNode) {
            if ((currentNode === null || currentNode === void 0 ? void 0 : currentNode.kind) === typescript.SyntaxKind.PropertyAssignment || (currentNode === null || currentNode === void 0 ? void 0 : currentNode.kind) === typescript.SyntaxKind.ShorthandPropertyAssignment) {
                index -= 1;
                currentNode = nodePaths[index];
                if (currentNode && (currentNode === null || currentNode === void 0 ? void 0 : currentNode.kind) === typescript.SyntaxKind.ObjectLiteralExpression) {
                }
            }
            else {
                let expression = null;
                if (currentNode.kind == typescript.SyntaxKind.CallExpression) {
                    expression = currentNode;
                }
                else {
                    while (currentNode && (currentNode === null || currentNode === void 0 ? void 0 : currentNode.kind) !== typescript.SyntaxKind.ExpressionStatement) {
                        index -= 1;
                        currentNode = nodePaths[index];
                    }
                    if (currentNode && (currentNode === null || currentNode === void 0 ? void 0 : currentNode.kind) === typescript.SyntaxKind.ExpressionStatement) {
                        let expressionNode = currentNode.expression;
                        if (expressionNode.kind === typescript.SyntaxKind.CallExpression) {
                            expression = expressionNode;
                        }
                    }
                }
                while (expression.kind === typescript.SyntaxKind.CallExpression) {
                    let callExpression = expression.expression;
                    if (callExpression.kind === typescript.SyntaxKind.PropertyAccessExpression) {
                        let name = callExpression.name.getText();
                        if (name === 'collection') {
                            let args = expression.arguments;
                            if ((args === null || args === void 0 ? void 0 : args.length) > 0) {
                                if (((_a = args[0]) === null || _a === void 0 ? void 0 : _a.kind) === typescript.SyntaxKind.StringLiteral) {
                                    let collections = args[0].text;
                                    result.push(...calcFieldPropsals(collections, options === null || options === void 0 ? void 0 : options.workspaceFolder));
                                }
                            }
                            break;
                        }
                        else {
                            expression = callExpression.expression;
                        }
                    }
                }
            }
        }
    }
    return result;
}
exports.doComplete = doComplete;
function doDBComponentComplete(position, document, options) {
    if (!options.htmlContext || !options.workspaceFolder) {
        return [];
    }
    const attributes = options.htmlContext.attributes;
    const currAttr = options.htmlContext.currentAttribute;
    if (currAttr.name == 'where' && attributes['collection']) {
        return calcFieldPropsals(attributes['collection'], options.workspaceFolder);
    }
    return [];
}
function gotoDefinition() {
}
exports.gotoDefinition = gotoDefinition;
//# sourceMappingURL=jqlHandler.js.map