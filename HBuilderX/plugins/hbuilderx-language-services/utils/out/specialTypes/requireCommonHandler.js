"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gotoDefinition = exports.doComplete = void 0;
const path = require("path");
const fs = require("fs");
const jsonc_1 = require("jsonc");
const vscode_languageserver_protocol_1 = require("vscode-languageserver-protocol");
function doComplete(position, document, options) {
    let result = [];
    let packageJsonPath = path.resolve(document.uri, '../package.json');
    if (!fs.existsSync(packageJsonPath))
        return result;
    let [err, res] = jsonc_1.jsonc.safe.parse(fs.readFileSync(packageJsonPath).toString());
    if (!err) {
        if (!!res['dependencies']) {
            let dependencies = res['dependencies'];
            for (let key of Object.keys(dependencies)) {
                if (dependencies[key].startsWith('file:')) {
                    result.push({
                        label: key,
                        kind: vscode_languageserver_protocol_1.CompletionItemKind.Property,
                        documentation: key
                    });
                }
            }
        }
    }
    return result;
}
exports.doComplete = doComplete;
function gotoDefinition(text, options) {
    let packageJsonPath = path.resolve(options.fileName, '../package.json');
    if (!fs.existsSync(packageJsonPath))
        return;
    let [err, res] = jsonc_1.jsonc.safe.parse(fs.readFileSync(packageJsonPath).toString());
    if (!err) {
        if (!!res['dependencies']) {
            let dependencies = res['dependencies'];
            for (let key of Object.keys(dependencies)) {
                if (key != options.token.getText())
                    continue;
                if (dependencies[key].startsWith('file:')) {
                    let value = dependencies[key].substring(5).trim();
                    let target = path.resolve(packageJsonPath, value);
                    return {
                        definitions: [{
                                textSpan: { start: 0, length: 0 },
                                fileName: target,
                                contextSpan: { start: 0, length: 0 }
                            }],
                        textSpan: { start: options.token.pos + options.offset, length: options.token.getText().length }
                    };
                }
            }
        }
    }
    return null;
}
exports.gotoDefinition = gotoDefinition;
//# sourceMappingURL=requireCommonHandler.js.map