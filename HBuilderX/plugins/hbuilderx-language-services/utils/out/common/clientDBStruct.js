"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSClientDBNode = exports.ClientDBCollection = exports.ClientDBAliasParser = exports.ClientDBAliasTokenize = void 0;
const typescript = require("typescript");
const commonHandler_1 = require("./commonHandler");
const jsonc_1 = require("jsonc");
class ClientDBAliasTokenize {
    static isKey(c) {
        let chars = '-_$.';
        let reg = /[0-9A-Za-z]/;
        if (reg.test(c) || chars.indexOf(c) !== -1) {
            return true;
        }
        else {
            return false;
        }
    }
    static isWhiteSpace(c) {
        return /\s/.test(c);
    }
    static next(str, offset) {
        return str[++offset];
    }
    static read(str, offset) {
        let start = offset;
        let value = '';
        let c = str[offset];
        while (this.isKey(c)) {
            value += c;
            if (offset === str.length - 1) {
                offset++;
                break;
            }
            c = this.next(str, offset);
            offset++;
        }
        return {
            tokenType: 'IDENTIFIER',
            value: value,
            start: start,
            end: offset - 1
        };
    }
    static tokenize(str) {
        let tokens = [];
        let tokenSize = str.length - 1;
        let offset = -1;
        while (offset < tokenSize) {
            if (offset === tokenSize - 1)
                break;
            let c = this.next(str, offset);
            offset++;
            while (this.isWhiteSpace(c)) {
                c = this.next(str, offset);
                offset++;
            }
            let start = offset;
            if (this.KnownTokenTypes.has(c)) {
                tokens.push({
                    tokenType: this.KnownTokenTypes.get(c),
                    value: c,
                    start: start,
                    end: start + 1
                });
            }
            else {
                let token = this.read(str, offset);
                tokens.push(token);
                offset = token.end;
            }
        }
        return tokens;
    }
}
exports.ClientDBAliasTokenize = ClientDBAliasTokenize;
ClientDBAliasTokenize.KnownTokenTypes = new Map([['{', 'LBRACE'], ['}', 'RBRACE'], [',', 'COMMA']]);
class ClientDBAliasParser {
    static unexpectedToken(token) {
        throw new Error(`field syntax error: ${token.value}`);
    }
    static toObject(offset, tokensLength, tokens, expectedTokens, state, lastKey) {
        if (offset.length === 0)
            return null;
        let object = {};
        while (offset[0] < tokensLength - 1) {
            let index = offset[0];
            let token = tokens[++index];
            if (!token)
                break;
            if (expectedTokens.indexOf(token.tokenType) === -1)
                this.unexpectedToken(token);
            offset[0] = index;
            switch (token.tokenType) {
                case 'IDENTIFIER': {
                    switch (state) {
                        case 'identifier': {
                            if ('as' !== token.value) {
                                this.unexpectedToken(token);
                            }
                            state = 'as';
                            break;
                        }
                        case 'as': {
                            if ('IDENTIFIER' !== token.tokenType) {
                                this.unexpectedToken(token);
                            }
                            const [err, res] = jsonc_1.jsonc.safe.parse(token.value);
                            object[lastKey] = !err ? res : token.value;
                            state = '';
                            break;
                        }
                        case '': {
                            lastKey = token.value;
                            state = 'identifier';
                            const [err, res] = jsonc_1.jsonc.safe.parse(lastKey);
                            object[lastKey] = !err ? res : lastKey;
                            break;
                        }
                        default:
                            this.unexpectedToken(token);
                            break;
                    }
                    expectedTokens = [];
                    expectedTokens.push('IDENTIFIER', 'COMMA', 'LBRACE', 'RBRACE');
                    break;
                }
                case 'LBRACE': {
                    let tempKey = lastKey;
                    state = '';
                    lastKey = '';
                    expectedTokens = [];
                    expectedTokens.push('IDENTIFIER');
                    object[tempKey] = this.toObject(offset, tokensLength, tokens, expectedTokens, state, lastKey);
                    break;
                }
                case 'RBRACE': {
                    state = '';
                    expectedTokens = [];
                    expectedTokens.push('COMMA');
                    return object;
                }
                case 'COMMA': {
                    state = '';
                    expectedTokens = [];
                    expectedTokens.push('IDENTIFIER', 'RBRACE');
                    break;
                }
                default:
                    this.unexpectedToken(token);
                    break;
            }
        }
        return object;
    }
    static parse(str) {
        let tokens = ClientDBAliasTokenize.tokenize(str);
        let tokenSize = tokens.length;
        let expectedTokens = ['IDENTIFIER'];
        let offsets = [-1];
        return this.toObject(offsets, tokenSize, tokens, expectedTokens, '', '');
    }
    static transform(object) {
        let newObject = Object.create(null);
        for (let key of Object.keys(object)) {
            let element = object[key];
            if (typeof element === 'object') {
                newObject[key] = this.transform(element);
            }
            else {
                const [err, res] = jsonc_1.jsonc.safe.parse(key);
                newObject[element] = !err ? res : key;
            }
        }
        return newObject;
    }
}
exports.ClientDBAliasParser = ClientDBAliasParser;
class ClientDBCollection {
    constructor(name) {
        this._name = name;
        this._properties = new Map();
    }
    getName() {
        return this._name;
    }
    setName(name) {
        this._name = name;
    }
    getProperties() {
        return this._properties;
    }
    setProperties(properties) {
        this._properties = properties;
    }
    addProperty(name, type) {
        this._properties.set(name, type);
    }
}
exports.ClientDBCollection = ClientDBCollection;
class JSClientDBNode {
    constructor(projectPath) {
        this._projectPath = projectPath;
    }
    getCollections() {
        return this._collections;
    }
    setCollections(collections) {
        if (collections.length > 0) {
            this._collections = Array.from([collections[0]]);
        }
        else {
            this._collections = null;
        }
    }
    getFields() {
        return this._fields;
    }
    setFields(fields) {
        this._fields = fields;
    }
    getWhere() {
        return this._where;
    }
    setWhere(where) {
        this._where = where;
    }
    setGetone(on) {
        this._getone = on;
    }
    isGetone() {
        return this._getone;
    }
    getVslots() {
        return this._vslots;
    }
    setVslot(vslots) {
        this._vslots = vslots;
    }
    getDataStruct() {
        if (this._collections.length > 0) {
            if (this._fields) {
                const fildsObj = ClientDBAliasParser.parse(this._fields);
                if (this.isGetone()) {
                    return JSON.stringify(ClientDBAliasParser.transform(fildsObj));
                }
                else {
                    return '[' + JSON.stringify(ClientDBAliasParser.transform(fildsObj)) + ']';
                }
            }
            else {
                let fieldSet = new Set();
                for (let collectionName of this._collections) {
                    let collection = this.parseSchema(collectionName);
                    let properties = collection.getProperties();
                    for (let entry of properties.keys()) {
                        fieldSet.add(entry);
                    }
                }
                if (fieldSet.size > 0) {
                    let result = Array.from(fieldSet).join(',');
                    if (this.isGetone()) {
                        return '{' + result.replace('{', ':{') + '}';
                    }
                    else {
                        return '[{' + result.replace('{', ':{') + '}]';
                    }
                }
            }
        }
    }
    parseSchema(schemaName) {
        return (0, commonHandler_1.parseSchema)(schemaName, this._projectPath);
        // for (let provider of providers) {
        //   let schemaFilePath: string = path.join(this._projectPath, getCloudDatabaseRoot(provider), schemaName, '.schema.json');
        //   if (fs.existsSync(schemaFilePath)) {
        //     return this.getCollection(schemaName, schemaFilePath);
        //   } else {
        //     let collection: ClientDBCollection = this.parseUniModuleSchema(schemaName, this._projectPath);
        //     if (collection) {
        //       return collection;
        //     }
        //   }
        // }
        // return null;
    }
    getCollection(schemaName, schemaFilePath) {
        return (0, commonHandler_1.getCollection)(schemaName, schemaFilePath, this._projectPath);
        // if (fs.existsSync(schemaFilePath)) {
        //   let dbCollection: ClientDBCollection = new ClientDBCollection(schemaName);
        //   let scheamContents: string = fs.readFileSync(schemaFilePath).toString();
        //   const [err, res] = jsonc.safe.parse(scheamContents);
        //   if (!err) {
        //     if (res['properties']) {
        //       for (let k of Object.keys(res['properties'])) {
        //         let field: string = k;
        //         let fieldType: FieldType = this.getFieldType(schemaName, res['properties'][k]);
        //         dbCollection.addProperty(field, fieldType);
        //       }
        //     }
        //   }
        //   return dbCollection;
        // }
        // return null;
    }
    parseUniModuleSchema(schemaName, projectPath) {
        return (0, commonHandler_1.parseUniModuleSchema)(schemaName, projectPath);
        // let uniModulesPath: string = path.join(projectPath, getUniModulesDir());
        // if (!fs.existsSync(uniModulesPath)) return null;
        // if (!fs.statSync(uniModulesPath).isDirectory()) return null;
        // let values: string[] = fs.readdirSync(uniModulesPath);
        // for (let value of values) {
        //   let modulePath: string = path.join(uniModulesPath, value);
        //   if (fs.statSync(modulePath).isDirectory()) {
        //     for (let provider of providers) {
        //       let moduleDatabasePath: string = path.join(projectPath, getUniModuleDatabase(value, provider));
        //       let scheamFilePath: string = path.join(moduleDatabasePath, schemaName, '.schema.json');
        //       if (fs.existsSync(scheamFilePath)) {
        //         return this.getCollection(schemaName, scheamFilePath);
        //       }
        //     }
        //   }
        // }
        // return null;
    }
    getFieldType(collection, object) {
        return (0, commonHandler_1.getFieldType)(collection, object, this._projectPath);
        // let fieldType: FieldType = new FieldType();
        // if (object.hasOwnProperty('description')) {
        //   fieldType.desc = object['description'];
        // }
        // if (object.hasOwnProperty('bsonType')) {
        //   fieldType.typeName = object['bsonType'];
        // }
        // if (object.hasOwnProperty('enum')) {
        //   fieldType.enums = object['enum'];
        // }
        // if (object.hasOwnProperty('foreignKey')) {
        //   let foreighKey: string = object['foreignKey'];
        //   if (foreighKey.length > 0) {
        //     let foreignSchema: string = foreighKey.split(`.`)[0];
        //     fieldType.refCollection = this.parseSchema(foreignSchema);
        //   }
        // }
        // if (object.hasOwnProperty('properties')) {
        //   fieldType.children.clear();
        //   let properties = object['properties'];
        //   for (let k of Object.keys(properties)) {
        //     let childType: FieldType = this.getFieldType(collection, properties[k]);
        //     fieldType.children.set(k, childType);
        //   }
        // }
        // fieldType.owningCollection = collection;
        // return fieldType;
    }
    computeVSlotDefaults() {
        let result = new Map();
        let defaultString = 'let' + this._vslots + '=__clientDBSlots__';
        let sourceFile = typescript.createSourceFile('', defaultString, typescript.ScriptTarget.Latest);
        if (sourceFile) {
            let vslotVars = new Map([
                ['error', 'new Error()'],
                ['loading', 'loading=true'],
                ['options', 'new Object()'],
                ['pagination', 'new Object()']
            ]);
            if (sourceFile.statements.length > 0) {
                let firstChild = sourceFile.statements[0];
                if (firstChild.kind === typescript.SyntaxKind.VariableStatement) {
                    let declarationList = firstChild.declarationList;
                    let declarations = declarationList.declarations;
                    for (let i = 0; i < declarations.length; ++i) {
                        let declaration = declarations[i];
                        let name = declaration.name;
                        if (name.kind === typescript.SyntaxKind.ObjectBindingPattern) {
                            for (let j = 0; j < name.elements.length; ++j) {
                                let element = name.elements[j];
                                if (element.kind === typescript.SyntaxKind.BindingElement) {
                                    let name = element.name;
                                    if (name.kind === typescript.SyntaxKind.Identifier) {
                                        if (name.escapedText === 'data') {
                                            result.set('data', this.getDataStruct());
                                        }
                                        else {
                                            result.set(name.escapedText, vslotVars.get(name.escapedText));
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return result;
    }
    getFieldElements(fieldPath) {
        let result = [];
        if (this._collections.length == 0)
            return null;
        let paths = fieldPath.split(`/`);
        if (paths.length > 0) {
            let properties = this.computeFields();
            for (let path of paths) {
                if (path.trim().length == 0)
                    continue;
                let field = properties.get(path);
                if (field && field.refCollection) {
                    properties = field.refCollection.getProperties();
                }
            }
            properties.forEach((value, key) => {
                result.push({
                    name: key,
                    desc: value.desc,
                    type: value.typeName,
                    owningType: value.owningCollection
                });
            });
            result.push({
                name: 'as'
            });
        }
        return result;
    }
    computeFields() {
        let properties = new Map();
        for (let collection of this._collections) {
            try {
                let db = this.parseSchema(collection.trim());
                if (db) {
                    return db.getProperties();
                }
            }
            catch (e) {
            }
        }
        return properties;
    }
}
exports.JSClientDBNode = JSClientDBNode;
//# sourceMappingURL=clientDBStruct.js.map