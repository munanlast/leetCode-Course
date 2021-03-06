"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRootFolder = exports.getDocumentContext = void 0;
const strings_1 = require("../utils/strings");
const requests_1 = require("../requests");
function getDocumentContext(documentUri, workspaceFolders) {
    function getRootFolder() {
        for (let folder of workspaceFolders) {
            let folderURI = folder.uri;
            if (!(0, strings_1.endsWith)(folderURI, '/')) {
                folderURI = folderURI + '/';
            }
            if ((0, strings_1.startsWith)(documentUri, folderURI)) {
                return folderURI;
            }
        }
        return undefined;
    }
    return {
        resolveReference: (ref, base = documentUri) => {
            if (ref[0] === '/') { // resolve absolute path against the current workspace folder
                let folderUri = getRootFolder();
                if (folderUri) {
                    return folderUri + ref.substr(1);
                }
            }
            base = base.substr(0, base.lastIndexOf('/') + 1);
            return (0, requests_1.resolvePath)(base, ref);
        },
    };
}
exports.getDocumentContext = getDocumentContext;
function getRootFolder(documentUri, workspaceFolders) {
    for (let folder of workspaceFolders) {
        let folderURI = folder.uri;
        if (!(0, strings_1.endsWith)(folderURI, '/')) {
            folderURI = folderURI + '/';
        }
        if ((0, strings_1.startsWith)(documentUri, folderURI)) {
            return folder;
        }
    }
    return undefined;
}
exports.getRootFolder = getRootFolder;
//# sourceMappingURL=documentContext.js.map