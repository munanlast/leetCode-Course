"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataManager = void 0;
const vscode_html_languageservice_1 = require("vscode-html-languageservice");
const fs = require("fs");
const path = require("path");
const dataroot = path.join(__dirname, '../../server/data');
const vue_tag_file = path.join(dataroot, 'uni_vue_tag.json');
const nvue_tag_file = path.join(dataroot, 'uni_nvue_html.json');
function createDataProvider(id, file) {
    try {
        let content = fs.readFileSync(file, { encoding: 'utf8' });
        let rawData = JSON.parse(content);
        return (0, vscode_html_languageservice_1.newHTMLDataProvider)(id, {
            version: rawData.version || 1,
            tags: rawData.tags || [],
            globalAttributes: rawData.globalAttributes || [],
            valueSets: rawData.valueSets || []
        });
    }
    catch (error) {
    }
    return (0, vscode_html_languageservice_1.newHTMLDataProvider)(id, { version: 1 });
}
function getDataManager() {
    let defaultProvider;
    let vuelibs = [];
    vuelibs.push(createDataProvider('uni_vue_tag', vue_tag_file));
    vuelibs.push(createDataProvider('uni_nvue_tag', nvue_tag_file));
    return {
        vueDataProvides() {
            let result = [];
            result.push(...vuelibs);
            return result;
        },
        allDataProviders(withDefault = false) {
            let result = [];
            result.push(...vuelibs);
            if (withDefault) {
                result.push(this.defaultDataProvider());
            }
            return result;
        },
        defaultDataProvider() {
            if (!defaultProvider) {
                defaultProvider = (0, vscode_html_languageservice_1.getDefaultHTMLDataProvider)();
            }
            return defaultProvider;
        }
    };
}
exports.getDataManager = getDataManager;
//# sourceMappingURL=dataProviderManager.js.map