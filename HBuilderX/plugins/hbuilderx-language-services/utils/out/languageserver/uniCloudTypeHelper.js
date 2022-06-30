"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hxproject_1 = require("./hxproject");
const uniCloudPath_1 = require("../common/uniCloudPath");
const ts = require("typescript");
const fs = require("fs");
const path = require("path");
function getType(name, location, checker) {
    let types = checker.getSymbolsInScope(location, ts.SymbolFlags.Type);
    let type = types.find(t => t.escapedName === name);
    if (type) {
        return checker.getDeclaredTypeOfSymbol(type);
    }
    return undefined;
}
function isUniCloudImportObjectExpression(node, checker) {
    var _a, _b;
    if (node.kind !== ts.SyntaxKind.PropertyAccessExpression) {
        return false;
    }
    let expression = node;
    let left = expression.expression;
    let memberName = (_a = expression.name) === null || _a === void 0 ? void 0 : _a.text;
    if (memberName !== 'importObject') {
        return false;
    }
    let leftSymbol = checker.getSymbolAtLocation(left);
    if (leftSymbol) {
        let leftType = checker.getTypeOfSymbol(leftSymbol);
        if (((_b = leftType === null || leftType === void 0 ? void 0 : leftType.symbol) === null || _b === void 0 ? void 0 : _b.escapedName) == "UniCloud") {
            return true;
        }
    }
    return false;
}
function checkCallExpression(prj, compilerOptions, checker, callExpr, checkMode, forceTuple) {
    if (isUniCloudImportObjectExpression(callExpr.expression, checker)
        && callExpr.arguments.length >= 1
        && ts.isStringLiteralLike(callExpr.arguments[0])) {
        let stringArg = callExpr.arguments[0];
        let cloudObjName = stringArg.text;
        let cldfunctions = (0, uniCloudPath_1.getAllCloudFunctions)(prj.fsPath);
        let _fileName;
        cldfunctions.forEach(fn => {
            if (fn.name == cloudObjName && fs.existsSync(path.join(fn.path, "index.obj.js"))) {
                _fileName = path.join(fn.path, "index.obj.js");
            }
        });
        let sourceFile = ts.createSourceFile(_fileName, hxproject_1.hx.readFiletoString(_fileName), ts.ScriptTarget.Latest);
        checker.bindSourceFile(sourceFile, compilerOptions);
        let fileSymbol = checker.getSymbolOfNode(sourceFile);
        if (fileSymbol) {
            const resolvedModuleSymbol = checker.resolveExternalModuleSymbol(fileSymbol);
            if (resolvedModuleSymbol) {
                return checker.getTypeOfSymbol(resolvedModuleSymbol);
            }
        }
    }
    return undefined;
}
function checkExpression(prj, compilerOptions, checker, node, checkMode, forceTuple) {
    var _a, _b, _c, _d;
    const kind = node.kind;
    if (kind === ts.SyntaxKind.Identifier) {
        let id = node;
        let idSymbol = checker.getResolvedSymbol(id);
        if (idSymbol && idSymbol.valueDeclaration) {
            let valueNode = idSymbol.valueDeclaration;
            //解析try {...} catch(e){} e的类型要根据try里面的语句决定
            if (((_a = valueNode.parent) === null || _a === void 0 ? void 0 : _a.kind) === ts.SyntaxKind.CatchClause
                && ((_c = (_b = valueNode.parent) === null || _b === void 0 ? void 0 : _b.parent) === null || _c === void 0 ? void 0 : _c.kind) === ts.SyntaxKind.TryStatement) {
                let tryStatement = valueNode.parent.parent;
                let tryBlock = tryStatement.tryBlock;
                let statements = tryBlock.statements;
                if (statements && statements.length > 0) {
                    let symbols = checker.getSymbolsInScope(statements[0], ts.SymbolFlags.Variable);
                    for (let i = 0; i < statements.length; i++) {
                        let s = statements[i];
                        //提取变量
                        let matches = /(\w+)\.(\w+)\s*\(/.exec(s.getText());
                        if (matches) {
                            let cloudObjVar = matches[1];
                            let sym = symbols.find(symbol => symbol.escapedName === cloudObjVar);
                            //简单判断下该符号是不是通过uniCloud.importObject定义的变量
                            if (sym && sym.valueDeclaration && sym.valueDeclaration.getText().indexOf(".importObject(") >= 0) {
                                //查找定义的UniCloudError类型
                                let modules = checker.getSymbolsInScope(statements[0], ts.SymbolFlags.Namespace);
                                let uniCloudNS = modules.find(m => m.escapedName === 'UniCloud');
                                if (!uniCloudNS) {
                                    return getType("Error", node, checker);
                                }
                                let errorSym = (_d = uniCloudNS.exports) === null || _d === void 0 ? void 0 : _d.get("UniCloudError");
                                if (errorSym) {
                                    return checker.getDeclaredTypeOfSymbol(errorSym);
                                }
                            }
                        }
                    }
                }
                return getType("Error", node, checker);
            }
        }
    }
    else if (kind === ts.SyntaxKind.PropertyAccessExpression) {
        //拦截uniCloud.importObject的真实类型，如果走d.ts中定义的函数类型的话，将不会走checkExpression的逻辑了
        if (isUniCloudImportObjectExpression(node, checker) && node.parent.kind === ts.SyntaxKind.CallExpression) {
            let type = checker.defaultCheckExpression(node, checkMode, forceTuple);
            let signatures = checker.getSignaturesOfType(type, ts.SignatureKind.Call);
            if (signatures) {
                signatures.forEach(item => {
                    item.resolvedReturnType = checkCallExpression(prj, compilerOptions, checker, node.parent, checkMode, forceTuple);
                });
            }
            return type;
        }
    }
    else if (kind === ts.SyntaxKind.CallExpression) {
        let callExpr = node;
        return checkCallExpression(prj, compilerOptions, checker, callExpr, checkMode, forceTuple);
    }
    return undefined;
}
exports.default = {
    checkExpression
};
//# sourceMappingURL=uniCloudTypeHelper.js.map