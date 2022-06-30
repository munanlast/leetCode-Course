"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVueTemplateMode = exports.initDataProviders = void 0;
const languageModelCache_1 = require("../languageModelCache");
const vscode_html_languageservice_1 = require("vscode-html-languageservice");
const htmlMode_1 = require("./htmlMode");
const htmlModeExtentsion_1 = require("../modes-ext/htmlModeExtentsion");
const utils_1 = require("../../../../utils");
const vscode_uri_1 = require("vscode-uri");
const path = require("path");
const veturProvider_1 = require("../modes-ext/dataprovider/veturProvider");
const vscode_languageserver_protocol_1 = require("vscode-languageserver-protocol");
const strings_1 = require("../utils/strings");
const htmlDataProviderWrapper_1 = require("../utils/htmlDataProviderWrapper");
const PathCompletionParticipant_1 = require("../modes-ext/PathCompletionParticipant");
const uniDBAttributeCompletion_1 = require("../modes-ext/uniDBAttributeCompletion");
const idClassCompletion_1 = require("../modes-ext/idClassCompletion");
let projectDataProviders = new Map();
let lastWorkspaceFolder = '';
let providersChanged = new vscode_languageserver_protocol_1.Emitter();
let workspaceDataManager = {
    onProviderChanged: providersChanged.event,
    getAllDataProiders() {
        let result = [];
        projectDataProviders.forEach((v) => { result.push(...v); });
        return result;
    },
    filterWorkspaceDataProvider(wsUri) {
        var _a;
        if (lastWorkspaceFolder != wsUri) {
            projectDataProviders.forEach(arr => { arr.forEach(p => { p.enable = false; }); });
            if (wsUri) {
                (_a = projectDataProviders.get(wsUri)) === null || _a === void 0 ? void 0 : _a.forEach(p => { p.enable = true; });
            }
            lastWorkspaceFolder = wsUri || '';
        }
    }
};
const dataroot = path.join(__dirname, '../../data');
let vueDataProvider = new Map();
// uni_nvue_html放在uni_vue_tag前面，去重时仅删除后面的即可
vueDataProvider.set("uni_nvue_html", (0, htmlDataProviderWrapper_1.createDataProvider)('uni_nvue_html', path.join(dataroot, 'uni_nvue_html.json')));
vueDataProvider.set("uni_vue_tag", (0, htmlDataProviderWrapper_1.createDataProvider)('uni_vue_tag', path.join(dataroot, 'uni_vue_tag.json')));
vueDataProvider.set("vue3_html", (0, htmlDataProviderWrapper_1.createDataProvider)('vue3_html', path.join(dataroot, 'vue3_html.json')));
vueDataProvider.set("vue_html", (0, htmlDataProviderWrapper_1.createDataProvider)('vue_html', path.join(dataroot, "vue_html.json")));
function initDataProviders(wsUris) {
    wsUris.forEach(uri => {
        let d = (0, veturProvider_1.getVeturDataProviders)(uri);
        projectDataProviders.set(uri, d);
    });
    lastWorkspaceFolder = '';
    providersChanged.fire();
}
exports.initDataProviders = initDataProviders;
function getRootFolder(uri, folders) {
    for (let folder of folders) {
        let folderURI = folder.uri;
        if (!(0, strings_1.endsWith)(folderURI, '/')) {
            folderURI = folderURI + '/';
        }
        if ((0, strings_1.startsWith)(uri, folderURI)) {
            return folder;
        }
    }
    return undefined;
}
function getVueTemplateMode(serviceOption, htmlLanguageService, workspace) {
    let vueTemplateDocuments = (0, languageModelCache_1.getLanguageModelCache)(10, 60, document => htmlLanguageService.parseHTMLDocument(document));
    let htmlMode = (0, htmlMode_1.getHTMLMode)(serviceOption, htmlLanguageService, vueTemplateDocuments, workspace);
    let htmlModeExt = (0, htmlModeExtentsion_1.getHtmlModeExt)(htmlLanguageService, vueTemplateDocuments, workspace, { vueEnable: true });
    let participants = [];
    if (serviceOption.fileSystemProvider && serviceOption.fileSystemProvider.readDirectory) {
        participants.push(new PathCompletionParticipant_1.PathCompletionParticipant(serviceOption.fileSystemProvider.readDirectory));
    }
    participants.push(new idClassCompletion_1.IdClassCompletionParticipant());
    participants.push(new uniDBAttributeCompletion_1.UnicloudDBAttributeCompletion(vueTemplateDocuments));
    htmlLanguageService.setCompletionParticipants(participants);
    let defaultProvider = new htmlDataProviderWrapper_1.HTMLDataProviderWrapper("html5", (0, vscode_html_languageservice_1.getDefaultHTMLDataProvider)());
    function updateDataProviders() {
        let folders = workspace.folders.map(f => { return f.uri; });
        Array.from(projectDataProviders.keys()).forEach(uri => {
            if (!folders.includes(uri)) {
                projectDataProviders.delete(uri);
            }
        });
        let providers = [defaultProvider];
        providers = providers.concat(Array.from(vueDataProvider.values()));
        providers = providers.concat(workspaceDataManager.getAllDataProiders());
        htmlLanguageService.setDataProviders(false, providers);
        htmlModeExt.updateDataProviders(providers);
    }
    workspaceDataManager.onProviderChanged(() => {
        updateDataProviders();
    });
    updateDataProviders();
    function filterVueDataProvider(document) {
        // 建议通过dataProvider.id过滤，在getVeturDataProviders内生成唯一id
        const rootFolder = getRootFolder(document.uri, workspace.folders);
        const folderUri = rootFolder ? rootFolder.uri : '';
        workspaceDataManager.filterWorkspaceDataProvider(folderUri);
        let isuniapp = !!(folderUri && (0, utils_1.getProjectType)(vscode_uri_1.URI.parse(folderUri).fsPath) === utils_1.ProjectType.PT_UniApp_Vue);
        let isnvue = document.languageId == 'vue' && document.uri.endsWith('.nvue');
        defaultProvider.enable = !isuniapp;
        try {
            vueDataProvider.get("uni_vue_tag").enable = isuniapp;
            vueDataProvider.get("uni_nvue_html").enable = isuniapp && isnvue;
        }
        catch (e) {
        }
    }
    htmlMode.getId = () => { return "vue-template"; };
    htmlMode.doComplete = async (document, position, documentContext, settings = workspace.settings) => {
        let options = settings && settings.html && settings.html.suggest;
        let doAutoComplete = settings && settings.html && settings.html.autoClosingTags;
        if (doAutoComplete) {
            options.hideAutoCompleteProposals = true;
        }
        filterVueDataProvider(document);
        let rootFolder = getRootFolder(document.uri, workspace.folders);
        let nvueEnable = Boolean(vueDataProvider.get("uni_nvue_html").enable);
        options = options !== null && options !== void 0 ? options : {};
        const vueDocument = vueTemplateDocuments.get(document);
        const defaultCompletion = async (config) => {
            var _a;
            participants.forEach(p => { var _a; (_a = p.beginCompletion) === null || _a === void 0 ? void 0 : _a.call(p, { workspaceFolder: rootFolder }); });
            let result = await htmlLanguageService.doComplete2(document, position, vueDocument, documentContext, config);
            if (nvueEnable) {
                let distinctItems = [];
                let labelSet = new Set();
                result.items.forEach(item => {
                    if (!labelSet.has(item.label)) {
                        distinctItems.push(item);
                        labelSet.add(item.label);
                    }
                });
                result.items = distinctItems;
            }
            for (let i = 0; i < participants.length; i++) {
                const p = participants[i];
                let temp = await p.computeCompletions(document, vueDocument, documentContext);
                result.items.push(...temp.items);
                result.isIncomplete = result.isIncomplete || temp.isIncomplete;
                (_a = p.endCompletion) === null || _a === void 0 ? void 0 : _a.call(p);
            }
            return result;
        };
        let completionList = await htmlModeExt.doComplete(document, position, vueDocument, defaultCompletion, options);
        return completionList;
    };
    htmlMode.doResolve = async (document, item) => {
        filterVueDataProvider(document);
        const vueDocument = vueTemplateDocuments.get(document);
        return htmlModeExt.doResolve(document, item, vueDocument);
    };
    htmlMode.doHover = async (document, pos) => {
        filterVueDataProvider(document);
        const vueDocument = vueTemplateDocuments.get(document);
        let result = await htmlModeExt.doHover(document, pos, vueDocument);
        if (!result) {
            return htmlLanguageService.doHover(document, pos, vueDocument);
        }
        return result;
    };
    htmlMode.findDefinition = async (document, position) => {
        const vueDocument = vueTemplateDocuments.get(document);
        return htmlModeExt.findDefinition(document, position, vueDocument);
    };
    htmlMode.updateDataProviders = (providers) => {
        htmlModeExt.updateDataProviders(providers);
    };
    htmlMode.setDocuments = (documents) => {
        htmlModeExt.setHtmlDocuments(documents);
    };
    return htmlMode;
}
exports.getVueTemplateMode = getVueTemplateMode;
//# sourceMappingURL=vueTemplateMode.js.map