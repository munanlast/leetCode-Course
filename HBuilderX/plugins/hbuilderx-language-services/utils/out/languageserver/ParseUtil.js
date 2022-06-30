"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseUtil = void 0;
const ts = require("typescript/lib/tsserverlibrary");
var ParseUtil;
(function (ParseUtil) {
    function getContainingObjectLiteralElement(node) {
        const element = getContainingObjectLiteralElementWorker(node);
        return element && (ts.isObjectLiteralExpression(element.parent) || ts.isJsxAttributes(element.parent)) ? element : undefined;
    }
    function getContainingObjectLiteralElementWorker(node) {
        switch (node.kind) {
            case ts.SyntaxKind.StringLiteral:
            case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
            case ts.SyntaxKind.NumericLiteral:
                if (node.parent.kind === ts.SyntaxKind.ComputedPropertyName) {
                    return ts.isObjectLiteralElement(node.parent.parent) ? node.parent.parent : undefined;
                }
            // falls through
            case ts.SyntaxKind.Identifier:
                return ts.isObjectLiteralElement(node.parent) &&
                    (node.parent.parent.kind === ts.SyntaxKind.ObjectLiteralExpression || node.parent.parent.kind === ts.SyntaxKind.JsxAttributes) &&
                    node.parent.name === node ? node.parent : undefined;
        }
        return undefined;
    }
    function getTextOfIdentifierOrLiteral(node) {
        return ts.isMemberName(node) ? ts.idText(node) : node.text;
    }
    function getNameFromPropertyName(name) {
        return name.kind === ts.SyntaxKind.ComputedPropertyName
            // treat computed property names where expression is string/numeric literal as just string/numeric literal
            ? (ts.isStringLiteralLike(name.expression) || ts.isNumericLiteral(name.expression)) ? name.expression.text : undefined
            : ts.isPrivateIdentifier(name) ? ts.idText(name) : getTextOfIdentifierOrLiteral(name);
    }
    function getDefinitionSymbolAtLocation(node, typeChecker) {
        if (!node || !node.parent) {
            return [];
        }
        var object = getContainingObjectLiteralElement(node);
        if (object) {
            const name = getNameFromPropertyName(object.name);
            if (!name) {
                return [];
            }
            var contextualType = typeChecker.getContextualType(object.parent);
            if (contextualType) {
                var property = contextualType.getProperty(name);
                ;
                if (property) {
                    return [property];
                }
            }
        }
        return [typeChecker.getSymbolAtLocation(node)];
    }
    ParseUtil.getDefinitionSymbolAtLocation = getDefinitionSymbolAtLocation;
    function getTypesAtLocation(node, ls) {
        if (!node || !node.parent) {
            return [];
        }
        let program = ls.getProgram();
        if (program == undefined) {
            return [];
        }
        let typeChecker = program.getTypeChecker();
        switch (node.parent.kind) {
            case ts.SyntaxKind.PropertyAccessExpression: {
                let propertyName = null;
                let propertyAccessExpression = node.parent.expression;
                if (propertyAccessExpression.kind === ts.SyntaxKind.PropertyAccessExpression) {
                    propertyName = propertyAccessExpression.name;
                    let expression = propertyAccessExpression.expression;
                    if (expression.kind === ts.SyntaxKind.PropertyAccessExpression) {
                        let symbols = getDefinitionSymbolAtLocation(propertyName, typeChecker);
                        for (let i = 0; i < symbols.length; ++i) {
                            if (!symbols[i])
                                continue;
                            let type = typeChecker.getTypeOfSymbolAtLocation(symbols[i], symbols[i].valueDeclaration);
                            let typeName = typeChecker.typeToString(type);
                            if (typeName === 'Dictionary<string>') {
                                return ['VueRouterParams'];
                            }
                        }
                    }
                }
                return [];
            }
            case ts.SyntaxKind.PropertyAssignment: {
                let propertyAssign = node.parent;
                var symbols = getDefinitionSymbolAtLocation(propertyAssign.name, typeChecker);
                if (symbols && symbols.length > 0) {
                    let results = [];
                    symbols.forEach(symbol => {
                        let type = typeChecker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
                        let typeName = typeChecker.typeToString(type);
                        let typeNames = typeName.split('|');
                        typeNames.forEach(t => {
                            results.push(t.trim());
                        });
                    });
                    return results;
                }
                return [];
            }
            case ts.SyntaxKind.CallExpression: {
                let results = [];
                let callExpression = node.parent;
                let expression = callExpression.expression;
                if ((expression === null || expression === void 0 ? void 0 : expression.kind) === ts.SyntaxKind.ImportKeyword) {
                    return ['HBuilderX.ImportURIString'];
                }
                let identifier = null;
                let callIdentifier = null;
                if (expression.kind === ts.SyntaxKind.PropertyAccessExpression) {
                    identifier = expression.name;
                    callIdentifier = expression.expression;
                }
                let symbols = getDefinitionSymbolAtLocation(identifier || callExpression.expression, typeChecker);
                let symbols2 = getDefinitionSymbolAtLocation(callIdentifier, typeChecker);
                symbols.push(...symbols2);
                if (symbols && symbols.length > 0) {
                    symbols.forEach(symbol => {
                        let type = typeChecker.getTypeOfSymbolAtLocation(symbol, symbol === null || symbol === void 0 ? void 0 : symbol.valueDeclaration);
                        let typeName = typeChecker.typeToString(type);
                        // 兼容 overload 场景
                        let mathcResults = typeName.match(/\(.+?\)/g);
                        if (mathcResults) {
                            mathcResults === null || mathcResults === void 0 ? void 0 : mathcResults.forEach(res => {
                                res = res.substring(1, res.length - 1);
                                let parameters = res.includes(',') ? res.split(',') : [res];
                                for (let param of parameters) {
                                    param = param.includes(':') ? param.substring(param.lastIndexOf(':') + 1, param.length).trim() : param.trim();
                                    param.split('|').forEach(p => {
                                        results.push(p.trim());
                                    });
                                }
                            });
                        }
                        else {
                            results.push(typeName);
                        }
                    });
                }
                return results;
            }
            case ts.SyntaxKind.BinaryExpression: {
                let results = [];
                let leftExpression = node.parent.left;
                if (leftExpression.kind === ts.SyntaxKind.PropertyAccessExpression) {
                    let expression = leftExpression;
                    let name = leftExpression.name;
                    if (name.kind !== ts.SyntaxKind.Identifier)
                        return [];
                    let propertyName = name.getText();
                    // 目前只处理 xx.src 的情况
                    if (propertyName !== 'src' && propertyName !== 'href')
                        return [];
                    let symbols = getDefinitionSymbolAtLocation(expression.expression, typeChecker);
                    symbols.forEach(symbol => {
                        let type = typeChecker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
                        let typeName = typeChecker.typeToString(type);
                        if (typeName === 'HTMLScriptElement' && propertyName === 'src') {
                            results.push('JSURIString');
                        }
                        else if ((typeName === 'CSSImportRule' || typeName === 'StyleSheet' || typeName === 'HTMLLinkElement') ||
                            propertyName === 'href') {
                            results.push('CSSURIString');
                        }
                    });
                }
                return results;
            }
            case ts.SyntaxKind.ImportDeclaration: {
                return ['HBuilderX.ImportURIString'];
            }
        }
        return [];
    }
    ParseUtil.getTypesAtLocation = getTypesAtLocation;
    function getParamTypes(fileName, position, languageService) {
        let types = [];
        let result = languageService.getSignatureHelpItems(fileName, position, { triggerReason: { kind: 'invoked' } });
        if (result) {
            for (let item of result.items) {
                if (item.parameters.length > result.argumentIndex) {
                    let parameter = item.parameters[result.argumentIndex];
                    let sigatureHelpItem = ts.displayPartsToString(parameter.displayParts);
                    let partItems = sigatureHelpItem.split(':');
                    if (partItems.length > 1) {
                        types.push(...partItems[1].split('|'));
                    }
                }
            }
        }
        return Array.from(new Set(types));
    }
    ParseUtil.getParamTypes = getParamTypes;
    function getVueExportNode(node) {
        if (node.kind === ts.SyntaxKind.SourceFile) {
            let statements = node.statements;
            for (let i = 0; i < (statements === null || statements === void 0 ? void 0 : statements.length); ++i) {
                let statement = statements[i];
                if ((statement === null || statement === void 0 ? void 0 : statement.kind) === ts.SyntaxKind.ExportAssignment) {
                    let expression = statement.expression;
                    for (let i = 0; i < expression.getChildCount(); ++i) {
                        let expressionNode = expression.getChildAt(i);
                        if (expressionNode.kind === ts.SyntaxKind.SyntaxList) {
                            return expressionNode;
                        }
                    }
                }
            }
        }
        return null;
    }
    function getVueMethodsValueNode(node) {
        let expressionNode = getVueExportNode(node);
        if (expressionNode) {
            for (let i = 0; i < expressionNode.getChildCount(); ++i) {
                let nameValueNode = expressionNode.getChildAt(i);
                if (nameValueNode.kind === ts.SyntaxKind.PropertyAssignment) {
                    let propertyAssignment = nameValueNode;
                    if (propertyAssignment.name.getText() === 'methods' &&
                        (propertyAssignment === null || propertyAssignment === void 0 ? void 0 : propertyAssignment.initializer.kind) === ts.SyntaxKind.ObjectLiteralExpression) {
                        return propertyAssignment.initializer;
                    }
                }
            }
        }
        return null;
    }
    function getVueActionsAndMutations(node) {
        var _a, _b;
        let res = {
            mapActions: null,
            mapMutations: null
        };
        let vueMethodsNode = getVueMethodsValueNode(node);
        if (vueMethodsNode && vueMethodsNode.kind === ts.SyntaxKind.ObjectLiteralExpression) {
            let objectExpressionNode = vueMethodsNode;
            for (let j = 0; j < objectExpressionNode.properties.length; ++j) {
                let property = objectExpressionNode.properties[j];
                if (property.kind === ts.SyntaxKind.SpreadAssignment) {
                    let expression = property.expression;
                    if (expression.kind === ts.SyntaxKind.CallExpression) {
                        if (((_a = expression) === null || _a === void 0 ? void 0 : _a.expression.kind) === ts.SyntaxKind.Identifier) {
                            let nameNode = (_b = expression) === null || _b === void 0 ? void 0 : _b.expression;
                            if (nameNode.escapedText === 'mapActions') {
                                res.mapActions = expression.arguments[0];
                            }
                            else if (nameNode.escapedText === 'mapMutations') {
                                res.mapMutations = expression.arguments[0];
                            }
                        }
                    }
                }
            }
        }
        return res;
    }
    function getVuexState(node) {
        let states = [];
        let expressionNode = getVueExportNode(node);
        if (expressionNode) {
            for (let i = 0; i < expressionNode.getChildCount(); ++i) {
                let nameValueNode = expressionNode.getChildAt(i);
                if (nameValueNode.kind === ts.SyntaxKind.PropertyAssignment) {
                    let propertyAssignment = nameValueNode;
                    if (propertyAssignment.name.getText() === 'computed' &&
                        (propertyAssignment === null || propertyAssignment === void 0 ? void 0 : propertyAssignment.initializer.kind) === ts.SyntaxKind.CallExpression) {
                        let callExpression = propertyAssignment.initializer;
                        if (callExpression.expression.kind === ts.SyntaxKind.Identifier &&
                            callExpression.expression.escapedText === 'mapState') {
                            let stateArg = callExpression.arguments[0];
                            if (!stateArg)
                                return states;
                            states.push(...getVuexLiteral(stateArg));
                        }
                    }
                }
            }
        }
        return states;
    }
    ParseUtil.getVuexState = getVuexState;
    function getVuexLiteral(node) {
        let res = [];
        if (!node)
            return res;
        if (node.kind === ts.SyntaxKind.ObjectLiteralExpression) {
            let actionsObject = node;
            actionsObject.forEachChild(property => {
                if (property.kind === ts.SyntaxKind.PropertyAssignment) {
                    let name = property.name.getText();
                    res.push(name);
                }
            });
        }
        else if (node.kind === ts.SyntaxKind.ArrayLiteralExpression) {
            let actionsArray = node;
            actionsArray.forEachChild(element => {
                if (element.kind === ts.SyntaxKind.StringLiteral) {
                    let name = element.text;
                    res.push(name);
                }
            });
        }
        return res;
    }
    function getVuexActions(node) {
        let actions = [];
        const { mapActions } = getVueActionsAndMutations(node);
        if (mapActions) {
            actions.push(...getVuexLiteral(mapActions));
        }
        return actions;
    }
    ParseUtil.getVuexActions = getVuexActions;
    function getVuexMutations(node) {
        let mutations = [];
        const { mapMutations } = getVueActionsAndMutations(node);
        if (mapMutations) {
            mutations.push(...getVuexLiteral(mapMutations));
        }
        return mutations;
    }
    ParseUtil.getVuexMutations = getVuexMutations;
    function getVuexInfo(node) {
        let state = getVuexState(node);
        let actions = getVuexActions(node);
        let mutations = getVuexMutations(node);
        return {
            state,
            actions,
            mutations
        };
    }
    ParseUtil.getVuexInfo = getVuexInfo;
})(ParseUtil = exports.ParseUtil || (exports.ParseUtil = {}));
//# sourceMappingURL=ParseUtil.js.map