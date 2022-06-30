"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterIdData = exports.filterClassData = void 0;
const indexlib_1 = require("../../../indexlib");
function filterClassData(workspaceFolder, document, distinct = false) {
    return getDataFromIndex(workspaceFolder, document, indexlib_1.IndexDataCategory.CLASS, distinct);
}
exports.filterClassData = filterClassData;
function filterIdData(workspaceFolder, document, distinct = false) {
    return getDataFromIndex(workspaceFolder, document, indexlib_1.IndexDataCategory.ID, distinct);
}
exports.filterIdData = filterIdData;
function getDataFromIndex(workspaceFolder, document, category, distinct = false) {
    var _a;
    let dataList = [];
    let refereceFiles = [];
    let otherFiles = [];
    let nameSet = new Set();
    let result = [];
    const allData = indexlib_1.IndexDataStore.load(workspaceFolder).allIndexData();
    let referenceSet = new Set();
    let referenceStack = [document.uri];
    const getNames = (items) => {
        let distinctSet = new Set();
        if (distinct) {
            distinctSet = nameSet;
        }
        let result = [];
        items.forEach((item) => {
            if (!distinctSet.has(item.label)) {
                result.push(item.label);
                distinctSet.add(item.label);
            }
        });
        return result;
    };
    while (referenceStack.length > 0) {
        let uri = referenceStack.shift();
        if (!referenceSet.has(uri)) {
            let indexdata = allData.get(uri);
            referenceSet.add(uri);
            if (indexdata) {
                let items = ((_a = indexdata[category]) !== null && _a !== void 0 ? _a : []);
                if (items.length > 0) {
                    let names = getNames(items);
                    if (names.length > 0) {
                        result.push({ uri, names });
                    }
                    indexdata.references.forEach((ref) => {
                        if (!referenceSet.has(ref.uri)) {
                            referenceStack.unshift(uri);
                        }
                    });
                }
            }
        }
    }
    let result2 = [];
    allData.forEach((indexdata, _key) => {
        var _a;
        if (!referenceSet.has(_key)) {
            let items = ((_a = indexdata[category]) !== null && _a !== void 0 ? _a : []);
            if (items.length > 0) {
                let names = getNames(items);
                if (names.length > 0) {
                    let include = indexdata.references.some(ref => { return ref.uri == document.uri; });
                    if (include) {
                        result2.unshift({ uri: _key, names });
                    }
                    else {
                        result2.push({ uri: _key, names });
                    }
                }
            }
        }
    });
    result.push(...result2);
    return result;
}
//# sourceMappingURL=idClassDataProvider.js.map