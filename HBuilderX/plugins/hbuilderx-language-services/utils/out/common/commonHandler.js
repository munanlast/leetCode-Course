"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUniModuleSchema = exports.parseSchema = exports.getFieldType = exports.getCollection = void 0;
const fs = require("fs");
const path = require("path");
const jsonc_1 = require("jsonc");
const clientDBStruct_1 = require("./clientDBStruct");
const uniCloudPath_1 = require("./uniCloudPath");
function getCollection(schemaName, schemaFilePath, projectPath) {
    if (fs.existsSync(schemaFilePath)) {
        let dbCollection = new clientDBStruct_1.ClientDBCollection(schemaName);
        let scheamContents = fs.readFileSync(schemaFilePath).toString();
        const [err, res] = jsonc_1.jsonc.safe.parse(scheamContents);
        if (!err) {
            if (res['properties']) {
                for (let k of Object.keys(res['properties'])) {
                    let field = k;
                    let fieldType = getFieldType(schemaName, res['properties'][k], projectPath);
                    dbCollection.addProperty(field, fieldType);
                }
            }
        }
        return dbCollection;
    }
    return null;
}
exports.getCollection = getCollection;
function getFieldType(collection, object, projectPath) {
    let fieldType = {};
    fieldType.children = new Map();
    if (object.hasOwnProperty('description')) {
        fieldType.desc = object['description'];
    }
    if (object.hasOwnProperty('bsonType')) {
        fieldType.typeName = object['bsonType'];
    }
    if (object.hasOwnProperty('enum')) {
        fieldType.enums = object['enum'];
    }
    if (object.hasOwnProperty('foreignKey')) {
        let foreighKey = object['foreignKey'];
        if (foreighKey.length > 0) {
            let foreignSchema = foreighKey.split(`.`)[0];
            fieldType.refCollection = parseSchema(foreignSchema, projectPath);
        }
    }
    if (object.hasOwnProperty('properties')) {
        fieldType.children.clear();
        let properties = object['properties'];
        for (let k of Object.keys(properties)) {
            let childType = getFieldType(collection, properties[k], projectPath);
            fieldType.children.set(k, childType);
        }
    }
    fieldType.owningCollection = collection;
    return fieldType;
}
exports.getFieldType = getFieldType;
function parseSchema(schemaName, projectPath) {
    for (let provider of uniCloudPath_1.providers) {
        let schemaFilePath = path.join(projectPath, (0, uniCloudPath_1.getCloudDatabaseRoot)(provider), schemaName + '.schema.json');
        if (fs.existsSync(schemaFilePath)) {
            return getCollection(schemaName, schemaFilePath, projectPath);
        }
        else {
            let collection = parseUniModuleSchema(schemaName, projectPath);
            if (collection) {
                return collection;
            }
        }
    }
    return null;
}
exports.parseSchema = parseSchema;
function parseUniModuleSchema(schemaName, projectPath) {
    let uniModulesPath = path.join(projectPath, (0, uniCloudPath_1.getUniModulesDir)());
    if (!fs.existsSync(uniModulesPath))
        return null;
    if (!fs.statSync(uniModulesPath).isDirectory())
        return null;
    let values = fs.readdirSync(uniModulesPath);
    for (let value of values) {
        let modulePath = path.join(uniModulesPath, value);
        if (fs.statSync(modulePath).isDirectory()) {
            for (let provider of uniCloudPath_1.providers) {
                let moduleDatabasePath = path.join(projectPath, (0, uniCloudPath_1.getUniModuleDatabase)(value, provider));
                let scheamFilePath = path.join(moduleDatabasePath, schemaName, '.schema.json');
                if (fs.existsSync(scheamFilePath)) {
                    return getCollection(schemaName, scheamFilePath, projectPath);
                }
            }
        }
    }
    return null;
}
exports.parseUniModuleSchema = parseUniModuleSchema;
//# sourceMappingURL=commonHandler.js.map