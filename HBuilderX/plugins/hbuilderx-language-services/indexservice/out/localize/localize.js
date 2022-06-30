"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadMessageBundle = void 0;
const path = require("path");
const fs = require("fs");
const rootDir_1 = require("../rootDir");
let options = {};
const toString = Object.prototype.toString;
function isString(value) {
    return toString.call(value) === '[object String]';
}
let resolvedMessages = {};
function initializeSettings() {
    if (process.env.VSCODE_NLS_CONFIG) {
        try {
            let vscodeOptions = JSON.parse(process.env.VSCODE_NLS_CONFIG);
            if (isString(vscodeOptions.locale)) {
                options.locale = vscodeOptions.locale.toLowerCase();
            }
            options.language = options.locale;
        }
        catch (_a) {
        }
    }
}
initializeSettings();
function format(message, args) {
    let result = "";
    if (args.length === 0) {
        result = message;
    }
    else {
        result = message.replace(/\{(\d+)\}/g, function (match, rest) {
            var index = rest[0];
            var arg = args[index];
            var replacement = match;
            if (typeof arg === 'string') {
                replacement = arg;
            }
            else if (typeof arg === 'number' || typeof arg === 'boolean' || arg === void 0 || arg === null) {
                replacement = String(arg);
            }
            return replacement;
        });
    }
    return result;
}
function localize(_key, message, ...args) {
    return format(message, args);
}
function createScopedLocalizeFunction(messages) {
    return function (key, message, ...args) {
        if (messages.has(key)) {
            return format(messages.get(key), args);
        }
        else {
            return format(message, args);
        }
    };
}
function resolveLanguage(file) {
    var _b;
    let relativePath = path.relative(rootDir_1.sourceRoot, file);
    let locale = (_b = options.language) !== null && _b !== void 0 ? _b : null;
    let resolvedLanguage = "";
    while (locale) {
        let candidate = `i18n/${locale}/${relativePath}.i18n.json`;
        let tmpPath = path.resolve(rootDir_1.extensionRoot, candidate);
        if (fs.existsSync(tmpPath)) {
            resolvedLanguage = tmpPath;
            break;
        }
        else {
            let index = locale.lastIndexOf('-');
            if (index > 0) {
                locale = locale.substring(0, index);
            }
            else {
                locale = null;
            }
        }
    }
    return resolvedLanguage;
}
function loadMessageBundle(file) {
    if (!file) {
        return localize;
    }
    const ext = path.extname(file);
    if (ext) {
        file = file.slice(0, file.length - ext.length);
    }
    const filename = path.basename(file);
    let messages = resolvedMessages[file];
    if (messages) {
        return createScopedLocalizeFunction(messages);
    }
    else {
        try {
            let languageFile = resolveLanguage(file);
            if (languageFile) {
                messages = new Map();
                const data = JSON.parse(fs.readFileSync(languageFile, 'utf8'));
                for (let key in data) {
                    messages.set(key, data[key]);
                }
                resolvedMessages[file] = messages;
                return createScopedLocalizeFunction(messages);
            }
        }
        catch (error) {
        }
    }
    return localize;
}
exports.loadMessageBundle = loadMessageBundle;
//# sourceMappingURL=localize.js.map