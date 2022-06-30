"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const fs = require("fs");
const vscode = require("vscode");
const path = require("path");
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle();
let servicesDir = ['cssservice', 'htmlservice', 'jsservice', 'stylusservice', 'emmet'];
let services = [];
function activatePackage(packageDir, context) {
    let result;
    try {
        const extension = require(packageDir);
        if (extension.activate) {
            result = extension.activate(context);
            services.push(extension);
        }
    }
    catch (error) {
        console.error(packageDir, "activate failed.", error);
    }
    return result;
}
function isZH_CN() {
    try {
        if (process.env["VSCODE_NLS_CONFIG"]) {
            return JSON.parse(process.env["VSCODE_NLS_CONFIG"]).locale === 'zh_CN';
        }
    }
    catch (e) {
        console.error(e === null || e === void 0 ? void 0 : e.stack);
    }
    return true;
}
function activate(context) {
    vscode.window.setStatusBarMessage(localize('serverLoading.progress', isZH_CN() ? "正在初始化语法助手服务..." : "Initializing language server..."));
    const packages = [];
    const rootDir = context.extensionPath;
    const indexProcessors = [];
    // 遍历package.json,向索引服务注册索引处理模块
    servicesDir.forEach(dir => {
        var _a;
        let p = path.join(rootDir, dir, 'package.json');
        if (fs.statSync(p).isFile()) {
            try {
                const packageJSON = JSON.parse(fs.readFileSync(p).toString());
                const processors = (_a = packageJSON.contributes) === null || _a === void 0 ? void 0 : _a.indexProcessors;
                processors === null || processors === void 0 ? void 0 : processors.forEach((processor) => {
                    if (processor.url) {
                        processor.url = path.join(path.dirname(p), processor.url);
                        if (fs.statSync(processor.url).isFile()) {
                            indexProcessors.push(processor);
                        }
                    }
                });
                packages.push({ service: dir, path: path.join(rootDir, dir), packageJSON });
            }
            catch (error) {
                console.log("read package failed:", p);
            }
        }
    });
    // 先激活索引服务，获取注册接口
    const indexServiceDir = context.asAbsolutePath("./indexservice");
    const indexService = activatePackage(indexServiceDir, context);
    if (indexService === null || indexService === void 0 ? void 0 : indexService.registerLanguageIndexProcessor) {
        indexProcessors === null || indexProcessors === void 0 ? void 0 : indexProcessors.forEach(processor => {
            indexService.registerLanguageIndexProcessor(processor);
        });
    }
    let serviceExports = [];
    function getLanguageServiceExports() {
        return serviceExports;
    }
    packages.forEach((p) => {
        Promise.resolve(p.path).then((dir) => {
            let api = activatePackage(dir, context);
            serviceExports.push({ service: p.service, exports: api });
        });
    });
    vscode.window.setStatusBarMessage(localize('serverLoading.progress.success', isZH_CN() ? "语法助手服务启动成功" : "Initializing language server successed."), 5000);
    return {
        getLanguageServiceExports,
        invokeApi(options) {
            if (!options.serverName || !options.apiName) {
                throw new Error('Invalid arguments: serverName and apiName can not be null!');
            }
            let serverExports = getLanguageServiceExports();
            for (const serverExport of serverExports) {
                if (serverExport.service === options.serverName) {
                    if (serverExport.exports[options.apiName]) {
                        return serverExport.exports[options.apiName](options.args);
                    }
                    else {
                        throw new Error(`The api ${options.apiName} can not find in ${options.serverName}.`);
                    }
                }
            }
        },
    };
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
    services.forEach((service) => {
        var _a;
        (_a = service.deactivate) === null || _a === void 0 ? void 0 : _a.call(service);
    });
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map