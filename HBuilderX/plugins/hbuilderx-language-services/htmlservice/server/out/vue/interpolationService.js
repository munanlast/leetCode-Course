"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findDefinition = exports.doCompletion2 = void 0;
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const javascriptMode_1 = require("../modes/javascriptMode");
const generateInterpolationScript_1 = require("./generateInterpolationScript");
const ts = require("typescript");
const path = require("path");
const vscode_uri_1 = require("vscode-uri");
const utils_1 = require("../../../../utils");
const vueScanner_1 = require("./vueScanner");
const utils_2 = require("../../../../utils");
const strings_1 = require("../utils/strings");
let documentRegs = {
    version: 100,
    documents: new Map()
};
let documentProvider = {
    get version() {
        return "" + documentRegs.version;
    },
    get documents() {
        let docs = [];
        documentRegs.documents.forEach((val, key) => {
            docs.push(key);
        });
        return docs;
    },
    compilerOptions: {
        allowNonTsExtensions: true,
        allowJs: true,
        lib: ["lib.esnext.d.ts"],
        target: ts.ScriptTarget.Latest,
        moduleResolution: ts.ModuleResolutionKind.Classic,
        experimentalDecorators: false
    },
    getDocumentSnapshot(uri) {
        let text = '';
        if (documentRegs.documents.has(uri)) {
            text = documentRegs.documents.get(uri).getText();
        }
        return {
            getText: (start, end) => text.substring(start, end),
            getLength: () => text.length,
            getChangeRange: () => undefined
        };
    },
    hasDocument(uri) {
        return documentRegs.documents.has(uri);
    },
    getDocumentVersion(uri) {
        return "" + documentRegs.documents.get(uri).version;
    }
};
const vforExpRe = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
const iteratorReg = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
const parensReg = /^\(|\)$/g;
function getLanguageService(docs, workspaceFolderDir, currentDoc) {
    // console.log(scriptText);
    // documentRegs.documents.clear();
    for (let doc of docs) {
        documentRegs.documents.set(doc.uri, doc);
    }
    let prj = utils_1.hx.getProject(workspaceFolderDir);
    if (prj) {
        return prj.createTSLanguageService(documentProvider);
    }
    return undefined;
}
function getTagAttributeValueOffset(text, tagOffset, attribute) {
    let scanner = (0, vueScanner_1.createScanner)(text, tagOffset + 1, vueScanner_1.ScannerState.WithinTag);
    let token = scanner.scan();
    let found = false;
    while (token != vueScanner_1.TokenType.EOS) {
        if (token === vueScanner_1.TokenType.AttributeName) {
            found = scanner.getTokenText() === attribute;
        }
        else if (token === vueScanner_1.TokenType.AttributeValue) {
            if (found) {
                return scanner.getTokenOffset();
            }
        }
        else if (token === vueScanner_1.TokenType.StartTagClose || token === vueScanner_1.TokenType.EndTagOpen ||
            token === vueScanner_1.TokenType.EndTagClose || token === vueScanner_1.TokenType.EndTag ||
            token === vueScanner_1.TokenType.StartTag) {
            break;
        }
        token = scanner.scan();
    }
    return -1;
}
function getTagAttributesValueOffset(text, tagOffset) {
    let scanner = (0, vueScanner_1.createScanner)(text, tagOffset + 1, vueScanner_1.ScannerState.WithinTag);
    let token = scanner.scan();
    let result = {};
    let currentAttr = '';
    while (token != vueScanner_1.TokenType.EOS) {
        if (token === vueScanner_1.TokenType.AttributeName) {
            currentAttr = scanner.getTokenText();
        }
        else if (token === vueScanner_1.TokenType.AttributeValue) {
            if (currentAttr)
                result[currentAttr] = scanner.getTokenOffset();
        }
        else if (token === vueScanner_1.TokenType.StartTagClose || token === vueScanner_1.TokenType.EndTagOpen ||
            token === vueScanner_1.TokenType.EndTagClose || token === vueScanner_1.TokenType.EndTag ||
            token === vueScanner_1.TokenType.StartTag) {
            break;
        }
        token = scanner.scan();
    }
    return result;
}
function getHtmlNodeText(document, node) {
    var _a;
    let scriptRangeStart = document.positionAt(node.startTagEnd);
    let scriptRangeEnd = document.positionAt((_a = node.endTagStart) !== null && _a !== void 0 ? _a : node.end);
    return document.getText({
        start: scriptRangeStart,
        end: scriptRangeEnd
    });
}
// 计算v-for表达式中定义的变量位置
function getVForAlias(text) {
    let match = text.match(vforExpRe);
    if (!match) {
        return undefined;
    }
    let variableName = match[2].trim();
    let nameListStr = match[1].trim().replace(parensReg, '').trim();
    let nameListOffset = text.indexOf(nameListStr);
    let variableInfo = { name: variableName, offset: text.lastIndexOf(variableName) };
    let itemInfo = { name: nameListStr, offset: nameListOffset };
    let result = { variable: variableInfo, item: itemInfo, };
    let iteratorList = nameListStr.match(iteratorReg);
    if (iteratorList) {
        itemInfo.name = nameListStr.slice(0, nameListStr.indexOf(',')).trim();
        let exp1 = iteratorList[1].trim();
        let exp2 = iteratorList[2] ? iteratorList[2].trim() : '';
        if (exp2.length > 0) {
            [exp1, exp2] = [exp2, exp1];
        }
        result.index = { name: exp1, offset: nameListOffset + nameListStr.lastIndexOf(exp1) };
        if (exp2) {
            result.key = { name: exp2, offset: nameListOffset + nameListStr.indexOf(exp2) };
        }
    }
    return result;
}
function convertComponentToScript(document, htmlDocument, textRange, position, ws) {
    var _a, _b, _c;
    let embeddedText = document.getText(textRange);
    let offset = document.offsetAt(position);
    let workspaceFolderDir = vscode_uri_1.URI.parse(ws.uri).fsPath;
    let suboffset = offset - document.offsetAt(textRange.start);
    let node = htmlDocument.findNodeAt(offset);
    let nodeAtPostion = true;
    while (node) {
        let startTagEnd = node.startTagEnd ? node.startTagEnd : node.end;
        if (!nodeAtPostion && node.tag == 'unicloud-db' && node.attributes) {
            if (node.attributes['v-slot:default'] && node.attributes['collection']) {
                let dbnode = new utils_2.JSClientDBNode(workspaceFolderDir);
                let collections = (0, strings_1.stripQuotes)(node.attributes['collection']).split(',').map((col) => { return col.trim(); });
                let fields = (0, strings_1.stripQuotes)((_a = node.attributes['field']) !== null && _a !== void 0 ? _a : '').trim();
                dbnode.setVslot((0, strings_1.stripQuotes)(node.attributes['v-slot:default']));
                dbnode.setCollections(collections);
                dbnode.setFields((0, strings_1.stripQuotes)(fields));
                dbnode.setGetone((0, strings_1.stripQuotes)((_b = node.attributes['getone']) !== null && _b !== void 0 ? _b : '') === 'true');
                let slotObjs = dbnode.computeVSlotDefaults();
                let names = [];
                let valueObjs = [];
                slotObjs.forEach((val, key) => {
                    names.push(key);
                    valueObjs.push(key + ':' + val);
                });
                let expr = `let {${names.join(',')}} = {${valueObjs.join(',')}}\n`;
                suboffset += expr.length;
                embeddedText = expr + embeddedText;
            }
        }
        else {
            let vforVaule = (_c = node.attributes) === null || _c === void 0 ? void 0 : _c['v-for'];
            if (vforVaule) {
                vforVaule = (0, strings_1.stripQuotes)(vforVaule);
                let expMatch = vforVaule.match(vforExpRe);
                if (expMatch) {
                    let variableName = expMatch[2].trim();
                    let nameListStr = expMatch[1].trim().replace(parensReg, '');
                    let iteratorExp = nameListStr;
                    let aliasList = nameListStr.match(iteratorReg);
                    let keyExp = '';
                    if (aliasList && aliasList[2]) {
                        // 当有key和index是，提取index与item合并
                        iteratorExp = nameListStr.substring(0, nameListStr.indexOf(',')).trim();
                        iteratorExp = iteratorExp + ',' + aliasList[2].trim();
                        keyExp = aliasList[1].trim();
                        keyExp = `let ${keyExp}:string=\'\'; `;
                    }
                    let snippetsPrefix = `Object.values(${variableName}).forEach((${iteratorExp})=>{\n ${keyExp}`;
                    embeddedText = snippetsPrefix + embeddedText + ';\n});';
                    suboffset += snippetsPrefix.length;
                }
            }
        }
        node = node.parent;
        nodeAtPostion = false;
    }
    return { text: embeddedText, offset: suboffset };
}
function parseComponentSymbols(document, htmlDocument, textRange, position, ws) {
    var _a, _b, _c, _d, _e;
    const docText = document.getText();
    let embeddedText = document.getText(textRange);
    let offset = document.offsetAt(position);
    // 需要约束textRange和position的有效性
    let workspaceFolderDir = vscode_uri_1.URI.parse(ws.uri).fsPath;
    let suboffset = offset - document.offsetAt(textRange.start);
    let node = htmlDocument.findNodeAt(offset);
    let nodeAtPostion = true;
    let componentSymboles = []; // embeddedText中，转换成js语言的各个变量对应到html文档中的定义
    while (node) {
        if (!node.attributes) {
            node = node.parent;
            nodeAtPostion = false;
            continue;
        }
        if (node.tag == 'unicloud-db') {
            if (!nodeAtPostion) {
                if (node.attributes['v-slot:default'] && node.attributes['collection']) {
                    let attrsInfo = getTagAttributesValueOffset(docText, node.start);
                    let slotOffset = (_a = attrsInfo['v-slot:default']) !== null && _a !== void 0 ? _a : -1;
                    if (slotOffset > 0) {
                        let currSymboles = [];
                        let dbscriptText = 'const db = uniCloud.database();\r\n';
                        let collectionText = node.attributes['collection'];
                        let fieldText = node.attributes['field'];
                        let getOne = (0, strings_1.stripQuotes)((_b = node.attributes['getone']) !== null && _b !== void 0 ? _b : '') == 'true';
                        let slotText = node.attributes['v-slot:default'];
                        let slotText2 = (0, strings_1.stripQuotes)(slotText);
                        slotOffset += (slotText.length != slotText2.length) ? 1 : 0;
                        dbscriptText += 'const ';
                        currSymboles.push({ offset: dbscriptText.length, length: slotText2.length, alias: { name: slotText2, offset: slotOffset } });
                        dbscriptText += `${slotText2} = await db.collection(`;
                        let collectionOffset = (_c = attrsInfo['collection']) !== null && _c !== void 0 ? _c : -1;
                        currSymboles.push({ offset: dbscriptText.length, length: collectionText.length, alias: { name: collectionText, offset: collectionOffset } });
                        dbscriptText += collectionText + ')';
                        if (fieldText) {
                            dbscriptText + '.field(';
                            let offset = (_d = attrsInfo['field']) !== null && _d !== void 0 ? _d : -1;
                            currSymboles.push({ offset: dbscriptText.length, length: fieldText.length, alias: { name: fieldText, offset: offset } });
                            dbscriptText += fieldText + ')';
                        }
                        dbscriptText += getOne ? '.limit(1).get();' : '.get();\r\n';
                        suboffset += dbscriptText.length;
                        embeddedText = dbscriptText + embeddedText;
                        componentSymboles.forEach((symbole => { symbole.offset += dbscriptText.length; }));
                        componentSymboles.push(...currSymboles);
                    }
                }
            }
            else {
                if (node.attributes['v-slot:default'] && node.attributes['collection']) {
                    let attrsInfo = getTagAttributesValueOffset(docText, node.start);
                    let collectionOffset = (_e = attrsInfo['collection']) !== null && _e !== void 0 ? _e : -1;
                    let collectionText = node.attributes['collection'];
                    if (collectionOffset > 0 && offset >= collectionOffset && offset < collectionOffset + collectionText.length) {
                        let dbscriptText = 'const db = uniCloud.database();\r\ndb.collection(';
                        suboffset = offset - collectionOffset + dbscriptText.length;
                        dbscriptText += collectionText + ');';
                        embeddedText = dbscriptText;
                        componentSymboles = [];
                        break;
                    }
                }
            }
        }
        else if (node.attributes['v-for']) {
            let valueOffset = getTagAttributeValueOffset(docText, node.start, 'v-for');
            let vforVaule = node.attributes['v-for'];
            if (valueOffset >= 0 && vforVaule) {
                let t = (0, strings_1.stripQuotes)(vforVaule);
                valueOffset = valueOffset + ((t.length != vforVaule.length) ? 1 : 0);
                vforVaule = t;
                let vforAlias = getVForAlias(vforVaule);
                if (vforAlias) {
                    // 调整偏移
                    let currSymboles = [];
                    Object.values(vforAlias).forEach((alias) => {
                        alias.offset = valueOffset + alias.offset;
                    });
                    let variableName = vforAlias.variable.name;
                    let itemName = vforAlias.item.name;
                    let iteratorExp = itemName;
                    let snippets = `Object.values(${variableName}).forEach((`;
                    currSymboles.push({ offset: snippets.length, length: itemName.length, alias: vforAlias.item });
                    snippets += itemName;
                    if (vforAlias.index) {
                        snippets += ',';
                        let name = vforAlias.index.name;
                        currSymboles.push({ offset: snippets.length, length: name.length, alias: vforAlias.index });
                        snippets += name;
                    }
                    snippets += ')=>{\n';
                    if (vforAlias.key) {
                        snippets += 'let ';
                        let name = vforAlias.key.name;
                        currSymboles.push({ offset: snippets.length, length: name.length, alias: vforAlias.key });
                        snippets += `${name}:string='';\n`;
                    }
                    embeddedText = snippets + embeddedText + ';\n});';
                    suboffset += snippets.length;
                    componentSymboles.forEach((symbole => { symbole.offset += snippets.length; }));
                    componentSymboles.push(...currSymboles);
                }
            }
        }
        node = node.parent;
        nodeAtPostion = false;
    }
    componentSymboles.sort((a, b) => { return a.offset - b.offset; }); //排序，方便查找
    return { text: embeddedText, offset: suboffset, symboles: componentSymboles };
}
async function findDefinition(document, htmlDocument, textRange, position, ws) {
    var _a, _b;
    if (!htmlDocument) {
        return Promise.resolve(null);
    }
    let scriptRoot = htmlDocument.roots.find(node => node.tag === 'script');
    if (!scriptRoot || scriptRoot.startTagEnd == undefined) {
        return Promise.resolve(null);
    }
    let isSetup = scriptRoot.attributes && scriptRoot.attributes['setup'] !== undefined;
    let symbolsInfo = parseComponentSymbols(document, htmlDocument, textRange, position, ws);
    const docText = document.getText();
    // 需要约束textRange和position的有效性
    let innerOffset = symbolsInfo.offset;
    let embeddedText = symbolsInfo.text;
    let componentSymboles = symbolsInfo.symboles;
    let workspaceFolderDir = vscode_uri_1.URI.parse(ws.uri).fsPath + '/';
    let currentDir = path.dirname(vscode_uri_1.URI.parse(document.uri).fsPath);
    let scriptRangeStart = document.positionAt(scriptRoot.startTagEnd);
    let scriptRangeEnd = document.positionAt((_a = scriptRoot.endTagStart) !== null && _a !== void 0 ? _a : scriptRoot.end);
    let scriptText = document.getText({
        start: scriptRangeStart,
        end: scriptRangeEnd
    });
    documentRegs.version++;
    let interpolationSource = '';
    let docs = [];
    const vueScriptTextUri = vscode_uri_1.URI.file(path.join(currentDir, '__virtual-script.vue.ts')).toString();
    let interpolationOffset = -1;
    if (!isSetup) {
        let vueScriptText = vscode_languageserver_textdocument_1.TextDocument.create(vueScriptTextUri, 'typescript', document.version, scriptText);
        docs = [vueScriptText];
        let baseInterpolationSource = `
		import vue from './__virtual-script.vue';
		let $$_dataType = vue.data();
		let $$_setupType = vue.setup();
		let $$_methods = vue.methods;
		let $$_props = vue.props;
		let $$_computed = vue.computed;
	`;
        let baseInterpolationTextUri = vscode_uri_1.URI.file(path.join(currentDir, '@v-inferrer-type-helper.vue.ts')).toString();
        let baseInterpolationText = vscode_languageserver_textdocument_1.TextDocument.create(baseInterpolationTextUri, 'typescript', documentRegs.version, baseInterpolationSource);
        let generateLS = getLanguageService([
            vueScriptText, baseInterpolationText
        ], workspaceFolderDir, document);
        if (!generateLS) {
            return Promise.resolve(null);
        }
        interpolationSource = (0, generateInterpolationScript_1.generateInterpolationScript)(generateLS, baseInterpolationText) + embeddedText;
        interpolationOffset = baseInterpolationSource.length;
    }
    else {
        interpolationSource = scriptText + '\r\n' + embeddedText;
    }
    documentRegs.version++;
    let embeddedOffset = interpolationSource.length - embeddedText.length;
    let currentOffset = embeddedOffset + innerOffset;
    let currentTextDocumentUri = vscode_uri_1.URI.file(path.join(currentDir, '@v-interpolation-script.vue')).toString();
    let currentTextDocument = vscode_languageserver_textdocument_1.TextDocument.create(currentTextDocumentUri, 'typescript', documentRegs.version, interpolationSource);
    let jsLanguageService = getLanguageService([...docs, currentTextDocument], workspaceFolderDir, document);
    if (!jsLanguageService) {
        return Promise.resolve(null);
    }
    let definitionsInfo = jsLanguageService.getDefinitionAndBoundSpan(currentTextDocument.uri, currentOffset);
    let defs = (_b = definitionsInfo === null || definitionsInfo === void 0 ? void 0 : definitionsInfo.definitions) !== null && _b !== void 0 ? _b : [];
    if (defs.length > 0) {
        let definitionStack = [];
        defs.forEach(info => definitionStack.push(info));
        while (definitionStack.length > 0) {
            let info = definitionStack.pop();
            let insideScriptRoot = false;
            if (info.fileName == currentTextDocument.uri) {
                let infoContextStart = info.contextSpan ? info.contextSpan.start : -1;
                let isLetExpr = info.kind == ts.ScriptElementKind.letElement || info.kind == ts.ScriptElementKind.functionElement;
                if (!isSetup && isLetExpr && infoContextStart >= interpolationOffset && infoContextStart < embeddedOffset) {
                    let finalDefInfos = jsLanguageService.getDefinitionAtPosition(currentTextDocument.uri, info.contextSpan.start + info.contextSpan.length - 1);
                    if (finalDefInfos && finalDefInfos.length > 0) {
                        finalDefInfos.forEach(item => definitionStack.push(item));
                    }
                }
                else if (info.textSpan.start >= embeddedOffset) {
                    for (let i = 0; i < componentSymboles.length; i++) {
                        const sym = componentSymboles[i];
                        const tmpoffset = sym.offset + embeddedOffset;
                        if (tmpoffset > info.textSpan.start)
                            break;
                        if (tmpoffset + sym.length > info.textSpan.start) {
                            let a = info.textSpan.start - tmpoffset + sym.alias.offset;
                            let start = document.positionAt(a);
                            let end = document.positionAt(a + info.textSpan.length);
                            return {
                                uri: document.uri,
                                range: { start, end }
                            };
                        }
                    }
                }
                else if (isSetup) {
                    insideScriptRoot = true;
                }
            }
            else if (!isSetup && info.fileName == vueScriptTextUri) {
                insideScriptRoot = true;
            }
            if (insideScriptRoot) {
                let result = {
                    uri: document.uri,
                    range: {
                        start: document.positionAt(info.textSpan.start + document.offsetAt(scriptRangeStart)),
                        end: document.positionAt(info.textSpan.start + info.textSpan.length + document.offsetAt(scriptRangeStart)),
                    }
                };
                return Promise.resolve(result);
            }
        }
    }
    if (defs.length > 0) {
        const d = defs[0];
        const { line, character } = jsLanguageService.toLineColumnOffset(d.fileName, d.textSpan.start);
        let _range = {
            start: {
                line: line,
                character: character
            },
            end: {
                line: line,
                character: character + d.textSpan.length
            }
        };
        return [{
                targetUri: utils_1.hx.toNormalizedUri(d.fileName),
                targetRange: _range,
                targetSelectionRange: _range
            }];
    }
    return Promise.resolve(null);
}
exports.findDefinition = findDefinition;
/**
 * @param {TextDocument} document 当前文档
 * @param {HTMLDocument} htmlDocument 当前html文档语法树
 * @param {Range} textRange 文档中需要语法提示的文本范围
 * @param {Position} postion 全局光标位置
 * @param {WorkspaceFolder} ws document所在项目
 */
