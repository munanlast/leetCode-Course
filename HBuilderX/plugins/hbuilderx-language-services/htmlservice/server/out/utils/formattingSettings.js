"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCssSettings = exports.formattingSettingListen = void 0;
const vscode_languageserver_1 = require("vscode-languageserver");
let serverConnection = undefined;
function formattingSettingListen(connection) {
    serverConnection = connection;
}
exports.formattingSettingListen = formattingSettingListen;
function toUndefined(data) {
    return data == null ? undefined : data;
}
function getCssSettings() {
    const configRequestParam = { items: [{ section: 'css.format' }] };
    if (serverConnection) {
        let cssFormatSettings = serverConnection.sendRequest(vscode_languageserver_1.ConfigurationRequest.type, configRequestParam).then((s) => s[0]);
        return cssFormatSettings;
    }
    return Promise.resolve({});
}
exports.getCssSettings = getCssSettings;
//# sourceMappingURL=formattingSettings.js.map