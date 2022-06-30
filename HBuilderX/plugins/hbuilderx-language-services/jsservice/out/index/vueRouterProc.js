"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVueRouterIndexProc = void 0;
const indexlib_1 = require("./../../../indexlib");
const utils_1 = require("./utils");
function getVueRouterIndexProc(ws) {
    let vueRouterName = new Set();
    return {
        support(documemt, _option) {
            const text = documemt.getText();
            let offset = text.indexOf('vue-router');
            return offset > 0;
        },
        onImportStatement(documemt, statement) {
            var _a, _b, _c;
            if ((0, utils_1.removeQuot)(statement.moduleSpecifier.getText()) === 'vue-router') {
                let name = (_c = (_b = (_a = statement.importClause) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.getText()) !== null && _c !== void 0 ? _c : '';
                if (name) {
                    vueRouterName.add(name);
                }
            }
            return null;
        },
        onNewExpression(document, expression, identifier) {
            var _a, _b;
            if (!identifier || !expression.arguments || expression.arguments.length === 0) {
                return null;
            }
            let text = identifier.getText();
            if (vueRouterName.has(text)) {
                let optionArg = expression.arguments[0];
                let dataItems = [];
                function findRoutersPaths(element) {
                    element.properties.some((val) => {
                        let prop = utils_1.tsConvert.asTsPropertyAssignment(val);
                        if (prop && /^['\"]?path['\"]?$/.test(prop.name.getText())) {
                            let pathstr = utils_1.tsConvert.asTsStringLiteral(prop.initializer);
                            let str = pathstr === null || pathstr === void 0 ? void 0 : pathstr.text;
                            if (str && str.length < 2048) {
                                let start = str[0];
                                if (start == '\'' || start == '"')
                                    str = str.slice(1);
                                let end = str[str.length - 1];
                                if (end == '\'' || end == '"')
                                    str = str.slice(0, -1);
                                dataItems.push({
                                    label: 'router-path',
                                    position: document.positionAt(pathstr.getStart()),
                                    data: str
                                });
                            }
                            return true;
                        }
                        return false;
                    });
                }
                let properties = (_b = (_a = utils_1.tsConvert.asTsObjectLiteralExpression(optionArg)) === null || _a === void 0 ? void 0 : _a.properties) !== null && _b !== void 0 ? _b : [];
                for (let i = 0; i < properties.length; i++) {
                    let prop = utils_1.tsConvert.asTsPropertyAssignment(properties[i]);
                    if (prop && /^['\"]?routes['\"]?$/.test(prop.name.getText())) {
                        let initializer = utils_1.tsConvert.asTsArrayLiteralExpression(prop.initializer);
                        initializer === null || initializer === void 0 ? void 0 : initializer.elements.forEach(ele => {
                            let element = utils_1.tsConvert.asTsObjectLiteralExpression(ele);
                            if (element) {
                                findRoutersPaths(element);
                            }
                        });
                    }
                }
                if (dataItems.length > 0) {
                    let result = new indexlib_1.IndexData();
                    result.categories.push('router-path');
                    result['router-path'] = dataItems;
                    return result;
                }
            }
            return null;
        }
    };
}
exports.getVueRouterIndexProc = getVueRouterIndexProc;
//# sourceMappingURL=vueRouterProc.js.map