"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GotoDefinition = void 0;
const vscode_css_languageservice_1 = require("vscode-css-languageservice");
const vscode_languageserver_1 = require("vscode-languageserver");
const vscode_uri_1 = require("vscode-uri");
const node_1 = require("../../../../htmlservice/entry/out/node");
const node_2 = require("../../../../indexlib/out/node");
const node_3 = require("../../../../serverinterface/out/node");
const utils_1 = require("../../../../utils");
const baseIndexProcessor_1 = require("../index/baseIndexProcessor");
const util_1 = require("../utils/util");
class GotoDefinition {
    // 增加自身功能的补全
    // 跨文件转到html文件中的ID定义
    locationToLocationLink(definitionData, originSelectionRange) {
        if (definitionData.length <= 0)
            return [];
        let locationLinkList = [];
        for (const iterator of definitionData) {
            locationLinkList.push(vscode_languageserver_1.LocationLink.create(iterator.uri, iterator.range, iterator.range, originSelectionRange));
        }
        return locationLinkList;
    }
    // 处理@开头的路径转到定义
    getDefinitionDataFromAtPath(workspaceFolder, document, position, astNode, definitionData) {
        let locationList = [];
        // 判断当前所处的位置是什么类型
        if (definitionData)
            locationList.unshift(definitionData);
        const offset = document.offsetAt(position);
        const currentAstNode = (0, util_1.getNodeAtOffset)(astNode, offset);
        const currentLocation = (0, util_1.getLocationFromPosition)(document, astNode, position);
        if (!currentLocation)
            return this.locationToLocationLink(locationList);
        const currentText = document.getText(currentLocation.range).replace(/'/g, '').replace(/"/g, '');
        if (!currentLocation)
            return this.locationToLocationLink(locationList);
        if (!workspaceFolder)
            return this.locationToLocationLink(locationList, currentLocation.range);
        if (currentText.startsWith('@') && currentAstNode.parent.nodeType === util_1.NodeType.URILiteral) {
            let folderPath = vscode_uri_1.URI.parse(workspaceFolder.uri).fsPath;
            let absolutePath = currentText.replace('@', folderPath).replace(/\\/g, '/');
            locationList.unshift({
                uri: utils_1.hx.toNormalizedUri(absolutePath),
                range: { start: vscode_languageserver_1.Position.create(0, 0), end: vscode_languageserver_1.Position.create(0, 0) },
            });
        }
        return this.locationToLocationLink(locationList, currentLocation.range);
    }
    async getDefinitionDataFromID(workspaceFolder, document, position, astNode, definitionData) {
        let locationList = [];
        let extDataList = [];
        if (definitionData)
            locationList.unshift(definitionData);
        if (document.languageId !== 'css')
            return this.locationToLocationLink(locationList);
        const currentLocation = (0, util_1.getLocationFromPosition)(document, astNode, position);
        if (!currentLocation)
            return this.locationToLocationLink(locationList);
        // 判断转到定义所选文字是否是ID, 不是则返回原数据
        const currentText = document.getText(currentLocation.range);
        if (!currentText.startsWith('#'))
            return this.getDefinitionDataFromAtPath(workspaceFolder, document, position, astNode, definitionData);
        if (!workspaceFolder)
            return this.locationToLocationLink(locationList, currentLocation.range);
        // 先去索引中寻找, 如果找不到, 就去查看import
        let symbol = { text: currentText.substring(1), type: node_3.SymbolType.ElementId };
        let htmlService = (0, node_1.getLanguageServerExt)();
        if (!htmlService || !htmlService.findSymbol)
            return this.locationToLocationLink(locationList, currentLocation.range);
        let extDefinitionData = await htmlService.findSymbol(document, symbol, workspaceFolder);
        extDataList.push(...(extDefinitionData instanceof Array ? extDefinitionData : [extDefinitionData]));
        if (extDataList.length > 0) {
            locationList.unshift(...extDataList);
        }
        else {
            // 查看本文件是否被其他css文件引用, 获取引用此css文件的文件名
            // 可能存在循环引用问题, 此处逻辑先不添加
            // 创建TextDocument对象, 执行htmlService.findSymbol
        }
        return this.locationToLocationLink(locationList, currentLocation.range);
    }
    // 从索引获取转到定义信息
    getDefinedListFromIndexFile(filePathList, symbol) {
        let locationList = [];
        if (filePathList.length <= 0)
            return locationList;
        let nodeType = util_1.NodeType.ClassSelector;
        for (const filePath of filePathList) {
            let index = filePath.lastIndexOf('.');
            let lang = filePath.substring(index + 1);
            let stylesDocument = (0, util_1.createDocument)(filePath, lang);
            let astNode = (0, util_1.createAstNode)(stylesDocument, lang);
            let rangesList = (0, util_1.getLocationFromText)(stylesDocument, astNode, nodeType, '.' + symbol.text);
            if (rangesList.length === 0)
                continue;
            locationList.push(...rangesList);
        }
        return locationList;
    }
    // 提供接口让外部获取Class转到定义信息
    getDefinitionFromClass(workspaceFolder, document, symbol) {
        // 此接口为HTML文件和VUE文件, 提供文件内转到定义和文件外转到定义功能
        // document为处理过的css类文件 symbol.sourceDocument为原html或vue文件
        // 没有工程目录\symbol类型不为class则退出
        if (typeof workspaceFolder === 'undefined')
            return [];
        if (symbol.type !== node_3.SymbolType.StyleClass)
            return [];
        if (!symbol.sourceDocument)
            return [];
        // 先在文件中查找, 获取语法树, 在语法树中找需要转到定义的位置
        let astNode;
        let referenceFileType = node_2.ReferenceFileType.CSS;
        astNode = (0, vscode_css_languageservice_1.getCSSLanguageService)().parseStylesheet(document);
        if (document.languageId === 'scss') {
            astNode = (0, vscode_css_languageservice_1.getSCSSLanguageService)().parseStylesheet(document);
            // referenceFileType = ReferenceFileType.SCSS;
        }
        else if (document.languageId === 'less') {
            astNode = (0, vscode_css_languageservice_1.getLESSLanguageService)().parseStylesheet(document);
            // referenceFileType = ReferenceFileType.LESS;
        }
        let locationList = [];
        astNode.accept((node) => {
            if (node.type === util_1.NodeType.ClassSelector) {
                if (symbol.text === node.getText().replace('.', '')) {
                    let startPosition = document.positionAt(node.offset);
                    let endPosition = document.positionAt(node.offset + node.getText().length);
                    let range = vscode_languageserver_1.Range.create(startPosition, endPosition);
                    locationList.push(vscode_languageserver_1.Location.create(document.uri, range));
                }
                if (locationList.length > 0) {
                    return false;
                }
            }
            return true;
        });
        if (locationList.length > 0)
            return locationList;
        // 在本文件中, 找不到, 则根据传入的doc路径, 查找对应关系
        let indexDataList = new baseIndexProcessor_1.BaseIndexProcessor().getIndexDataFromFile(workspaceFolder, symbol.sourceDocument.uri);
        let callRelationshipList = [];
        for (const indexData of indexDataList) {
            for (const references of indexData.references) {
                if (references.type === referenceFileType)
                    callRelationshipList.push(references.uri);
            }
        }
        locationList = this.getDefinedListFromIndexFile(callRelationshipList, symbol);
        return locationList;
    }
    // 提供接口让外部获取基本转到定义信息
    async getBaseLocationLink(workspaceFolder, document, position, astNode, definitionData) {
        let locationList = [];
        astNode = (0, vscode_css_languageservice_1.getCSSLanguageService)().parseStylesheet(document);
        if (document.languageId === 'scss') {
            astNode = (0, vscode_css_languageservice_1.getSCSSLanguageService)().parseStylesheet(document);
        }
        else if (document.languageId === 'less') {
            astNode = (0, vscode_css_languageservice_1.getLESSLanguageService)().parseStylesheet(document);
        }
        if (definitionData)
            locationList.unshift(definitionData);
        const currentLocation = (0, util_1.getLocationFromPosition)(document, astNode, position);
        if (!currentLocation)
            return this.locationToLocationLink(locationList);
        let value = this.getDefinitionDataFromAtPath(workspaceFolder, document, position, astNode, definitionData);
        // this.locationToLocationLink(locationList, currentLocation.range);
        return value;
    }
}
exports.GotoDefinition = GotoDefinition;
//# sourceMappingURL=gotoDefinition.js.map