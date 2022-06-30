"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexProcessTask = exports.ProjectActiveReason = void 0;
const indexlib_1 = require("../../../indexlib");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const vscode_languageserver_protocol_1 = require("vscode-languageserver-protocol");
const fileFilter_1 = require("../fileFilter");
const fs = require("fs");
const path = require("path");
const vscode_uri_1 = require("vscode-uri");
const filterDirs = ['.git', '.svn', 'node_modules', 'unpackage', '.hbuilderx'];
const maxFileSize = 5 * 1024 * 1024;
const projectFiles = new Map();
var ProjectActiveReason;
(function (ProjectActiveReason) {
    ProjectActiveReason[ProjectActiveReason["ActiveFile"] = 0] = "ActiveFile";
    ProjectActiveReason[ProjectActiveReason["RebuildIndex"] = 1] = "RebuildIndex";
})(ProjectActiveReason = exports.ProjectActiveReason || (exports.ProjectActiveReason = {}));
class IndexProcessTask {
    constructor(docments, processorMnger) {
        this._storeMap = new Map();
        this._traverseTask = new Map();
        this._activatedFolders = new Map();
        this._processorMnger = processorMnger;
        this._onFolderIndexFinished = new vscode_languageserver_protocol_1.Emitter();
        this._documents = docments;
    }
    addActivatedProject(ws, reason) {
        if (reason == ProjectActiveReason.RebuildIndex) {
            if (ws) {
                this._activatedFolders.set(ws.uri, 1);
                this.startFolder(ws);
            }
        }
        else if (reason == ProjectActiveReason.ActiveFile) {
            let folders = Array.from(this._activatedFolders.keys());
            for (let f of folders) {
                if (this._activatedFolders.get(f) == 2) {
                    this._activatedFolders.delete(f);
                }
            }
            if (ws === null || ws === void 0 ? void 0 : ws.uri) {
                this._activatedFolders.set(ws.uri, 2);
                this.startFolder(ws);
            }
        }
    }
    doProjectFileIndext(folder) {
        return new Promise((resolve) => {
            let processNext = () => {
                var _a, _b;
                let files = (_a = projectFiles.get(folder.uri)) !== null && _a !== void 0 ? _a : [];
                if (files.length == 0) {
                    resolve();
                    return;
                }
                if (!this._activatedFolders.has(folder.uri)) {
                    for (let f of this._activatedFolders.keys()) {
                        if (((_b = projectFiles.get(f)) !== null && _b !== void 0 ? _b : []).length > 0) {
                            setTimeout(processNext, 200);
                            return;
                        }
                    }
                }
                let file = files.shift();
                this.doIndexForFile2(file, folder);
                setTimeout(processNext, 10);
            };
            processNext();
        });
    }
    createTask(folder) {
        const folderUri = folder.uri;
        let canceled = false;
        let started = false;
        projectFiles.set(folderUri, []);
        let checkFile = (file) => {
            if (fileFilter_1.supportNameReg.test(file)) {
                return true;
            }
            else {
                let doc = vscode_languageserver_textdocument_1.TextDocument.create(file, '', 1.0, '');
                let processors = this._processorMnger.getProcessorForLanguage('');
                return processors.some((processor) => { return processor.support(doc); });
            }
            return false;
        };
        function readDir(dir) {
            const root = dir;
            return new Promise((resolve, reject) => {
                fs.readdir(root, { withFileTypes: true }, (err, files) => {
                    var _a;
                    if (err) {
                        reject(err);
                        return;
                    }
                    const subdir = [];
                    let fileList = (_a = projectFiles.get(folderUri)) !== null && _a !== void 0 ? _a : [];
                    if (fileList.length > 1000 || canceled) {
                        resolve();
                        return;
                    }
                    files.forEach((file) => {
                        const name = file.name;
                        if (file.isFile() && checkFile(name)) {
                            const fullPath = path.join(root, name);
                            if (fs.statSync(fullPath).size < maxFileSize) {
                                fileList.push(vscode_uri_1.URI.file(fullPath).toString());
                            }
                        }
                        else if (file.isDirectory() && !filterDirs.includes(name)) {
                            subdir.push(path.join(root, name));
                        }
                    });
                    if (fileList.length > 1000 || subdir.length == 0 || canceled) {
                        resolve();
                        return;
                    }
                    Promise.all(subdir.map((p) => { return readDir(p); })).then(() => { resolve(); });
                });
            });
        }
        let doProjectFileIndext = this.doProjectFileIndext.bind(this, folder);
        function doIndex() {
            started = true;
            let f = vscode_uri_1.URI.parse(folder.uri).fsPath;
            if (f) {
                return readDir(f).then(doProjectFileIndext);
            }
            return Promise.reject('项目路径无效');
        }
        return {
            doIndex,
            isStarted: function () {
                return started;
            },
            cancel: function () {
                canceled = true;
            }
        };
    }
    addProject(folder, autoStart = false) {
        if (!this._traverseTask.has(folder.uri)) {
            let task = this.createTask(folder);
            this._traverseTask.set(folder.uri, task);
        }
        if (autoStart) {
            this.startFolder(folder);
        }
        return this.createWathch(folder);
    }
    startFolder(folder) {
        let task = this._traverseTask.get(folder.uri);
        if (task && !task.isStarted()) {
            task.doIndex().then(() => {
            }, (err) => {
                this._activatedFolders.delete(folder.uri);
                console.log(err);
                throw err;
            }).catch().finally(() => {
                projectFiles.delete(folder.uri);
                this._activatedFolders.delete(folder.uri);
                this._traverseTask.delete(folder.uri);
                this._onFolderIndexFinished.fire(folder);
            });
        }
    }
    createWathch(folder) {
        return new Promise((resolve) => {
            if (this._traverseTask.has(folder.uri)) {
                let disposable = this._onFolderIndexFinished.event((ws) => {
                    if (ws.uri == folder.uri) {
                        resolve();
                        disposable.dispose();
                    }
                });
                return;
            }
            resolve();
        });
    }
    removeIndextTask(folder, removeOld = false) {
        return new Promise((resolve) => {
            let removeStore = () => {
                if (removeOld) {
                    let store = this.getStore(folder);
                    store.removeAll();
                    store.save();
                }
            };
            let task = this._traverseTask.get(folder.uri);
            if (task) {
                let disposable = this._onFolderIndexFinished.event((ws) => {
                    if (ws.uri == folder.uri) {
                        removeStore();
                        resolve();
                        disposable.dispose();
                    }
                });
                // 先设置停止标志，再启动一次
                task.cancel();
                this.startFolder(folder);
                return;
            }
            else {
                removeStore();
                resolve();
            }
        });
    }
    removeIndexForFile(uri, root) {
        let store = this.getStore(root);
        store.removeIndex(uri);
        store.save();
    }
    doIndexForFile2(uri, root) {
        try {
            let doc = this._documents.get(uri);
            if (!doc) {
                let path = vscode_uri_1.URI.parse(uri).fsPath;
                if (fs.existsSync(path)) {
                    doc = vscode_languageserver_textdocument_1.TextDocument.create(uri, "", 1, fs.readFileSync(path, { encoding: "utf-8" }));
                }
            }
            if (doc) {
                this.doIndexForDocument2(doc, root);
            }
        }
        catch (error) {
        }
    }
    doIndexForDocument2(document, root) {
        let uri = document.uri;
        let store = this.getStore(root);
        store.removeIndex(uri);
        if (fs.existsSync(vscode_uri_1.URI.parse(uri).fsPath)) {
            let language = document.languageId;
            this._processorMnger.getProcessorForLanguage(language)
                .forEach((processor) => {
                if (processor.support(document, root)) {
                    //无法取到WorkspaceFolder，暂时能想到的办法是遍历WorkspaceFolders,根据documentURi是否在某个folder下。
                    let data = processor.doIndex(document, root);
                    store.addIndexData(uri, data);
                }
            });
        }
        store.save();
    }
    // 针对项目文件变动，该项目索引未处理完时直接补充到文件队列
    doIndexForFile(uri, root) {
        var _a;
        let files = (_a = projectFiles.get(root.uri)) !== null && _a !== void 0 ? _a : [];
        if (files.length == 0) {
            this.doIndexForFile2(uri, root);
        }
        else {
            let index = files ? files.indexOf(uri) : -1;
            if (index < 0) {
                files.push(uri);
            }
        }
    }
    // 针对编辑文件, 直接调用索引处理
    doIndexForDocument(document, root) {
        this.doIndexForDocument2(document, root);
    }
    getStore(ws) {
        const uri = ws.uri.toString();
        if (!this._storeMap.has(uri)) {
            let store = indexlib_1.IndexDataStore.loadWithWrite(ws);
            this._storeMap.set(uri, store);
        }
        return this._storeMap.get(uri);
    }
}
exports.IndexProcessTask = IndexProcessTask;
//# sourceMappingURL=indexprocesstask.js.map