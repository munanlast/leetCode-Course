"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeType = exports.isDefined = exports.getNodeAtOffset = void 0;
function getNodeAtOffset(node, offset) {
    let candidate = null;
    if (!node || offset < node.offset || offset > node.end) {
        return null;
    }
    // Find the shortest node at the position
    node.accept((node) => {
        if (node.offset === -1 && node.length === -1) {
            return true;
        }
        if (node.offset <= offset && node.end >= offset) {
            if (!candidate) {
                candidate = node;
            }
            else if (node.length <= candidate.length) {
                candidate = node;
            }
            return true;
        }
        return false;
    });
    return candidate;
}
exports.getNodeAtOffset = getNodeAtOffset;
function isDefined(obj) {
    return typeof obj !== 'undefined';
}
exports.isDefined = isDefined;
var NodeType;
(function (NodeType) {
    NodeType[NodeType["Undefined"] = 0] = "Undefined";
    NodeType[NodeType["Identifier"] = 1] = "Identifier";
    NodeType[NodeType["Stylesheet"] = 2] = "Stylesheet";
    NodeType[NodeType["Ruleset"] = 3] = "Ruleset";
    NodeType[NodeType["Selector"] = 4] = "Selector";
    NodeType[NodeType["SimpleSelector"] = 5] = "SimpleSelector";
    NodeType[NodeType["SelectorInterpolation"] = 6] = "SelectorInterpolation";
    NodeType[NodeType["SelectorCombinator"] = 7] = "SelectorCombinator";
    NodeType[NodeType["SelectorCombinatorParent"] = 8] = "SelectorCombinatorParent";
    NodeType[NodeType["SelectorCombinatorSibling"] = 9] = "SelectorCombinatorSibling";
    NodeType[NodeType["SelectorCombinatorAllSiblings"] = 10] = "SelectorCombinatorAllSiblings";
    NodeType[NodeType["SelectorCombinatorShadowPiercingDescendant"] = 11] = "SelectorCombinatorShadowPiercingDescendant";
    NodeType[NodeType["Page"] = 12] = "Page";
    NodeType[NodeType["PageBoxMarginBox"] = 13] = "PageBoxMarginBox";
    NodeType[NodeType["ClassSelector"] = 14] = "ClassSelector";
    NodeType[NodeType["IdentifierSelector"] = 15] = "IdentifierSelector";
    NodeType[NodeType["ElementNameSelector"] = 16] = "ElementNameSelector";
    NodeType[NodeType["PseudoSelector"] = 17] = "PseudoSelector";
    NodeType[NodeType["AttributeSelector"] = 18] = "AttributeSelector";
    NodeType[NodeType["Declaration"] = 19] = "Declaration";
    NodeType[NodeType["Declarations"] = 20] = "Declarations";
    NodeType[NodeType["Property"] = 21] = "Property";
    NodeType[NodeType["Expression"] = 22] = "Expression";
    NodeType[NodeType["BinaryExpression"] = 23] = "BinaryExpression";
    NodeType[NodeType["Term"] = 24] = "Term";
    NodeType[NodeType["Operator"] = 25] = "Operator";
    NodeType[NodeType["Value"] = 26] = "Value";
    NodeType[NodeType["StringLiteral"] = 27] = "StringLiteral";
    NodeType[NodeType["URILiteral"] = 28] = "URILiteral";
    NodeType[NodeType["EscapedValue"] = 29] = "EscapedValue";
    NodeType[NodeType["Function"] = 30] = "Function";
    NodeType[NodeType["NumericValue"] = 31] = "NumericValue";
    NodeType[NodeType["HexColorValue"] = 32] = "HexColorValue";
    NodeType[NodeType["MixinDeclaration"] = 33] = "MixinDeclaration";
    NodeType[NodeType["MixinReference"] = 34] = "MixinReference";
    NodeType[NodeType["VariableName"] = 35] = "VariableName";
    NodeType[NodeType["VariableDeclaration"] = 36] = "VariableDeclaration";
    NodeType[NodeType["Prio"] = 37] = "Prio";
    NodeType[NodeType["Interpolation"] = 38] = "Interpolation";
    NodeType[NodeType["NestedProperties"] = 39] = "NestedProperties";
    NodeType[NodeType["ExtendsReference"] = 40] = "ExtendsReference";
    NodeType[NodeType["SelectorPlaceholder"] = 41] = "SelectorPlaceholder";
    NodeType[NodeType["Debug"] = 42] = "Debug";
    NodeType[NodeType["If"] = 43] = "If";
    NodeType[NodeType["Else"] = 44] = "Else";
    NodeType[NodeType["For"] = 45] = "For";
    NodeType[NodeType["Each"] = 46] = "Each";
    NodeType[NodeType["While"] = 47] = "While";
    NodeType[NodeType["MixinContentReference"] = 48] = "MixinContentReference";
    NodeType[NodeType["MixinContentDeclaration"] = 49] = "MixinContentDeclaration";
    NodeType[NodeType["Media"] = 50] = "Media";
    NodeType[NodeType["Keyframe"] = 51] = "Keyframe";
    NodeType[NodeType["FontFace"] = 52] = "FontFace";
    NodeType[NodeType["Import"] = 53] = "Import";
    NodeType[NodeType["Namespace"] = 54] = "Namespace";
    NodeType[NodeType["Invocation"] = 55] = "Invocation";
    NodeType[NodeType["FunctionDeclaration"] = 56] = "FunctionDeclaration";
    NodeType[NodeType["ReturnStatement"] = 57] = "ReturnStatement";
    NodeType[NodeType["MediaQuery"] = 58] = "MediaQuery";
    NodeType[NodeType["FunctionParameter"] = 59] = "FunctionParameter";
    NodeType[NodeType["FunctionArgument"] = 60] = "FunctionArgument";
    NodeType[NodeType["KeyframeSelector"] = 61] = "KeyframeSelector";
    NodeType[NodeType["ViewPort"] = 62] = "ViewPort";
    NodeType[NodeType["Document"] = 63] = "Document";
    NodeType[NodeType["AtApplyRule"] = 64] = "AtApplyRule";
    NodeType[NodeType["CustomPropertyDeclaration"] = 65] = "CustomPropertyDeclaration";
    NodeType[NodeType["CustomPropertySet"] = 66] = "CustomPropertySet";
    NodeType[NodeType["ListEntry"] = 67] = "ListEntry";
    NodeType[NodeType["Supports"] = 68] = "Supports";
    NodeType[NodeType["SupportsCondition"] = 69] = "SupportsCondition";
    NodeType[NodeType["NamespacePrefix"] = 70] = "NamespacePrefix";
    NodeType[NodeType["GridLine"] = 71] = "GridLine";
    NodeType[NodeType["Plugin"] = 72] = "Plugin";
    NodeType[NodeType["UnknownAtRule"] = 73] = "UnknownAtRule";
    NodeType[NodeType["Use"] = 74] = "Use";
    NodeType[NodeType["ModuleConfiguration"] = 75] = "ModuleConfiguration";
    NodeType[NodeType["Forward"] = 76] = "Forward";
    NodeType[NodeType["ForwardVisibility"] = 77] = "ForwardVisibility";
    NodeType[NodeType["Module"] = 78] = "Module";
})(NodeType = exports.NodeType || (exports.NodeType = {}));
//# sourceMappingURL=cssUtilts.js.map