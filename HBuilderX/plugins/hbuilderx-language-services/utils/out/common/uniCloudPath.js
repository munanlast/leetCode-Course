"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jqlPrefix = exports.getAllCloudObjects = exports.getAllCloudFunctions = exports.isUniMoudlesPages = exports.fixPath = exports.isUniCloudServerFile = exports.getUniModuleAction = exports.getUniModuleCloudFunction = exports.getUniModuleValidate = exports.getUniModuleDatabase = exports.getUniModuleUniCloud = exports.getUniModulesDir = exports.getValidationRoot = exports.getCloudActionRoot = exports.getCloudDatabaseRoot = exports.getCloudFunctionsRoot = exports.getUniCloudRoot = exports.providers = void 0;
const fs = require("fs");
const path = require("path");
let providers = ['aliyun', 'tcb'];
exports.providers = providers;
const jqlPrefix = 'let db = uniCloud.database();';
exports.jqlPrefix = jqlPrefix;
function fixPath(filePath) {
    return filePath.replace(/\\/g, '/');
}
exports.fixPath = fixPath;
function isUniMoudlesPages(filePath) {
    let vuePattern = /uni_modules\/\\S+\/pages\/\\S+.vue/i;
    let nvuePattern = /uni_modules\/\\S+\/pages\/\\S+.nvue/i;
    return vuePattern.test(filePath) || nvuePattern.test(filePath);
}
exports.isUniMoudlesPages = isUniMoudlesPages;
function hasCloudResources(projectPath) {
    for (let provider of providers) {
        let resourcePath = path.join(projectPath, 'uniCloud-', provider);
        if (fs.existsSync(resourcePath))
            return true;
    }
    return false;
}
function isUniCloudServerFile(filePath, projectPath) {
    let result = false;
    for (let provider of providers) {
        let cloudFunctionPath = path.join(projectPath, getCloudFunctionsRoot(provider));
        if (filePath.startsWith(cloudFunctionPath)) {
            result = true;
            break;
        }
        let pattern = path.join(projectPath, 'uni_modules/\\S+/uniCloud-', provider, 'cloudfunctions/*.js');
        if (new RegExp(pattern).test(fixPath(filePath))) {
            result = true;
            break;
        }
    }
    return result;
}
exports.isUniCloudServerFile = isUniCloudServerFile;
function getUniCloudRoot(provider) {
    return 'uniCloud-' + provider;
}
exports.getUniCloudRoot = getUniCloudRoot;
function getCloudFunctionsRoot(provider) {
    return getUniCloudRoot(provider) + '/cloudfunctions';
}
exports.getCloudFunctionsRoot = getCloudFunctionsRoot;
function getCloudDatabaseRoot(provider) {
    return getUniCloudRoot(provider) + '/database';
}
exports.getCloudDatabaseRoot = getCloudDatabaseRoot;
function getCloudActionRoot(provider) {
    return getCloudFunctionsRoot(provider) + '/uni-clientDB-actions';
}
exports.getCloudActionRoot = getCloudActionRoot;
function getValidationRoot(provider) {
    return getUniCloudRoot(provider) + '/database/validateFunction';
}
exports.getValidationRoot = getValidationRoot;
function getUniModulesDir() {
    return 'uni_modules';
}
exports.getUniModulesDir = getUniModulesDir;
function getUniModuleUniCloud(moduleName, provider) {
    return getUniModulesDir() + "/" + moduleName + "/uniCloud";
}
exports.getUniModuleUniCloud = getUniModuleUniCloud;
function getUniModuleDatabase(moduleName, provider) {
    return getUniModuleUniCloud(moduleName, provider) + "/database";
}
exports.getUniModuleDatabase = getUniModuleDatabase;
function getUniModuleValidate(moduleName, provider) {
    return getUniModuleUniCloud(moduleName, provider) + "/database/validateFunction";
}
exports.getUniModuleValidate = getUniModuleValidate;
function getUniModuleCloudFunction(moduleName, provider) {
    return getUniModuleUniCloud(moduleName, provider) + "/cloudfunctions";
}
exports.getUniModuleCloudFunction = getUniModuleCloudFunction;
function getUniModuleAction(moduleName, provider) {
    return getUniModuleCloudFunction(moduleName, provider) + "/uni-clientDB-actions";
}
exports.getUniModuleAction = getUniModuleAction;
function getAllCloudObjects(projectPath) {
    let allfunctions = getAllCloudFunctions(projectPath);
    let allobjects = new Set();
    allfunctions.forEach(fn => {
        if (fs.existsSync(path.join(fn.path, "index.obj.js"))) {
            allobjects.add(fn);
        }
    });
    return allobjects;
}
exports.getAllCloudObjects = getAllCloudObjects;
function getAllCloudFunctions(projectPath) {
    let cloudFunctionSets = new Set();
    for (let i = 0; i < providers.length; ++i) {
        let cfRoot = getCloudFunctionsRoot(providers[i]);
        let cf = path.join(projectPath, cfRoot);
        if (fs.existsSync(cf)) {
            fs.readdirSync(cf).forEach(value => {
                let filePath = path.join(cf, value);
                if (fs.statSync(filePath).isDirectory()
                    && value !== 'common'
                    && value !== 'uni-clientDB-actions') {
                    cloudFunctionSets.add({
                        name: value,
                        path: filePath
                    });
                }
            });
        }
    }
    let uniMoudlesDirPath = getUniModulesDir();
    let uniModules = path.join(projectPath, uniMoudlesDirPath);
    if (fs.existsSync(uniModules)) {
        if (fs.statSync(uniModules).isDirectory()) {
            fs.readdirSync(uniModules).forEach((value) => {
                let modulePath = path.join(uniModules, value);
                if (fs.statSync(modulePath).isDirectory()) {
                    let moduleCloudFuncPath = getUniModuleCloudFunction(value, '');
                    let cloudFunctions = path.join(projectPath, moduleCloudFuncPath);
                    if (fs.existsSync(cloudFunctions) && fs.statSync(cloudFunctions).isDirectory()) {
                        fs.readdirSync(cloudFunctions).forEach(cloudFunction => {
                            let cloudFunctionPath = path.join(cloudFunctions, cloudFunction);
                            if (cloudFunction !== 'common'
                                && cloudFunction !== 'uni-clientDB-actions'
                                && fs.statSync(cloudFunctionPath).isDirectory()) {
                                cloudFunctionSets.add({
                                    name: cloudFunction,
                                    path: cloudFunctionPath
                                });
                            }
                        });
                    }
                }
            });
        }
    }
    return cloudFunctionSets;
}
exports.getAllCloudFunctions = getAllCloudFunctions;
//# sourceMappingURL=uniCloudPath.js.map