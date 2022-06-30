"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
function getType(name, location, checker) {
    let types = checker.getSymbolsInScope(location, ts.SymbolFlags.Type);
    let type = types.find(t => t.escapedName === name);
    if (type) {
        return checker.getDeclaredTypeOfSymbol(type);
    }
    return undefined;
}
function asCallExpression(node) {
    return node.kind == ts.SyntaxKind.CallExpression ? node : undefined;
}
function checkExpression(prj, compilerOptions, checker, node, checkMode, forceTuple) {
    var _a, _b, _c, _d;
    const kind = node.kind;
    if (kind === ts.SyntaxKind.Identifier) {
        let idNode = node;
        let symbol = checker.getResolvedSymbol(idNode);
        if (((_a = symbol === null || symbol === void 0 ? void 0 : symbol.valueDeclaration) === null || _a === void 0 ? void 0 : _a.kind) == ts.SyntaxKind.VariableDeclaration) {
            let declareation = symbol.valueDeclaration;
            let expression = declareation.initializer ? (_b = asCallExpression(declareation.initializer)) === null || _b === void 0 ? void 0 : _b.expression : undefined;
            if (expression && expression.kind == ts.SyntaxKind.Identifier) {
                let refSymbol = checker.getResolvedSymbol(expression);
                const typeTmp = checker.getTypeOfSymbol(refSymbol);
                const typeSymbol = typeTmp.symbol;
                if (typeSymbol.valueDeclaration && typeSymbol.escapedName == 'ref') {
                    let doc = (_c = typeSymbol.valueDeclaration.jsDoc) === null || _c === void 0 ? void 0 : _c[0];
                    let isVue = doc && doc.comment == 'vue.3.reactivity.ref';
                    if (!isVue) {
                        if (((_d = typeSymbol.valueDeclaration) === null || _d === void 0 ? void 0 : _d.parent.kind) == ts.SyntaxKind.SourceFile) {
                            const source = typeSymbol.valueDeclaration.parent;
                            isVue = source.fileName.indexOf('/@vue/reactivity/') > 0;
                        }
                    }
                    if (isVue) {
                        let idNodeType = checker.getTypeOfSymbol(symbol);
                        if (idNodeType.typeArguments) {
                            return idNodeType.typeArguments[0];
                        }
                    }
                }
            }
        }
    }
    return undefined;
}
exports.default = {
    checkExpression
};
//# sourceMappingURL=vueRefTypeHelper.js.map