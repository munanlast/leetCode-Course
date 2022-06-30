"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("vscode-languageserver/node");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const protocol_1 = require("vscode-languageserver-protocol/lib/common/protocol");
const indexprocesstask_1 = require("./indexprocesstask");
const request_1 = require("./request");
const processormanager_1 = require("./processormanager");
const documentContext_1 = require("../utils/documentContext");
const vscode_uri_1 = require("vscode-uri");
const nls = require("../localize/localize");
const localize = nls.loadMessageBundle(__filename);
const connection = (0, node_1.createConnection)(node_1.ProposedFeatures.all);
// Create a simple text document manager.
const documents = new node_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
const processorMnger = new processormanager_1.IndexProcessorManager();
const indexProcessTask = new indexprocesstask_1.IndexProcessTask(documents, processorMnger);
let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
let workspaceFolders = [];
connection.onInitialize((params) => {
    const capabilities = params.capabilities;
    workspaceFolders = params.workspaceFolders;
    if (!Array.isArray(workspaceFolders)) {
        workspaceFolders = [];
    }
    connection.console.log(JSON.stringify(capabilities));
    // Does the client support the `workspace/configuration` request?
    // If not, we fall back using global settings.
    hasConfigurationCapability = !!(capabilities.workspace && !!capabilities.workspace.configuration);
    hasWorkspaceFolderCapability = !!(capabilities.workspace && !!capabilities.workspace.workspaceFolders);
    const result = {
        capabilities: {
            textDocumentSync: { openClose: true, change: node_1.TextDocumentSyncKind.Incremental }
        }
    };
    if (hasWorkspaceFolderCapability) {
        result.capabilities.workspace = {
            workspaceFolders: {
                supported: true
            }
        };
    }
    return result;
});
connection.onInitialized(() => {
    if (hasConfigurationCapability) {
        // Register for all configuration changes.
        connection.client.register(node_1.DidChangeConfigurationNotification.type, undefined);
    }
    if (hasWorkspaceFolderCapability) {
        connection.client.register(node_1.DidChangeWorkspaceFoldersNotification.type);
        connection.onNotification(node_1.DidChangeWorkspaceFoldersNotification.type, e => {
            const toAdd = e.event.added;
            const toRemove = e.event.removed;
            const updatedFolders = [];
            if (workspaceFolders) {
                for (const folder of workspaceFolders) {
                    if (!toRemove.some(r => r.uri === folder.uri) && !toAdd.some(r => r.uri === folder.uri)) {
                        updatedFolders.push(folder);
                    }
                }
            }
            workspaceFolders = updatedFolders.concat(toAdd);
            toRemove.forEach((folder) => {
                indexProcessTask.removeIndextTask(folder, true);
            });
            toAdd.forEach((folder) => {
                indexProcessTask.addProject(folder);
            });
        });
    }
});
connection.onDidChangeConfiguration(change => {
    //目前估计用不着，不过后续应该会加配置项，可以先保留
    //connection.console.log('这里处理onDidChangeConfiguration事件');
});
let delayDoIndex = (function () {
    let changeSet = new Map();
    let delayTimer = null;
    function doIndexForFile(uri) {
        (0, documentContext_1.getRootFolders)(uri, workspaceFolders).forEach(folder => {
            indexProcessTask.doIndexForFile(uri, folder);
        });
    }
    function delayDoIndex(docUri, delay) {
        if (delay <= 0) {
            doIndexForFile(docUri);
        }
        else {
            if (changeSet.has(docUri)) {
                let delayTimer = changeSet.get(docUri);
                clearTimeout(delayTimer);
                changeSet.delete(docUri);
            }
            changeSet.set(docUri, setTimeout(() => {
                if (changeSet.has(docUri)) {
                    changeSet.delete(docUri);
                    doIndexForFile(docUri);
                }
            }, delay));
        }
    }
    return delayDoIndex;
})();
documents.onDidChangeContent(change => {
    let uri = change.document.uri;
    delayDoIndex(uri, 300);
});
documents.onDidClose(change => {
    // 关闭时可能没有保存,手动调用处理过程
    let uri = change.document.uri;
    delayDoIndex(uri, 20);
});
connection.onDidChangeWatchedFiles(_change => {
    _change.changes.forEach((fe) => {
        if (fe.type === protocol_1.FileChangeType.Created ||
            fe.type === protocol_1.FileChangeType.Changed) {
            delayDoIndex(fe.uri, 20);
        }
        else if (fe.type === protocol_1.FileChangeType.Deleted) {
            let uri = fe.uri;
            (0, documentContext_1.getRootFolders)(uri, workspaceFolders).forEach((folder) => {
                indexProcessTask.removeIndexForFile(uri, folder);
            });
        }
    });
});
let delayTraverseAllFolders = function () {
    let delayTimer = null;
    function delay() {
        if (delayTimer === null) {
            delayTimer = setTimeout(() => {
                delayTimer = null;
                workspaceFolders.forEach(folder => {
                    indexProcessTask.removeIndextTask(folder, true).then(() => {
                        indexProcessTask.addProject(folder);
                    });
                });
            }, 1000);
        }
    }
    return delay;
}();
connection.onRequest(request_1.RegisterProcessorRequest.type, (param) => {
    try {
        Promise.resolve().then(() => require(param.url)).then((processor) => {
            if (processor && processor.createFileIndexProcessor) {
                const p = processor.createFileIndexProcessor(processorMnger);
                if (p) {
                    processorMnger.addProcessor(p, param.language);
                    delayTraverseAllFolders();
                }
            }
        });
    }
    catch (error) {
        console.log(error);
    }
});
connection.onRequest(request_1.RebuildProjectIndexRequest.type, (param) => {
    const uri = vscode_uri_1.URI.parse(param.folderUri);
    try {
        const uriString = uri.toString();
        let ws = workspaceFolders.find((folder) => { return folder.uri === uriString; });
        if (ws) {
            return indexProcessTask.removeIndextTask(ws, true).then(() => {
                indexProcessTask.addActivatedProject(ws, indexprocesstask_1.ProjectActiveReason.RebuildIndex);
                return indexProcessTask.addProject(ws, true);
            }).then(function () {
            }, function (error) {
                return new node_1.ResponseError(node_1.ErrorCodes.InternalError, "", error);
            });
        }
        let message = localize('indexservice.notfound', '未找到项目路径: [{0}]', uri.fsPath);
        return Promise.resolve(new node_1.ResponseError(node_1.ErrorCodes.InternalError, message));
    }
    catch (error) {
        return Promise.resolve(new node_1.ResponseError(node_1.ErrorCodes.InternalError, "", error));
    }
});
connection.onNotification(request_1.EditorActivatedNofity.type, (uri) => {
    let folders = uri ? (0, documentContext_1.getRootFolders)(uri, workspaceFolders) : [];
    folders.forEach(f => {
        indexProcessTask.addActivatedProject(f, indexprocesstask_1.ProjectActiveReason.ActiveFile);
    });
});
documents.listen(connection);
connection.listen();
//# sourceMappingURL=server.js.map