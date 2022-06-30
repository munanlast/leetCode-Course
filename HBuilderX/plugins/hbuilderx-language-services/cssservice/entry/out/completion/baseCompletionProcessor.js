"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCompletionProcessor = void 0;
const path_1 = require("path");
const vscode_css_languageservice_1 = require("vscode-css-languageservice");
const vscode_languageserver_1 = require("vscode-languageserver");
const vscode_uri_1 = require("vscode-uri");
const entry_1 = require("../../../../htmlservice/entry");
const indexlib_1 = require("../../../../indexlib");
const utils_1 = require("../../../../utils");
const contextCompletionProcessor_1 = require("../context/contextCompletionProcessor");
const extraProcessor_1 = require("../grammar/extraProcessor");
const grammarProcessor_1 = require("../grammar/grammarProcessor");
const baseIndexProcessor_1 = require("../index/baseIndexProcessor");
const util_1 = require("../utils/util");
const { Scanner } = require('vscode-css-languageservice/lib/umd/parser/cssScanner');
const { ParseErrorCollector } = require('vscode-css-languageservice/lib/umd/parser/cssNodes');
// 此类为实现额外补全项的基类, 将大部分功能相同的代码写在此处
const SnippetFormat = vscode_languageserver_1.InsertTextFormat.Snippet;
const retriggerCommand = {
    title: 'Suggest',
    command: 'editor.action.triggerSuggest',
};
class BaseCompletionProcessor {
    constructor() {
        // 根据token获取补全类型
        this.getCompletionTypeFromScanner = contextCompletionProcessor_1.getCompletionTypeFromScanner;
        this.getCompletionDataFromScanner = contextCompletionProcessor_1.getCompletionDataFromScanner;
        // 根据项目类型和语法库, 对现有补全项, 做增加和删减
        this.getGrammarCompletionData = grammarProcessor_1.getGrammarCompletionData;
    }
    isErrorAstNode(document, position, astNode) {
        const offset = document.offsetAt(position);
        const entries = ParseErrorCollector.entries(astNode);
        for (const iterator of entries) {
            if (iterator.offset + iterator.length < offset) {
                return true;
            }
        }
        return false;
    }
    getCompletionTypeFromAstNode(document, position, astNode) {
        var _a, _b;
        const offset = document.offsetAt(position);
        const currentAstNode = (0, util_1.getNodeAtOffset)(astNode, offset);
        return {
            type: currentAstNode === null || currentAstNode === void 0 ? void 0 : currentAstNode.type,
            parentType: (_a = currentAstNode === null || currentAstNode === void 0 ? void 0 : currentAstNode.parent) === null || _a === void 0 ? void 0 : _a.type,
            nodeType: currentAstNode === null || currentAstNode === void 0 ? void 0 : currentAstNode.nodeType,
            parentNodeType: (_b = currentAstNode === null || currentAstNode === void 0 ? void 0 : currentAstNode.parent) === null || _b === void 0 ? void 0 : _b.nodeType,
            isNode: true,
        };
    }
    getHxKind(hxKind, completionItemKind, label) {
        if (hxKind) {
            return hxKind;
        }
        if (!completionItemKind) {
            completionItemKind = vscode_languageserver_1.CompletionItemKind.Text;
        }
        if (completionItemKind === vscode_languageserver_1.CompletionItemKind.Keyword) {
            if (util_1.html5Tags.includes(label) || util_1.svgElements.includes(label)) {
                return utils_1.HxIconKind.ELEMENT;
            }
            else if (label.startsWith('.')) {
                return utils_1.HxIconKind.CLASS;
            }
            else if (label.startsWith('#')) {
                return utils_1.HxIconKind.ID;
            }
            else if (label.startsWith('@')) {
                return utils_1.HxIconKind.ATTRIBUTE;
            }
        }
        else if (completionItemKind === vscode_languageserver_1.CompletionItemKind.Function) {
            if (label.endsWith('()')) {
                return utils_1.HxIconKind.FUNCTION;
            }
            else if (label.startsWith(':')) {
                return utils_1.HxIconKind.CLASS;
            }
        }
        return utils_1.HxIconKind.DEFAULT;
    }
    async getHxKindConvertedCompletionData(completionList) {
        var _a;
        for (const item of completionList.items) {
            let oriData = undefined;
            if (item.data) {
                oriData = item.data;
            }
            let completionItemKind = item.kind;
            let label = item.label;
            let hxKind = (_a = item.data) === null || _a === void 0 ? void 0 : _a.hxKind;
            item.data = {
                hxKind: this.getHxKind(hxKind, completionItemKind, label),
                oriData: oriData,
            };
        }
        return completionList;
    }
    async getSelfIdSelectorCompletionData(document, position, completionType, completionList) {
        const isRightType = (0, util_1.isRightCompletionType)(completionType, undefined, [util_1.NodeType.ClassSelector, util_1.NodeType.IdentifierSelector, util_1.NodeType.ElementNameSelector], util_1.NodeType.Selector);
        if (!isRightType) {
            return completionList;
        }
        let offset = document.offsetAt(position);
        let currentWord = (0, util_1.getCurrentWord)(document, offset);
        const visited = {};
        visited[currentWord] = true;
        const docText = document.getText();
        let start = vscode_languageserver_1.Position.create(position.line, position.character - currentWord.length);
        // 通过token找自身的ID(原为通过语法树查找)
        const tokenList = (0, contextCompletionProcessor_1.getTokenList)(document);
        for (let i = 0; i < tokenList.length; i++) {
            if (tokenList[i].type === util_1.TokenType.Hash) {
                if (tokenList[i].text.charAt(0) === '#' && !visited[tokenList[i].text]) {
                    visited[tokenList[i].text] = true;
                    completionList.items.push({
                        label: tokenList[i].text,
                        textEdit: vscode_languageserver_1.TextEdit.replace(vscode_languageserver_1.Range.create(start, position), tokenList[i].text),
                        kind: vscode_languageserver_1.CompletionItemKind.Keyword,
                        data: {
                            hxKind: utils_1.HxIconKind.ID,
                        },
                    });
                }
            }
        }
        return completionList;
    }
    async getSelfClassSelectorCompletionData(document, position, completionType, completionList) {
        const isRightType = (0, util_1.isRightCompletionType)(completionType, undefined, [util_1.NodeType.ClassSelector, util_1.NodeType.IdentifierSelector, util_1.NodeType.ElementNameSelector], util_1.NodeType.Selector);
        if (!isRightType) {
            return completionList;
        }
        let offset = document.offsetAt(position);
        let currentWord = (0, util_1.getCurrentWord)(document, offset);
        const visited = {};
        visited[currentWord] = true;
        const docText = document.getText();
        let start = vscode_languageserver_1.Position.create(position.line, position.character - currentWord.length);
        visited[currentWord] = true;
        const styleSheet = (0, vscode_css_languageservice_1.getCSSLanguageService)().parseStylesheet(document);
        styleSheet.accept((n) => {
            if (n.type === util_1.NodeType.SimpleSelector && n.length > 0) {
                const selector = docText.substring(n.offset, n.length);
                if (selector.charAt(0) === '.' && !visited[selector]) {
                    visited[selector] = true;
                    completionList.items.push({
                        label: selector,
                        textEdit: vscode_languageserver_1.TextEdit.replace(vscode_languageserver_1.Range.create(start, position), selector),
                        kind: vscode_languageserver_1.CompletionItemKind.Keyword,
                    });
                }
                return false;
            }
            return true;
        });
        return completionList;
    }
    // 由于部分函数需要严格的匹配规则, 需单独实现
    addCalcFunction(document, start, position, completionList) {
        const offset = document.offsetAt(position);
        const leftLineText = (0, util_1.getOffsetLeftLineText)(document, offset);
        const colonOffset = leftLineText.indexOf(':');
        const propertyText = document.getText(vscode_languageserver_1.Range.create(vscode_languageserver_1.Position.create(position.line, 0), vscode_languageserver_1.Position.create(position.line, colonOffset))).trim();
        const data = (0, vscode_css_languageservice_1.getDefaultCSSDataProvider)();
        const propertyData = data.provideProperties();
        let isNeedCalc = false;
        for (const iterator of propertyData) {
            if (propertyText !== iterator.name) {
                continue;
            }
            const propertyRestrictions = iterator.restrictions;
            if (propertyRestrictions && propertyRestrictions.length > 0) {
                for (const iterator of propertyRestrictions) {
                    isNeedCalc = (0, util_1.includesList)(iterator, util_1.calcRestrictionTypes);
                    if (isNeedCalc)
                        break;
                }
            }
            if (isNeedCalc)
                break;
        }
        if (isNeedCalc) {
            completionList.items.push({
                label: 'calc()',
                documentation: 'Evaluates an mathematical expression. The following operators can be used: + - * /.',
                textEdit: vscode_languageserver_1.TextEdit.replace(vscode_languageserver_1.Range.create(start, position), 'calc()'),
                kind: vscode_languageserver_1.CompletionItemKind.Function,
            });
        }
        return completionList;
    }
    async getFunctionsCompletionData(document, position, completionType, completionList) {
        if (!completionType) {
            return completionList;
        }
        const offset = document.offsetAt(position);
        const currentWord = (0, util_1.getCurrentWord)(document, offset);
        if (currentWord === '') {
            const isRightType = (0, util_1.isRightCompletionType)(completionType, [util_1.NodeType.Declarations, util_1.NodeType.Ruleset], undefined, util_1.NodeType.Value);
            if (!isRightType) {
                return completionList;
            }
        }
        else {
            const isRightType = (0, util_1.isRightCompletionType)(completionType, [util_1.NodeType.Identifier, util_1.NodeType.Term], undefined, util_1.NodeType.Value);
            if (!isRightType) {
                return completionList;
            }
        }
        let start = vscode_languageserver_1.Position.create(position.line, position.character - currentWord.length);
        completionList.items.push({
            label: 'var()',
            documentation: 'Evaluates the value of a custom variable.',
            textEdit: vscode_languageserver_1.TextEdit.replace(vscode_languageserver_1.Range.create(start, position), 'var()'),
            kind: vscode_languageserver_1.CompletionItemKind.Function,
        });
        let addFunc = this.addCalcFunction(document, start, position, completionList);
        completionList.items.push(...addFunc.items);
        return completionList;
    }
    getMediaType(lineText) {
        if (lineText.endsWith('@media')) {
            return 'all';
        }
        if (lineText.endsWith('not') || lineText.endsWith('only') || lineText.endsWith(',')) {
            return 'mediaType';
        }
        if (lineText.endsWith('(')) {
            return 'mediaFeature';
        }
        if (lineText.endsWith(')')) {
            return 'mediaLogicalOperator';
        }
        for (const iterator of extraProcessor_1.mediaTypes) {
            if (lineText.endsWith(iterator.name)) {
                return 'mediaLogicalOperator';
            }
        }
        return undefined;
    }
    async getMediaCompletionData(document, position, completionType, completionList) {
        // 判断当前位置
        // @media not|only mediatype and (mediafeature and|or|not mediafeature) {
        //    CSS-Code;
        // }
        const isRightType = (0, util_1.isRightCompletionType)(completionType, [util_1.NodeType.Media, util_1.NodeType.MediaQuery], undefined, util_1.NodeType.Media);
        if (!isRightType) {
            return completionList;
        }
        let offset = document.offsetAt(position);
        let currentWord = (0, util_1.getCurrentWord)(document, offset);
        // 获取当前行光标前的文本
        let lineRangeBeforeOffset = vscode_languageserver_1.Range.create(vscode_languageserver_1.Position.create(position.line, 0), position);
        // 获取当前光标位置, 去除已输入文字的光标前的文本
        let lineRangeBeforeCurrentWord = vscode_languageserver_1.Range.create(vscode_languageserver_1.Position.create(position.line, 0), vscode_languageserver_1.Position.create(position.line, position.character - currentWord.length));
        let lineText = document.getText(lineRangeBeforeCurrentWord).trim();
        let start = vscode_languageserver_1.Position.create(position.line, position.character - currentWord.length);
        // 因当前语法树, 无法获取准确信息, 故分析当前行字符串进行判断
        let type = this.getMediaType(lineText);
        completionList.items = [];
        if (!type) {
            return completionList;
        }
        if (type === 'all') {
            completionList.items.push({
                label: 'ont',
                detail: 'mediaLogicalOperator',
                textEdit: vscode_languageserver_1.TextEdit.replace(vscode_languageserver_1.Range.create(start, position), 'ont'),
                kind: vscode_languageserver_1.CompletionItemKind.Property,
            });
            completionList.items.push({
                label: 'only',
                detail: 'mediaLogicalOperator',
                textEdit: vscode_languageserver_1.TextEdit.replace(vscode_languageserver_1.Range.create(start, position), 'only'),
                kind: vscode_languageserver_1.CompletionItemKind.Property,
            });
        }
        switch (type) {
            case 'all':
            case 'mediaType':
                for (const mediaType of extraProcessor_1.mediaTypes) {
                    completionList.items.push({
                        label: mediaType.name,
                        detail: 'mediaType',
                        documentation: mediaType.description,
                        textEdit: vscode_languageserver_1.TextEdit.replace(vscode_languageserver_1.Range.create(start, position), mediaType.name),
                        kind: vscode_languageserver_1.CompletionItemKind.Property,
                    });
                }
                break;
            case 'mediaLogicalOperator':
                for (const mediaLogicalOperator of extraProcessor_1.mediaLogicalOperators) {
                    completionList.items.push({
                        label: mediaLogicalOperator,
                        detail: 'mediaLogicalOperator',
                        textEdit: vscode_languageserver_1.TextEdit.replace(vscode_languageserver_1.Range.create(start, position), mediaLogicalOperator),
                        kind: vscode_languageserver_1.CompletionItemKind.Property,
                    });
                }
                break;
            case 'mediaFeature':
                for (const mediaFeature of extraProcessor_1.mediaFeatures) {
                    completionList.items.push({
                        label: mediaFeature.name,
                        detail: 'mediaFeature',
                        documentation: mediaFeature.description,
                        textEdit: vscode_languageserver_1.TextEdit.replace(vscode_languageserver_1.Range.create(start, position), mediaFeature.name),
                        kind: vscode_languageserver_1.CompletionItemKind.Property,
                    });
                }
                break;
        }
        return completionList;
    }
    async getCharsetCompletionData(document, position, completionType, completionList) {
        const isRightType = (0, util_1.isRightCompletionType)(completionType, [util_1.NodeType.Stylesheet], undefined, undefined, 'charset');
        if (!isRightType) {
            return completionList;
        }
        const offset = document.offsetAt(position);
        const leftLineText = (0, util_1.getOffsetLeftLineText)(document, offset);
        const rightLineText = (0, util_1.getOffsetRightLineText)(document, offset);
        const doubleQuotes = leftLineText.indexOf('"');
        const apostrophe = leftLineText.indexOf("'");
        if (doubleQuotes === -1 && apostrophe === -1)
            return completionList;
        let startPosition = vscode_languageserver_1.Position.create(position.line, doubleQuotes + 1);
        let endPosition = vscode_languageserver_1.Position.create(position.line, rightLineText.indexOf('"') + leftLineText.length);
        if (apostrophe > -1) {
            startPosition = vscode_languageserver_1.Position.create(position.line, apostrophe + 1);
            endPosition = vscode_languageserver_1.Position.create(position.line, rightLineText.indexOf("'") + leftLineText.length);
        }
        const range = vscode_languageserver_1.Range.create(startPosition, endPosition);
        if (leftLineText.includes('@charset')) {
            completionList.items = [];
            for (const charset of extraProcessor_1.charsetFeatures) {
                completionList.items.push({
                    label: charset.name,
                    detail: 'mediaFeature',
                    documentation: charset.description,
                    textEdit: vscode_languageserver_1.TextEdit.replace(range, charset.name),
                    kind: vscode_languageserver_1.CompletionItemKind.Property,
                });
            }
        }
        return completionList;
    }
    getFileIconType(suffix) {
        let type = utils_1.HxIconKind.FILE;
        if ((0, util_1.includesList)(suffix, utils_1.DefaultFileExtensions.image)) {
            type = utils_1.HxIconKind.IMAGE;
        }
        else if ((0, util_1.includesList)(suffix, utils_1.DefaultFileExtensions.font)) {
            type = utils_1.HxIconKind.FILE;
        }
        else if ((0, util_1.includesList)(suffix, ['.css', '.scss', '.less'])) {
            type = utils_1.HxIconKind.CSS;
        }
        else if ((0, util_1.includesList)(suffix, ['.js'])) {
            type = utils_1.HxIconKind.JS;
        }
        return type;
    }
    async getUrlFilePath(workspaceFolder, document, currentWord, property) {
        let option = {
            extensionFilters: ['.css'],
            prefixPath: currentWord,
            limit: 100,
            timeout: 300,
            withCurrentLevelFolder: true,
        };
        if ((0, util_1.includesList)(property, util_1.imageUrlProperty)) {
            option.extensionFilters = utils_1.DefaultFileExtensions.image;
        }
        else if ((0, util_1.includesList)(property, ['src'])) {
            option.extensionFilters = utils_1.DefaultFileExtensions.font;
        }
        else if (property === 'cssFile') {
            option.extensionFilters.push(`.${document.languageId}`);
            option.extensionFilters = [...new Set(option.extensionFilters)];
        }
        else {
            option.extensionFilters = [];
        }
        let strPathList = [];
        let pathList = await (0, utils_1.getCompletionFiles)(workspaceFolder, option, document.uri);
        if (pathList !== null) {
            for (const iterator of pathList.files) {
                // 根据文件后缀设置图标类型
                const flag = iterator.relative.lastIndexOf('.');
                const suffix = iterator.relative.substring(flag);
                let type = this.getFileIconType(suffix);
                if (iterator.isDir)
                    type = utils_1.HxIconKind.FOLDER;
                // 直接触发代码助手的情况
                if (currentWord === '') {
                    // 将没有./的本层级路径, 加上./
                    if (!iterator.relative.includes('/')) {
                        iterator.relative = './' + iterator.relative;
                    }
                }
                strPathList.push({ label: iterator.relative, data: { hxKind: type } });
            }
        }
        return strPathList;
    }
    // 支持uni-app下的@路径, 然后对返回的路径进行排序
    supportAtPathAndSort(workspaceFolder, docDir, prefixPath, range, pathList) {
        let completionList = { isIncomplete: true, items: [] };
        // 将当前能提示的所有文件路径, 做转换, 转换成@可使用的
        // 此转换只能在uni-app项目下使用
        let strWorkspaceFolder = vscode_uri_1.URI.parse(workspaceFolder.uri).fsPath;
        let isUniAppProject = (0, utils_1.getProjectType)(strWorkspaceFolder) === utils_1.ProjectType.PT_UniApp_Vue;
        let atList = [];
        if (isUniAppProject) {
            for (const item of pathList) {
                if (item.data.hxKind === utils_1.HxIconKind.FOLDER)
                    continue;
                let relativePath = prefixPath + item.label;
                let absolutePath = (0, path_1.resolve)((0, path_1.dirname)(docDir), relativePath);
                absolutePath = absolutePath.replace(strWorkspaceFolder, '@').replace(/\\/g, '/');
                atList.push({
                    label: absolutePath,
                    textEdit: vscode_languageserver_1.TextEdit.replace(range, absolutePath),
                    kind: vscode_languageserver_1.CompletionItemKind.Property,
                    data: item.data,
                });
            }
        }
        pathList.push(...atList);
        // 进行排序处理, 生成补全数据
        for (const path of pathList) {
            let sort1 = 'z';
            let sort2 = 'z';
            if (path.data.hxKind !== utils_1.HxIconKind.FOLDER)
                sort1 = 'a';
            if (path.label.startsWith('@'))
                sort2 = 'a';
            if (path.label.startsWith('./'))
                sort2 = 'b';
            completionList.items.push({
                label: path.label,
                textEdit: vscode_languageserver_1.TextEdit.replace(range, path.label),
                kind: vscode_languageserver_1.CompletionItemKind.Property,
                sortText: sort1 + sort2 + '_' + path.label,
                data: path.data,
            });
        }
        return completionList;
    }
    async getPathCompletionData(workspaceFolder, document, position, completionType, completionList) {
        if (!workspaceFolder) {
            return completionList;
        }
        const isImportType = (0, util_1.isRightCompletionType)(completionType, [util_1.NodeType.Import, util_1.NodeType.StringLiteral], undefined, util_1.NodeType.Import);
        const isUrlType = (0, util_1.isRightCompletionType)(completionType, [util_1.NodeType.URILiteral], [util_1.NodeType.URILiteral], util_1.NodeType.URILiteral);
        if (!isImportType && !isUrlType)
            return completionList;
        const lineText = (0, util_1.getLineTextFromPosition)(document, position);
        if (isImportType && !lineText.includes('@import'))
            return completionList;
        const doubleQuotes = lineText.indexOf('"');
        const apostrophe = lineText.indexOf("'");
        const colon = lineText.indexOf(':');
        const parenthesisL = lineText.indexOf('(');
        let start;
        if (doubleQuotes === -1 && apostrophe === -1) {
            if (!isUrlType) {
                return completionList;
            }
            start = vscode_languageserver_1.Position.create(position.line, parenthesisL + 1);
        }
        else {
            start = vscode_languageserver_1.Position.create(position.line, doubleQuotes + 1);
            if (apostrophe > -1) {
                start = vscode_languageserver_1.Position.create(position.line, apostrophe + 1);
            }
        }
        let range = vscode_languageserver_1.Range.create(start, position);
        let currentWord = document.getText(range);
        const property = lineText.substring(0, colon).trim();
        // 根据/重新获取range, 主要适配以/开头的路径, 和写了一半的路径
        if (currentWord.lastIndexOf('/') > 0) {
            start = vscode_languageserver_1.Position.create(start.line, start.character + currentWord.lastIndexOf('/') + 1);
        }
        if (currentWord === '/') {
            start = vscode_languageserver_1.Position.create(start.line, start.character + 1);
        }
        range = vscode_languageserver_1.Range.create(start, position);
        let pathList = [];
        if (currentWord === '@') {
            currentWord = '';
        }
        if (isImportType) {
            pathList = await this.getUrlFilePath(workspaceFolder, document, currentWord, 'cssFile');
        }
        else if (isUrlType && lineText.includes('@import')) {
            pathList = await this.getUrlFilePath(workspaceFolder, document, currentWord, 'cssFile');
        }
        else if (isUrlType) {
            pathList = await this.getUrlFilePath(workspaceFolder, document, currentWord, property);
        }
        if (pathList.length === 0) {
            return completionList;
        }
        completionList.isIncomplete = true;
        completionList = this.supportAtPathAndSort(workspaceFolder, vscode_uri_1.URI.parse(document.uri).fsPath, currentWord, range, pathList);
        return completionList;
    }
    async getDeprecatedCompletionData(document, position, completionType, completionList) {
        return (0, contextCompletionProcessor_1.getDeprecatedPseudoList)(document, position, completionType, completionList);
    }
    async getExtraCompletionData(workspaceFolder, document, position, completionType, completionList) {
        if (!completionType) {
            return completionList;
        }
        // 添加自身ID补全项
        completionList = await this.getSelfIdSelectorCompletionData(document, position, completionType, completionList);
        // 添加一些过时的, vscode没有的补全提示项
        completionList = await this.getDeprecatedCompletionData(document, position, completionType, completionList);
        // 添加缺失的函数补全项
        completionList = await this.getFunctionsCompletionData(document, position, completionType, completionList);
        // 添加Media补全提示项
        completionList = await this.getMediaCompletionData(document, position, completionType, completionList);
        // 添加charset补全提示项
        completionList = await this.getCharsetCompletionData(document, position, completionType, completionList);
        // 添加路径补全提示项
        completionList = await this.getPathCompletionData(workspaceFolder, document, position, completionType, completionList);
        return completionList;
    }
    // 添加基础补全功能: 属性选择器
    async getPropertySelectorCompletionData(workspaceFolder, document, position, completionType, completionList) {
        // 先判断位置是否处在选择器
        const isRightType = (0, util_1.isRightCompletionType)(completionType, [util_1.NodeType.AttributeSelector], undefined, util_1.NodeType.AttributeSelector);
        if (!isRightType) {
            return completionList;
        }
        // 如果是node获取的结果, 需要重新获取, 因node获取的结果缺少需要的参数
        if (completionType === null || completionType === void 0 ? void 0 : completionType.isNode)
            completionType = (0, contextCompletionProcessor_1.getCompletionTypeFromScanner)(document, position);
        let offset = document.offsetAt(position);
        let currentWord = (0, util_1.getCurrentWord)(document, offset);
        let tagWord = completionType === null || completionType === void 0 ? void 0 : completionType.context;
        // 从html获取数据, 生成补全数据
        let tagAttributes = [];
        if (tagWord && util_1.html5Tags.includes(tagWord)) {
            tagAttributes = (0, entry_1.getTagAttributes)(workspaceFolder, tagWord);
        }
        else {
            tagAttributes = (0, entry_1.getTagAttributes)(workspaceFolder);
        }
        let start = vscode_languageserver_1.Position.create(position.line, position.character - currentWord.length);
        completionList.items = [];
        for (const iterator of tagAttributes) {
            completionList.items.push({
                label: iterator,
                textEdit: vscode_languageserver_1.TextEdit.replace(vscode_languageserver_1.Range.create(start, position), iterator),
                kind: vscode_languageserver_1.CompletionItemKind.Property,
            });
        }
        return completionList;
    }
    // 根据项目类型, 提供px转换功能
    async webPxConversion(document, position, connection, scopedSettingsSupport, completionList) {
        // 获取当前文本数据
        let offset = document.offsetAt(position);
        let currentWord = (0, util_1.getCurrentWord)(document, offset);
        // 非p或px结尾的, 直接返回结果
        if (!(currentWord.endsWith('p') || currentWord.endsWith('px'))) {
            return completionList;
        }
        if (!connection) {
            return completionList;
        }
        if (!scopedSettingsSupport) {
            return completionList;
        }
        // 获取配置文件信息
        let isOpenPxConversion = await (0, util_1.getHXSettings)(`editor.codeassist.px2rem.enabel`, connection, scopedSettingsSupport);
        if (!isOpenPxConversion) {
            return completionList;
        }
        let conversionProportion = await (0, util_1.getHXSettings)(`editor.codeassist.px2rem.proportion`, connection, scopedSettingsSupport);
        let conversionDecimalLength = await (0, util_1.getHXSettings)(`editor.codeassist.px2rem.decimalLength`, connection, scopedSettingsSupport);
        if (!conversionProportion) {
            conversionProportion = 1;
        }
        if (!conversionDecimalLength) {
            conversionDecimalLength = 2;
        }
        // 进行px转换, 生成对应补全项
        let start = vscode_languageserver_1.Position.create(position.line, position.character - currentWord.length);
        let pxNumber = currentWord.match(/\d+/);
        let pxNumberStr = '';
        // pxNumber?pxNumber[0]:'';
        if (pxNumber) {
            pxNumberStr = pxNumber[0];
        }
        let pxNumberInt = parseFloat(pxNumberStr);
        let cpxNumberInt = pxNumberInt / conversionProportion;
        let cpxNumberDec = cpxNumberInt.toFixed(conversionDecimalLength);
        cpxNumberDec = cpxNumberDec.replace(/0+$/, '');
        if (cpxNumberDec.endsWith('.')) {
            cpxNumberDec = cpxNumberDec.substring(0, cpxNumberDec.length - 1);
        }
        // 只写px不写数字的情况
        if (pxNumberStr === '') {
            return completionList;
        }
        completionList.items.push({
            label: pxNumber + 'px->' + cpxNumberDec + 'rem',
            textEdit: vscode_languageserver_1.TextEdit.replace(vscode_languageserver_1.Range.create(start, position), cpxNumberDec + 'rem'),
            kind: vscode_languageserver_1.CompletionItemKind.Snippet,
        });
        return completionList;
    }
    async uniPxConversion(document, position, connection, scopedSettingsSupport, completionList) {
        // 获取当前文本数据
        let offset = document.offsetAt(position);
        let currentWord = (0, util_1.getCurrentWord)(document, offset);
        // 非p或px结尾的, 直接返回结果
        if (!(currentWord.endsWith('p') || currentWord.endsWith('px'))) {
            return completionList;
        }
        if (!connection) {
            return completionList;
        }
        if (!scopedSettingsSupport) {
            return completionList;
        }
        // 获取配置文件信息
        let isOpenPxConversion = await (0, util_1.getHXSettings)(`editor.codeassist.px2upx.enabel`, connection, scopedSettingsSupport);
        if (!isOpenPxConversion) {
            return completionList;
        }
        let conversionProportion = await (0, util_1.getHXSettings)(`editor.codeassist.px2upx.proportion`, connection, scopedSettingsSupport);
        let conversionDecimalLength = await (0, util_1.getHXSettings)(`editor.codeassist.px2upx.decimalLength`, connection, scopedSettingsSupport);
        if (!conversionProportion) {
            conversionProportion = 1;
        }
        if (!conversionDecimalLength) {
            conversionDecimalLength = 2;
        }
        // 进行px转换, 生成对应补全项
        let start = vscode_languageserver_1.Position.create(position.line, position.character - currentWord.length);
        let pxNumber = currentWord.match(/\d+/);
        let pxNumberStr = '';
        // pxNumber?pxNumber[0]:'';
        if (pxNumber) {
            pxNumberStr = pxNumber[0];
        }
        let pxNumberInt = parseFloat(pxNumberStr);
        let cpxNumberInt = pxNumberInt / conversionProportion;
        let cpxNumberDec = cpxNumberInt.toFixed(conversionDecimalLength);
        cpxNumberDec = cpxNumberDec.replace(/0+$/, '');
        if (cpxNumberDec.endsWith('.')) {
            cpxNumberDec = cpxNumberDec.substring(0, cpxNumberDec.length - 1);
        }
        // 只写px不写数字的情况
        if (pxNumberStr === '') {
            return completionList;
        }
        completionList.items.push({
            label: pxNumber + 'px->' + cpxNumberDec + 'upx',
            textEdit: vscode_languageserver_1.TextEdit.replace(vscode_languageserver_1.Range.create(start, position), cpxNumberDec + 'upx'),
            kind: vscode_languageserver_1.CompletionItemKind.Snippet,
        });
        completionList.items.push({
            label: pxNumber + 'px->' + cpxNumberDec + 'rpx',
            textEdit: vscode_languageserver_1.TextEdit.replace(vscode_languageserver_1.Range.create(start, position), cpxNumberDec + 'rpx'),
            kind: vscode_languageserver_1.CompletionItemKind.Snippet,
        });
        return completionList;
    }
    async getPxConversionCompletionData(workspaceFolder, document, position, completionType, connection, scopedSettingsSupport, completionList) {
        const isRightType = (0, util_1.isRightCompletionType)(completionType, [util_1.NodeType.NumericValue], undefined, util_1.NodeType.Value);
        if (!isRightType) {
            return completionList;
        }
        // 判断项目类型, 如果是uni项目, 启用upx, 如果不是, 启用rem
        if (workspaceFolder) {
            let filePath = vscode_uri_1.URI.parse(document.uri).fsPath;
            let workspaceFolderPath = vscode_uri_1.URI.parse(workspaceFolder.uri).fsPath;
            let isUniAppProject = (0, utils_1.getProjectType)(workspaceFolderPath) === utils_1.ProjectType.PT_UniApp_Vue &&
                (filePath.endsWith('.vue') || filePath.endsWith('.css') || filePath.endsWith('.scss') || filePath.endsWith('.less') || filePath.endsWith('.styl'));
            if (isUniAppProject) {
                return this.uniPxConversion(document, position, connection, scopedSettingsSupport, completionList);
            }
        }
        return this.webPxConversion(document, position, connection, scopedSettingsSupport, completionList);
    }
    // 添加从其他文件获取ID补全功能
    async getIndexIdSelectorsCompletionData(workspaceFolder, document, position, completionType, completionList) {
        const isRightType = (0, util_1.isRightCompletionType)(completionType, undefined, [util_1.NodeType.ClassSelector, util_1.NodeType.IdentifierSelector, util_1.NodeType.ElementNameSelector], util_1.NodeType.Selector);
        if (!isRightType) {
            return completionList;
        }
        if (!workspaceFolder) {
            return completionList;
        }
        let dataFlag = '#';
        let indexFlag = indexlib_1.IndexDataCategory.ID;
        let offset = document.offsetAt(position);
        let currentWord = (0, util_1.getCurrentWord)(document, offset);
        let start = vscode_languageserver_1.Position.create(position.line, position.character - currentWord.length);
        let indexClass = new baseIndexProcessor_1.BaseIndexProcessor();
        let indexDataList = indexClass.getIndexDataFromType(indexClass.getWorkspaceIndexData(workspaceFolder), indexFlag);
        for (let indexData of indexDataList) {
            if (indexData.length > 0) {
                completionList.items.push({
                    label: dataFlag + indexData,
                    textEdit: vscode_languageserver_1.TextEdit.replace(vscode_languageserver_1.Range.create(start, position), dataFlag + indexData),
                    kind: vscode_languageserver_1.CompletionItemKind.Keyword,
                    data: {
                        hxKind: utils_1.HxIconKind.ID,
                    },
                });
            }
        }
        return completionList;
    }
    // 添加从其他文件获取CLASS补全功能
    async getIndexClassSelectorsCompletionData(workspaceFolder, document, position, completionType, completionList) {
        const isRightType = (0, util_1.isRightCompletionType)(completionType, undefined, [util_1.NodeType.ClassSelector, util_1.NodeType.IdentifierSelector, util_1.NodeType.ElementNameSelector], util_1.NodeType.Selector);
        if (!isRightType) {
            return completionList;
        }
        if (!workspaceFolder) {
            return completionList;
        }
        let dataFlag = '.';
        let indexFlag = indexlib_1.IndexDataCategory.CLASS;
        let offset = document.offsetAt(position);
        let currentWord = (0, util_1.getCurrentWord)(document, offset);
        let start = vscode_languageserver_1.Position.create(position.line, position.character - currentWord.length);
        let indexClass = new baseIndexProcessor_1.BaseIndexProcessor();
        let indexDataList = indexClass.getIndexDataFromType(indexClass.getWorkspaceIndexData(workspaceFolder), indexFlag);
        for (let indexData of indexDataList) {
            if (indexData.length > 0) {
                completionList.items.push({
                    label: dataFlag + indexData,
                    textEdit: vscode_languageserver_1.TextEdit.replace(vscode_languageserver_1.Range.create(start, position), dataFlag + indexData),
                    kind: vscode_languageserver_1.CompletionItemKind.Keyword,
                    data: {
                        hxKind: utils_1.HxIconKind.CLASS,
                    },
                });
            }
        }
        return completionList;
    }
    getDeduplicationDataSync(completionList) {
        let deduplicationItems = [];
        for (var i = completionList.items.length - 1; i >= 0; --i) {
            if (!deduplicationItems.includes(completionList.items[i].label)) {
                deduplicationItems.push(completionList.items[i].label);
            }
            else {
                completionList.items.splice(i, 1);
            }
        }
        return completionList;
    }
    async getDeduplicationData(completionList) {
        return this.getDeduplicationDataSync(completionList);
    }
    // 根据当前位置, 判断是否处于:之后;之前
    async getMoveCursorData(document, position, completionType, completionList) {
        const offset = document.offsetAt(position);
        const currentWord = (0, util_1.getCurrentWord)(document, offset);
        const typeIsValue = (0, contextCompletionProcessor_1.isValueInNode)(document, position);
        const start = vscode_languageserver_1.Position.create(position.line, position.character - currentWord.length);
        const index = (0, util_1.getOffsetRightLineText)(document, offset).indexOf(';');
        const lineText = (0, util_1.getLineTextFromOffset)(document, offset);
        const colonIndex = lineText.indexOf(':');
        if (index === -1)
            return completionList;
        if (typeIsValue && colonIndex < position.character && colonIndex > 0) {
            if ((0, util_1.includesList)(typeIsValue.context, util_1.notMoveCursorProperty, true)) {
                for (const item of completionList.items) {
                    if (item.textEdit && item.textEdit.newText.includes('$'))
                        continue;
                    if (item.label.endsWith(')'))
                        continue;
                    let nextText = item.label;
                    if (item.textEdit) {
                        nextText = item.textEdit.newText;
                        if (nextText.includes('$'))
                            nextText = nextText.replace(/\$/g, `\\$`);
                        item.textEdit = vscode_languageserver_1.TextEdit.replace(vscode_languageserver_1.Range.create(start, document.positionAt(offset + index + 1)), `${nextText};$0`);
                    }
                    else {
                        if (nextText.includes('$'))
                            nextText = nextText.replace(/\$/g, `\\$`);
                        item.insertText = `${nextText};$0`;
                    }
                    item.command = undefined;
                    item.insertTextFormat = vscode_languageserver_1.InsertTextFormat.Snippet;
                }
            }
            return completionList;
        }
        return completionList;
    }
    async getFiltrationPseudoData(document, position, completionType, completionList) {
        const isRightType = (0, util_1.isRightCompletionType)(completionType, [util_1.NodeType.PseudoSelector], [util_1.NodeType.PseudoSelector], util_1.NodeType.PseudoSelector);
        if (!isRightType) {
            return completionList;
        }
        let completionItemList = [];
        for (const item of completionList.items) {
            if (item.label.startsWith(':')) {
                completionItemList.push(item);
            }
        }
        completionList.items = completionItemList;
        return completionList;
    }
    async getAltMode(document, position, completionList) {
        const typeIsValue = (0, contextCompletionProcessor_1.isValueInNode)(document, position);
        if (typeIsValue) {
            let isAltMode = false;
            const data = (0, vscode_css_languageservice_1.getDefaultCSSDataProvider)();
            const item = data.provideProperties().find((item) => item.name === typeIsValue.context);
            if (!item || !item.restrictions)
                return completionList;
            for (const iterator of item.restrictions) {
                if ((0, util_1.includesList)(iterator, util_1.numberType))
                    isAltMode = true;
                break;
            }
            if (isAltMode) {
                completionList.items.forEach((element) => {
                    if (!element.data)
                        element.data = {};
                    element.data['hxOption'] = { altMode: true };
                });
            }
        }
        return completionList;
    }
}
exports.BaseCompletionProcessor = BaseCompletionProcessor;
//# sourceMappingURL=baseCompletionProcessor.js.map