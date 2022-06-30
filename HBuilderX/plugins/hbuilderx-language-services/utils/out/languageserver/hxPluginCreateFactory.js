"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPlugin = void 0;
const ts = require("typescript/lib/tsserverlibrary");
const fs = require("fs");
const path = require("path");
const hxproject_1 = require("./hxproject");
const uniCloudServerTsServerPluign_1 = require("./uniCloudServerTsServerPluign");
const project_resolve_1 = require("../project-resolve");
function createPlugin(info) {
    let rootPath = '';
    let prj = hxproject_1.hx.getProject(info.project.getCurrentDirectory());
    if (prj) {
        rootPath = prj.fsPath;
        console.log(`root path: ${rootPath}`);
        let defaultLibs = hxproject_1.hx.getDefaultLibs(prj);
        defaultLibs.forEach(lib => {
            info.project.addMissingFileRoot(ts.server.toNormalizedPath(lib));
        });
        let selectedLibraries = new Set();
        // 添加勾选的常用语法库
        let frameworkTypePath = path.resolve(__dirname, `../../../frameworkdts`);
        if (fs.existsSync(frameworkTypePath) && fs.statSync(frameworkTypePath).isDirectory()) {
            fs.readdirSync(frameworkTypePath).forEach(value => {
                let type = path.join(frameworkTypePath, value, 'index.d.ts');
                let libraries = (0, project_resolve_1.getLibraries)(rootPath);
                if (libraries.findIndex(lib => value === lib) != -1) {
                    selectedLibraries.add(value);
                    info.project.addMissingFileRoot(ts.server.toNormalizedPath(type));
                }
            });
        }
        // 添加勾选的框架语法库
        let settingPath = (0, project_resolve_1.getSettingPath)(rootPath);
        let typesPath = path.resolve(settingPath, `../../../types`);
        if (fs.existsSync(typesPath) && fs.statSync(typesPath).isDirectory()) {
            fs.readdirSync(typesPath).forEach(value => {
                let type = path.join(typesPath, value, 'index.d.ts');
                let libraries = (0, project_resolve_1.getLibraries)(rootPath);
                if (libraries.findIndex(lib => value === lib) != -1) {
                    selectedLibraries.add(value);
                    info.project.addMissingFileRoot(ts.server.toNormalizedPath(type));
                }
            });
        }
        setInterval(() => {
            let libraries = new Set((0, project_resolve_1.getLibraries)(rootPath));
            // 先删除
            for (let lib of selectedLibraries) {
                if (!libraries.has(lib)) {
                    let libPath = frameworkTypePath + '/' + lib + `/index.d.ts`;
                    if (!fs.existsSync(libPath)) {
                        libPath = typesPath + '/' + lib + `/index.d.ts`;
                    }
                    if (fs.existsSync(libPath)) {
                        let scriptInfo = info.project.getScriptInfo(libPath);
                        info.project.removeFile(scriptInfo, true, true);
                    }
                }
            }
            // 后添加
            for (let lib of libraries) {
                if (!selectedLibraries.has(lib)) {
                    let libPath = frameworkTypePath + '/' + lib + `/index.d.ts`;
                    if (!fs.existsSync(libPath)) {
                        libPath = typesPath + '/' + lib + `/index.d.ts`;
                    }
                    if (fs.existsSync(libPath)) {
                        info.project.addMissingFileRoot(ts.server.toNormalizedPath(libPath));
                    }
                }
            }
        }, 2000);
        const oriModuleResolver = info.project.resolveModuleNames;
        info.project.resolveModuleNames = (moduleNames, containingFile, reusedNames, redirectedReference, _options, containingSourceFile) => {
            let result = oriModuleResolver.apply(info.project, [moduleNames, containingFile, reusedNames,
                redirectedReference, _options, containingSourceFile]);
            for (let i = 0; i < result.length; i++) {
                if (result[i]) {
                    continue;
                }
                result[i] = hxproject_1.hx.resolveModuleName(prj, moduleNames[i], containingFile, _options, info.project);
            }
            return result;
        };
        return uniCloudServerTsServerPluign_1.default.create({
            project: prj,
            languageService: info.languageService,
            languageServiceHost: info.languageServiceHost,
            config: info.config
        });
    }
    return info.languageService;
}
exports.createPlugin = createPlugin;
//# sourceMappingURL=hxPluginCreateFactory.js.map