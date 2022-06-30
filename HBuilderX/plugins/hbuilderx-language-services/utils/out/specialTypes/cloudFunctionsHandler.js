"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gotoDefinition = exports.doComplete = void 0;
const path = require("path");
const fs = require("fs");
const vscode_languageserver_protocol_1 = require("vscode-languageserver-protocol");
const uniCloudPath_1 = require("../common/uniCloudPath");
function doComplete(position, document, options) {
    let result = [];
    let cloudFunctionSets = new Set();
    if (options === null || options === void 0 ? void 0 : options.workspaceFolder) {
        let cloudFunctions = (0, uniCloudPath_1.getAllCloudFunctions)(options.workspaceFolder);
        cloudFunctions.forEach(fn => {
            cloudFunctionSets.add(fn.name);
        });
    }
    cloudFunctionSets.forEach(value => {
        result.push({
            label: value,
            kind: vscode_languageserver_protocol_1.CompletionItemKind.Property,
            documentation: value
        });
    });
    return result;
}
exports.doComplete = doComplete;
function gotoDefinition(text, options) {
    if (options === null || options === void 0 ? void 0 : options.workspaceFolder) {
        let cloudFunctions = (0, uniCloudPath_1.getAllCloudFunctions)(options.workspaceFolder);
        for (let cloudFunction of cloudFunctions) {
            if (cloudFunction.name == text) {
                let cloudFunctionPath = path.join(cloudFunction.path, 'index.js');
                let fileExists = fs.existsSync(cloudFunctionPath);
                if (!fileExists)
                    return undefined;
                if (options.fileName.endsWith('.ts') || options.fileName.endsWith('.js')) {
                    let isJqlFile = options.fileName == "jql-helper-docs.ts";
                    return {
                        definitions: [{
                                textSpan: { start: 0, length: 0 },
                                fileName: cloudFunctionPath,
                                contextSpan: { start: 0, length: 0 }
                            }],
                        textSpan: { start: isJqlFile ? options.token.pos + options.offset - uniCloudPath_1.jqlPrefix.length : options.token.pos + 1, length: text.length }
                    };
                }
                else {
                    return {
                        definitions: [{
                                textSpan: { start: 0, length: 0 },
                                originSelectionRange: { start: { line: options.range.start.line, character: options.range.start.character }, end: { line: options.range.end.line, character: options.range.start.character } },
                                targetRange: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
                                targetSelectionRange: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
                                fileName: cloudFunctionPath
                            }]
                    };
                }
            }
        }
    }
    return undefined;
}
exports.gotoDefinition = gotoDefinition;
//# sourceMappingURL=cloudFunctionsHandler.js.map