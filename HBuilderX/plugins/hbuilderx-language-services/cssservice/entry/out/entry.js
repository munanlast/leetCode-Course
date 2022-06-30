"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentWorkspaceFolder = exports.getExtraServer = void 0;
const cssExtraServer_1 = require("./cssExtraServer");
const lessExtraServer_1 = require("./lessExtraServer");
const scssExtraServer_1 = require("./scssExtraServer");
// 此文件为入口文件, server调用此文件获取对应的语法提示功能
const languageIndex = {};
languageIndex.css = new cssExtraServer_1.CssExtraServer();
languageIndex.scss = new scssExtraServer_1.ScssExtraServer();
languageIndex.less = new lessExtraServer_1.LessExtraServer();
function getExtraServer(document) {
    let cssIndex;
    if (typeof document === 'string') {
        cssIndex = languageIndex[document];
    }
    else {
        cssIndex = languageIndex[document.languageId];
    }
    if (!cssIndex) {
        cssIndex = languageIndex['css'];
    }
    return cssIndex;
}
exports.getExtraServer = getExtraServer;
// 获取当前使用的项目
function getCurrentWorkspaceFolder(workspaceFolders, document) {
    let workSpaceList = [];
    for (const workspaceFolder of workspaceFolders) {
        if (document.uri.startsWith(workspaceFolder.uri)) {
            workSpaceList.push(workspaceFolder);
        }
    }
    workSpaceList.sort((a, b) => {
        return a.uri.length - b.uri.length;
    });
    return workSpaceList;
}
exports.getCurrentWorkspaceFolder = getCurrentWorkspaceFolder;
//# sourceMappingURL=entry.js.map