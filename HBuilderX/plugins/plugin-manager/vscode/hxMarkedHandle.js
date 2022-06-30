// 悬浮处理类, 主要功能为, 调用c++端API, 生成带样式的html文本
const hx = require('../hbxBridge.js');
let marked = require('marked');

const invertLangMatchTable = {
    'html': 'html_es6',
    'javascript': 'javascript_es6',
};

// 自定义marked的渲染器
function init() {
    const renderer = {
        code(code, infoString, escaped) {
            return `<needChangeCode>` + '```' + infoString + '\n' + code + '\n' + '```' + `</needChangeCode>`;
        },
    };
    marked.use({ renderer });
}

// 转换langID
function langIdToHx(pmLangId) {
    let hxLangId = pmLangId;
    if (invertLangMatchTable.hasOwnProperty(hxLangId)) {
        hxLangId = invertLangMatchTable[hxLangId];
    }
    return hxLangId;
}

// 从纯markdown文本, 生成html文本
async function getDataFromMarkdownText(resultContent) {
    let markdownString = '';
    if (typeof resultContent === 'string') {
        markdownString = resultContent;
    } else if (typeof resultContent === 'object' && typeof resultContent.value === 'string') {
        markdownString = resultContent.value;
    }

    markdownString = marked(markdownString);
    //截取<needChangeCode>内容, 调用API, 将返回的数据替换
    let needChangeTextList = markdownString.match(/<needChangeCode>[\s\S]*<\/needChangeCode>/g);
    if (needChangeTextList == null) return markdownString;
    for (const iterator of needChangeTextList) {
        let parameter = {
            language: 'markdown',
            value: iterator.substring(16, markdownString.length - 17),
            isNeedKeepCode: false,
        };

        let data = await hx.request('languagefeature.getHtmlFromMarkdown', parameter);
        if (data == null) return markdownString;
        markdownString = markdownString.replace(iterator, data.value);
    }
    return markdownString;
}

// 已知langId, 调用api获取html文本
async function getColoredText(resultContents, options) {
    init();
    let dataArr = [];

    for (let iterator of resultContents) {
        let markData = '';

        let isObj = false;
        if (options.type === 'hover') {
            isObj = typeof iterator.language !== 'undefined';
        } else if (options.type === 'completion') {
            isObj = iterator.language === 'javascript' || iterator.language === 'typescript';
        }

        // 如果是代码块语法, 则调用c++那边的接口
        if (isObj) {
            iterator.language = langIdToHx(iterator.language);
            let data = await hx.request('languagefeature.getHtmlFromMarkdown', iterator);
            markData = data.value;
        } else {
            // 纯markdown文本, 特殊处理
            markData = await getDataFromMarkdownText(iterator);
        }
        dataArr.push(markData);
    }

    return dataArr;
}

module.exports = {
    getColoredText,
};
