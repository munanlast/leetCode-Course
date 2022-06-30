"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const rimraf = require("rimraf");
const vscode = require("vscode");
const commandManager_1 = require("./commands/commandManager");
const index_1 = require("./commands/index");
const schemaManager_1 = require("./jsonHandler/schemaManager");
const languageConfiguration_1 = require("./languageFeatures/languageConfiguration");
const lazyClientHost_1 = require("./lazyClientHost");
const cancellation_electron_1 = require("./tsServer/cancellation.electron");
const logDirectoryProvider_electron_1 = require("./tsServer/logDirectoryProvider.electron");
const serverProcess_electron_1 = require("./tsServer/serverProcess.electron");
const versionProvider_electron_1 = require("./tsServer/versionProvider.electron");
const fileSystem_electron_1 = require("./utils/fileSystem.electron");
const plugins_1 = require("./utils/plugins");
const temp = require("./utils/temp.electron");
function activate(context) {
    const pluginManager = new plugins_1.PluginManager();
    context.subscriptions.push(pluginManager);
    const commandManager = new commandManager_1.CommandManager();
    context.subscriptions.push(commandManager);
    const onCompletionAccepted = new vscode.EventEmitter();
    context.subscriptions.push(onCompletionAccepted);
    const logDirectoryProvider = new logDirectoryProvider_electron_1.NodeLogDirectoryProvider(context);
    const versionProvider = new versionProvider_electron_1.DiskTypeScriptVersionProvider();
    context.subscriptions.push(new languageConfiguration_1.LanguageConfigurationManager());
    serverProcess_electron_1.ChildServerProcess.inServerDebugMode = context.extensionMode == vscode.ExtensionMode.Development;
    const lazyClientHost = (0, lazyClientHost_1.createLazyClientHost)(context, (0, fileSystem_electron_1.onCaseInsenitiveFileSystem)(), {
        pluginManager,
        commandManager,
        logDirectoryProvider,
        cancellerFactory: cancellation_electron_1.nodeRequestCancellerFactory,
        versionProvider,
        processFactory: serverProcess_electron_1.ChildServerProcess,
    }, (item) => {
        onCompletionAccepted.fire(item);
    });
    (0, index_1.registerBaseCommands)(commandManager, lazyClientHost, pluginManager);
    // import('./task/taskProvider').then(module => {
    // 	context.subscriptions.push(module.register(lazyClientHost.map(x => x.serviceClient)));
    // });
    Promise.resolve().then(() => require('./languageFeatures/tsconfig')).then((module) => {
        context.subscriptions.push(module.register());
    });
    Promise.resolve().then(() => require('./jsonHandler/jsonCompletion')).then((module) => {
        context.subscriptions.push(module.register());
    });
    Promise.resolve().then(() => require('./jsonHandler/jsonHover')).then((module) => {
        context.subscriptions.push(module.register());
    });
    // import('./jsonHandler/jsonFormatting').then( module => {
    // 	context.subscriptions.push(module.register());
    // })
    context.subscriptions.push((0, lazyClientHost_1.lazilyActivateClient)(lazyClientHost, pluginManager));
    return {
        expandJsonServerRegisterSchema: schemaManager_1.expandJsonServerRegisterSchema
    };
}
exports.activate = activate;
function deactivate() {
    rimraf.sync(temp.getInstanceTempDir());
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map