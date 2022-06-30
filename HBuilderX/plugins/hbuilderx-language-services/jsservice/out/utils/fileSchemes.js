"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.disabledSchemes = exports.semanticSupportedSchemes = exports.walkThroughSnippet = exports.vsls = exports.privateScheme = exports.pr = exports.git = exports.untitled = exports.file = void 0;
exports.file = 'file';
exports.untitled = 'untitled';
exports.git = 'git';
exports.pr = 'pr';
exports.privateScheme = 'private';
/** Live share scheme */
exports.vsls = 'vsls';
exports.walkThroughSnippet = 'walkThroughSnippet';
exports.semanticSupportedSchemes = [
    exports.file,
    exports.untitled,
];
/**
 * File scheme for which JS/TS language feature should be disabled
 */
exports.disabledSchemes = new Set([
    exports.git,
    exports.vsls,
    exports.privateScheme,
    exports.pr,
]);
//# sourceMappingURL=fileSchemes.js.map