"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gotoDefinition = exports.doComplete = void 0;
const path = require("path");
const fs = require("fs");
const vscode_languageserver_protocol_1 = require("vscode-languageserver-protocol");
const uniCloudPath_1 = require("../common/uniCloudPath");
function doComplete(position, document, options) {
    let result = [];
    let validationFunctions = new Set();
    if (options === null || options === void 0 ? void 0 : options.workspaceFolder) {
        let projectPath = options === null || options === void 0 ? void 0 : options.workspaceFolder.uri;
        for (let i = 0; i < uniCloudPath_1.providers.length; ++i) {
            let validataionDirPath = path.join(projectPath.fsPath, (0, uniCloudPath_1.getValidationRoot)(uniCloudPath_1.providers[i]));
            if (!fs.existsSync(validataionDirPath))
                continue;
            if (!fs.statSync(validataionDirPath).isDirectory())
                continue;
            fs.readdirSync(validataionDirPath).forEach((value) => {
                let validationPath = path.join(validataionDirPath, value);
                if (fs.statSync(validationPath).isFile() && value.endsWith('.js')) {
                    validationFunctions.add(value.substr(0, value.lastIndexOf('.')));
                }
            });
        }
        getUniModuleValidatateFunction(validationFunctions, projectPath.fsPath);
    }
    validationFunctions.forEach((value) => {
        result.push({
            label: value,
            kind: vscode_languageserver_protocol_1.CompletionItemKind.File,
            documentation: value
        });
    });
    return result;
}
exports.doComplete = doComplete;
function getUniModuleValidatateFunction(values, projectPath) {
    let uniModulesPath = path.join(projectPath, (0, uniCloudPath_1.getUniModulesDir)());
    if (!fs.existsSync(uniModulesPath))
        return;
    if (!fs.statSync(uniModulesPath).isDirectory())
        return;
    fs.readdirSync(uniModulesPath).forEach((value) => {
        let modulePath = path.join(uniModulesPath, value);
        if (fs.statSync(modulePath).isDirectory()) {
            let moduleValidatePath = path.join(projectPath, (0, uniCloudPath_1.getUniModuleValidate)(value, ''));
            if (!fs.existsSync(moduleValidatePath))
                return;
            if (!fs.statSync(moduleValidatePath).isDirectory())
                return;
            fs.readdirSync(moduleValidatePath).forEach((child) => {
                let validatePath = path.join(moduleValidatePath, child);
                if (fs.statSync(validatePath).isFile() && child.endsWith('.js')) {
                    values.add(child.substr(0, child.lastIndexOf('.')));
                }
            });
        }
    });
}
function gotoDefinition(text, options) {
    if (options === null || options === void 0 ? void 0 : options.workspaceFolder) {
        let projectPath = options === null || options === void 0 ? void 0 : options.workspaceFolder;
        for (let i = 0; i < uniCloudPath_1.providers.length; ++i) {
            let validataionDirPath = path.join(projectPath, (0, uniCloudPath_1.getValidationRoot)(uniCloudPath_1.providers[i]));
            if (!fs.existsSync(validataionDirPath))
                continue;
            if (!fs.statSync(validataionDirPath).isDirectory())
                continue;
            let validataionPaths = fs.readdirSync(validataionDirPath);
            for (let value of validataionPaths) {
                let validationPath = path.join(validataionDirPath, value);
                if (fs.statSync(validationPath).isFile() && value.endsWith('.js')) {
                    let fileName = path.basename(validationPath, '.js');
                    if (fileName == text) {
                        return {
                            targetUri: validationPath,
                            targetRange: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
                            targetSelectionRange: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }
                        };
                    }
                }
            }
        }
        let uniModulesPath = path.join(projectPath, (0, uniCloudPath_1.getUniModulesDir)());
        if (!fs.existsSync(uniModulesPath))
            return undefined;
        if (!fs.statSync(uniModulesPath).isDirectory())
            return undefined;
        let uniModules = fs.readdirSync(uniModulesPath);
        for (let uniModule of uniModules) {
            let modulePath = path.join(uniModulesPath, uniModule);
            if (fs.statSync(modulePath).isDirectory()) {
                let moduleValidatePath = path.join(projectPath, (0, uniCloudPath_1.getUniModuleValidate)(uniModule, ''));
                if (!fs.existsSync(moduleValidatePath))
                    continue;
                if (!fs.statSync(moduleValidatePath).isDirectory())
                    continue;
                let moduleValidatPaths = fs.readdirSync(moduleValidatePath);
                for (let child of moduleValidatPaths) {
                    let validatePath = path.join(moduleValidatePath, child);
                    if (fs.statSync(validatePath).isFile() && child.endsWith('.js')) {
                        let fileName = path.basename(validatePath, '.js');
                        if (fileName == text) {
                            return {
                                targetUri: validatePath,
                                targetRange: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
                                targetSelectionRange: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }
                            };
                        }
                    }
                }
            }
        }
    }
    return undefined;
}
exports.gotoDefinition = gotoDefinition;
//# sourceMappingURL=validateFunctionHandler.js.map