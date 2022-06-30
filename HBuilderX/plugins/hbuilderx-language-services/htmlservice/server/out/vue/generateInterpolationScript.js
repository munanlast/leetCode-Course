"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInterpolationScript = void 0;
const ts = require("typescript");
//第一步，构造辅助脚本，缓存必要的SourceFile
//第二步，createLanguageService,开始计算结果；
//第三步，还原正确的offset
function generateInterpolationScript(ls, helperDoc) {
    let program = ls.getProgram();
    if (program) {
        let tc = program.getTypeChecker();
        let sf = program.getSourceFile(helperDoc.uri);
        if (sf) {
            let symbols = tc.getSymbolsInScope(sf, ts.SymbolFlags.Variable);
            if (symbols) {
                let generateVariables = [];
                for (let sym of symbols) {
                    let symName = sym.escapedName.toString();
                    if (!symName.startsWith("$$_")) {
                        continue;
                    }
                    let symType = tc.getTypeOfSymbolAtLocation(sym, sym.valueDeclaration);
                    let properties = tc.getPropertiesOfType(symType);
                    if (properties) {
                        for (let targetProp of properties) {
                            let propName = targetProp.escapedName.toString();
                            generateVariables.push(`let ${propName} = ${symName}.${propName};`);
                        }
                    }
                }
                return helperDoc.getText() + generateVariables.join("\r\n") + "\r\n";
            }
        }
    }
    return "";
}
exports.generateInterpolationScript = generateInterpolationScript;
//# sourceMappingURL=generateInterpolationScript.js.map