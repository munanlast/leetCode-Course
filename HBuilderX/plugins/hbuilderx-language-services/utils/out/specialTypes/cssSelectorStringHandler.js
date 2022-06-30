"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doComplete = void 0;
const vscode_languageserver_protocol_1 = require("vscode-languageserver-protocol");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const vscode_css_languageservice_1 = require("vscode-css-languageservice");
const type_resolve_1 = require("../common/type-resolve");
const string_1 = require("../common/string");
const cssNodes = require("../languageserver/cssTypeUtils");
const htmlDataUtils_1 = require("./htmlDataUtils");
const htmlDataUtils_2 = require("./htmlDataUtils");
const indexlib_1 = require("../../../indexlib");
const hxIconKind_1 = require("../languageserver/hxIconKind");
const vscode_uri_1 = require("vscode-uri");
const { html5Tags, svgElements } = require('vscode-css-languageservice/lib/umd/languageFacts/builtinData');
function getCurrentWord(document, offset) {
    let i = offset - 1;
    const text = document.getText();
    while (i >= 0 && ' \t\n\r":{[()]},*>+'.indexOf(text.charAt(i)) === -1) {
        i--;
    }
    return text.substring(i + 1, offset);
}
function moveCursorInsideParenthesis(text) {
    return text.replace(/\(\)$/, "($1)");
}
var SortTexts;
(function (SortTexts) {
    // char code 32, comes before everything
    SortTexts["Enums"] = " ";
    SortTexts["Normal"] = "d";
    SortTexts["Class"] = "e";
    SortTexts["Id"] = "f";
    SortTexts["PseudoClass"] = "h";
    SortTexts["PseudoElement"] = "i";
    SortTexts["VendorPrefixed"] = "x";
    SortTexts["Term"] = "y";
    SortTexts["Variable"] = "z";
})(SortTexts || (SortTexts = {}));
class CSSCompletion {
    constructor(sourceDocument, position, ws) {
        this.sourceDocument = sourceDocument;
        this.position = position;
        this.worspaceRoot = ws;
    }
    doCompletion(subDocument, docOffset) {
        this.textDocument = subDocument;
        this.textDocumentOffset = docOffset;
        let astNode = (0, vscode_css_languageservice_1.getCSSLanguageService)().parseStylesheet(this.textDocument);
        this.innerOffset = this.sourceDocument.offsetAt(this.position) - docOffset;
        this.nodePath = getNodePath(astNode, this.innerOffset);
        this.currentWord = getCurrentWord(subDocument, this.innerOffset);
        this.defaultReplaceRange = vscode_languageserver_protocol_1.Range.create(vscode_languageserver_protocol_1.Position.create(this.position.line, this.position.character - this.currentWord.length), this.position);
        let result = [];
        for (let i = this.nodePath.length - 1; i >= 0; i--) {
            const node = this.nodePath[i];
            if (node.type == cssNodes.NodeType.SimpleSelector) {
                const parentRef = node.findAParent(cssNodes.NodeType.Ruleset);
                if (parentRef) {
                    result = this.getCompletionsForSelector(parentRef);
                }
            }
        }
        if (this.nodePath.length == 0 ||
            (this.nodePath.length == 1 && this.nodePath[0].type == cssNodes.NodeType.Stylesheet)) {
            //空内容
            this.getIdClassCompletion(true, true, true, true, result);
            this.getElementCompletion(result);
        }
        else {
            let node = getNodeAtOffset(astNode, this.innerOffset);
            if (node) {
                let selectorCombinatorTypes = [cssNodes.NodeType.SelectorCombinatorParent,
                    cssNodes.NodeType.SelectorCombinatorSibling,
                    cssNodes.NodeType.SelectorCombinatorAllSiblings,];
                let newSelector = node.issues && this.hasCharacterAtPosition(this.innerOffset - 1, ',');
                if (newSelector || selectorCombinatorTypes.includes(node.type)) {
                    this.getIdClassCompletion(true, true, true, true, result);
                    this.getElementCompletion(result);
                }
            }
        }
        return result;
    }
    findInNodePath(types) {
        for (let i = this.nodePath.length - 1; i >= 0; i--) {
            const node = this.nodePath[i];
            if (types.indexOf(node.type) !== -1) {
                return node;
            }
        }
        return null;
    }
    hasCharacterAtPosition(offset, char) {
        const text = this.textDocument.getText();
        return (offset >= 0 && offset < text.length) && text.charAt(offset) === char;
    }
    getCompletionRange(existingNode) {
        if (existingNode && existingNode.offset <= this.innerOffset && this.innerOffset <= existingNode.end) {
            // 需要获取原始sourceDocument位置
            const end = existingNode.end !== -1 ? this.sourceDocument.positionAt(existingNode.end + this.textDocumentOffset) : this.position;
            const start = this.sourceDocument.positionAt(existingNode.offset + this.textDocumentOffset);
            if (start.line === end.line) {
                return vscode_languageserver_protocol_1.Range.create(start, end); // multi line edits are not allowed
            }
        }
        return this.defaultReplaceRange;
    }
    getIdClassCompletion(withId, withSharp, withClass, withDot, result) {
        if (this.worspaceRoot && (withId || withClass)) {
            const dataStore = indexlib_1.IndexDataStore.load(this.worspaceRoot);
            let distinctId = new Set();
            let distinctClass = new Set();
            dataStore.allIndexData().forEach((data, uri) => {
                if (withId) {
                    let idData = data[indexlib_1.IndexDataCategory.ID];
                    if (idData instanceof Array) {
                        idData.forEach((item) => {
                            var _a;
                            const name = (_a = item.label) !== null && _a !== void 0 ? _a : '';
                            if (name && !distinctId.has(name)) {
                                result.push({
                                    label: '#' + name,
                                    insertText: withSharp ? ('#' + name) : name,
                                    kind: vscode_languageserver_protocol_1.CompletionItemKind.Property,
                                    sortText: SortTexts.Id
                                });
                                distinctId.add(name);
                            }
                        });
                    }
                }
                if (withClass) {
                    let classData = data[indexlib_1.IndexDataCategory.CLASS];
                    if (classData instanceof Array) {
                        classData.forEach((item) => {
                            var _a;
                            const name = (_a = item.label) !== null && _a !== void 0 ? _a : '';
                            if (name && !distinctClass.has(name)) {
                                result.push({
                                    label: '.' + name,
                                    insertText: withDot ? ('.' + name) : name,
                                    kind: vscode_languageserver_protocol_1.CompletionItemKind.Property,
                                    sortText: SortTexts.Class
                                });
                                distinctClass.add(name);
                            }
                        });
                    }
                }
            });
        }
    }
    getElementCompletion(result) {
        const tagHxKind = { hxKind: hxIconKind_1.HxIconKind.ELEMENT };
        for (const entry of html5Tags) {
            result.push({
                label: entry,
                kind: vscode_languageserver_protocol_1.CompletionItemKind.Keyword,
                data: tagHxKind,
                sortText: SortTexts.Normal
            });
        }
        for (const entry of svgElements) {
            result.push({
                label: entry,
                kind: vscode_languageserver_protocol_1.CompletionItemKind.Keyword,
                data: tagHxKind,
                sortText: SortTexts.Normal
            });
        }
    }
    getTagAttributeCompletion(result) {
        var _a, _b;
        const htmlData = (0, htmlDataUtils_2.htmlDataProvider)();
        const attrHxKind = { hxKind: hxIconKind_1.HxIconKind.ATTRIBUTE };
        let attrNames = new Set();
        const attrCollector = (attr) => {
            const name = attr.name;
            if (!attrNames.has(name) && !name.startsWith('on')) {
                result.push({
                    label: name,
                    kind: vscode_languageserver_protocol_1.CompletionItemKind.Value,
                    data: attrHxKind,
                    sortText: SortTexts.Normal
                });
                attrNames.add(name);
            }
        };
        (_a = htmlData) === null || _a === void 0 ? void 0 : _a._tags.forEach((tag) => {
            tag.attributes.forEach(attrCollector);
        });
        (_b = htmlData) === null || _b === void 0 ? void 0 : _b._globalAttributes.forEach(attrCollector);
    }
    getPseudoClassCompletion(withColon, result) {
        const dataProvider = (0, htmlDataUtils_1.cssDataProvider)();
        const pseudoClasses = dataProvider.providePseudoClasses();
        pseudoClasses.forEach(entry => {
            const item = {
                label: entry.name,
                insertText: withColon ? entry.name : entry.name.slice(1),
                kind: vscode_languageserver_protocol_1.CompletionItemKind.Function,
                sortText: SortTexts.PseudoClass
            };
            if (entry.name.startsWith(':-')) {
                item.sortText = SortTexts.VendorPrefixed;
            }
            result.push(item);
        });
    }
    getPseudoElementCompletion(colons, result) {
        const dataProvider = (0, htmlDataUtils_1.cssDataProvider)();
        const pseudoElements = dataProvider.providePseudoElements();
        colons = Math.min(2, colons);
        colons = colons < 0 ? 0 : colons;
        pseudoElements.forEach(entry => {
            const item = {
                label: entry.name,
                insertText: entry.name.slice(2 - colons),
                kind: vscode_languageserver_protocol_1.CompletionItemKind.Function,
                sortText: SortTexts.PseudoElement
            };
            if (entry.name.startsWith('::-')) {
                item.sortText = SortTexts.VendorPrefixed;
            }
            result.push(item);
        });
    }
    getCompletionsForSelector(node) {
        let selectorTypes = [cssNodes.NodeType.PseudoSelector,
            cssNodes.NodeType.IdentifierSelector,
            cssNodes.NodeType.ClassSelector,
            cssNodes.NodeType.ElementNameSelector,
            cssNodes.NodeType.AttributeSelector];
        let existingNode = this.findInNodePath(selectorTypes);
        let replaceRange = this.getCompletionRange(existingNode);
        let result = [];
        if (existingNode) {
            if (existingNode.type == cssNodes.NodeType.IdentifierSelector) {
                this.getIdClassCompletion(true, false, false, false, result);
            }
            else if (existingNode.type == cssNodes.NodeType.ClassSelector) {
                this.getIdClassCompletion(false, false, true, false, result);
            }
            else if (existingNode.type == cssNodes.NodeType.ElementNameSelector) {
                this.getElementCompletion(result);
            }
            else if (existingNode.type == cssNodes.NodeType.PseudoSelector) {
                let text = existingNode.getText();
                if (text.startsWith('::')) {
                    this.getPseudoElementCompletion(0, result);
                }
                else {
                    this.getPseudoElementCompletion(1, result);
                    this.getPseudoClassCompletion(false, result);
                }
            }
            else if (existingNode.type == cssNodes.NodeType.AttributeSelector) {
                let offset = this.innerOffset;
                let candidate = null;
                let children = existingNode.getChildren();
                for (let i = 0; i < children.length; i++) {
                    const node = children[i];
                    if (node.offset <= offset && node.end >= offset && node.type == cssNodes.NodeType.Identifier) {
                        candidate = node;
                        break;
                    }
                }
                if (candidate || children.length == 0) {
                    this.getTagAttributeCompletion(result);
                }
            }
        }
        return result;
    }
}
function doComplete(position, document, options) {
    let sf = options.sourceFile;
    let token = (0, type_resolve_1.getTokenAtPosition)(sf, document.offsetAt(position));
    if (!token) {
        return [];
    }
    let offset = token.getStart();
    let text = token.getText();
    let temp = (0, string_1.removeQuote)(text);
    if (temp.length != text.length) {
        offset++;
    }
    let cssDocument = vscode_languageserver_textdocument_1.TextDocument.create('file:///select_complete.ts', 'css', 1.0, temp);
    let projectPath = options.workspaceFolder;
    let ws = undefined;
    if (projectPath) {
        let uri = vscode_uri_1.URI.file(projectPath).toString();
        ws = { uri, name: "" };
    }
    let completion = new CSSCompletion(document, position, ws);
    return completion.doCompletion(cssDocument, offset);
}
exports.doComplete = doComplete;
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
function getNodePath(node, offset) {
    let candidate = getNodeAtOffset(node, offset);
    const path = [];
    while (candidate) {
        path.unshift(candidate);
        candidate = candidate.parent;
    }
    return path;
}
//# sourceMappingURL=cssSelectorStringHandler.js.map