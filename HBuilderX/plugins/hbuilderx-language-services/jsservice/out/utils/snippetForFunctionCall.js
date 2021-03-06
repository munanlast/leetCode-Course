"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.snippetForFunctionCall = void 0;
const vscode = require("vscode");
const PConst = require("../protocol.const");
function snippetForFunctionCall(item, displayParts) {
    if (item.insertText && typeof item.insertText !== 'string') {
        return { snippet: item.insertText, parameterCount: 0 };
    }
    const parameterListParts = getParameterListParts(displayParts);
    const snippet = new vscode.SnippetString();
    snippet.appendText(`${item.insertText || item.label}(`);
    snippet.appendTabstop(1);
    snippet.appendText(')');
    snippet.appendTabstop(0);
    return { snippet, parameterCount: parameterListParts.parts.length + (parameterListParts.hasOptionalParameters ? 1 : 0) };
}
exports.snippetForFunctionCall = snippetForFunctionCall;
function appendJoinedPlaceholders(snippet, parts, joiner) {
    for (let i = 0; i < parts.length; ++i) {
        const paramterPart = parts[i];
        snippet.appendPlaceholder(paramterPart.text);
        if (i !== parts.length - 1) {
            snippet.appendText(joiner);
        }
    }
}
function getParameterListParts(displayParts) {
    const parts = [];
    let isInMethod = false;
    let hasOptionalParameters = false;
    let parenCount = 0;
    let braceCount = 0;
    outer: for (let i = 0; i < displayParts.length; ++i) {
        const part = displayParts[i];
        switch (part.kind) {
            case PConst.DisplayPartKind.methodName:
            case PConst.DisplayPartKind.functionName:
            case PConst.DisplayPartKind.text:
            case PConst.DisplayPartKind.propertyName:
                if (parenCount === 0 && braceCount === 0) {
                    isInMethod = true;
                }
                break;
            case PConst.DisplayPartKind.parameterName:
                if (parenCount === 1 && braceCount === 0 && isInMethod) {
                    // Only take top level paren names
                    const next = displayParts[i + 1];
                    // Skip optional parameters
                    const nameIsFollowedByOptionalIndicator = next && next.text === '?';
                    // Skip this parameter
                    const nameIsThis = part.text === 'this';
                    if (!nameIsFollowedByOptionalIndicator && !nameIsThis) {
                        parts.push(part);
                    }
                    hasOptionalParameters = hasOptionalParameters || nameIsFollowedByOptionalIndicator;
                }
                break;
            case PConst.DisplayPartKind.punctuation:
                if (part.text === '(') {
                    ++parenCount;
                }
                else if (part.text === ')') {
                    --parenCount;
                    if (parenCount <= 0 && isInMethod) {
                        break outer;
                    }
                }
                else if (part.text === '...' && parenCount === 1) {
                    // Found rest parmeter. Do not fill in any further arguments
                    hasOptionalParameters = true;
                    break outer;
                }
                else if (part.text === '{') {
                    ++braceCount;
                }
                else if (part.text === '}') {
                    --braceCount;
                }
                break;
        }
    }
    return { hasOptionalParameters, parts };
}
//# sourceMappingURL=snippetForFunctionCall.js.map