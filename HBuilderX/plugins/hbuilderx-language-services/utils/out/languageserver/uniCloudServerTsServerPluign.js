"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const hxproject_1 = require("./hxproject");
const ts = require("typescript/lib/tsserverlibrary");
const fs = require("fs");
const vscode_uri_1 = require("vscode-uri");
const languageServiceProxy_1 = require("./languageServiceProxy");
function createDocumentProvider(prj, lsHost, roots) {
    if (!prj || !lsHost) {
        return undefined;
    }
    return {
        get version() {
            return lsHost.getProjectVersion();
        },
        getDefaultLibs(prj) {
            return [];
        },
        compilerOptions: {
            allowNonTsExtensions: true,
            allowJs: true,
            lib: ["lib.esnext.d.ts"],
            target: ts.ScriptTarget.Latest,
            moduleResolution: ts.ModuleResolutionKind.NodeJs,
            experimentalDecorators: false
        },
        get documents() {
            let docs = [].concat(roots);
            lsHost.getScriptFileNames().forEach(item => {
                if (prj.isProjectOf(item)) {
                    docs.push(item);
                }
            });
            return docs;
        },
        getDocumentSnapshot(uri) {
            let docUri = vscode_uri_1.URI.parse(uri);
            if (roots.indexOf(docUri.fsPath) >= 0) {
                let text = fs.readFileSync(docUri.fsPath).toString();
                return {
                    getText: (start, end) => text.substring(start, end),
                    getLength: () => text.length,
                    getChangeRange: () => undefined
                };
            }
            return lsHost.getScriptSnapshot(docUri.fsPath);
        },
        hasDocument(uri) {
            let docUri = vscode_uri_1.URI.parse(uri);
            if (roots.indexOf(docUri.fsPath) >= 0) {
                return true;
            }
            return lsHost.fileExists(docUri.fsPath);
        },
        getDocumentVersion(uri) {
            let docUri = vscode_uri_1.URI.parse(uri);
            if (roots.indexOf(docUri.fsPath) >= 0) {
                //注入的d.ts是静态文件
                return "1";
            }
            return lsHost.getScriptVersion(docUri.fsPath);
        }
    };
}
function create(info) {
    let prj = info.project;
    if (prj) {
        let uniCloudServerLS;
        if (prj && (prj.kind == hxproject_1.hx.HXProjectKind.UniApp || prj.kind == hxproject_1.hx.HXProjectKind.UniApp_Cli)) {
            let serverLibs = hxproject_1.hx.getUnicloudServerLibs();
            const documentProvider = createDocumentProvider(prj, info.languageServiceHost, serverLibs);
            uniCloudServerLS = prj.createTSLanguageService(documentProvider);
        }
        const proxy = (0, languageServiceProxy_1.createTSLanguageServiceProxy)(info.languageService, prj, uniCloudServerLS);
        return proxy;
    }
    return info.languageService;
}
exports.create = create;
exports.default = {
    create
};
//# sourceMappingURL=uniCloudServerTsServerPluign.js.map