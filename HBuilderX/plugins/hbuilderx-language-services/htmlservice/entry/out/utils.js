"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtmlServiceExtUtils = void 0;
const vscode_html_languageservice_1 = require("vscode-html-languageservice");
var HtmlServiceExtUtils;
(function (HtmlServiceExtUtils) {
    function searchHtmlNode(roots, callback) {
        let queue = [...roots];
        while (queue.length > 0) {
            let node = queue.splice(0, 1)[0];
            if (!callback(node)) {
                break;
            }
            queue.unshift(...node.children);
        }
    }
    HtmlServiceExtUtils.searchHtmlNode = searchHtmlNode;
    function getAttributeInDocument(source, languageSevice, node, attributeName) {
        if (node.attributes && node.attributes[attributeName]) {
            let start = source.positionAt(node.start);
            let end = source.positionAt(node.startTagEnd ? node.startTagEnd : node.end);
            let text = source.getText({ start, end });
            let scanner = languageSevice.createScanner(text);
            let token = scanner.scan();
            let hasFind = false;
            while (token !== vscode_html_languageservice_1.TokenType.EOS) {
                switch (token) {
                    case vscode_html_languageservice_1.TokenType.AttributeName:
                        hasFind = scanner.getTokenText() === attributeName;
                        break;
                    case vscode_html_languageservice_1.TokenType.AttributeValue:
                        if (hasFind) {
                            let start = scanner.getTokenOffset();
                            let end = scanner.getTokenEnd();
                            if (text[start] === '\'' || text[start] === '"') {
                                start++;
                                end--;
                            }
                            return {
                                start: source.positionAt(start + node.start),
                                end: source.positionAt(end + node.start)
                            };
                        }
                }
                token = scanner.scan();
            }
        }
        return null;
    }
    HtmlServiceExtUtils.getAttributeInDocument = getAttributeInDocument;
})(HtmlServiceExtUtils = exports.HtmlServiceExtUtils || (exports.HtmlServiceExtUtils = {}));
//# sourceMappingURL=utils.js.map