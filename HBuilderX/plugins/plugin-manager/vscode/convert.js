const { CompletionItemKind } = require('vs/workbench/api/common/extHostTypes');

var HxIconKind;
(function (HxIconKind) {
    HxIconKind[HxIconKind["DEFALUT"]    = 0]  = "DEFALUT";
    HxIconKind[HxIconKind["ABC"]        = 1]  = "ABC";
    HxIconKind[HxIconKind["ATTRIBUTE"]  = 2]  = "ATTRIBUTE";
    HxIconKind[HxIconKind["CLASS"]      = 3]  = "CLASS";
    HxIconKind[HxIconKind["CLIPBOARD"]  = 4]  = "CLIPBOARD";
    HxIconKind[HxIconKind["CSS"]        = 5]  = "CSS";
    HxIconKind[HxIconKind["ELEMENT"]    = 6]  = "ELEMENT";
    HxIconKind[HxIconKind["EVENT"]      = 7]  = "EVENT";
    HxIconKind[HxIconKind["FILE"]       = 8]  = "FILE";
    HxIconKind[HxIconKind["FOLDER"]     = 9]  = "FOLDER";
    HxIconKind[HxIconKind["FUNCTION"]   = 10] = "FUNCTION";
    HxIconKind[HxIconKind["HTML"]       = 11] = "HTML";
    HxIconKind[HxIconKind["ID"]         = 12] = "ID";
    HxIconKind[HxIconKind["IMAGE"]      = 13] = "IMAGE";
    HxIconKind[HxIconKind["JS"]         = 14] = "JS";
    HxIconKind[HxIconKind["KEYWORD"]    = 15] = "KEYWORD";
    HxIconKind[HxIconKind["SELECTOR"]   = 16] = "SELECTOR";
    HxIconKind[HxIconKind["SNIPPET"]    = 17] = "SNIPPET";
    HxIconKind[HxIconKind["STRING"]     = 18] = "STRING";
})(HxIconKind = exports.HxIconKind || (exports.HxIconKind = {}));

const Type = {
    // 默认
    DEFALUT: 'DEFALUT',
    // 普通文本
    ABC: 'ABC',
    // 锚?
    // ANCHOR: 'ANCHOR',
    // 属性
    ATTRIBUTE: 'ATTRIBUTE',
    // 类
    CLASS: 'CLASS',
    // 剪贴板?
    CLIPBOARD: 'CLIPBOARD',
    // 代码块?
    // CODEBLOCK: 'CODEBLOCK',
    // 颜色
    COLOR: 'COLOR',
    // 注释?
    // COMMENT: 'COMMENT',
    // CSS文件?
    CSS: 'CSS',
    // 元素
    ELEMENT: 'ELEMENT',
    // 事件
    EVENT: 'EVENT',
    // 文件
    FILE: 'FILE',
    // 文件夹
    FOLDER: 'FOLDER',
    // 字体?
    FONT: 'FONT',
    // 函数
    FUNCTION: 'FUNCTION',
    // HTML文件?
    HTML: 'HTML',
    // ID
    ID: 'ID',
    // 图片?
    IMAGE: 'IMAGE',
    // JS文件?
    JS: 'JS',
    // 关键字
    KEYWORD: 'KEYWORD',
    // 数字?
    // NUMBER: 'NUMBER',
    // 其他?
    // OTHER: 'OTHER',
    // 选择
    SELECTOR: 'SELECTOR',
    // 片段
    SNIPPET: 'SNIPPET',
    // 字符串
    STRING: 'STRING',
};

/**
 *
 * @param {string} kind
 * @param {object} data
 */
function convert(kind, data) {
	if (data){
		if (data.hxKind && data.hxKind !== HxIconKind['DEFALUT']){
			return HxIconKind[data.hxKind];
		}
	}


    let type = kind;
    if (typeof kind === 'string') {
        type = CompletionItemKind[kind];
    }
    switch (type) {
        case CompletionItemKind.Text:
            return Type.ABC;

        case CompletionItemKind.Method:
        case CompletionItemKind.Function:
        case CompletionItemKind.Constructor:
            return Type.FUNCTION;

        // case CompletionItemKind.Field:
        //     return Type.ABC;
        case CompletionItemKind.Variable:
            return Type.ATTRIBUTE;
        case CompletionItemKind.Class:
            return Type.CLASS;
        // case CompletionItemKind.Interface:
        //     return Type.ABC;
        // case CompletionItemKind.Module:
        //     return Type.ABC;
        case CompletionItemKind.Property:
            return Type.ATTRIBUTE;
        // case CompletionItemKind.Unit:
        //     return Type.ABC;
        // case CompletionItemKind.Value:
        //     return Type.ABC;
        // case CompletionItemKind.Enum:
        //     return Type.ABC;
        case CompletionItemKind.Keyword:
            return Type.KEYWORD;
        case CompletionItemKind.Snippet:
            return Type.SNIPPET;
        case CompletionItemKind.Color:
             return Type.COLOR;
        case CompletionItemKind.File:
            return Type.FILE;
        // case CompletionItemKind.Reference:
        //     return Type.ABC;
        case CompletionItemKind.Folder:
            return Type.FOLDER;
        // case CompletionItemKind.EnumMember:
        //     return Type.ABC;
        // case CompletionItemKind.Constant:
        //     return Type.ABC;
        // case CompletionItemKind.Struct:
        //     return Type.ABC;
        case CompletionItemKind.Event:
            return Type.EVENT;
        case CompletionItemKind.Operator:
            return Type.KEYWORD;
        // case CompletionItemKind.TypeParameter:
        //     return Type.ABC;
        default:
            return Type.DEFALUT;
    }
}

module.exports = convert;
