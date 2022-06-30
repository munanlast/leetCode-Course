"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogRedirectOutputChannel = void 0;
class LogRedirectOutputChannel {
    constructor(name) {
        this.name = name;
    }
    /**
     * Append the given value to the channel.
     *
     * @param value A string, falsy values will not be printed.
     */
    append(value) {
        console.log(`[${this.name}] ${value}`);
    }
    /**
     * Append the given value and a line feed character
     * to the channel.
     *
     * @param value A string, falsy values will be printed.
     */
    appendLine(value) {
        console.log(`[${this.name}] ${value}`);
    }
    /**
     * Removes all output from the channel.
     */
    clear() {
    }
    /**
     * Reveal this channel in the UI.
     *
     * @param preserveFocus When `true` the channel will not take focus.
     */
    show(columnOrPreserveFocus, preserveFocus) {
    }
    /**
     * Hide this channel from the UI.
     */
    hide() {
    }
    /**
     * Dispose and free associated resources.
     */
    dispose() {
    }
}
exports.LogRedirectOutputChannel = LogRedirectOutputChannel;
//# sourceMappingURL=logRedirectOutputChannel.js.map