"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRootFolders = void 0;
function endsWith(haystack, needle) {
    let diff = haystack.length - needle.length;
    if (diff > 0) {
        return haystack.indexOf(needle, diff) === diff;
    }
    else if (diff === 0) {
        return haystack === needle;
    }
    else {
        return false;
    }
}
function startsWith(haystack, needle) {
    if (haystack.length < needle.length) {
        return false;
    }
    for (let i = 0; i < needle.length; i++) {
        if (haystack[i] !== needle[i]) {
            return false;
        }
    }
    return true;
}
function getRootFolders(documentUri, workspaceFolders) {
    let result = [];
    for (let folder of workspaceFolders) {
        let folderURI = folder.uri;
        if (!endsWith(folderURI, '/')) {
            folderURI = folderURI + '/';
        }
        if (startsWith(documentUri, folderURI)) {
            result.push(folder);
        }
    }
    return result;
}
exports.getRootFolders = getRootFolders;
//# sourceMappingURL=documentContext.js.map