async function doCompletion2(document, htmlDocument, textRange, position, ws) {
    const result = {
        isIncomplete: false,
        items: []
    };
    if (!htmlDocument) {
        return result;
    }
    let scriptRoot = htmlDocument.roots.find(node => node.tag === 'script');
    if (!scriptRoot || scriptRoot.startTagEnd == undefined) {
        return result;
    }
    let isSetup = scriptRoot.attributes && scriptRoot.attributes['setup'] !== undefined;
    let scriptInfo = convertComponentToScript(document, htmlDocument, textRange, position, ws);
    let embeddedText = scriptInfo.text;
    let innerOffset = scriptInfo.offset;
    let workspaceFolderDir = vscode_uri_1.URI.parse(ws.uri).fsPath + '/';
    let currentDir = path.dirname(document.uri);
    let scriptText = getHtmlNodeText(document, scriptRoot);
    documentRegs.version++;
    let interpolationSource = '';
    let docs = [];
    if (!isSetup) {
        let uri = vscode_uri_1.URI.parse(currentDir + '/__virtual-script.vue.ts').toString();
        let vueScriptText = vscode_languageserver_textdocument_1.TextDocument.create(uri, 'typescript', document.version, scriptText);
        docs = [vueScriptText];
        let baseInterpolationSource = `
		import vue from './__virtual-script.vue';
		let $$_dataType = vue.data();
		let $$_setupType = vue.setup();
		let $$_methods = vue.methods;
		let $$_props = vue.props;
		let $$_computed = vue.computed;
		`;
        uri = vscode_uri_1.URI.parse(currentDir + '/@v-inferrer-type-helper.vue.ts').toString();
        let baseInterpolationText = vscode_languageserver_textdocument_1.TextDocument.create(uri, 'typescript', documentRegs.version, baseInterpolationSource);
        let generateLS = getLanguageService([
            vueScriptText, baseInterpolationText
        ], workspaceFolderDir, document);
        if (!generateLS) {
            return result;
        }
        interpolationSource = (0, generateInterpolationScript_1.generateInterpolationScript)(generateLS, baseInterpolationText) + embeddedText;
    }
    else {
        interpolationSource = scriptText + '\r\n' + embeddedText;
    }
    documentRegs.version++;
    let currentOffset = interpolationSource.length - embeddedText.length + innerOffset;
    let currentTextDocumentUri = vscode_uri_1.URI.parse(currentDir + '/@v-interpolation-script.ts').toString();
    let currentTextDocument = vscode_languageserver_textdocument_1.TextDocument.create(currentTextDocumentUri, 'typescript', documentRegs.version, interpolationSource);
    let jsLanguageService = getLanguageService([...docs, currentTextDocument], workspaceFolderDir, document);
    if (!jsLanguageService) {
        return result;
    }
    let completions = jsLanguageService.getCompletionsAtPosition(currentTextDocument.uri, currentOffset, undefined);
    if (completions) {
        let items = completions.entries.filter(entry => (entry.kind != "keyword")).map(entry => {
            return {
                uri: currentTextDocument.uri,
                position: position,
                label: entry.name,
                sortText: entry.sortText,
                kind: (0, javascriptMode_1.convertKind)(entry.kind),
                data: {
                    kind: 'vue-mustache',
                    languageId: 'vue-template',
                    uri: document.uri
                }
            };
        });
        result.items = items.filter(item => !item.label.startsWith("$$_"));
    }
    result.isIncomplete = true;
    return Promise.resolve(result);
}
exports.doCompletion2 = doCompletion2;
//# sourceMappingURL=interpolationService.js.map