"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tsConvert = exports.removeQuot = void 0;
const ts = require("typescript");
function removeQuot(text) {
    const first = text[0];
    const last = text[text.length - 1];
    if (first === last && (first === '\'' || first === '\"')) {
        text = text.substr(1, text.length - 2);
    }
    return text;
}
exports.removeQuot = removeQuot;
var tsConvert;
(function (tsConvert) {
    function asTsObjectLiteralExpression(node) {
        return node.kind == ts.SyntaxKind.ObjectLiteralExpression ? node : undefined;
    }
    tsConvert.asTsObjectLiteralExpression = asTsObjectLiteralExpression;
    function asTsArrayLiteralExpression(node) {
        return node.kind == ts.SyntaxKind.ArrayLiteralExpression ? node : undefined;
    }
    tsConvert.asTsArrayLiteralExpression = asTsArrayLiteralExpression;
    function asTsPropertyAssignment(node) {
        return node.kind == ts.SyntaxKind.PropertyAssignment ? node : undefined;
    }
    tsConvert.asTsPropertyAssignment = asTsPropertyAssignment;
    function asTsStringLiteral(node) {
        return node.kind == ts.SyntaxKind.StringLiteral ? node : undefined;
    }
    tsConvert.asTsStringLiteral = asTsStringLiteral;
    function asImportStatement(node) {
        return node.kind == ts.SyntaxKind.ImportDeclaration ? node : undefined;
    }
    tsConvert.asImportStatement = asImportStatement;
    function asNewExpression(node) {
        return node.kind == ts.SyntaxKind.NewExpression ? node : undefined;
    }
    tsConvert.asNewExpression = asNewExpression;
    function asCallExpression(node) {
        return node.kind == ts.SyntaxKind.CallExpression ? node : undefined;
    }
    tsConvert.asCallExpression = asCallExpression;
})(tsConvert = exports.tsConvert || (exports.tsConvert = {}));
//# sourceMappingURL=utils.js.map