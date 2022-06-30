"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transitionTimingFunctions = exports.TokenType = exports.svgElements = exports.startsWith = exports.SortTexts = exports.repeatStyleKeywords = exports.positionKeywords = exports.numberType = exports.notMoveCursorProperty = exports.NodeType = exports.lineWidthKeywords = exports.lineStyleKeywords = exports.isSameRange = exports.isRightCompletionType = exports.includesList = exports.imageUrlProperty = exports.imageFunctions = exports.html5Tags = exports.getOffsetRightLineText = exports.getOffsetLeftLineText = exports.getNodeAtOffset = exports.getLocationFromText = exports.getLocationFromPosition = exports.getLineTextFromPosition = exports.getLineTextFromOffset = exports.getHXSettings = exports.getCurrentWord = exports.geometryBoxKeywords = exports.cssWideKeywords = exports.createDocument = exports.createAstNode = exports.colors = exports.colorRestrictions = exports.colorKeywords = exports.colorFunctions = exports.calcRestrictionTypes = exports.boxKeywords = exports.basicShapeFunctions = void 0;
// 和某个功能实现无关的通用操作或数据结构写在这里
const fs_1 = require("fs");
const vscode_css_languageservice_1 = require("vscode-css-languageservice");
const vscode_languageserver_1 = require("vscode-languageserver");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const vscode_uri_1 = require("vscode-uri");
const utils_1 = require("../../../../utils");
Object.defineProperty(exports, "basicShapeFunctions", { enumerable: true, get: function () { return utils_1.basicShapeFunctions; } });
Object.defineProperty(exports, "boxKeywords", { enumerable: true, get: function () { return utils_1.boxKeywords; } });
Object.defineProperty(exports, "calcRestrictionTypes", { enumerable: true, get: function () { return utils_1.calcRestrictionTypes; } });
Object.defineProperty(exports, "colorFunctions", { enumerable: true, get: function () { return utils_1.colorFunctions; } });
Object.defineProperty(exports, "colorKeywords", { enumerable: true, get: function () { return utils_1.colorKeywords; } });
Object.defineProperty(exports, "colorRestrictions", { enumerable: true, get: function () { return utils_1.colorRestrictions; } });
Object.defineProperty(exports, "colors", { enumerable: true, get: function () { return utils_1.colors; } });
Object.defineProperty(exports, "cssWideKeywords", { enumerable: true, get: function () { return utils_1.cssWideKeywords; } });
Object.defineProperty(exports, "geometryBoxKeywords", { enumerable: true, get: function () { return utils_1.geometryBoxKeywords; } });
Object.defineProperty(exports, "html5Tags", { enumerable: true, get: function () { return utils_1.html5Tags; } });
Object.defineProperty(exports, "imageFunctions", { enumerable: true, get: function () { return utils_1.imageFunctions; } });
Object.defineProperty(exports, "imageUrlProperty", { enumerable: true, get: function () { return utils_1.imageUrlProperty; } });
Object.defineProperty(exports, "includesList", { enumerable: true, get: function () { return utils_1.includesList; } });
Object.defineProperty(exports, "lineStyleKeywords", { enumerable: true, get: function () { return utils_1.lineStyleKeywords; } });
Object.defineProperty(exports, "lineWidthKeywords", { enumerable: true, get: function () { return utils_1.lineWidthKeywords; } });
Object.defineProperty(exports, "NodeType", { enumerable: true, get: function () { return utils_1.NodeType; } });
Object.defineProperty(exports, "notMoveCursorProperty", { enumerable: true, get: function () { return utils_1.notMoveCursorProperty; } });
Object.defineProperty(exports, "numberType", { enumerable: true, get: function () { return utils_1.numberType; } });
Object.defineProperty(exports, "positionKeywords", { enumerable: true, get: function () { return utils_1.positionKeywords; } });
Object.defineProperty(exports, "repeatStyleKeywords", { enumerable: true, get: function () { return utils_1.repeatStyleKeywords; } });
Object.defineProperty(exports, "SortTexts", { enumerable: true, get: function () { return utils_1.SortTexts; } });
Object.defineProperty(exports, "startsWith", { enumerable: true, get: function () { return utils_1.startsWith; } });
Object.defineProperty(exports, "svgElements", { enumerable: true, get: function () { return utils_1.svgElements; } });
Object.defineProperty(exports, "TokenType", { enumerable: true, get: function () { return utils_1.TokenType; } });
Object.defineProperty(exports, "transitionTimingFunctions", { enumerable: true, get: function () { return utils_1.transitionTimingFunctions; } });
// 获取当前位置文字
function getCurrentWord(document, offset) {
    let i = offset - 1;
    const text = document.getText();
    while (i >= 0 && ' \t\n\r":{[()]},*>+'.indexOf(text.charAt(i)) === -1) {
        i--;
    }
    return text.substring(i + 1, offset);
}
exports.getCurrentWord = getCurrentWord;
// 获取当前节点位置
function getNodeAtOffset(node, offset) {
    let candidate = null;
    if (!node || offset < node.offset || offset > node.end) {
        return null;
    }
    // Find the shortest node at the position
    node.accept((node) => {
        if (node.offset === -1 && node.length === -1) {
            return true;
        }
        if (node.offset <= offset && node.end >= offset) {
            if (!candidate) {
                candidate = node;
            }
            else if (node.length <= candidate.length) {
                candidate = node;
            }
            return true;
        }
        return false;
    });
    return candidate;
}
exports.getNodeAtOffset = getNodeAtOffset;
function getLineTextFromPosition(document, position) {
    const docLength = document.getText().length;
    const docEndPosition = document.positionAt(docLength);
    const docLineCount = document.lineCount;
    const lineStartPosition = vscode_languageserver_1.Position.create(position.line, 0);
    if (docLineCount === position.line + 1) {
        const lineRange = vscode_languageserver_1.Range.create(lineStartPosition, docEndPosition);
        const lineText = document.getText(lineRange);
        return lineText;
    }
    const nextLine = position.line + 1;
    const nextLineStartPosition = vscode_languageserver_1.Position.create(nextLine, 0);
    const nextLineStartOffset = document.offsetAt(nextLineStartPosition);
    const lineEndPosition = document.positionAt(nextLineStartOffset - 1);
    const lineRange = vscode_languageserver_1.Range.create(lineStartPosition, lineEndPosition);
    const lineText = document.getText(lineRange);
    return lineText;
}
exports.getLineTextFromPosition = getLineTextFromPosition;
function getLineTextFromOffset(document, offset) {
    const position = document.positionAt(offset);
    return getLineTextFromPosition(document, position);
}
exports.getLineTextFromOffset = getLineTextFromOffset;
function getOffsetRightLineText(document, offset) {
    const lineText = getLineTextFromOffset(document, offset);
    const position = document.positionAt(offset);
    return lineText.substring(position.character);
}
exports.getOffsetRightLineText = getOffsetRightLineText;
function getOffsetLeftLineText(document, offset) {
    const position = document.positionAt(offset);
    const lineStartPosition = vscode_languageserver_1.Position.create(position.line, 0);
    const range = vscode_languageserver_1.Range.create(lineStartPosition, position);
    return document.getText(range);
}
exports.getOffsetLeftLineText = getOffsetLeftLineText;
// 判断Range是否相等
function isSameRange(range1, range2) {
    if (range1.start.line !== range2.start.line) {
        return false;
    }
    if (range1.start.character !== range2.start.character) {
        return false;
    }
    if (range1.end.line !== range2.end.line) {
        return false;
    }
    if (range1.end.character !== range2.end.character) {
        return false;
    }
    return true;
}
exports.isSameRange = isSameRange;
// 根据当前位置获取对应location
function getLocationFromPosition(document, astNode, position) {
    const offset = document.offsetAt(position);
    const currentAstNode = getNodeAtOffset(astNode, offset);
    if (!currentAstNode) {
        return undefined;
    }
    const startPosition = document.positionAt(currentAstNode.offset);
    const endPosition = document.positionAt(currentAstNode.end);
    const currentRange = vscode_languageserver_1.Range.create(startPosition, endPosition);
    return {
        uri: document.uri,
        range: currentRange,
    };
}
exports.getLocationFromPosition = getLocationFromPosition;
/**
 * 根据提供的数据创建TextDocument对象
 * @param filePath is TextDocument.uri Type
 * @param fileType
 * @returns
 */
