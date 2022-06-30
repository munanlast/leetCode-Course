"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomDataSource = void 0;
const vscode_1 = require("vscode");
const requests_1 = require("./requests");
function getCustomDataSource(toDispose) {
    let pathsInWorkspace = getCustomDataPathsInAllWorkspaces();
    let pathsInExtensions = getCustomDataPathsFromAllExtensions();
    const onChange = new vscode_1.EventEmitter();
    toDispose.push(vscode_1.extensions.onDidChange(_ => {
        const newPathsInExtensions = getCustomDataPathsFromAllExtensions();
        if (newPathsInExtensions.length !== pathsInExtensions.length || !newPathsInExtensions.every((val, idx) => val === pathsInExtensions[idx])) {
            pathsInExtensions = newPathsInExtensions;
            onChange.fire();
        }
    }));
    toDispose.push(vscode_1.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('css.customData')) {
            pathsInWorkspace = getCustomDataPathsInAllWorkspaces();
            onChange.fire();
        }
    }));
    return {
        get uris() {
            return pathsInWorkspace.concat(pathsInExtensions);
        },
        get onDidChange() {
            return onChange.event;
        }
    };
}
exports.getCustomDataSource = getCustomDataSource;
function getCustomDataPathsInAllWorkspaces() {
    const workspaceFolders = vscode_1.workspace.workspaceFolders;
    const dataPaths = [];
    if (!workspaceFolders) {
        return dataPaths;
    }
    const collect = (paths, rootFolder) => {
        if (Array.isArray(paths)) {
            for (const path of paths) {
                if (typeof path === 'string') {
                    dataPaths.push((0, requests_1.resolvePath)(rootFolder, path).toString());
                }
            }
        }
    };
    // 此处代码注释掉, 此处功能为vscode的全局设置, 工作区设置, 文件夹设置的配置优先读取
    // for (let i = 0; i < workspaceFolders.length; i++) {
    // 	const folderUri = workspaceFolders[i].uri;
    // 	const allCssConfig = workspace.getConfiguration('css', folderUri);
    // 	const customDataInspect = allCssConfig.inspect<string[]>('customData');
    // 	if (customDataInspect) {
    // 		collect(customDataInspect.workspaceFolderValue, folderUri);
    // 		if (i === 0) {
    // 			if (workspace.workspaceFile) {
    // 				collect(customDataInspect.workspaceValue, workspace.workspaceFile);
    // 			}
    // 			collect(customDataInspect.globalValue, folderUri);
    // 		}
    // 	}
    // }
    return dataPaths;
}
function getCustomDataPathsFromAllExtensions() {
    const dataPaths = [];
    return dataPaths;
}
//# sourceMappingURL=customData.js.map