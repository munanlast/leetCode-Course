"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnicloudDBAttributeCompletion = void 0;
const vscode_html_languageservice_1 = require("vscode-html-languageservice");
const utils_1 = require("../../../../utils");
const strings_1 = require("../utils/strings");
const vscode_uri_1 = require("vscode-uri");
const utils_2 = require("../../../../utils");
const interpolationDocProvider_1 = require("./utils/interpolationDocProvider");
const ts = require("typescript");
const { node } = require('../../../../lib/field');
const slotDefaultKey = ['data', 'pagination', 'loading', 'hasMore', 'error', 'options'];
let documentVersion = 100;
function getLanguageService(workspaceFolderDir, docProvider) {
    let prj = utils_2.hx.getProject(workspaceFolderDir);
    if (prj) {
        return prj.createTSLanguageService(docProvider);
    }
    return undefined;
}
function attributeInfo(context) {
    const document = context.document;
    const attrValue = document.getText(context.range);
    const attrStr = (0, strings_1.stripQuotes)(attrValue);
    let offset = document.offsetAt(context.position);
    let innerOffset = offset - document.offsetAt(context.range.start);
    if (attrStr.length != attrValue.length) {
        innerOffset--;
    }
    return { value: attrStr, offset, innerOffset };
}
class UnicloudDBAttributeCompletion {
    constructor(documentCache) {
        this.documentCache = documentCache;
        this.atributeCompletions = [];
        this.documentProvider = new interpolationDocProvider_1.InterpolationDocProvider();
    }
    onHtmlAttributeValue(context) {
        if (context.tag == "unicloud-db") {
            this.atributeCompletions.push(context);
        }
    }
    beginCompletion(option) {
        this.currentWorkspace = option === null || option === void 0 ? void 0 : option.workspaceFolder;
        this.atributeCompletions = [];
    }
    getCompletionOptions(document, htmlDocument, context) {
        const folderPath = this.currentWorkspace ? vscode_uri_1.URI.parse(this.currentWorkspace.uri).fsPath : undefined;
        const attrValue = document.getText(context.range);
        const attrStr = (0, strings_1.stripQuotes)(attrValue);
        let offset = document.offsetAt(context.position);
        let insideOffset = offset - document.offsetAt(context.range.start);
        if (attrStr.length != attrValue.length) {
            insideOffset--;
        }
        let tagNode = htmlDocument.findNodeAt(offset);
        let allAttrs = {};
        if (tagNode.attributes) {
            for (let attr in tagNode.attributes) {
                let value = tagNode.attributes[attr];
                allAttrs[attr] = value ? (0, strings_1.stripQuotes)(value) : null;
            }
            allAttrs[context.attribute] = null;
        }
        return {
            workspaceFolder: folderPath,
            locationType: utils_1.SpecialValueLocationType.IN_HTML,
            replaceRange: context.range,
            htmlContext: {
                currentAttribute: {
                    name: context.attribute,
                    value: attrStr,
                    offset: insideOffset
                },
                attributes: allAttrs,
                docOffset: offset
            }
        };
    }
    async computeCompletions(document, _htmlDocument, documentContext) {
        const result = { items: [], isIncomplete: false };
        if (!this.currentWorkspace) {
            return result;
        }
        const folderPath = vscode_uri_1.URI.parse(this.currentWorkspace.uri).fsPath;
        let htmlDoc = this.documentCache.get(document);
        if (this.atributeCompletions.length > 0) {
            // 一般来讲当前位置只有一个属性，所以进处理第一个
            const attributeCompletion = this.atributeCompletions[0];
            if (attributeCompletion.attribute == "collection") {
                let options = {
                    workspaceFolder: folderPath,
                    locationType: utils_1.SpecialValueLocationType.IN_HTML,
                    replaceRange: attributeCompletion.range
                };
                let data = (0, utils_1.doComplete)(["HBuilderX.DBCollectionString"], attributeCompletion.position, document, options);
                data.forEach(item => {
                    if (item.kind == vscode_html_languageservice_1.CompletionItemKind.Property) {
                        item.data = {
                            hxKind: utils_1.HxIconKind.ATTRIBUTE
                        };
                    }
                    result.items.push(item);
                });
                return result;
            }
            if (attributeCompletion.attribute == "field" || attributeCompletion.attribute == 'orderby') {
                let options = this.getCompletionOptions(document, _htmlDocument, attributeCompletion);
                let data = (0, utils_1.doComplete)(["HBuilderX.DBFieldString"], attributeCompletion.position, document, options);
                data.forEach(item => {
                    if (item.kind == vscode_html_languageservice_1.CompletionItemKind.Property) {
                        item.data = {
                            hxKind: utils_1.HxIconKind.ATTRIBUTE
                        };
                    }
                    result.items.push(item);
                });
                return result;
            }
            if (attributeCompletion.attribute == "where") {
                let options = this.getCompletionOptions(document, _htmlDocument, attributeCompletion);
                let data = (0, utils_1.doComplete)(["HBuilderX.JQLString"], attributeCompletion.position, document, options);
                data.forEach(item => {
                    if (item.kind == vscode_html_languageservice_1.CompletionItemKind.Property) {
                        item.data = {
                            hxKind: utils_1.HxIconKind.ATTRIBUTE
                        };
                    }
                    result.items.push(item);
                });
                return result;
            }
            if (attributeCompletion.attribute == "v-slot:default") {
                let service = getLanguageService(folderPath, this.documentProvider);
                if (service) {
                    documentVersion++;
                    const attrValue = attributeInfo(attributeCompletion);
                    const slotValueUri = 'file:///__slot_value.ts';
                    const slotValueDoc = vscode_html_languageservice_1.TextDocument.create(slotValueUri, 'typescript', documentVersion, attrValue.value);
                    this.documentProvider.setDocuments([slotValueDoc]);
                    this.documentProvider.updateVersion();
                    let program = service.getProgram();
                    let sourceFile = program === null || program === void 0 ? void 0 : program.getSourceFile(slotValueUri);
                    let nodepath = sourceFile ? (0, utils_2.findNodePathByOffset)(sourceFile, attrValue.innerOffset) : [];
                    for (let i = nodepath.length - 1; i >= 0; --i) {
                        let node = nodepath[i];
                        if (node.kind == ts.SyntaxKind.Identifier || node.kind == ts.SyntaxKind.Block) {
                            result.items = slotDefaultKey.map((key) => {
                                return {
                                    label: key,
                                    kind: vscode_html_languageservice_1.CompletionItemKind.Property,
                                    data: {
                                        hxKind: utils_1.HxIconKind.ATTRIBUTE
                                    }
                                };
                            });
                            break;
                        }
                    }
                }
            }
        }
        return result;
    }
}
exports.UnicloudDBAttributeCompletion = UnicloudDBAttributeCompletion;
//# sourceMappingURL=uniDBAttributeCompletion.js.map