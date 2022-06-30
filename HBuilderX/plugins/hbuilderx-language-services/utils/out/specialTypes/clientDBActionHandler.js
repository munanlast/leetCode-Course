"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gotoDefinition = exports.doComplete = void 0;
const path = require("path");
const fs = require("fs");
const vscode_languageserver_protocol_1 = require("vscode-languageserver-protocol");
const uniCloudPath_1 = require("../common/uniCloudPath");
function doComplete(position, document, options) {
    let result = [];
    let actionNames = new Set();
    if (options === null || options === void 0 ? void 0 : options.workspaceFolder) {
        let projectPath = options.workspaceFolder;
        for (let i = 0; i < uniCloudPath_1.providers.length; ++i) {
            let actionsPath = path.join(projectPath, (0, uniCloudPath_1.getCloudActionRoot)(uniCloudPath_1.providers[i]));
            if (!fs.existsSync(actionsPath)) {
                continue;
            }
            fs.readdirSync(actionsPath).forEach(value => {
                let fileName = value.substr(0, value.lastIndexOf('.'));
                actionNames.add(fileName);
            });
        }
        getUniModuleActionNames(projectPath).forEach(value => {
            actionNames.add(value);
        });
    }
    actionNames.forEach(value => {
        result.push({
            label: value,
            kind: vscode_languageserver_protocol_1.CompletionItemKind.Property,
            documentation: value
        });
    });
    return result;
}
exports.doComplete = doComplete;
function getUniModuleActionNames(projectPath, actionName) {
    let actionNames = [];
    let uniModulespath = (0, uniCloudPath_1.getUniModulesDir)();
    let uniModules = path.join(projectPath, uniModulespath);
    if (fs.existsSync(uniModules)) {
        if (fs.statSync(uniModules).isDirectory()) {
            let uniMoudlePaths = fs.readdirSync(uniModules);
            for (let value of uniMoudlePaths) {
                let modulePath = path.join(uniModules, value);
                if (fs.statSync(modulePath).isDirectory()) {
                    for (let i = 0; i < uniCloudPath_1.providers.length; ++i) {
                        let moduleActionPath = path.join(modulePath, '/uniCloud/cloudfunctions/uni-clientDB-actions');
                        if (fs.existsSync(moduleActionPath)) {
                            if (fs.statSync(moduleActionPath).isDirectory()) {
                                let files = fs.readdirSync(moduleActionPath);
                                for (let i = 0; i < files.length; ++i) {
                                    let fileName = path.basename(files[i], '.js');
                                    if (fileName == actionName) {
                                        return [path.join(moduleActionPath, files[i])];
                                    }
                                    actionNames.push(fileName);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return actionNames;
}
function gotoDefinition(text, options) {
    if (options === null || options === void 0 ? void 0 : options.workspaceFolder) {
        let projectPath = options.workspaceFolder;
        for (let i = 0; i < uniCloudPath_1.providers.length; ++i) {
            let actionsPath = path.join(projectPath, (0, uniCloudPath_1.getCloudActionRoot)(uniCloudPath_1.providers[i]));
            if (!fs.existsSync(actionsPath)) {
                continue;
            }
            let files = fs.readdirSync(actionsPath);
            for (let i = 0; i < files.length; ++i) {
                let fileName = path.basename(files[i], '.js');
                if (fileName == text) {
                    return {
                        definitions: [{
                                textSpan: { start: 0, length: 0 },
                                fileName: path.join(actionsPath, files[i]),
                                originSelectionRange: { start: { line: options.range.start.line, character: options.range.start.character }, end: { line: options.range.end.line, character: options.range.end.character } },
                                targetRange: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
                                targetSelectionRange: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }
                            }]
                    };
                }
            }
        }
        let targets = getUniModuleActionNames(projectPath, text);
        if (targets.length === 1) {
            return {
                definitions: [{
                        textSpan: { start: 0, length: 0 },
                        fileName: targets[0],
                        originSelectionRange: { start: { line: options.range.start.line, character: options.range.start.character }, end: { line: options.range.end.line, character: options.range.end.character } },
                        targetRange: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
                        targetSelectionRange: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }
                    }]
            };
        }
    }
    return undefined;
}
exports.gotoDefinition = gotoDefinition;
//# sourceMappingURL=clientDBActionHandler.js.map