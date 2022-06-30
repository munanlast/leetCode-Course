"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gotoDefinition = exports.doComplete = exports.specialTypes = exports.initSpecialTypeHandlers = exports.SpecialValueLocationType = void 0;
var SpecialValueLocationType;
(function (SpecialValueLocationType) {
    SpecialValueLocationType[SpecialValueLocationType["IN_JS_CSS"] = 0] = "IN_JS_CSS";
    SpecialValueLocationType[SpecialValueLocationType["IN_CSS"] = 1] = "IN_CSS";
    SpecialValueLocationType[SpecialValueLocationType["IN_HTML"] = 2] = "IN_HTML";
    SpecialValueLocationType[SpecialValueLocationType["IN_JS_HTML"] = 3] = "IN_JS_HTML";
})(SpecialValueLocationType = exports.SpecialValueLocationType || (exports.SpecialValueLocationType = {}));
let specialTypes = new Set();
exports.specialTypes = specialTypes;
let specialType2Handler = new Map();
function initSpecialTypeHandlers() {
    // type -> filepath
    specialType2Handler.set('HBuilderX.HTMLElementProperties', './htmlElementPropertiesHandler');
    specialType2Handler.set('HBuilderX.HTMLStyleObjectString', './htmlStyleObjectHandler');
    specialType2Handler.set('HBuilderX.CloudFunctions', './cloudFunctionsHandler');
    specialType2Handler.set('HBuilderX.CloudObjects', './cloudObjectsHandler');
    specialType2Handler.set('HBuilderX.ClientDBActionString', './clientDBActionHandler');
    specialType2Handler.set('HBuilderX.SchemaField', './schemaFieldHandler');
    specialType2Handler.set('HBuilderX.DBCollectionString', './dbCollectionHandler');
    specialType2Handler.set('HBuilderX.DBFieldString', './dbFieldHandler');
    specialType2Handler.set('HBuilderX.JQLString', './jqlHandler');
    specialType2Handler.set('HBuilderX.ValidateFunctionString', './validateFunctionHandler');
    specialType2Handler.set('HBuilderX.DBFieldOrderByString', './dbFieldOrderByHandler');
    specialType2Handler.set('HBuilderX.ParentField', './parentFieldHandler');
    specialType2Handler.set('HBuilderX.PageURIString', './pageURIHandler');
    specialType2Handler.set('HBuilderX.NPageURIString', './pageURIHandler');
    specialType2Handler.set('HBuilderX.IDString', './idHandler');
    specialType2Handler.set('HBuilderX.ClassString', './classHandler');
    specialType2Handler.set('HBuilderX.ColorString', './colorHandler');
    specialType2Handler.set('HBuilderX.ImageURIString', "./pageURIHandler");
    specialType2Handler.set('HBuilderX.RequireCommonString', './requireCommonHandler');
    specialType2Handler.set('HBuilderX.AttrString', './htmlAttrHandler');
    specialType2Handler.set('HBuilderX.AttrValueString', './htmlAttrValueHandler');
    specialType2Handler.set('HBuilderX.cssPropertyString', './cssPropertyHandler');
    specialType2Handler.set('HBuilderX.cssPropertyValueString', './cssPropertyValueHandler');
    specialType2Handler.set('HBuilderX.cssSelectorString', './cssSelectorStringHandler');
    specialType2Handler.set('HBuilderX.JSURIString', './jsURIHandler');
    specialType2Handler.set('HBuilderX.CSSURIString', './cssURIHandler');
    specialType2Handler.set('HBuilderX.ImportURIString', './importURIHandler');
    specialType2Handler.set('HBuilderX.HTMLEventString', './htmlEventHandler');
    specialType2Handler.forEach((value, key) => {
        specialTypes.add(key);
    });
}
exports.initSpecialTypeHandlers = initSpecialTypeHandlers;
initSpecialTypeHandlers();
function doComplete(types, position, document, options) {
    let completions = [];
    types.forEach(value => {
        if (specialType2Handler.has(value)) {
            let handler = require(specialType2Handler.get(value));
            completions = handler.doComplete(position, document, options);
        }
    });
    return completions;
}
exports.doComplete = doComplete;
function gotoDefinition(type, text, options) {
    let definitionLink = [];
    type = type.trim();
    if (specialType2Handler.has(type)) {
        let handler = require(specialType2Handler.get(type));
        definitionLink = handler === null || handler === void 0 ? void 0 : handler.gotoDefinition(text, options);
    }
    return definitionLink;
}
exports.gotoDefinition = gotoDefinition;
//# sourceMappingURL=index.js.map