"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScssIndexProcessor = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const vscode_css_languageservice_1 = require("vscode-css-languageservice");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const vscode_uri_1 = require("vscode-uri");
const indexlib_1 = require("../../../../indexlib");
const utils_1 = require("../../../../utils");
const util_1 = require("../utils/util");
class ScssIndexProcessor {
    createIndexData(workspaceFolder, document) {
        let doIndexData = new indexlib_1.IndexData();
        if (typeof document === 'string') {
            let data = (0, fs_1.readFileSync)(document, { encoding: 'utf8', flag: 'r' });
            document = vscode_languageserver_textdocument_1.TextDocument.create(document, 'scss', 0, data);
        }
        let docDir = (0, path_1.dirname)(vscode_uri_1.URI.parse(document.uri).fsPath);
        let astNode = (0, vscode_css_languageservice_1.getSCSSLanguageService)().parseStylesheet(document);
        let indexFilePath = document.uri;
        let indexReferences = [];
        let indexClass = [];
        let indexID = [];
        let indexColor = [];
        let repeatClass = [''];
        let repeatId = [''];
        let repeatColor = [];
        let repeatRef = [];
        astNode.accept((node) => {
            var _a, _b;
            if (node.type === util_1.NodeType.ClassSelector) {
                if (!repeatClass.includes(node.getText().replace('.', ''))) {
                    if (!node.getText().includes('$')) {
                        repeatClass.push(node.getText().replace('.', ''));
                        indexClass.push({ label: node.getText().replace('.', ''), offset: node.offset, type: indexlib_1.IndexItemType.DEF });
                    }
                }
            }
            else if (node.type === util_1.NodeType.IdentifierSelector) {
                if (!repeatId.includes(node.getText().replace('#', ''))) {
                    if (!node.getText().includes('$')) {
                        repeatId.push(node.getText().replace('#', ''));
                        indexID.push({ label: node.getText().replace('#', ''), offset: node.offset, type: indexlib_1.IndexItemType.REF });
                    }
                }
            }
            else if (node.type === util_1.NodeType.HexColorValue) {
                if (!repeatColor.includes(node.getText())) {
                    repeatColor.push(node.getText());
                    indexColor.push({ label: node.getText(), offset: node.offset });
                }
            }
            else if (node.type === util_1.NodeType.Import) {
                const nodeText = node.getText();
                if (!repeatRef.includes(nodeText)) {
                    repeatRef.push(node.getText());
                    let type = indexlib_1.ReferenceFileType.CSS;
                    let dir = '';
                    let uri = '';
                    if (nodeText.includes('url(')) {
                        dir = (_b = (_a = node.children[0]) === null || _a === void 0 ? void 0 : _a.children[0]) === null || _b === void 0 ? void 0 : _b.getText().replace(/'/g, '').replace(/"/g, '');
                    }
                    else {
                        dir = nodeText.replace('@import', '').replace(/'/g, '').replace(/"/g, '').trim();
                    }
                    if (dir.startsWith('@/') && workspaceFolder) {
                        let folderPath = vscode_uri_1.URI.parse(workspaceFolder.uri).fsPath;
                        uri = dir.replace('@', folderPath).replace(/\\/g, '/');
                    }
                    else {
                        uri = (0, path_1.resolve)(docDir, dir).replace(/\\/g, '/');
                    }
                    if ((0, fs_1.existsSync)(uri)) {
                        uri = utils_1.hx.toNormalizedUri(uri);
                        let reference = { uri, type };
                        indexReferences.push(reference);
                    }
                }
            }
            return true;
        });
        doIndexData.location = indexFilePath;
        doIndexData.references = indexReferences;
        doIndexData[indexlib_1.IndexDataCategory.CLASS] = indexClass;
        doIndexData[indexlib_1.IndexDataCategory.ID] = indexID;
        doIndexData[indexlib_1.IndexDataCategory.COLOR] = indexColor;
        doIndexData.categories.push(indexlib_1.IndexDataCategory.CLASS);
        doIndexData.categories.push(indexlib_1.IndexDataCategory.ID);
        doIndexData.categories.push(indexlib_1.IndexDataCategory.COLOR);
        return doIndexData;
    }
}
exports.ScssIndexProcessor = ScssIndexProcessor;
//# sourceMappingURL=scssIndexProcessor.js.map