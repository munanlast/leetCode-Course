"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocumentContext = exports.joinPath = exports.normalizePath = exports.resolvePath = exports.isAbsolutePath = void 0;
var vscode_uri_1 = require("vscode-uri");
var Slash = '/'.charCodeAt(0);
var Dot = '.'.charCodeAt(0);
function isAbsolutePath(path) {
    return path.charCodeAt(0) === Slash;
}
exports.isAbsolutePath = isAbsolutePath;
function resolvePath(uriString, path) {
    if (isAbsolutePath(path)) {
        var uri = vscode_uri_1.URI.parse(uriString);
        var parts = path.split('/');
        return uri.with({ path: normalizePath(parts) }).toString();
    }
    return joinPath(uriString, path);
}
exports.resolvePath = resolvePath;
function normalizePath(parts) {
    var newParts = [];
    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
        var part = parts_1[_i];
        if (part.length === 0 || part.length === 1 && part.charCodeAt(0) === Dot) {
            // ignore
        }
        else if (part.length === 2 && part.charCodeAt(0) === Dot && part.charCodeAt(1) === Dot) {
            newParts.pop();
        }
        else {
            newParts.push(part);
        }
    }
    if (parts.length > 1 && parts[parts.length - 1].length === 0) {
        newParts.push('');
    }
    var res = newParts.join('/');
    if (parts[0].length === 0) {
        res = '/' + res;
    }
    return res;
}
exports.normalizePath = normalizePath;
function joinPath(uriString) {
    var paths = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        paths[_i - 1] = arguments[_i];
    }
    var uri = vscode_uri_1.URI.parse(uriString);
    var parts = uri.path.split('/');
    for (var _a = 0, paths_1 = paths; _a < paths_1.length; _a++) {
        var path = paths_1[_a];
        parts.push.apply(parts, path.split('/'));
    }
    return uri.with({ path: normalizePath(parts) }).toString();
}
exports.joinPath = joinPath;
function getDocumentContext(docUri, workspaceFolderUri) {
    return {
        resolveReference: function (ref, base) {
            if (ref[0] === '/') { // resolve absolute path against the current workspace folder
                if (workspaceFolderUri) {
                    return workspaceFolderUri + ref.substr(1);
                }
                return undefined;
            }
            base = base.substr(0, base.lastIndexOf('/') + 1);
            return resolvePath(base, ref);
        }
    };
}
exports.getDocumentContext = getDocumentContext;
//# sourceMappingURL=pathresolve.js.map