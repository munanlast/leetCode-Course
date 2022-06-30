"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLibraries = exports.getSettingPath = exports.isUniAppCli = exports.isExtension = exports.isWap2App = exports.sitemapExists = exports.isApp = exports.isWepy = exports.isMpVue = exports.isMiniApp = exports.isUniAppVue = exports.getProjectType = exports.ProjectType = void 0;
const fs = require("fs");
const path = require("path");
const os = require("os");
const jsonc_1 = require("jsonc");
const md5 = require('md5');
function getSettingPath(filePath) {
    filePath = fs.realpathSync.native(filePath).replace(/\\/g, '/');
    let md5Name = md5(filePath);
    // console.log(`md5: ${md5Name}`);
    let appDataDirPath = os.platform();
    if (os.platform() == 'win32') {
        appDataDirPath = path.join(os.homedir(), 'AppData/Roaming/HBuilder X');
    }
    else {
        // .extensions_development
        // appDataDirPath = path.join(os.homedir(), 'Library/Application Support/.extensions_development/');
        appDataDirPath = path.join(os.homedir(), 'Library/Application Support/HBuilder X/');
    }
    let settingPath = path.join(appDataDirPath, 'projects', md5Name, 'setting.json');
    return settingPath;
}
exports.getSettingPath = getSettingPath;
function getLibraries(filePath) {
    let libraries = [];
    let settingPath = getSettingPath(filePath);
    if (fs.existsSync(settingPath)) {
        let contents = fs.readFileSync(settingPath).toString();
        const [err, res] = jsonc_1.jsonc.safe.parse(contents);
        if (!err) {
            if (!!res['libraries']) {
                return res['libraries'];
            }
        }
    }
    return libraries;
}
exports.getLibraries = getLibraries;
function getProjectType(filePath) {
    if (!fs.existsSync(filePath))
        return ProjectType.PT_Unknown;
    let projectType = ProjectType.PT_Web;
    if (isUniAppVue(filePath))
        return ProjectType.PT_UniApp_Vue;
    if (isMiniApp(filePath))
        return ProjectType.PT_MiniApp;
    if (isMpVue(filePath))
        return ProjectType.PT_MpVue;
    if (isWap2App(filePath))
        return ProjectType.PT_App;
    if (isApp(filePath))
        return ProjectType.PT_App;
    if (isExtension(filePath))
        return ProjectType.PT_Extension;
    return projectType;
}
exports.getProjectType = getProjectType;
function isUniAppCli(filePath) {
    let result = false;
    const packagePath = path.join(filePath, 'package.json');
    const srcPath = path.join(filePath, 'src');
    const srcManifestPath = path.join(filePath, 'src', 'manifest.json');
    const srcPagesPath = path.join(filePath, 'src', 'pages.json');
    const srcAppVuePath = path.join(filePath, 'src', 'App.vue');
    const srcAppNVuePath = path.join(filePath, 'src', 'App.nvue');
    const srcMainjsPath = path.join(filePath, 'src', 'main.js');
    const srcMaintsPath = path.join(filePath, 'src', 'main.ts');
    if (fs.existsSync(packagePath)
        && fs.existsSync(srcManifestPath)
        && fs.existsSync(srcPagesPath)
        && fs.existsSync(srcPath)
        && (fs.existsSync(srcAppVuePath) || fs.existsSync(srcAppNVuePath))
        && (fs.existsSync(srcMainjsPath) || fs.existsSync(srcMaintsPath))) {
        result = true;
    }
    return result;
}
exports.isUniAppCli = isUniAppCli;
function isUniAppVue(filePath) {
    let result = false;
    const manifestPath = path.join(filePath, 'manifest.json');
    const pagesPath = path.join(filePath, 'pages.json');
    const appVuePath = path.join(filePath, 'App.vue');
    const appNVuePath = path.join(filePath, 'App.nvue');
    const mainjsPath = path.join(filePath, 'main.js');
    const maintsPath = path.join(filePath, 'main.ts');
    // uniapp
    if (fs.existsSync(manifestPath)
        && fs.existsSync(pagesPath)
        && (fs.existsSync(appVuePath) || fs.existsSync(appNVuePath))
        && (fs.existsSync(mainjsPath) || fs.existsSync(maintsPath))) {
        result = true;
    }
    // uniapp-cli
    if (!result)
        result = isUniAppCli(filePath);
    return result;
}
exports.isUniAppVue = isUniAppVue;
function isMiniApp(filePath) {
    let result = false;
    const projectConfigPath = path.join(filePath, 'project.config.json');
    const nodeModulesPath = path.join(filePath, 'node_modules');
    const packagePath = path.join(filePath, 'package.json');
    if (fs.existsSync(projectConfigPath)) {
        result = true;
        if (fs.existsSync(nodeModulesPath) || fs.existsSync(packagePath)) {
            result = false;
        }
    }
    return result;
}
exports.isMiniApp = isMiniApp;
function isMpVue(filePath) {
    let result = false;
    const projectConfigPath = path.join(filePath, 'project.config.json');
    const nodeModulesPath = path.join(filePath, 'node_modules');
    const packagePath = path.join(filePath, 'package.json');
    if (fs.existsSync(projectConfigPath)) {
        if (fs.existsSync(nodeModulesPath) || fs.existsSync(packagePath)) {
            result = true;
        }
    }
    return result;
}
exports.isMpVue = isMpVue;
function isWepy(filePath) {
    let result = false;
    const wepyConfigPath = path.join(filePath, 'wepy.config.js');
    if (fs.existsSync(wepyConfigPath)) {
        result = true;
    }
    return result;
}
exports.isWepy = isWepy;
function isApp(filePath) {
    let result = false;
    const manifestPath = path.join(filePath, 'manifest.json');
    const srcManifestPath = path.join(filePath, 'src', 'manifest.json');
    let resolvePath = '';
    if (fs.existsSync(manifestPath)) {
        resolvePath = manifestPath;
    }
    else if (fs.existsSync(srcManifestPath)) {
        resolvePath = manifestPath;
    }
    if (fs.existsSync(resolvePath)) {
        let contents = fs.readFileSync(resolvePath).toString();
        const [err, res] = jsonc_1.jsonc.safe.parse(contents);
        if (!err) {
            let name = res.name || null;
            if (name) {
                if (!isExtension(filePath)) {
                    result = (res === null || res === void 0 ? void 0 : res.plus) || false;
                }
            }
        }
    }
    return result;
}
exports.isApp = isApp;
function isWap2App(filePath) {
    return isApp(filePath) && sitemapExists(filePath);
}
exports.isWap2App = isWap2App;
function sitemapExists(filePath) {
    let result = false;
    const sitemapPath = path.join(filePath, 'sitemap.json');
    if (fs.existsSync(sitemapPath)) {
        result = true;
    }
    return result;
}
exports.sitemapExists = sitemapExists;
function isExtension(filePath) {
    let result = false;
    const packagePath = path.join(filePath, 'package.json');
    if (fs.existsSync(packagePath)) {
        let contents = fs.readFileSync(packagePath).toString();
        const [err, res] = jsonc_1.jsonc.safe.parse(contents);
        if (!err) {
            let hbxEngineExists = false;
            let engines = res.engines || null;
            if (engines) {
                hbxEngineExists = engines.HBuilderX;
            }
            let mainExists = res.main || null;
            let contributesExists = res.contributes || null;
            if (hbxEngineExists
                && (mainExists != null || contributesExists != null)) {
                result = true;
            }
        }
    }
    return result;
}
exports.isExtension = isExtension;
var ProjectType;
(function (ProjectType) {
    ProjectType[ProjectType["PT_Unknown"] = 0] = "PT_Unknown";
    ProjectType[ProjectType["PT_Web"] = 1] = "PT_Web";
    ProjectType[ProjectType["PT_App"] = 2] = "PT_App";
    ProjectType[ProjectType["PT_UniApp"] = 3] = "PT_UniApp";
    ProjectType[ProjectType["PT_Wap2App"] = 4] = "PT_Wap2App";
    ProjectType[ProjectType["PT_Extension"] = 5] = "PT_Extension";
    ProjectType[ProjectType["PT_UniApp_Vue"] = 6] = "PT_UniApp_Vue";
    ProjectType[ProjectType["PT_MiniApp"] = 7] = "PT_MiniApp";
    ProjectType[ProjectType["PT_MpVue"] = 8] = "PT_MpVue";
    ProjectType[ProjectType["PT_WePy"] = 9] = "PT_WePy";
    ProjectType[ProjectType["PT_BaiduApp"] = 10] = "PT_BaiduApp";
    ProjectType[ProjectType["PT_AlipayApp"] = 11] = "PT_AlipayApp";
    ProjectType[ProjectType["PT_ByteDanceApp"] = 12] = "PT_ByteDanceApp";
    ProjectType[ProjectType["PT_QQApp"] = 13] = "PT_QQApp";
    ProjectType[ProjectType["PT_App360"] = 14] = "PT_App360";
    ProjectType[ProjectType["PT_HuaweiApp"] = 15] = "PT_HuaweiApp";
    ProjectType[ProjectType["PT_QuickAppUnion"] = 16] = "PT_QuickAppUnion";
    ProjectType[ProjectType["PT_KuaiShouApp"] = 17] = "PT_KuaiShouApp";
})(ProjectType = exports.ProjectType || (exports.ProjectType = {}));
;
//# sourceMappingURL=project-resolve.js.map