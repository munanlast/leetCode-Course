"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExternalDataProvider = exports.getDependencyDataProvider = exports.getWorkspaceDataProvider = exports.VeturDataProvider = void 0;
const fs = require("fs");
const path = require("path");
const ts = require("typescript");
class VeturDataProvider {
    constructor(id, tags) {
        this.id = id;
        this._tags = [];
        this._tagMap = {};
        this._enable = true;
        this._tagMap = tags;
        this._tags = Object.values(tags);
    }
    getId() { return this.id; }
    get enable() {
        return this._enable;
    }
    set enable(v) {
        this._enable = v;
    }
    isApplicable(languageId) {
        return this._enable && languageId == 'vue';
    }
    provideTags() {
        return this._tags;
    }
    provideAttributes(tag) {
        const attributes = [];
        const processAttribute = (a) => {
            attributes.push(a);
        };
        let tagEntry = this._tagMap[tag];
        if (tagEntry) {
            tagEntry.attributes.forEach(processAttribute);
        }
        return attributes;
    }
    provideValues(tag, attribute) {
        var _a;
        const values = [];
        attribute = attribute.toLowerCase();
        const processAttributes = (attributes) => {
            attributes.forEach(a => {
                if (a.name.toLowerCase() === attribute && a.values) {
                    a.values.forEach(v => {
                        values.push(v);
                    });
                }
            });
        };
        let tagEntry = this._tagMap[tag];
        if (tagEntry) {
            processAttributes((_a = tagEntry.attributes) !== null && _a !== void 0 ? _a : []);
        }
        return values;
    }
}
exports.VeturDataProvider = VeturDataProvider;
// import elementTags from 'element-helper-json/element-tags.json';
// import elementAttributes from 'element-helper-json/element-attributes.json';
// import onsenTags from 'vue-onsenui-helper-json/vue-onsenui-tags.json';
// import onsenAttributes from 'vue-onsenui-helper-json/vue-onsenui-attributes.json';
// import bootstrapTags from 'bootstrap-vue-helper-json/tags.json';
// import bootstrapAttributes from 'bootstrap-vue-helper-json/attributes.json';
// import gridsomeTags from 'gridsome-helper-json/gridsome-tags.json';
// import gridsomeAttributes from 'gridsome-helper-json/gridsome-attributes.json';
// import { findConfigFile } from '../../../utils/workspace';
// export const elementTagProvider = getExternalTagProvider('element', elementTags, elementAttributes);
// export const onsenTagProvider = getExternalTagProvider('onsen', onsenTags, onsenAttributes);
// export const bootstrapTagProvider = getExternalTagProvider('bootstrap', bootstrapTags, bootstrapAttributes);
// export const gridsomeTagProvider = getExternalTagProvider('gridsome', gridsomeTags, gridsomeAttributes);
function findConfigFile(findPath, configName) {
    return ts.findConfigFile(findPath, ts.sys.fileExists, configName);
}
/**
 * Get tag providers specified in workspace root's packaage.json
 */
function getWorkspaceDataProvider(packageRoot, packageJson) {
    if (!packageJson.vetur) {
        return null;
    }
    const tagsPath = findConfigFile(packageRoot, packageJson.vetur.tags);
    const attrsPath = findConfigFile(packageRoot, packageJson.vetur.attributes);
    try {
        if (tagsPath && attrsPath) {
            const tagsJson = JSON.parse(fs.readFileSync(tagsPath, 'utf-8'));
            const attrsJson = JSON.parse(fs.readFileSync(attrsPath, 'utf-8'));
            return getExternalDataProvider('__vetur-workspace', tagsJson, attrsJson);
        }
        return null;
    }
    catch (err) {
        return null;
    }
}
exports.getWorkspaceDataProvider = getWorkspaceDataProvider;
/**
 * Get tag providers specified in packaage.json's `vetur` key
 */
function getDependencyDataProvider(packageRoot, depName, depPkgJson) {
    if (!depPkgJson.vetur) {
        return null;
    }
    try {
        const tagsPath = require.resolve(path.join(depName, depPkgJson.vetur.tags), { paths: [packageRoot] });
        const attrsPath = require.resolve(path.join(depName, depPkgJson.vetur.attributes), {
            paths: [packageRoot]
        });
        const tagsJson = JSON.parse(fs.readFileSync(tagsPath, 'utf-8'));
        const attrsJson = JSON.parse(fs.readFileSync(attrsPath, 'utf-8'));
        return getExternalDataProvider(depName, tagsJson, attrsJson);
    }
    catch (err) {
        console.error(err.stack);
        return null;
    }
}
exports.getDependencyDataProvider = getDependencyDataProvider;
function getExternalDataProvider(id, tags, attributes) {
    let attrMap = new Map();
    Object.keys(attributes).forEach((attr) => {
        var _a;
        let data = attributes[attr];
        let attrData = { name: attr, description: data.description };
        let isEvent = data.type === 'event';
        if (data.type === 'boolean') {
            attrData.valueSet = 'v';
        }
        else if (!isEvent && data.options instanceof Array) {
            attrData.values = data.options.map((v) => { return { name: v }; });
        }
        let i = attr.indexOf('/');
        let name = attr.slice(i >= 0 ? i + 1 : 0);
        attrData.name = (isEvent ? '[event]' : '') + name;
        let tag = attr.slice(0, i >= 0 ? i : 0);
        if (!attrMap.has(tag)) {
            attrMap.set(tag, []);
        }
        (_a = attrMap.get(tag)) === null || _a === void 0 ? void 0 : _a.push(attrData);
    });
    let tagMap = {};
    Object.keys(tags).forEach((tag) => {
        var _a, _b;
        let data = tags[tag];
        let attributes = [];
        if (data.attributes instanceof Array) {
            for (let i = 0; i < data.attributes.length; i++) {
                let name = data.attributes[i];
                let eventName = '[event]' + name;
                attributes.push(...((_a = attrMap.get('')) !== null && _a !== void 0 ? _a : []).filter((v) => {
                    return v.name === name || v.name === eventName;
                }));
                attributes.push(...((_b = attrMap.get(tag)) !== null && _b !== void 0 ? _b : []).filter((v) => { return v.name === name || v.name === eventName; }));
            }
        }
        tagMap[tag] = { name: tag, description: data.description, attributes };
    });
    return new VeturDataProvider(id, tagMap);
}
exports.getExternalDataProvider = getExternalDataProvider;
//# sourceMappingURL=veturProviderParse.js.map