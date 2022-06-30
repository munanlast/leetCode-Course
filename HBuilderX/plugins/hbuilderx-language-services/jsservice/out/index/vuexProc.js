"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVuexIndexProc = void 0;
const indexlib_1 = require("./../../../indexlib");
const utils_1 = require("./utils");
function getVuexIndexProc(ws) {
    let vuexImportSet = new Set();
    return {
        support(documemt, _option) {
            const text = documemt.getText();
            let offset = text.indexOf('vuex');
            return offset > 0;
        },
        onImportStatement(document, statement) {
            var _a, _b, _c;
            if ((0, utils_1.removeQuot)(statement.moduleSpecifier.getText()) === 'vuex') {
                let name = (_c = (_b = (_a = statement.importClause) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.getText()) !== null && _c !== void 0 ? _c : '';
                if (name) {
                    vuexImportSet.add(name);
                }
            }
            return null;
        },
        onNewExpression(document, expression, identifier, _option) {
            var _a, _b;
            if (!identifier || !expression.arguments || expression.arguments.length === 0) {
                return null;
            }
            let text = identifier.getText();
            if (text.endsWith('.Store') && vuexImportSet.has(text.slice(0, -6))) {
                let optionArg = expression.arguments[0];
                let properties = (_b = (_a = utils_1.tsConvert.asTsObjectLiteralExpression(optionArg)) === null || _a === void 0 ? void 0 : _a.properties) !== null && _b !== void 0 ? _b : [];
                let state = [];
                let mutations = [];
                let actions = [];
                for (let i = 0; i < properties.length; i++) {
                    let prop = utils_1.tsConvert.asTsPropertyAssignment(properties[i]);
                    if (prop) {
                        const propName = prop.name.getText();
                        let data = undefined;
                        if (/^['\"]?state['\"]?$/.test(propName)) {
                            data = state;
                        }
                        else if (/^['\"]?mutations['\"]?$/.test(propName)) {
                            data = mutations;
                        }
                        else if (/^['\"]?actions['\"]?$/.test(propName)) {
                            data = actions;
                        }
                        if (data) {
                            let initializer = utils_1.tsConvert.asTsObjectLiteralExpression(prop.initializer);
                            initializer === null || initializer === void 0 ? void 0 : initializer.properties.forEach(ele => {
                                var _a, _b;
                                let name = (_b = (_a = ele.name) === null || _a === void 0 ? void 0 : _a.getText()) !== null && _b !== void 0 ? _b : '';
                                if (name) {
                                    let tmp = (0, utils_1.removeQuot)(name);
                                    let offset = ele.getStart();
                                    if (tmp.length != name.length) {
                                        offset++;
                                    }
                                    name = tmp;
                                    let position = document.positionAt(offset);
                                    if (_option && _option.source) {
                                        offset = _option.source.offsetAt(position);
                                    }
                                    data.push({ name, position, offset }); // 记录offset，js中转到定义需要
                                }
                            });
                        }
                    }
                }
                if (state.length > 0 || mutations.length > 0 || actions.length > 0) {
                    let indexItem = { label: 'construct-args' };
                    indexItem.data = {
                        state: state.length > 0 ? state : undefined,
                        mutations: mutations.length > 0 ? mutations : undefined,
                        actions: actions.length > 0 ? actions : undefined
                    };
                    let result = new indexlib_1.IndexData();
                    result.categories.push('vuex-construct');
                    result['vuex-construct'] = [indexItem];
                    return result;
                }
            }
            return null;
        }
    };
}
exports.getVuexIndexProc = getVuexIndexProc;
//# sourceMappingURL=vuexProc.js.map