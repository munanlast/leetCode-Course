"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginManager = void 0;
const vscode = require("vscode");
const arrays = require("./arrays");
const dispose_1 = require("./dispose");
const path = require('path');
var TypeScriptServerPlugin;
(function (TypeScriptServerPlugin) {
    function equals(a, b) {
        return a.path === b.path
            && a.name === b.name
            && a.enableForWorkspaceTypeScriptVersions === b.enableForWorkspaceTypeScriptVersions
            && arrays.equals(a.languages, b.languages);
    }
    TypeScriptServerPlugin.equals = equals;
})(TypeScriptServerPlugin || (TypeScriptServerPlugin = {}));
class PluginManager extends dispose_1.Disposable {
    constructor() {
        super();
        this._pluginConfigurations = new Map();
        this._onDidUpdatePlugins = this._register(new vscode.EventEmitter());
        this.onDidChangePlugins = this._onDidUpdatePlugins.event;
        this._onDidUpdateConfig = this._register(new vscode.EventEmitter());
        this.onDidUpdateConfig = this._onDidUpdateConfig.event;
    }
    get plugins() {
        if (!this._plugins) {
            this._plugins = this.readPlugins();
        }
        return arrays.flatten(Array.from(this._plugins.values()));
    }
    setConfiguration(pluginId, config) {
        this._pluginConfigurations.set(pluginId, config);
        this._onDidUpdateConfig.fire({ pluginId, config });
    }
    configurations() {
        return this._pluginConfigurations.entries();
    }
    readPlugins() {
        const pluginMap = new Map();
        const plugins = [];
        const hxplugins_dir = path.resolve(path.dirname(__dirname), './tsplugins/');
        plugins.push({
            name: 'dcloudio',
            enableForWorkspaceTypeScriptVersions: true,
            path: hxplugins_dir,
            languages: []
        });
        pluginMap.set('hbuilderx-language-services', plugins);
        return pluginMap;
    }
}
exports.PluginManager = PluginManager;
//# sourceMappingURL=plugins.js.map