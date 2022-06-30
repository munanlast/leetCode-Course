"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFileIndexProcessor = exports.StylusIndexProcessor = void 0;
const node_1 = require("../../../indexlib/out/node");
const path_1 = require("path");
const parser_1 = require("../parser");
const utils_1 = require("../utils");
class StylusIndexProcessor {
    support(doc, _ws) {
        if (doc.languageId === 'css' || doc.uri.endsWith('.css')) {
            return true;
        }
        return false;
    }
    doIndex(doc, _ws) {
        return this.createIndexData(doc);
    }
    getWorkspaceIndexData(workspaceFolder) {
        let aLLIndexData = node_1.IndexDataStore.load(workspaceFolder);
        let indexDataMap = aLLIndexData.allIndexData();
        return [...indexDataMap.values()];
    }
    getIndexDataFromFile(workspaceFolder, filePath) {
        let aLLIndexData = node_1.IndexDataStore.load(workspaceFolder);
        let indexDataList = [];
        indexDataList.push(aLLIndexData.indexData(filePath));
        return indexDataList;
    }
    getIndexDataFromType(indexDataList, type) {
        let strIndexDataList = [];
        for (let indexData of indexDataList) {
            let indexItemList = indexData[type] || [];
            for (let i = 0; i < indexItemList.length; ++i) {
                let data = indexItemList[i];
                strIndexDataList.push(data.label);
            }
        }
        return strIndexDataList;
    }
    createIndexData(document) {
        const text = document.getText();
        const ast = (0, parser_1.buildAst)(text);
        const rawSymbols = (0, utils_1.compact)((0, parser_1.flattenAndFilterAst)(ast).filter((item) => item && ['selector', 'import'].indexOf(item.nodeName) !== -1));
        let doIndexData = new node_1.IndexData();
        let indexFilePath = document.uri;
        let indexReferences = [];
        let indexClass = [];
        let indexID = [];
        // let indexColor: IndexItem[] = [];
        let repeatClass = [''];
        let repeatId = [''];
        // let repeatColor: string[] = [];
        let repeatRef = [];
        for (const iterator of rawSymbols) {
            if (iterator.name.startsWith('.')) {
                if (!repeatClass.includes(iterator.name.replace('.', ''))) {
                    repeatClass.push(iterator.name.replace('.', ''));
                    indexClass.push({ label: iterator.name.replace('.', '') });
                }
            }
            if (iterator.name.startsWith('#')) {
                if (!repeatId.includes(iterator.name.replace('#', ''))) {
                    repeatId.push(iterator.name.replace('#', ''));
                    indexID.push({ label: iterator.name.replace('#', '') });
                }
            }
            if (iterator.nodeName === 'import') {
                if (!repeatRef.includes(iterator.name)) {
                    repeatRef.push(iterator.name);
                    let type = node_1.ReferenceFileType.CSS;
                    let uri = (0, path_1.resolve)(iterator.name);
                    let reference = { uri, type };
                    indexReferences.push(reference);
                }
            }
        }
        // 暂时不支持颜色
        doIndexData.location = indexFilePath;
        doIndexData.references = indexReferences;
        doIndexData[node_1.IndexDataCategory.CLASS] = indexClass;
        doIndexData[node_1.IndexDataCategory.ID] = indexID;
        // doIndexData[IndexDataCategory.COLOR] = indexColor;
        doIndexData.categories.push(node_1.IndexDataCategory.CLASS);
        doIndexData.categories.push(node_1.IndexDataCategory.ID);
        // doIndexData.categories.push(IndexDataCategory.COLOR);
        return doIndexData;
    }
}
exports.StylusIndexProcessor = StylusIndexProcessor;
function createFileIndexProcessor(_manager) {
    return new StylusIndexProcessor();
}
exports.createFileIndexProcessor = createFileIndexProcessor;
//# sourceMappingURL=stylusIndexProcessor.js.map