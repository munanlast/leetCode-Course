"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerBaseCommands = void 0;
const openTsServerLog_1 = require("./openTsServerLog");
function registerBaseCommands(commandManager, lazyClientHost, pluginManager) {
    // commandManager.register(new ReloadTypeScriptProjectsCommand(lazyClientHost));
    // commandManager.register(new ReloadJavaScriptProjectsCommand(lazyClientHost));
    // commandManager.register(new SelectTypeScriptVersionCommand(lazyClientHost));
    commandManager.register(new openTsServerLog_1.OpenTsServerLogCommand(lazyClientHost));
    // commandManager.register(new RestartTsServerCommand(lazyClientHost));
    // commandManager.register(new TypeScriptGoToProjectConfigCommand(lazyClientHost));
    // commandManager.register(new JavaScriptGoToProjectConfigCommand(lazyClientHost));
    // commandManager.register(new ConfigurePluginCommand(pluginManager));
    // commandManager.register(new LearnMoreAboutRefactoringsCommand());
}
exports.registerBaseCommands = registerBaseCommands;
//# sourceMappingURL=index.js.map