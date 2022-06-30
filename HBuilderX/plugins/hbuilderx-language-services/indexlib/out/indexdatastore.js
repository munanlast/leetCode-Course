"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexDataStore = void 0;
const IndexProcessor_1 = require("./IndexProcessor");
const fs = require("fs");
const path = require("path");
const md5 = require('md5');
class IndexDataStoreLoader {
    constructor(ws) {
        this.fileIndexMap = new Map();
        this.folderRoot = ws;
        if (process.platform === 'darwin') {
            this.indexDir = path.join(process.env.HOME || '.', 'Library', 'Application Support', 'HBuilder X', 'indexdb');
        }
        else {
            this.indexDir = path.join(process.env.APPDATA || '.', 'HBuilder X', 'indexdb');
        }
    }
    load() {
        let file = md5(this.folderRoot.uri).toLowerCase();
        try {
            let data = JSON.parse(fs.readFileSync(path.join(this.indexDir, file), { encoding: 'utf-8' }));
            for (let key in data) {
                this.fileIndexMap.set(key, data[key]);
            }
        }
        catch (err) {
        }
    }
    save() {
    }
    removeIndex(_uri) {
    }
    removeAll() {
    }
    addIndexData(_uri, _data) {
    }
    getAllColorIndex(preferUri) {
        let result = [];
        let dataList = [];
        if (preferUri) {
            let preferData = this.fileIndexMap.get(preferUri);
            if (preferData) {
                dataList.push(preferData);
            }
        }
        this.fileIndexMap.forEach((val, uri) => {
            if (uri !== preferUri) {
                dataList.push(val);
            }
        });
        dataList.forEach((data) => {
            let cateData = data[IndexProcessor_1.IndexDataCategory.COLOR];
            if (cateData && cateData instanceof Array) {
                result.unshift(...cateData);
            }
        });
        return result;
    }
    indexData(uri) {
        return this.fileIndexMap.get(uri) || new IndexProcessor_1.IndexData;
    }
    allIndexData() {
        return this.fileIndexMap;
    }
}
class IndexDataStoreWriterImpl extends IndexDataStoreLoader {
    constructor(ws) {
        super(ws);
    }
    save() {
        let file = md5(this.folderRoot.uri).toLowerCase();
        try {
            if (!fs.existsSync(this.indexDir)) {
                fs.mkdirSync(this.indexDir, { recursive: true });
            }
            let obj = {};
            this.fileIndexMap.forEach((val, key) => {
                obj[key] = val;
            });
            const data = JSON.stringify(obj);
            fs.writeFileSync(path.join(this.indexDir, file), data, { encoding: 'utf-8' });
        }
        catch (err) {
        }
    }
    addIndexData(uri, data) {
        var _a;
        const path = uri;
        if (!this.fileIndexMap.has(path)) {
            this.fileIndexMap.set(path, new IndexProcessor_1.IndexData());
        }
        let oldData = this.fileIndexMap.get(path);
        for (let cate of data.categories) {
            if (oldData.categories.indexOf(cate) === -1) {
                oldData.categories.push(cate);
            }
            const t = data[cate];
            if (t instanceof Array) {
                let arr = t;
                if (arr.length > 0) {
                    if (oldData[cate] instanceof Array) {
                        oldData[cate].concat(arr);
                    }
                    else {
                        oldData[cate] = arr;
                    }
                }
            }
        }
        if (oldData.references && oldData.references.length > 0) {
            (_a = data.references) === null || _a === void 0 ? void 0 : _a.forEach((file) => {
                var _a, _b;
                if (((_a = oldData.references) === null || _a === void 0 ? void 0 : _a.indexOf(file)) !== -1) {
                    (_b = oldData.references) === null || _b === void 0 ? void 0 : _b.push(file);
                }
            });
        }
        else {
            oldData.references = data.references;
        }
    }
    removeIndex(uri) {
        this.fileIndexMap.delete(uri);
    }
    removeAll() {
        this.fileIndexMap.clear();
    }
}
var IndexDataStore;
(function (IndexDataStore) {
    function load(ws) {
        let store = new IndexDataStoreLoader(ws);
        store.load();
        return store;
    }
    IndexDataStore.load = load;
    function loadWithWrite(ws) {
        let store = new IndexDataStoreWriterImpl(ws);
        store.load();
        return store;
    }
    IndexDataStore.loadWithWrite = loadWithWrite;
})(IndexDataStore = exports.IndexDataStore || (exports.IndexDataStore = {}));
//# sourceMappingURL=indexdatastore.js.map