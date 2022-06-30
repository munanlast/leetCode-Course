"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseIndexProcessor = void 0;
const indexlib_1 = require("../../../../indexlib");
// 此类为CSS索引处理模块
// 主要功能: 添加CSS数据到索引\获取索引的数据
class BaseIndexProcessor {
    // 提供各种接口, 用于获取数据
    // 根据文件名, 数据类型, 获取对应的数据
    // 获取到当前工程下的全部索引
    getWorkspaceIndexData(workspaceFolder) {
        let aLLIndexData = indexlib_1.IndexDataStore.load(workspaceFolder);
        let indexDataMap = aLLIndexData.allIndexData();
        return [...indexDataMap.values()];
    }
    // 获取指定文件的索引信息
    getIndexDataFromFile(workspaceFolder, filePath) {
        let aLLIndexData = indexlib_1.IndexDataStore.load(workspaceFolder);
        let indexDataList = [];
        indexDataList.push(aLLIndexData.indexData(filePath));
        return indexDataList;
    }
    // 根据指定的Type, 获取索引数据
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
}
exports.BaseIndexProcessor = BaseIndexProcessor;
//# sourceMappingURL=baseIndexProcessor.js.map