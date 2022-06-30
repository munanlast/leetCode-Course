"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDocumentation = exports.normalizeMarkupContent = void 0;
function normalizeMarkupContent(input) {
    if (!input) {
        return undefined;
    }
    if (typeof input === 'string') {
        return {
            kind: 'markdown',
            value: input
        };
    }
    return {
        kind: 'markdown',
        value: input.value
    };
}
exports.normalizeMarkupContent = normalizeMarkupContent;
function generateDocumentation(item, settings = {}, doesSupportMarkdown) {
    const result = {
        kind: doesSupportMarkdown ? 'markdown' : 'plaintext',
        value: ''
    };
    if (item.description && settings.documentation !== false) {
        const normalizedDescription = normalizeMarkupContent(item.description);
        if (normalizedDescription) {
            result.value += normalizedDescription.value;
        }
    }
    if (item.references && item.references.length > 0 && settings.references !== false) {
        if (result.value.length) {
            result.value += `\n\n`;
        }
        if (doesSupportMarkdown) {
            result.value += item.references.map(r => {
                return `[${r.name}](${r.url})`;
            }).join(' | ');
        }
        else {
            result.value += item.references.map(r => {
                return `${r.name}: ${r.url}`;
            }).join('\n');
        }
    }
    if (result.value === '') {
        return undefined;
    }
    return result;
}
exports.generateDocumentation = generateDocumentation;
//# sourceMappingURL=dataProviderUtils.js.map