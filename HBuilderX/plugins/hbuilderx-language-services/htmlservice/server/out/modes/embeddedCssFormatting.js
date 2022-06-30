"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCssFormatting = void 0;
const vscode_languageserver_1 = require("vscode-languageserver");
const entry_1 = require("../../../../cssservice/entry");
const strings_1 = require("../utils/strings");
function toNumber(a, def) {
    if (typeof a == 'number') {
        return a;
    }
    return def;
}
function toBoolean(a, def) {
    if (typeof a == 'boolean') {
        return a;
    }
    return def;
}
function getLineTextFromPosition(document, position) {
    const nextLine = position.line + 1;
    const nextPosition = vscode_languageserver_1.Position.create(nextLine, 0);
    const nextLineStartOffset = document.offsetAt(nextPosition);
    const lineEndPosition = document.positionAt(nextLineStartOffset - 1);
    const lineRange = vscode_languageserver_1.Range.create(vscode_languageserver_1.Position.create(position.line, 0), lineEndPosition);
    const lineText = document.getText(lineRange);
    return lineText;
}
function getCssFormatting(documentRegions, language) {
    return {
        async doFormatting(document, range, formatParams, settings) {
            var _a;
            let service = (0, entry_1.getExtraServer)(document).getLanguageServiceExt();
            if (!service || !service.format) {
                return [];
            }
            const docText = document.getText();
            const embedded = documentRegions.get(document).getEmbeddedDocument(language, true);
            const initialIndentLevel = computeInitialIndent(document, range, formatParams);
            let needLineBreaks = false;
            let needTabs = true;
            const isReacquire = true;
            let cssSettings = (_a = settings === null || settings === void 0 ? void 0 : settings.css) !== null && _a !== void 0 ? _a : {};
            // 判断前方是不是\n开头, 如果是则需要添加标记
            let startIsStyleLine = false;
            const startLineText = getLineTextFromPosition(document, range.start);
            const startPeekLineText = getLineTextFromPosition(document, vscode_languageserver_1.Position.create(range.start.line - 1, 0));
            cssSettings.indentLevel = initialIndentLevel;
            if (startLineText.includes('<style')) {
                cssSettings.indentLevel = initialIndentLevel + 1;
                range.start.character = startLineText.indexOf('>') + 1;
                cssSettings.isNeedLineBreak = true;
                startIsStyleLine = true;
            }
            else if (startPeekLineText.includes('<style')) {
                range.start.character = 0;
            }
            else {
                range.start.character = 0;
            }
            // 判断选区是否是在</之前结尾(包括本行内存在</和下一行存在</)
            // 判断</style>是否是结尾
            let endsWithStyle = false;
            if (docText.endsWith('</style>'))
                endsWithStyle = true;
            if (endsWithStyle) {
                const endLineText = getLineTextFromPosition(document, range.end);
                if (endLineText.includes('</style')) {
                    range.end.character = endLineText.indexOf('</style');
                }
                else {
                    range.end.character = endLineText.length - 1;
                    cssSettings.endWithNewline = false;
                    endsWithStyle = false;
                    needTabs = false;
                }
            }
            else {
                const endLineText = getLineTextFromPosition(document, range.end);
                if (endLineText.includes('</style')) {
                    range.end.character = endLineText.indexOf('</style');
                }
                else {
                    range.end.character = endLineText.length - 1;
                    cssSettings.endWithNewline = false;
                    endsWithStyle = false;
                    needTabs = false;
                }
            }
            let result = await service.format(embedded, range, cssSettings);
            if (!cssSettings.endWithNewline && endsWithStyle) {
                needLineBreaks = true;
            }
            let changedInitialIndentLevel = initialIndentLevel;
            if (!startIsStyleLine)
                changedInitialIndentLevel = initialIndentLevel - 1;
            let newInsertText = '\n';
            if (needLineBreaks && needTabs)
                newInsertText += generateIndent(changedInitialIndentLevel, formatParams);
            else if (needLineBreaks)
                newInsertText = '\n';
            else if (needTabs)
                newInsertText = generateIndent(changedInitialIndentLevel, formatParams);
            else
                return result;
            result.push({
                range: vscode_languageserver_1.Range.create(range.end, range.end),
                newText: newInsertText,
            });
            return result;
        },
    };
}
exports.getCssFormatting = getCssFormatting;
function computeInitialIndent(document, range, options) {
    let lineStart = document.offsetAt(vscode_languageserver_1.Position.create(range.start.line, 0));
    let content = document.getText();
    let i = lineStart;
    let nChars = 0;
    let tabSize = options.tabSize || 4;
    while (i < content.length) {
        let ch = content.charAt(i);
        if (ch === ' ') {
            nChars++;
        }
        else if (ch === '\t') {
            nChars += tabSize;
        }
        else {
            break;
        }
        i++;
    }
    return Math.floor(nChars / tabSize);
}
const whiteSpaceCharCode = [' '.charCodeAt(0), '\t'.charCodeAt(0), '\f'.charCodeAt(0)];
const NL = '\n'.charCodeAt(0);
function hasEndOfLineBeforeWord(document, range) {
    let start = document.offsetAt(range.start);
    let content = document.getText();
    let i = start;
    while (i < content.length) {
        let ch = content.charCodeAt(i);
        if (ch == NL) {
            return true;
        }
        else if (!whiteSpaceCharCode.includes(ch)) {
            return false;
        }
        i++;
    }
    return false;
}
function generateIndent(level, options) {
    if (options.insertSpaces) {
        return (0, strings_1.repeat)(' ', level * options.tabSize);
    }
    else {
        return (0, strings_1.repeat)('\t', level);
    }
}
//# sourceMappingURL=embeddedCssFormatting.js.map