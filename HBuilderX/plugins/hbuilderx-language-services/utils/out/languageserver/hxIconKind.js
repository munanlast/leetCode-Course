"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.includesList = exports.numberType = exports.HxIconKind = void 0;
// 新增hx图标类型, 需要注意, 此处类型需要与plugin-manager\vscode\convert.js中的类型相匹配
var HxIconKind;
(function (HxIconKind) {
    HxIconKind[HxIconKind["DEFAULT"] = 0] = "DEFAULT";
    HxIconKind[HxIconKind["ABC"] = 1] = "ABC";
    HxIconKind[HxIconKind["ATTRIBUTE"] = 2] = "ATTRIBUTE";
    HxIconKind[HxIconKind["CLASS"] = 3] = "CLASS";
    HxIconKind[HxIconKind["CLIPBOARD"] = 4] = "CLIPBOARD";
    HxIconKind[HxIconKind["CSS"] = 5] = "CSS";
    HxIconKind[HxIconKind["ELEMENT"] = 6] = "ELEMENT";
    HxIconKind[HxIconKind["EVENT"] = 7] = "EVENT";
    HxIconKind[HxIconKind["FILE"] = 8] = "FILE";
    HxIconKind[HxIconKind["FOLDER"] = 9] = "FOLDER";
    HxIconKind[HxIconKind["FUNCTION"] = 10] = "FUNCTION";
    HxIconKind[HxIconKind["HTML"] = 11] = "HTML";
    HxIconKind[HxIconKind["ID"] = 12] = "ID";
    HxIconKind[HxIconKind["IMAGE"] = 13] = "IMAGE";
    HxIconKind[HxIconKind["JS"] = 14] = "JS";
    HxIconKind[HxIconKind["KEYWORD"] = 15] = "KEYWORD";
    HxIconKind[HxIconKind["SELECTOR"] = 16] = "SELECTOR";
    HxIconKind[HxIconKind["SNIPPET"] = 17] = "SNIPPET";
    HxIconKind[HxIconKind["STRING"] = 18] = "STRING";
})(HxIconKind || (HxIconKind = {}));
exports.HxIconKind = HxIconKind;
const numberType = [
    // "angle"          ,// "角度, 不带",
    // "box"            ,// "区域, 不带",
    // "color"          ,// "颜色, 不带",
    // "enum"           ,// "枚举, 不带",
    // "font"           ,// "字体, 不带",
    // "geometry-box"   ,// "几何框, 不带",
    // "identifier"     ,// "标识符, 不带",
    // "image"          ,// "图片, 不带",
    "integer",
    "length",
    // "line-style"     ,// "样式, 不带",
    "line-width",
    "number",
    "number(0-1)",
    "percentage",
    "position",
    "positon",
    // "property"       ,// "属性, 不带",
    // "repeat"         ,// "重复, 不带",
    // "shape"          ,// "区域大小, 不带",
    // "string"         ,// "字符串, 不带",
    "time", // "时间, 带数字",
    // "timing-function",// "时间函数, 不带",
    // "unicode-range"  ,// "不带",
    // "url"            ,// "不带"
];
exports.numberType = numberType;
function includesList(text, list, isNotInclude) {
    if (!isNotInclude)
        isNotInclude = false;
    for (const iterator of list) {
        if (text === iterator) {
            return !isNotInclude;
        }
    }
    return isNotInclude;
}
exports.includesList = includesList;
//# sourceMappingURL=hxIconKind.js.map