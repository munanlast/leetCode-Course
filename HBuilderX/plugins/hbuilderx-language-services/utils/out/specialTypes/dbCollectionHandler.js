"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gotoDefinition = exports.doComplete = void 0;
const path = require("path");
const fs = require("fs");
const vscode_languageserver_protocol_1 = require("vscode-languageserver-protocol");
const uniCloudPath_1 = require("../common/uniCloudPath");
function doComplete(position, document, options) {
    let result = [];
    let sources = document.getText(options.replaceRange);
    let filter = new Set();
    if (sources.trim().length > 0) {
        let collections = sources.split(',');
        collections.forEach((value) => {
            filter.add(value.trim());
        });
    }
    let values = new Set();
    for (let i = 0; i < uniCloudPath_1.providers.length; ++i) {
        let provider = uniCloudPath_1.providers[i];
        let databasePath = path.join(options === null || options === void 0 ? void 0 : options.workspaceFolder, (0, uniCloudPath_1.getCloudDatabaseRoot)(provider));
        if (!fs.existsSync(databasePath))
            continue;
        if (fs.statSync(databasePath).isDirectory()) {
            fs.readdirSync(databasePath).forEach((value) => {
                let filePath = path.join(databasePath, value);
                if (fs.statSync(filePath).isFile() && value.endsWith('.schema.json')) {
                    values.add(path.basename(filePath, '.schema.json'));
                }
            });
        }
    }
    getUniModuleSchema(values, options === null || options === void 0 ? void 0 : options.workspaceFolder);
    values.forEach((value) => {
        if (value.length > 0) {
            result.push({
                label: value,
                kind: vscode_languageserver_protocol_1.CompletionItemKind.Variable,
                documentation: value
            });
        }
    });
    return result;
}
exports.doComplete = doComplete;
/**
 *
 * @param values colletion sets
 * @param filePath project root path
 */
function getUniModuleSchema(values, filePath) {
    let uniModulePaths = uniModules(filePath);
    for (let moduleDatabasePath of uniModulePaths) {
        fs.readdirSync(moduleDatabasePath).forEach((database) => {
            let databasePath = path.join(moduleDatabasePath, database);
            if (fs.statSync(databasePath).isFile() && database.endsWith('.schema.json')) {
                values.add(path.basename(databasePath, '.schema.json'));
            }
        });
    }
}
function uniModules(filePath) {
    let targetDirs = [];
    let uniModulesPath = path.join(filePath, (0, uniCloudPath_1.getUniModulesDir)());
    if (fs.existsSync(uniModulesPath)) {
        if (fs.statSync(uniModulesPath).isDirectory()) {
            fs.readdirSync(uniModulesPath).forEach((value) => {
                let uniModulePath = path.join(uniModulesPath, value);
                if (fs.statSync(uniModulePath).isDirectory()) {
                    for (let i = 0; i < uniCloudPath_1.providers.length; ++i) {
                        let moduleDatabasePath = path.join(filePath, (0, uniCloudPath_1.getUniModuleDatabase)(value, uniCloudPath_1.providers[i]));
                        if (fs.existsSync(moduleDatabasePath)) {
                            if (fs.statSync(moduleDatabasePath).isDirectory()) {
                                targetDirs.push(moduleDatabasePath);
                            }
                        }
                    }
                }
            });
        }
    }
    return targetDirs;
}
function findUniModuleSchema(filePath, moduleName) {
    let targetUri = undefined;
    let uniModulePaths = uniModules(filePath);
    for (let moduleDatabasePath of uniModulePaths) {
        let moduleDatabasePaths = fs.readdirSync(moduleDatabasePath);
        for (let database of moduleDatabasePaths) {
            let databasePath = path.join(moduleDatabasePath, database);
            if (fs.statSync(databasePath).isFile() && database.endsWith('.schema.json')) {
                let fileName = path.basename(database, '.schema.json');
                if (fileName == moduleName) {
                    return databasePath;
                }
            }
        }
    }
    return targetUri;
}
function findTarget(text, offset) {
    let collections = text.split(',');
    let pos = 0;
    let end = 0;
    for (let collection of collections) {
        if (pos <= offset && offset <= pos + collection.length) {
            end = pos + collection.length;
            break;
        }
        pos += collection.length;
    }
    if (text.charAt(pos) == ',') {
        pos += 1;
        end += 1;
    }
    while (text.charAt(pos) == ' ') {
        pos++;
    }
    while (text.charAt(end) == ' ') {
        end--;
    }
    return {
        pos,
        end
    };
}
function gotoDefinition(text, options) {
    if (options === null || options === void 0 ? void 0 : options.workspaceFolder) {
        let projectPath = options.workspaceFolder;
        let { pos, end } = findTarget(text, options.offset);
        text = text.substring(pos, end).trim();
        for (let i = 0; i < uniCloudPath_1.providers.length; ++i) {
            let provider = uniCloudPath_1.providers[i];
            let databasePath = path.join(projectPath, (0, uniCloudPath_1.getCloudDatabaseRoot)(provider));
            if (!fs.existsSync(databasePath))
                continue;
            if (fs.statSync(databasePath).isDirectory()) {
                let files = fs.readdirSync(databasePath);
                for (let i = 0; i < files.length; ++i) {
                    let fileName = path.basename(files[i], '.schema.json');
                    if (fileName == text) {
                        let isJqlFile = options.fileName == "jql-helper-docs.ts";
                        if (options.fileName.endsWith('.ts') || options.fileName.endsWith('.js')) {
                            return {
                                definitions: [{
                                        textSpan: { start: 0, length: 0 },
                                        fileName: path.join(databasePath, files[i]),
                                        contextSpan: { start: 0, length: 0 }
                                    }],
                                textSpan: { start: isJqlFile ? options.token.pos + options.offset - uniCloudPath_1.jqlPrefix.length : options.token.pos + pos + 1, length: end - pos }
                            };
                        }
                        else {
                            return {
                                definitions: [{
                                        textSpan: { start: 0, length: 0 },
                                        originSelectionRange: { start: { line: options.range.start.line, character: options.range.start.character + pos }, end: { line: options.range.end.line, character: options.range.start.character + end } },
                                        targetRange: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
                                        targetSelectionRange: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
                                        fileName: path.join(databasePath, files[i])
                                    }]
                            };
                        }
                    }
                }
            }
        }
        let target = findUniModuleSchema(projectPath, text);
        if (!!target) {
            if (options.fileName.endsWith('.ts') || options.fileName.endsWith('.js')) {
                let isJqlFile = options.fileName == "jql-helper-docs.ts";
                return {
                    definitions: [{
                            textSpan: { start: 0, length: 0 },
                            fileName: target,
                            contextSpan: { start: 0, length: 0 }
                        }],
                    textSpan: { start: isJqlFile ? options.token.pos + options.offset - uniCloudPath_1.jqlPrefix.length : options.token.pos + options.offset, length: end - pos }
                };
            }
            else {
                return {
                    textSpan: { start: 0, length: 0 },
                    originSelectionRange: { start: { line: options.range.start.line, character: options.range.start.character }, end: { line: options.range.end.line, character: options.range.end.character } },
                    fileName: target,
                    targetRange: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
                    targetSelectionRange: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }
                };
            }
        }
    }
    return undefined;
}
exports.gotoDefinition = gotoDefinition;
//# sourceMappingURL=dbCollectionHandler.js.map