"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vueVersion = void 0;
const md5 = require('md5');
const path = require("path");
const fs = require("fs");
const jsonc_1 = require("jsonc");
const vue2Library = 'vue.2.x';
const vue3Library = 'vue.3.x';
/**
 *
 * @param filePath project root path
 * @returns default 2
 */
function vueVersion(filePath) {
    let manifestPath = path.join(filePath, 'manifest.json');
    if (!fs.existsSync(manifestPath)) {
        manifestPath = path.join(filePath, 'src/manifest.json');
    }
    if (fs.existsSync(manifestPath)) {
        let contents = fs.readFileSync(manifestPath).toString();
        const [err, res] = jsonc_1.jsonc.safe.parse(contents);
        if (!err)
            return parseInt(res.vueVersion) || 2;
    }
    let packagePath = path.join(filePath, 'package.json');
    if (fs.existsSync(packagePath)) {
        let contents = fs.readFileSync(packagePath).toString();
        const [err, res] = jsonc_1.jsonc.safe.parse(contents);
        if (!err) {
            let dependency = null;
            if (!!res['dependencies']) {
                dependency = res['dependencies'];
            }
            else if (!!res['devDependencies']) {
                dependency = res['devDependencies'];
            }
            if (!!dependency && !!dependency['vue']) {
                let vueVersion = dependency['vue'];
                if (typeof vueVersion == 'string') {
                    if (vueVersion.startsWith('3')
                        || vueVersion.startsWith('^3')
                        || vueVersion.startsWith('~3.')) {
                        return 3;
                    }
                    else {
                        return 2;
                    }
                }
            }
        }
    }
    return 2;
}
exports.vueVersion = vueVersion;
//# sourceMappingURL=vueVersion.js.map