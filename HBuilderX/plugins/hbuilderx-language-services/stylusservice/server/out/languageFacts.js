"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPropertyDescription = exports.getBrowserLabel = exports.textToMarkedString = exports.browserNames = void 0;
exports.browserNames = {
    E: 'Edge',
    FF: 'Firefox',
    S: 'Safari',
    C: 'Chrome',
    IE: 'IE',
    O: 'Opera'
};
function getEntryStatus(status) {
    switch (status) {
        case 'experimental':
            return '⚠️ Property is experimental. Be cautious when using it.️\n\n';
        case 'nonstandard':
            return '🚨️ Property is nonstandard. Avoid using it.\n\n';
        case 'obsolete':
            return '🚨️️️ Property is obsolete. Avoid using it.\n\n';
        default:
            return '';
    }
}
function textToMarkedString(text) {
    text = text.replace(/[\\`*_{}[\]()#+\-.!]/g, '\\$&'); // escape markdown syntax tokens: http://daringfireball.net/projects/markdown/syntax#backslash
    return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
exports.textToMarkedString = textToMarkedString;
/**
 * Input is like `["E12","FF49","C47","IE","O"]`
 * Output is like `Edge 12, Firefox 49, Chrome 47, IE, Opera`
 */
function getBrowserLabel(browsers = []) {
    if (browsers.length === 0) {
        return null;
    }
    return browsers
        .map(b => {
        let result = '';
        const matches = b.match(/([A-Z]+)(\d+)?/);
        const name = matches[1];
        const version = matches[2];
        if (name in exports.browserNames) {
            result += exports.browserNames[name];
        }
        if (version) {
            result += ' ' + version;
        }
        return result;
    })
        .join(', ');
}
exports.getBrowserLabel = getBrowserLabel;
function getPropertyDescription(entry) {
    if (!entry.description || entry.description === '') {
        return { value: '' };
    }
    let result = '';
    if (entry.status) {
        result += getEntryStatus(entry.status);
    }
    result += textToMarkedString(entry.description.toString());
    const browserLabel = getBrowserLabel(entry.browsers);
    if (browserLabel) {
        result += '\n\n(' + textToMarkedString(browserLabel) + ')';
    }
    if ('syntax' in entry && entry.syntax) {
        result += `\n\nSyntax: ${textToMarkedString(entry.syntax)}`;
    }
    if (entry.references && entry.references.length > 0) {
        if (result.length > 0) {
            result += '\n\n';
        }
        result += entry.references.map(r => {
            return `[${r.name}](${r.url})`;
        }).join(' | ');
    }
    return { value: result };
}
exports.getPropertyDescription = getPropertyDescription;
//# sourceMappingURL=languageFacts.js.map