function createDocument(filePath, fileType) {
    let data = (0, fs_1.readFileSync)(vscode_uri_1.URI.parse(filePath).fsPath, { encoding: 'utf8', flag: 'r' });
    return vscode_languageserver_textdocument_1.TextDocument.create(filePath, fileType, 0, data);
}
exports.createDocument = createDocument;
// 创建语法树
function createAstNode(document, fileType) {
    if (fileType === 'css') {
        return (0, vscode_css_languageservice_1.getCSSLanguageService)().parseStylesheet(document);
    }
    if (fileType === 'scss') {
        return (0, vscode_css_languageservice_1.getSCSSLanguageService)().parseStylesheet(document);
    }
    if (fileType === 'less') {
        return (0, vscode_css_languageservice_1.getLESSLanguageService)().parseStylesheet(document);
    }
    console.error('fileType is not style');
    return (0, vscode_css_languageservice_1.getCSSLanguageService)().parseStylesheet(document);
}
exports.createAstNode = createAstNode;
// 根据文本获取到其在语法树中的位置, 对应的Location
function getLocationFromText(document, astNode, nodeType, selection) {
    let locationList = [];
    astNode.accept((node) => {
        if (node.type === nodeType) {
            const selector = node.getText();
            if (selector === selection) {
                let startPosition = document.positionAt(node.offset);
                let endPosition = document.positionAt(node.end);
                let currentRange = vscode_languageserver_1.Range.create(startPosition, endPosition);
                locationList.push({ uri: document.uri, range: currentRange });
            }
            return false;
        }
        return true;
    });
    return locationList;
}
exports.getLocationFromText = getLocationFromText;
// 获取设置文件中的信息, 供px转换功能使用
function getHXSettings(resource, connection, hasConfigurationCapability) {
    if (!hasConfigurationCapability) {
        return Promise.resolve(undefined);
    }
    const configRequestParam = { items: [{ section: resource }] };
    let result = connection.sendRequest(vscode_languageserver_1.ConfigurationRequest.type, configRequestParam).then((s) => s[0]);
    return result;
}
exports.getHXSettings = getHXSettings;
/**
 * 根据传入数值判断提示类型
 * @param completionType 补全类型
 * @param type 需要判断的语法树type类型
 * @param nodeType 需要判断的语法树nodeType类型
 * @param scannerType 需要判断的语法树错误时的类型
 * @returns 返回true或false
 */
function isRightCompletionType(completionType, type, nodeType, scannerType, context) {
    if (!completionType) {
        return false;
    }
    if (completionType.isNode) {
        if (type) {
            for (const iterator of type) {
                if (completionType.type === iterator) {
                    return true;
                }
                if (completionType.parentType === iterator) {
                    return true;
                }
            }
        }
        if (nodeType) {
            for (const iterator of nodeType) {
                if (completionType.nodeType === iterator) {
                    return true;
                }
                if (completionType.parentNodeType === iterator) {
                    return true;
                }
            }
        }
    }
    else {
        if (scannerType && completionType.nodeType === scannerType) {
            return true;
        }
        if (context && completionType.context === context) {
            return true;
        }
    }
    return false;
}
exports.isRightCompletionType = isRightCompletionType;
//# sourceMappingURL=util.js.map