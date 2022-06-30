"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandJsonServerRegisterSchema = exports.setLanguageConfig = exports.registerSchema = exports.findSchema = void 0;
// 此文件处理各种schema, 并提供API使外界注入schema
const path_1 = require("path");
const vscode_uri_1 = require("vscode-uri");
const out_1 = require("../../../utils/out");
var allSchemas = [];
function findSchema(uri) {
    const url = vscode_uri_1.URI.parse(uri).fsPath;
    let schema = {};
    allSchemas.forEach((element) => {
        if (element.name === uri) {
            schema = element.value;
        }
    });
    if (schema !== null)
        return Promise.resolve(JSON.stringify(schema));
    return Promise.reject(`Unable to load schema at ${url}`);
}
exports.findSchema = findSchema;
function expandJsonServerRegisterSchema(data) {
    registerSchema(data.name, data.value, data.fileMatch, data.projectType);
}
exports.expandJsonServerRegisterSchema = expandJsonServerRegisterSchema;
function registerSchema(name, value, fileMatch, projectType) {
    allSchemas.forEach((item, index) => {
        if (item.name === name)
            allSchemas.splice(index, 1);
    });
    allSchemas.push({
        name,
        value,
        fileMatch,
        projectType,
    });
    return true;
}
exports.registerSchema = registerSchema;
function getSchemaOnlyFilePath(fileUri) {
    let schemaConfiguration = [];
    for (const iterator of allSchemas) {
        if (iterator.projectType)
            continue;
        const schema = iterator.fileMatch;
        for (const item of schema) {
            if (item.includes('*')) {
                let regex = new RegExp(`${item.replace(/\./g, '\\.').replace(/\*/, '.*')}`);
                if (regex.test(fileUri)) {
                    schemaConfiguration.push({ fileMatch: iterator.fileMatch, uri: iterator.name });
                    return schemaConfiguration;
                }
            }
            else if ((0, path_1.basename)(fileUri) === item) {
                schemaConfiguration.push({ fileMatch: iterator.fileMatch, uri: iterator.name });
                return schemaConfiguration;
            }
        }
    }
    return undefined;
}
function getSchemaFromProjectType(fileUri, workspaceFolder) {
    let schemaConfiguration = [];
    for (const iterator of allSchemas) {
        if (!iterator.projectType)
            continue;
        const projectPath = workspaceFolder.uri.fsPath;
        const projectType = (0, out_1.getProjectType)(projectPath);
        if (projectType !== iterator.projectType)
            continue;
        const schema = iterator.fileMatch;
        for (const item of schema) {
            if (item.includes('*')) {
                let regex = new RegExp(`${item.replace(/\./g, '\\.').replace(/\*/, '.*')}`);
                if (regex.test(fileUri)) {
                    schemaConfiguration.push({ fileMatch: iterator.fileMatch, uri: iterator.name });
                    return schemaConfiguration;
                }
            }
            else if ((0, path_1.basename)(fileUri) === item) {
                schemaConfiguration.push({ fileMatch: iterator.fileMatch, uri: iterator.name });
                return schemaConfiguration;
            }
        }
    }
    return undefined;
}
/**
 * 根据传入的文件路径和项目路径, 判断需要设置哪个schema
 * @param languageService
 * @param fileUri
 * @param workspaceFolder
 * @returns
 */
function setLanguageConfig(languageService, fileUri, workspaceFolder) {
    // 先设置只需要根据文件路径, 判断需要设置的schema
    let schemas = getSchemaOnlyFilePath(fileUri);
    if (schemas) {
        languageService.configure({ allowComments: true, schemas });
        return;
    }
    // 再设置需要文件和项目类型一起判断的schema
    if (!workspaceFolder)
        return;
    schemas = getSchemaFromProjectType(fileUri, workspaceFolder);
    if (schemas) {
        languageService.configure({ allowComments: true, schemas });
        return;
    }
}
exports.setLanguageConfig = setLanguageConfig;
//# sourceMappingURL=schemaManager.js.map