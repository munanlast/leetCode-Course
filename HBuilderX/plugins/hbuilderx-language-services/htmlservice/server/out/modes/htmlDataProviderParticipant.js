"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHTMLDataProviderParticipant = void 0;
const utils_1 = require("../../../../utils");
function getHTMLDataProviderParticipant() {
    const provider = (0, utils_1.getCustomHTMLDataProvider)();
    return {
        getId() {
            return provider.getId();
        },
        isApplicable(languageId) {
            return true;
        },
        provideTags() {
            return [];
        },
        provideAttributes(tag) {
            return [];
        },
        provideValues(tag, attribute) {
            return provider.provideValues(tag, attribute);
        }
    };
}
exports.getHTMLDataProviderParticipant = getHTMLDataProviderParticipant;
//# sourceMappingURL=htmlDataProviderParticipant.js.map