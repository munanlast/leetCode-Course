"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNuxtDataProvider = void 0;
const path_1 = require("path");
const veturProviderParse_1 = require("./veturProviderParse");
const NUXT_JSON_SOURCES = ['@nuxt/vue-app-edge', '@nuxt/vue-app', 'nuxt-helper-json'];
function getNuxtDataProvider(packageRoot) {
    let nuxtTags, nuxtAttributes;
    for (const source of NUXT_JSON_SOURCES) {
        if (tryResolve((0, path_1.join)(source, 'package.json'), packageRoot)) {
            nuxtTags = tryRequire((0, path_1.join)(source, 'vetur/nuxt-tags.json'), packageRoot);
            nuxtAttributes = tryRequire((0, path_1.join)(source, 'vetur/nuxt-attributes.json'), packageRoot);
            if (nuxtTags) {
                break;
            }
        }
    }
    const componentsTags = tryRequire((0, path_1.join)(packageRoot, '.nuxt/vetur/tags.json'), packageRoot);
    const componentsAttributes = tryRequire((0, path_1.join)(packageRoot, '.nuxt/vetur/attributes.json'), packageRoot);
    return (0, veturProviderParse_1.getExternalDataProvider)('nuxt', { ...nuxtTags, ...componentsTags }, { ...nuxtAttributes, ...componentsAttributes });
}
exports.getNuxtDataProvider = getNuxtDataProvider;
function tryRequire(modulePath, findPath) {
    try {
        const resolved = tryResolve(modulePath, findPath);
        return resolved ? require(resolved) : undefined;
    }
    catch (_err) { }
    return undefined;
}
function tryResolve(modulePath, findPath) {
    try {
        return require.resolve(modulePath, {
            paths: [findPath, __dirname]
        });
    }
    catch (_err) { }
    return undefined;
}
//# sourceMappingURL=nuxtDataProvider.js.map