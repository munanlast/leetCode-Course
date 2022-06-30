"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExposedStylusServer = void 0;
const serverCompletion_1 = require("./serverCompletion");
// 获取当前使用的项目
class ExposedStylusServer {
    getLanguageServiceExt() {
        return {
            // 别人调用的转到定义接口
            async findSymbol(document, symbol, ws) {
                return Promise.resolve().then(() => {
                    return [];
                });
            },
            async doComplete(document, position, option) {
                return Promise.resolve().then(async () => {
                    const completionClass = new serverCompletion_1.default();
                    return completionClass.provideCompletionItems(document, position);
                });
            },
        };
    }
}
exports.ExposedStylusServer = ExposedStylusServer;
//# sourceMappingURL=entry.js.map