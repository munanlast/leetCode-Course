/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/base/common/buffer", "vs/base/common/strings", "vs/base/common/uri"], function (require, exports, buffer_1, strings_1, uri_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.revive = exports.parse = exports.stringify = void 0;
    function stringify(obj) {
        return JSON.stringify(obj, replacer);
    }
    exports.stringify = stringify;
    function parse(text) {
        let data = JSON.parse(text);
        data = revive(data);
        return data;
    }
    exports.parse = parse;
    function replacer(key, value) {
        // URI is done via toJSON-member
        if (value instanceof RegExp) {
            return {
                $mid: 2,
                source: value.source,
                flags: strings_1.regExpFlags(value),
            };
        }
        return value;
    }
    function revive(obj, depth = 0) {
        if (!obj || depth > 200) {
            return obj;
        }
        if (typeof obj === 'object') {
            switch (obj.$mid) {
                case 1: return uri_1.URI.revive(obj);
                case 2: return new RegExp(obj.source, obj.flags);
            }
            if (obj instanceof buffer_1.VSBuffer
                || obj instanceof Uint8Array) {
                return obj;
            }
            if (Array.isArray(obj)) {
                for (let i = 0; i < obj.length; ++i) {
                    obj[i] = revive(obj[i], depth + 1);
                }
            }
            else {
                // walk object
                for (const key in obj) {
                    if (Object.hasOwnProperty.call(obj, key)) {
                        obj[key] = revive(obj[key], depth + 1);
                    }
                }
            }
        }
        return obj;
    }
    exports.revive = revive;
});
//# sourceMappingURL=marshalling.js.map