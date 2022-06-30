"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gotoDefinition = exports.doComplete = void 0;
const ts = require("typescript");
const fs = require("fs");
const path = require("path");
const jsonc_1 = require("jsonc");
const vscode_languageserver_protocol_1 = require("vscode-languageserver-protocol");
const ProjectFileFilter_1 = require("../languageserver/ProjectFileFilter");
const type_resolve_1 = require("../common/type-resolve");
const project_resolve_1 = require("../project-resolve");
const vscode_uri_1 = require("vscode-uri");
/**
 * 根据项目类型返回对应的内置语法库名称
 * @param projectPath
 */
function getBuiltInLibs(projectPath) {
    if ((0, project_resolve_1.isUniAppVue)(projectPath) && !(0, project_resolve_1.isUniAppCli)(projectPath)) {
        return ['vue', 'vuex', 'vue-router', '@dcloudio/uni-app'];
    }
    return [];
}
function doComplete(position, document, options) {
    let completionItems = [];
    let isVueFile = document.uri.endsWith('.vue') || document.uri.endsWith('.nvue');
    let token = (0, type_resolve_1.getTokenAtPosition)(options.sourceFile, document.offsetAt(position));
    let text = '';
    if (token.kind === ts.SyntaxKind.StringLiteral) {
        text = token.text;
    }
    let fileInfoList = (0, ProjectFileFilter_1.getCompletionFilesSync)(options.workspaceFolder, {
        extensionFilters: ['.js', '.vue'],
        prefixPath: text,
        timeout: 1000
    }, document.uri);
    if (options.workspaceFolder) {
        if ((0, project_resolve_1.isUniAppVue)(options.workspaceFolder) && !(0, project_resolve_1.isUniAppCli)(options.workspaceFolder)) {
            let simFile = path.join(options.workspaceFolder, 'abc.js');
            simFile = vscode_uri_1.URI.file(simFile).toString();
            let relativeProjectPaths = (0, ProjectFileFilter_1.getCompletionFilesSync)(options.workspaceFolder, {
                extensionFilters: ['.js', '.vue'],
                prefixPath: '',
                timeout: 1000
            }, simFile);
            relativeProjectPaths === null || relativeProjectPaths === void 0 ? void 0 : relativeProjectPaths.files.forEach(file => {
                completionItems.push({
                    label: '@/' + file.relative,
                    kind: file.isDir ? vscode_languageserver_protocol_1.CompletionItemKind.Folder : vscode_languageserver_protocol_1.CompletionItemKind.File
                });
            });
        }
    }
    fileInfoList === null || fileInfoList === void 0 ? void 0 : fileInfoList.files.forEach(file => {
        completionItems.push({
            label: file.relative,
            kind: file.isDir ? vscode_languageserver_protocol_1.CompletionItemKind.Folder : vscode_languageserver_protocol_1.CompletionItemKind.File
        });
    });
    if (options.workspaceFolder) {
        let packagePath = options.workspaceFolder + '/package.json';
        if (fs.existsSync(packagePath)) {
            const [err, res] = jsonc_1.jsonc.safe.parse(fs.readFileSync(packagePath).toString());
            if (!err) {
                if (res['dependencies'] && typeof res['dependencies'] === 'object') {
                    for (let dependency of Object.keys(res['dependencies'])) {
                        completionItems.push({
                            label: dependency
                        });
                    }
                }
                else if (res['devDependencies'] && typeof res['devDependencies'] === 'object') {
                    for (let dependency of Object.keys(res['devDependencies'])) {
                        completionItems.push({
                            label: dependency
                        });
                    }
                }
            }
        }
        if (text === '') {
            getBuiltInLibs(options.workspaceFolder).forEach(lib => {
                completionItems.push({
                    label: lib
                });
            });
        }
    }
    return completionItems;
}
exports.doComplete = doComplete;
function gotoDefinition(text, options) {
    if (text.startsWith('@/') && options.workspaceFolder) {
    }
    return undefined;
}
exports.gotoDefinition = gotoDefinition;
//# sourceMappingURL=importURIHandler.js.map