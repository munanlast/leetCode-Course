"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HXLanguageClient = void 0;
const node_1 = require("vscode-languageclient/node");
class HXLanguageClient extends node_1.LanguageClient {
    //扩展协议字段
    get protocol2CodeConverter() {
        //@ts-ignore
        let oldP2c = this._p2c;
        function asSymbolInformations(values) {
            if (!values) {
                return undefined;
            }
            return values.map((information) => asSymbolInformation(information));
        }
        function asSymbolInformation(item, uri) {
            let symbol = oldP2c.asSymbolInformation(item);
            if (symbol) {
                let hxsymbol = symbol;
                hxsymbol.hxKind = item.hxKind;
            }
            return symbol;
        }
        return {
            ...oldP2c,
            asSymbolInformation,
            asSymbolInformations,
        };
    }
}
exports.HXLanguageClient = HXLanguageClient;
//# sourceMappingURL=hxLanguageClient.js.map