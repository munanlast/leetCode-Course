"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StylusColorProvider = exports.getColors = exports.extractColorsFromExpression = exports.normalizeColors = exports.getRealCallColumn = exports.getRealColumn = exports.buildCallValueFromArgs = void 0;
const vscode_1 = require("vscode");
const parser_1 = require("./parser");
const colors_1 = require("./colors");
const buildCallValueFromArgs = args => args.nodes.map(node => node.nodes[0].val).join(', ');
exports.buildCallValueFromArgs = buildCallValueFromArgs;
const getRealColumn = (textToSearch, text, lineno) => Math.max(text[lineno].indexOf(textToSearch), 0);
exports.getRealColumn = getRealColumn;
const getRealCallColumn = (textToSearch, text, lineno) => {
    const startPos = Math.max(text[lineno].indexOf(textToSearch), 0);
    const searchStr = text[lineno].slice(startPos);
    return Math.max(text[lineno].indexOf(textToSearch), 0) + searchStr.indexOf(")") + 1;
};
exports.getRealCallColumn = getRealCallColumn;
function normalizeColors(colorsNode, text) {
    const colorsInformation = [];
    const colorPosSet = new Set();
    colorsNode.forEach(color => {
        var _a, _b, _c, _d, _e;
        if (color.nodeName === 'ident' && colors_1.colors[color.name]) {
            try {
                const colorObj = (0, colors_1.colorFromHex)(colors_1.colors[color.name]);
                const pos = `${color.lineno - 1}-${(0, exports.getRealColumn)(color.name, text, color.lineno - 1)}`;
                if (colorPosSet.has(pos)) {
                    // do nothing
                }
                else {
                    colorPosSet.add(pos);
                    colorsInformation.push(new vscode_1.ColorInformation(new vscode_1.Range(new vscode_1.Position(color.lineno - 1, (0, exports.getRealColumn)(color.name, text, color.lineno - 1)), new vscode_1.Position(color.lineno - 1, (0, exports.getRealColumn)(color.name, text, color.lineno - 1) + ((_a = color.name) === null || _a === void 0 ? void 0 : _a.length) || 0)), new vscode_1.Color(colorObj.red, colorObj.green, colorObj.blue, colorObj.alpha)));
                }
            }
            catch (_) {
                // do nothing
            }
        }
        else if (color.nodeName === 'rgba') {
            try {
                const pos = `${color.lineno - 1}-${(0, exports.getRealColumn)(color.raw, text, color.lineno - 1)}`;
                if (colorPosSet.has(pos)) {
                    // do nothing
                }
                else {
                    colorPosSet.add(pos);
                    colorsInformation.push(new vscode_1.ColorInformation(new vscode_1.Range(new vscode_1.Position(color.lineno - 1, (0, exports.getRealColumn)(color.raw, text, color.lineno - 1)), new vscode_1.Position(color.lineno - 1, (0, exports.getRealColumn)(color.raw, text, color.lineno - 1) + ((_b = color.raw) === null || _b === void 0 ? void 0 : _b.length) || 0)), 
                    // @ts-ignore
                    new vscode_1.Color(color.r, color.g, color.b, color.a)));
                }
            }
            catch (_) {
                // do nothing
            }
        }
        else if (color.nodeName === 'call') {
            try {
                // @ts-ignore
                const colorValues = (_e = (_d = (_c = color === null || color === void 0 ? void 0 : color.args) === null || _c === void 0 ? void 0 : _c.nodes) === null || _d === void 0 ? void 0 : _d.map) === null || _e === void 0 ? void 0 : _e.call(_d, node => node.nodes[0].val);
                if (!colorValues || colorValues.length < 3 || colorValues.length > 4) {
                    return;
                }
                const alpha = colorValues.length === 4 ? (0, colors_1.getNumericValue)(colorValues[3], 1) : 1;
                const funcName = color.name;
                const pos = `${color.lineno - 1}-${(0, exports.getRealColumn)(color.name, text, color.lineno - 1)}`;
                if (colorPosSet.has(pos)) {
                    // do nothing
                }
                else {
                    colorPosSet.add(pos);
                    if (funcName === 'rgb' || funcName === 'rgba') {
                        colorsInformation.push(new vscode_1.ColorInformation(new vscode_1.Range(new vscode_1.Position(color.lineno - 1, (0, exports.getRealColumn)(color.name, text, color.lineno - 1)), new vscode_1.Position(color.lineno - 1, (0, exports.getRealCallColumn)(color.name, text, color.lineno - 1))), 
                        // @ts-ignore
                        new vscode_1.Color((0, colors_1.getNumericValue)(colorValues[0], 255.0), (0, colors_1.getNumericValue)(colorValues[1], 255.0), (0, colors_1.getNumericValue)(colorValues[2], 255.0), alpha)));
                    }
                    else if (funcName === 'hsl' || funcName === 'hsla') {
                        const h = (0, colors_1.getAngle)(colorValues[0]);
                        const s = (0, colors_1.getNumericValue)(colorValues[1], 100.0);
                        const l = (0, colors_1.getNumericValue)(colorValues[2], 100.0);
                        const colorRes = (0, colors_1.colorFromHSL)(h, s, l, alpha);
                        colorsInformation.push(new vscode_1.ColorInformation(new vscode_1.Range(new vscode_1.Position(color.lineno - 1, (0, exports.getRealColumn)(color.name, text, color.lineno - 1)), new vscode_1.Position(color.lineno - 1, (0, exports.getRealCallColumn)(color.name, text, color.lineno - 1))), new vscode_1.Color(colorRes.red, colorRes.green, colorRes.blue, colorRes.alpha)));
                    }
                }
            }
            catch (_) {
                // do nothing
            }
        }
    });
    // clear position set
    colorPosSet.clear();
    return colorsInformation;
}
exports.normalizeColors = normalizeColors;
function extractColorsFromExpression(node) {
    let result = [];
    if (node.nodeName === 'expression') {
        node.nodes.forEach(valNode => {
            if ((0, parser_1.isColor)(valNode)) {
                result.push(valNode);
            }
            else if (valNode.nodeName === 'object') {
                Object.keys(valNode.vals).forEach(subValNode => {
                    result = result.concat(extractColorsFromExpression(valNode.vals[subValNode]));
                });
            }
        });
    }
    return result;
}
exports.extractColorsFromExpression = extractColorsFromExpression;
function getColors(ast) {
    return (ast.nodes || ast || []).reduce((acc, node) => {
        if (node.nodeName === 'ident') {
            acc = acc.concat(extractColorsFromExpression(node.val));
        }
        if (node.nodeName === 'property' && node.expr) {
            acc = acc.concat(extractColorsFromExpression(node.expr));
        }
        return acc;
    }, []);
}
exports.getColors = getColors;
class StylusColorProvider {
    provideDocumentColors(document, token) {
        if (token.isCancellationRequested) {
            return [];
        }
        const documentTxt = document.getText();
        const ast = (0, parser_1.flattenAndFilterAst)((0, parser_1.buildAst)(documentTxt));
        const list = normalizeColors(getColors(ast), documentTxt.split('\n'));
        return list;
    }
    provideColorPresentations(color, context, token) {
        if (token.isCancellationRequested) {
            return [];
        }
        const result = [];
        const red256 = Math.round(color.red * 255), green256 = Math.round(color.green * 255), blue256 = Math.round(color.blue * 255);
        let label;
        if (color.alpha === 1) {
            label = `rgb(${red256}, ${green256}, ${blue256})`;
        }
        else {
            label = `rgba(${red256}, ${green256}, ${blue256}, ${color.alpha})`;
        }
        result.push({ label: label, textEdit: vscode_1.TextEdit.replace(context.range, label) });
        if (color.alpha === 1) {
            label = `#${(0, colors_1.toTwoDigitHex)(red256)}${(0, colors_1.toTwoDigitHex)(green256)}${(0, colors_1.toTwoDigitHex)(blue256)}`;
        }
        else {
            label = `#${(0, colors_1.toTwoDigitHex)(red256)}${(0, colors_1.toTwoDigitHex)(green256)}${(0, colors_1.toTwoDigitHex)(blue256)}${(0, colors_1.toTwoDigitHex)(Math.round(color.alpha * 255))}`;
        }
        result.push({ label: label, textEdit: vscode_1.TextEdit.replace(context.range, label) });
        const hsl = (0, colors_1.hslFromColor)(color);
        if (hsl.a === 1) {
            label = `hsl(${hsl.h}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%)`;
        }
        else {
            label = `hsla(${hsl.h}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%, ${hsl.a})`;
        }
        result.push({ label: label, textEdit: vscode_1.TextEdit.replace(context.range, label) });
        return result;
    }
}
exports.StylusColorProvider = StylusColorProvider;
//# sourceMappingURL=color-provider.js.map