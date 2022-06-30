"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const nodeFs_1 = require("./nodeFs");
const vscode_1 = require("vscode");
const htmlClient_1 = require("../htmlClient");
const node_1 = require("vscode-languageclient/node");
const util_1 = require("util");
const fs = require("fs");
const client_1 = require("../../../../utils/client");
// this method is called when vs code is activated
function activate(context) {
    let clientPackageJSON = getPackageInfo(context);
    const serverMain = `./htmlservice/server/${clientPackageJSON.main.indexOf('/dist/') !== -1 ? 'dist' : 'out'}/node/htmlServerMain`;
    const serverModule = context.asAbsolutePath(serverMain);
    // The debug options for the server
    let debugOptions;
    if (context.extensionMode == vscode_1.ExtensionMode.Development) {
        debugOptions = { execArgv: ['--nolazy', '--inspect=16044'] };
    }
    else {
        debugOptions = { execArgv: ['--nolazy'] };
    }
    // If the extension is launch in debug mode the debug server options are use
    // Otherwise the run options are used
    const serverOptions = {
        run: { module: serverModule, transport: node_1.TransportKind.ipc },
        debug: { module: serverModule, transport: node_1.TransportKind.ipc, options: debugOptions },
    };
    const newLanguageClient = (id, name, clientOptions) => {
        return new client_1.HXLanguageClient(id, name, serverOptions, clientOptions);
        // return new LanguageClient(id, name, serverOptions, clientOptions);
    };
    (0, htmlClient_1.startClient)(context, newLanguageClient, { fs: (0, nodeFs_1.getNodeFSRequestService)(), TextDecoder: util_1.TextDecoder });
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
function getPackageInfo(context) {
    const location = context.asAbsolutePath('./htmlservice/package.json');
    try {
        return JSON.parse(fs.readFileSync(location).toString());
    }
    catch (e) {
        console.log(`Problems reading ${location}: ${e}`);
        return { name: '', version: '', aiKey: '', main: '' };
    }
}
//# sourceMappingURL=htmlClientMain.js.map