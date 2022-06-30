"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexData = exports.IndexItemType = exports.ReferenceFileType = exports.IndexDataCategory = void 0;
var IndexDataCategory;
(function (IndexDataCategory) {
    IndexDataCategory["CLASS"] = "html.class";
    IndexDataCategory["ID"] = "html.id";
    IndexDataCategory["COLOR"] = "color";
    IndexDataCategory["TYPE"] = "type";
})(IndexDataCategory = exports.IndexDataCategory || (exports.IndexDataCategory = {}));
var ReferenceFileType;
(function (ReferenceFileType) {
    ReferenceFileType["Unknown"] = "";
    ReferenceFileType["CSS"] = "stylesheet";
    ReferenceFileType["Script"] = "script";
    //vue-components, 记录html中使用vue自定义组件的标签
    //router-path, 记录VueRouter的path字符串
})(ReferenceFileType = exports.ReferenceFileType || (exports.ReferenceFileType = {}));
var IndexItemType;
(function (IndexItemType) {
    IndexItemType[IndexItemType["REF"] = 1] = "REF";
    IndexItemType[IndexItemType["DEF"] = 2] = "DEF";
})(IndexItemType = exports.IndexItemType || (exports.IndexItemType = {}));
class IndexData {
    constructor() {
        this.location = '';
        this.references = [];
        this.categories = [];
    }
}
exports.IndexData = IndexData;
//# sourceMappingURL=IndexProcessor.js.map