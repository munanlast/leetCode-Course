"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFormattingInHtml = exports.getFormattingData = void 0;
const jsBeautify = require("js-beautify");
var Diff = require('../../../../lib/diff.js');
const vscode_languageserver_1 = require("vscode-languageserver");
const util_1 = require("../utils/util");
async function getFormattingData(document, options, connection, scopedSettingsSupport) {
    var _a;
    let result = [];
    if (!connection)
        return result;
    if (!scopedSettingsSupport)
        return result;
    if (document.languageId !== 'css')
        return result;
    const docText = document.getText();
    const start = vscode_languageserver_1.Position.create(0, 0);
    const end = document.positionAt(docText.length);
    const range = vscode_languageserver_1.Range.create(start, end);
    let content = document.getText(range);
    let hxEol = await (0, util_1.getHXSettings)(`editor.showDefaultEndOfLine`, connection, scopedSettingsSupport);
    let beautifyOptions = {
        indent_size: (_a = options.tabSize) !== null && _a !== void 0 ? _a : 4,
        indent_char: ' ',
        indent_level: 0,
        indent_with_tabs: options.insertSpaces ? false : true,
        eol: hxEol !== null && hxEol !== void 0 ? hxEol : '\n',
        end_with_newline: false,
        brace_style: 'collapse',
        selector_separator_newline: true,
        newline_between_rules: true,
        indent_empty_lines: false,
    };
    const cssFormat = await (0, util_1.getHXSettings)(`css.format`, connection, scopedSettingsSupport);
    if (cssFormat != undefined) {
        beautifyOptions = {
            indent_size: cssFormat.indentSize,
            indent_char: cssFormat.indentChar,
            indent_level: cssFormat.indentLevel,
            indent_with_tabs: cssFormat.indentWithTabs,
            eol: cssFormat.eol,
            end_with_newline: cssFormat.endWithNewline,
            brace_style: cssFormat.braceStyle,
            selector_separator_newline: cssFormat.selectorSeparatorNewline,
            newline_between_rules: cssFormat.newlineBetweenRules,
            indent_empty_lines: cssFormat.indentEmptyLines,
        };
    }
    if (beautifyOptions.indent_level === 0)
        content = content.trim();
    const formatted = jsBeautify.css_beautify(content, beautifyOptions);
    // let formattedLineList: string[] = [];
    // formattedLineList = formatted.split('\n');
    if (formatted) {
        const diffs = Diff.stringDiff(docText, formatted);
        for (let df of diffs) {
            const dfStart = document.positionAt(df.originalStart);
            const dfEnd = document.positionAt(df.originalStart + df.originalLength);
            const dfRange = vscode_languageserver_1.Range.create(dfStart, dfEnd);
            const dfText = formatted.substring(df.modifiedStart, df.modifiedStart + df.modifiedLength);
            result.push(vscode_languageserver_1.TextEdit.replace(dfRange, dfText));
        }
    }
    // result.push(TextEdit.replace(range, formatted));
    return result;
}
exports.getFormattingData = getFormattingData;
async function getFormattingInHtml(document, range, options) {
    let result = [];
    const offset = document.offsetAt(range.start);
    const originalText = document.getText(range);
    let content = originalText;
    let beautifyOptions = {
        indent_size: 4,
        indent_char: ' ',
        indent_level: 0,
        indent_with_tabs: false,
        eol: '\n',
        end_with_newline: false,
        brace_style: 'collapse',
        selector_separator_newline: true,
        newline_between_rules: true,
        indent_empty_lines: false,
    };
    beautifyOptions = {
        indent_size: options.indentSize,
        indent_char: options.indentChar,
        indent_level: options.indentLevel,
        indent_with_tabs: options.indentWithTabs,
        eol: options.eol,
        end_with_newline: options.endWithNewline,
        brace_style: options.braceStyle,
        selector_separator_newline: options.selectorSeparatorNewline,
        newline_between_rules: options.newlineBetweenRules,
        indent_empty_lines: options.indentEmptyLines,
    };
    if (options.indentLevel && options.indentLevel < 0)
        beautifyOptions.indent_level = 0;
    // 文本后面的空白一定需要去除
    content = 'a' + content;
    content = content.trim().substring(1);
    if (options.indentLevel === 0)
        content = content.trim();
    let formatted = jsBeautify.css_beautify(content, beautifyOptions);
    if (formatted) {
        if (options.isNeedLineBreak)
            formatted = '\n' + formatted;
        const diffs = Diff.stringDiff(originalText, formatted);
        for (let df of diffs) {
            const dfStart = document.positionAt(df.originalStart + offset);
            const dfEnd = document.positionAt(df.originalStart + df.originalLength + offset);
            const dfRange = vscode_languageserver_1.Range.create(dfStart, dfEnd);
            const dfText = formatted.substring(df.modifiedStart, df.modifiedStart + df.modifiedLength);
            result.push(vscode_languageserver_1.TextEdit.replace(dfRange, dfText));
        }
    }
    // result.push(TextEdit.replace(range, formatted));
    return result;
}
exports.getFormattingInHtml = getFormattingInHtml;
//# sourceMappingURL=formatProcessor.js.map