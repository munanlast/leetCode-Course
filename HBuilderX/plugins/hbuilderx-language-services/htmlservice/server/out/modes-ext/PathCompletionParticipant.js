"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PathCompletionParticipant = void 0;
const vscode_html_languageservice_1 = require("vscode-html-languageservice");
const vscode_uri_1 = require("vscode-uri");
const utils_1 = require("../../../../utils");
const strings_1 = require("../utils/strings");
const imageSuffix = utils_1.DefaultFileExtensions.image;
const mediaSuffix = utils_1.DefaultFileExtensions.media;
const jsSuffix = utils_1.DefaultFileExtensions.js;
const cssSuffix = utils_1.DefaultFileExtensions.css;
const htmlSuffix = utils_1.DefaultFileExtensions.html;
const pathLeftBorder = ['/'.charCodeAt(0), "'".charCodeAt(0), '"'.charCodeAt(0)];
const pathRightBorder = pathLeftBorder.slice(1);
class PathCompletionParticipant {
    constructor(readDirectory) {
        this.readDirectory = readDirectory;
        this.atributeCompletions = [];
    }
    onHtmlAttributeValue(context) {
        if (isPathAttribute(context.tag, context.attribute)) {
            this.atributeCompletions.push(context);
        }
    }
    beginCompletion(option) {
        this.atributeCompletions = [];
        this.workspaceFolder = option === null || option === void 0 ? void 0 : option.workspaceFolder;
    }
    async computeCompletions(document, _htmlDocument, documentContext) {
        const result = { items: [], isIncomplete: false };
        for (const attributeCompletion of this.atributeCompletions) {
            const attributeValue = document.getText(attributeCompletion.range);
            const fullValue = stripQuotes(attributeValue);
            if (isCompletablePath(fullValue)) {
                if (fullValue === '.' || fullValue === '..') {
                    result.isIncomplete = true;
                }
                else {
                    let completionList = await this.collectWorkspaceFileCompletion(document, attributeCompletion);
                    result.isIncomplete = completionList.isIncomplete || result.isIncomplete;
                    let ignoreFiles = [];
                    for (let i = 0; i < completionList.items.length; i++) {
                        const item = completionList.items[i];
                        if (item.label.indexOf('/') == -1) {
                            ignoreFiles.push(item.label);
                        }
                        else {
                            break;
                        }
                    }
                    if (completionList.items.length > 0) {
                        result.items.push(...completionList.items);
                    }
                    // const replaceRange = pathToReplaceRange(attributeCompletion.value, fullValue, attributeCompletion.range);
                    // const suggestions = await this.providePathSuggestions(attributeCompletion.value, replaceRange, document, documentContext, ignoreFiles);
                    // for (const item of suggestions) {
                    //     result.items.push(item);
                    // }
                }
            }
        }
        return result;
    }
    async providePathSuggestions(valueBeforeCursor, replaceRange, document, documentContext, ignoreFiles) {
        const valueBeforeLastSlash = valueBeforeCursor.substring(0, valueBeforeCursor.lastIndexOf('/') + 1); // keep the last slash
        let parentDir = documentContext.resolveReference(valueBeforeLastSlash || '.', document.uri);
        if (parentDir) {
            try {
                const result = [];
                const infos = await this.readDirectory(parentDir);
                for (const [name, type] of infos) {
                    // Exclude paths that start with `.`
                    if (name.charCodeAt(0) !== CharCode_dot) {
                        if (type == vscode_html_languageservice_1.FileType.File && ignoreFiles.includes(name)) {
                            continue;
                        }
                        result.push(createCompletionItem(name, type === vscode_html_languageservice_1.FileType.Directory, replaceRange));
                    }
                }
                return result;
            }
            catch (e) {
                // ignore
            }
        }
        return [];
    }
    async collectWorkspaceFileCompletion(document, attributeCompletion) {
        var _a;
        let result = { isIncomplete: false, items: [] };
        const attributeValue = document.getText(attributeCompletion.range);
        const lastSlash = attributeCompletion.value.lastIndexOf('/');
        const leftPart = lastSlash >= 0 ? attributeCompletion.value.slice(lastSlash + 1) : '';
        result.isIncomplete = leftPart == '.' || leftPart == '..' || !attributeCompletion.value;
        if (this.workspaceFolder) {
            const prefixPath = attributeCompletion.value;
            let textRange = attributeCompletion.range;
            let offset = document.offsetAt(attributeCompletion.position);
            let start = document.offsetAt(textRange.start);
            let insideOffset = offset - start;
            let repaceStart = insideOffset;
            while (repaceStart > 0 && !pathLeftBorder.includes(attributeValue.charCodeAt(repaceStart - 1))) {
                repaceStart--;
            }
            let replaceEnd = document.offsetAt(textRange.end) - start;
            while (replaceEnd > insideOffset && pathRightBorder.includes(attributeValue.charCodeAt(replaceEnd - 1))) {
                replaceEnd--;
            }
            let info = getFileSuffixFilter(attributeCompletion.tag, attributeCompletion.attribute);
            textRange = { start: document.positionAt(repaceStart + start), end: document.positionAt(replaceEnd + start) };
            let options = { extensionFilters: info.filters, prefixPath, timeout: 300, withCurrentLevelFolder: true, withAllCurrentLevelFiles: false };
            let files = (0, utils_1.getCompletionFiles)(this.workspaceFolder, options, document.uri);
            (_a = (await files)) === null || _a === void 0 ? void 0 : _a.files.forEach((p) => {
                result.items.push({
                    label: p.relative,
                    kind: p.isDir ? vscode_html_languageservice_1.CompletionItemKind.Folder : vscode_html_languageservice_1.CompletionItemKind.File,
                    textEdit: vscode_html_languageservice_1.TextEdit.replace(textRange, p.relative),
                    sortText: p.isDir ? 'bb' : 'aa',
                    data: {
                        isPathCompletion: true,
                        imageUri: info.isImage ? vscode_uri_1.URI.file(p.file).toString() : undefined,
                    },
                });
            });
        }
        return result;
    }
}
exports.PathCompletionParticipant = PathCompletionParticipant;
const CharCode_dot = '.'.charCodeAt(0);
function stripQuotes(fullValue) {
    if ((0, strings_1.startsWith)(fullValue, `'`) || (0, strings_1.startsWith)(fullValue, `"`)) {
        return fullValue.slice(1, -1);
    }
    else {
        return fullValue;
    }
}
function isCompletablePath(value) {
    if ((0, strings_1.startsWith)(value, 'http') || (0, strings_1.startsWith)(value, 'https') || (0, strings_1.startsWith)(value, '//')) {
        return false;
    }
    return true;
}
function isPathAttribute(tag, attr) {
    const a = PATH_TAG_AND_ATTR[tag];
    if (a) {
        if (typeof a === 'string') {
            return a === attr;
        }
        else {
            return a.indexOf(attr) !== -1;
        }
    }
    return false;
}
function isImageAttribute(tag, attr) {
    return (tag == 'image' || tag == 'img') && attr == 'src';
}
function getFileSuffixFilter(tag, attr) {
    if ((tag == 'image' || tag == 'img') && attr == 'src') {
        return { filters: imageSuffix, isImage: true };
    }
    if (tag == 'body' && attr == 'background') {
        return { filters: imageSuffix, isImage: true };
    }
    if (tag == 'a' && attr == 'href') {
        return { filters: htmlSuffix, isImage: false };
    }
    if ((tag == 'source' || tag == 'video' || tag == 'track' || tag == 'audio') && attr == 'src') {
        return { filters: mediaSuffix, isImage: false };
    }
    if (tag == 'link' && attr == 'href') {
        return { filters: cssSuffix, isImage: false };
    }
    if (tag == 'script' && attr == 'src') {
        return { filters: jsSuffix, isImage: false };
    }
    if (tag == 'frame' && (attr == 'src' || attr == 'longdesc')) {
        return { filters: htmlSuffix, isImage: false };
    }
    if (tag == 'input' || tag == 'button') {
        if (attr == 'src') {
            return { filters: imageSuffix, isImage: true };
        }
        else if (attr == 'formaction') {
            return { filters: htmlSuffix, isImage: false };
        }
    }
    return { filters: [], isImage: false };
}
function pathToReplaceRange(valueBeforeCursor, fullValue, range) {
    let replaceRange;
    const lastIndexOfSlash = valueBeforeCursor.lastIndexOf('/');
    if (lastIndexOfSlash === -1) {
        replaceRange = shiftRange(range, 1, -1);
    }
    else {
        // For cases where cursor is in the middle of attribute value, like <script src="./s|rc/test.js">
        // Find the last slash before cursor, and calculate the start of replace range from there
        const valueAfterLastSlash = fullValue.slice(lastIndexOfSlash + 1);
        const startPos = shiftPosition(range.end, -1 - valueAfterLastSlash.length);
        // If whitespace exists, replace until there is no more
        const whitespaceIndex = valueAfterLastSlash.indexOf('');
        let endPos;
        if (whitespaceIndex !== -1) {
            endPos = shiftPosition(startPos, whitespaceIndex);
        }
        else {
            endPos = shiftPosition(range.end, -1);
        }
        replaceRange = vscode_html_languageservice_1.Range.create(startPos, endPos);
    }
    return replaceRange;
}
function createCompletionItem(p, isDir, replaceRange) {
    if (isDir) {
        p = p + '/';
        return {
            label: p,
            kind: vscode_html_languageservice_1.CompletionItemKind.Folder,
            textEdit: vscode_html_languageservice_1.TextEdit.replace(replaceRange, p),
            command: {
                title: 'Suggest',
                command: 'editor.action.triggerSuggest',
            },
            sortText: 'zz',
        };
    }
    else {
        return {
            label: p,
            kind: vscode_html_languageservice_1.CompletionItemKind.File,
            textEdit: vscode_html_languageservice_1.TextEdit.replace(replaceRange, p),
            sortText: 'zz',
        };
    }
}
function shiftPosition(pos, offset) {
    return vscode_html_languageservice_1.Position.create(pos.line, pos.character + offset);
}
function shiftRange(range, startOffset, endOffset) {
    const start = shiftPosition(range.start, startOffset);
    const end = shiftPosition(range.end, endOffset);
    return vscode_html_languageservice_1.Range.create(start, end);
}
const PATH_TAG_AND_ATTR = {
    // HTML 4
    a: 'href',
    area: 'href',
    body: 'background',
    del: 'cite',
    form: 'action',
    frame: ['src', 'longdesc'],
    img: ['src', 'longdesc'],
    ins: 'cite',
    link: 'href',
    object: 'data',
    q: 'cite',
    script: 'src',
    // HTML 5
    audio: 'src',
    button: 'formaction',
    embed: 'src',
    html: 'manifest',
    input: ['src', 'formaction'],
    source: 'src',
    track: 'src',
    video: ['src', 'poster'],
};
// vue
PATH_TAG_AND_ATTR['image'] = ['src'];
//# sourceMappingURL=PathCompletionParticipant.js.map