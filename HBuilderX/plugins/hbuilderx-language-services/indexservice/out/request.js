"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorActivatedNofity = exports.RebuildProjectIndexRequest = exports.RegisterProcessorRequest = void 0;
const vscode_languageclient_1 = require("vscode-languageclient");
var RegisterProcessorRequest;
(function (RegisterProcessorRequest) {
    RegisterProcessorRequest.type = new vscode_languageclient_1.RequestType('indexservice/registerIndexProcessor');
})(RegisterProcessorRequest = exports.RegisterProcessorRequest || (exports.RegisterProcessorRequest = {}));
var RebuildProjectIndexRequest;
(function (RebuildProjectIndexRequest) {
    RebuildProjectIndexRequest.type = new vscode_languageclient_1.RequestType('indexservice/rebuildIndex');
})(RebuildProjectIndexRequest = exports.RebuildProjectIndexRequest || (exports.RebuildProjectIndexRequest = {}));
var EditorActivatedNofity;
(function (EditorActivatedNofity) {
    EditorActivatedNofity.type = new vscode_languageclient_1.NotificationType('indexservice/editorActivated');
})(EditorActivatedNofity = exports.EditorActivatedNofity || (exports.EditorActivatedNofity = {}));
//# sourceMappingURL=request.js.map