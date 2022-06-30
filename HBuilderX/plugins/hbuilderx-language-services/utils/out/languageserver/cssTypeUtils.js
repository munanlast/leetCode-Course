"use strict";
// 和某个功能实现无关的通用操作或数据结构写在这里
Object.defineProperty(exports, "__esModule", { value: true });
exports.vueStyleScoped = exports.transitionTimingFunctions = exports.TokenType = exports.svgElements = exports.startsWith = exports.SortTexts = exports.repeatStyleKeywords = exports.positionKeywords = exports.notMoveCursorProperty = exports.NodeType = exports.lineWidthKeywords = exports.lineStyleKeywords = exports.imageUrlProperty = exports.imageFunctions = exports.html5Tags = exports.geometryBoxKeywords = exports.cssWideKeywords = exports.colors = exports.colorRestrictions = exports.colorKeywords = exports.colorFunctions = exports.calcRestrictionTypes = exports.boxKeywords = exports.basicShapeFunctions = void 0;
const { positionKeywords, repeatStyleKeywords, lineStyleKeywords, lineWidthKeywords, boxKeywords, geometryBoxKeywords, cssWideKeywords, imageFunctions, transitionTimingFunctions, basicShapeFunctions, units, html5Tags, svgElements, pageBoxDirectives, } = require('vscode-css-languageservice/lib/umd/languageFacts/builtinData');
exports.positionKeywords = positionKeywords;
exports.repeatStyleKeywords = repeatStyleKeywords;
exports.lineStyleKeywords = lineStyleKeywords;
exports.lineWidthKeywords = lineWidthKeywords;
exports.boxKeywords = boxKeywords;
exports.geometryBoxKeywords = geometryBoxKeywords;
exports.cssWideKeywords = cssWideKeywords;
exports.imageFunctions = imageFunctions;
exports.transitionTimingFunctions = transitionTimingFunctions;
exports.basicShapeFunctions = basicShapeFunctions;
exports.html5Tags = html5Tags;
exports.svgElements = svgElements;
const { colorFunctions, colors, colorKeywords } = require('vscode-css-languageservice/lib/umd/languageFacts/colors');
exports.colorFunctions = colorFunctions;
exports.colors = colors;
exports.colorKeywords = colorKeywords;
const { startsWith } = require('vscode-css-languageservice/lib/umd/utils/strings');
exports.startsWith = startsWith;
// 此数据是css语言服务, 根据src\data\webCustomData.ts此文件, 获取各种数据
const colorRestrictions = ['color', 'background', 'box-shadow', 'outline', 'stop-opacity'];
exports.colorRestrictions = colorRestrictions;
const calcRestrictionTypes = ['length', 'frequency', 'angle', 'time', 'percentage', 'number', 'integer'];
exports.calcRestrictionTypes = calcRestrictionTypes;
const imageUrlProperty = [
    '-moz-binding',
    '-moz-border-image',
    '-webkit-border-image',
    '-webkit-clip-path',
    '-webkit-filter',
    '-webkit-mask-box-image-source',
    '-webkit-mask-box-image',
    '-webkit-mask-image',
    '-webkit-mask',
    '-webkit-shape-outside',
    'background-image',
    'background',
    'behavior',
    'border-image-source',
    'border-image',
    'clip-path',
    'content',
    'counter-reset',
    'cursor',
    'fill',
    'filter',
    'icon',
    'list-style-image',
    'list-style',
    'marker-end',
    'marker-mid',
    'marker-start',
    'marker',
    'mask-image',
    'mask',
    'offset-path',
    'shape-outside',
    'stroke',
];
exports.imageUrlProperty = imageUrlProperty;
const notMoveCursorProperty = [
    '-moz-animation',
    '-moz-border-image',
    '-moz-border-radius',
    '-moz-box-flex',
    '-moz-column-rule',
    '-moz-outline',
    '-ms-animation',
    '-ms-flex',
    '-ms-grid-column',
    '-webkit-animation',
    '-webkit-border-image',
    '-webkit-column-rule',
    '-webkit-flex',
    '-webkit-grid-column',
    'animation',
    'background',
    'border-bottom',
    'border-image',
    'border-left',
    'border-right',
    'border-top',
    'border',
    'column-rule',
    'cue',
    'filter',
    'flex',
    'font',
    'layout-grid',
    'list-style',
    'margin',
    'outline',
    'padding',
    'pause',
    'quotes',
    'size',
    'text-shadow',
];
exports.notMoveCursorProperty = notMoveCursorProperty;
const vueStyleScoped = [':deep', ':global', ':slotted'];
exports.vueStyleScoped = vueStyleScoped;
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
})(NodeType || (NodeType = {}));
exports.NodeType = NodeType;
var TokenType;
(function (TokenType) {
    TokenType[TokenType["Ident"] = 0] = "Ident";
    TokenType[TokenType["AtKeyword"] = 1] = "AtKeyword";
    TokenType[TokenType["String"] = 2] = "String";
    TokenType[TokenType["BadString"] = 3] = "BadString";
    TokenType[TokenType["UnquotedString"] = 4] = "UnquotedString";
    TokenType[TokenType["Hash"] = 5] = "Hash";
    TokenType[TokenType["Num"] = 6] = "Num";
    TokenType[TokenType["Percentage"] = 7] = "Percentage";
    TokenType[TokenType["Dimension"] = 8] = "Dimension";
    TokenType[TokenType["UnicodeRange"] = 9] = "UnicodeRange";
    TokenType[TokenType["CDO"] = 10] = "CDO";
    TokenType[TokenType["CDC"] = 11] = "CDC";
    TokenType[TokenType["Colon"] = 12] = "Colon";
    TokenType[TokenType["SemiColon"] = 13] = "SemiColon";
    TokenType[TokenType["CurlyL"] = 14] = "CurlyL";
    TokenType[TokenType["CurlyR"] = 15] = "CurlyR";
    TokenType[TokenType["ParenthesisL"] = 16] = "ParenthesisL";
    TokenType[TokenType["ParenthesisR"] = 17] = "ParenthesisR";
    TokenType[TokenType["BracketL"] = 18] = "BracketL";
    TokenType[TokenType["BracketR"] = 19] = "BracketR";
    TokenType[TokenType["Whitespace"] = 20] = "Whitespace";
    TokenType[TokenType["Includes"] = 21] = "Includes";
    TokenType[TokenType["Dashmatch"] = 22] = "Dashmatch";
    TokenType[TokenType["SubstringOperator"] = 23] = "SubstringOperator";
    TokenType[TokenType["PrefixOperator"] = 24] = "PrefixOperator";
    TokenType[TokenType["SuffixOperator"] = 25] = "SuffixOperator";
    TokenType[TokenType["Delim"] = 26] = "Delim";
    TokenType[TokenType["EMS"] = 27] = "EMS";
    TokenType[TokenType["EXS"] = 28] = "EXS";
    TokenType[TokenType["Length"] = 29] = "Length";
    TokenType[TokenType["Angle"] = 30] = "Angle";
    TokenType[TokenType["Time"] = 31] = "Time";
    TokenType[TokenType["Freq"] = 32] = "Freq";
    TokenType[TokenType["Exclamation"] = 33] = "Exclamation";
    TokenType[TokenType["Resolution"] = 34] = "Resolution";
    TokenType[TokenType["Comma"] = 35] = "Comma";
    TokenType[TokenType["Charset"] = 36] = "Charset";
    TokenType[TokenType["EscapedJavaScript"] = 37] = "EscapedJavaScript";
    TokenType[TokenType["BadEscapedJavaScript"] = 38] = "BadEscapedJavaScript";
    TokenType[TokenType["Comment"] = 39] = "Comment";
    TokenType[TokenType["SingleLineComment"] = 40] = "SingleLineComment";
    TokenType[TokenType["EOF"] = 41] = "EOF";
    TokenType[TokenType["CustomToken"] = 42] = "CustomToken";
})(TokenType || (TokenType = {}));
exports.TokenType = TokenType;
var SortTexts;
(function (SortTexts) {
    // char code 32, comes before everything
    SortTexts["Enums"] = " ";
    SortTexts["Normal"] = "d";
    SortTexts["VendorPrefixed"] = "x";
    SortTexts["Term"] = "y";
    SortTexts["Variable"] = "z";
})(SortTexts || (SortTexts = {}));
exports.SortTexts = SortTexts;
//# sourceMappingURL=cssTypeUtils.js.map