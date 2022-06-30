"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexProcessorManager = void 0;
class IndexProcessorManager {
    constructor() {
        this.processorMap = new Map();
    }
    getProcessors() {
        let result = [];
        for (let v of this.processorMap.values()) {
            result = result.concat(v);
        }
        return result;
    }
    getProcessorForLanguage(language) {
        if (!language) {
            return this.getProcessors();
        }
        return this.processorMap.get(language) || [];
    }
    addProcessor(processor, language = '') {
        var _a;
        if (!this.processorMap.has(language)) {
            this.processorMap.set(language, [processor]);
        }
        else {
            (_a = this.processorMap.get(language)) === null || _a === void 0 ? void 0 : _a.push(processor);
        }
    }
}
exports.IndexProcessorManager = IndexProcessorManager;
//# sourceMappingURL=processormanager.js.map