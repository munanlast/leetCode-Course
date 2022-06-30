"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const path = require("path");
const node_1 = require("vscode-languageclient/node");
const request_1 = require("./request");
const client_1 = require("../../utils/client");
const vscode_uri_1 = require("vscode-uri");
const fileFilter_1 = require("./fileFilter");
const editorWatch_1 = require("./editorWatch");
const hx = require('hbuilderx');
const nls = require("./localize/localize");
const localize = nls.loadMessageBundle(__filename);
let client;
let clientReady = false;
function activate(context) {
    // The server is implemented in node
    const serverModule = context.asAbsolutePath(path.join('indexservice', 'out', 'server', 'server.js'));
    // The debug options for the server
    // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
    let debugOptions;
    if (context.extensionMode == vscode.ExtensionMode.Development) {
        debugOptions = { execArgv: ['--nolazy', '--inspect=6509'] };
    }
    else {
        debugOptions = { execArgv: ['--nolazy'] };
    }
    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    const serverOptions = {
        run: { module: serverModule, transport: node_1.TransportKind.ipc },
        debug: {
            module: serverModule,
            transport: node_1.TransportKind.ipc,
            options: debugOptions,
        },
    };
    // Options to control the language client
    const clientOptions = {
        documentSelector: fileFilter_1.supportLanguages,
        synchronize: {
            fileEvents: vscode.workspace.createFileSystemWatcher(fileFilter_1.supportNameGlob),
        },
        outputChannel: new client_1.LogRedirectOutputChannel("LanguageServerIndex")
    };
    // Create the language client and start the client.
    client = new node_1.LanguageClient('LanguageServerIndex', 'LanguageServerIndex', serverOptions, clientOptions);
    // client.registerProposedFeatures();
    client.start();
    client.onReady().then(() => {
        clientReady = true;
        context.subscriptions.push((0, editorWatch_1.watchActivateTextEditor)(client));
    });
    function registerLanguageIndexProcessor(processorSrc) {
        const param = processorSrc;
        try {
            if (clientReady) {
                client.sendRequest(request_1.RegisterProcessorRequest.type, param);
            }
            else {
                client.onReady().then(() => {
                    client.sendRequest(request_1.RegisterProcessorRequest.type, param);
                });
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    // 注册重建索引api
    let disposable = hx.commands.registerCommand('indexService.rebuildIndex', (files) => {
        let projectUri = null;
        let projectName = "";
        let hxWorkspaceFolder = undefined;
        if (files instanceof Array && files.length > 0) {
            hxWorkspaceFolder = files[0].workspaceFolder;
        }
        else if (files) {
            hxWorkspaceFolder = files.workspaceFolder;
        }
        if (hxWorkspaceFolder && hxWorkspaceFolder.uri && hxWorkspaceFolder.uri.scheme == 'file') {
            projectName = hxWorkspaceFolder.name;
            projectUri = vscode_uri_1.URI.file(hxWorkspaceFolder.uri.fsPath);
        }
        if (projectUri) {
            let folderUri = projectUri.toString();
            hx.window.setStatusBarMessage(localize('index.build.processing', '正在构建项目[{0}]索引...', projectName), -1);
            client.sendRequest(request_1.RebuildProjectIndexRequest.type, { folderUri }).then(() => {
                let message = localize('index.build.finish', '项目[{0}]构建索引完成', projectName);
                hx.window.setStatusBarMessage(message, 5000);
            }, (e) => {
                let message = localize('index.build.error', '项目[{0}]构建索引失败', projectName);
                if (e.message) {
                    message += `: ${e.message}`;
                }
                else if (e.data) {
                    let errStr = e.data.toString();
                    message += `: ${errStr}`;
                }
                hx.window.setStatusBarMessage(message, 5000, 'error');
            });
        }
        else {
            let message = localize('index.build.error.invalidProject', '构建索引失败: 无效的项目');
            hx.window.setStatusBarMessage(message, 5000, "error");
        }
    });
    context.subscriptions.push(disposable);
    return {
        registerLanguageIndexProcessor,
    };
}
exports.activate = activate;
function deactivate() {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map