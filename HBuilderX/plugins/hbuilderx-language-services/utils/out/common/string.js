"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeQuote = void 0;
function removeQuote(text) {
    const first = text[0];
    const last = text[text.length - 1];
    if (first === last && (first === '\'' || first === '\"')) {
        text = text.substr(1, text.length - 2);
    }
    return text;
}
exports.removeQuote = removeQuote;
//# sourceMappingURL=string.js.map