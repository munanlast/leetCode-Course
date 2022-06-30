"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVeturDataProviders = exports.VeturDataProvider = void 0;
const fs = require("fs");
const path = require("path");
const vscode_uri_1 = require("vscode-uri");
const nuxtDataProvider_1 = require("./nuxtDataProvider");
const veturProviderParse_1 = require("./veturProviderParse");
const utils_1 = require("../../../../../utils");
var veturProviderParse_2 = require("./veturProviderParse");
Object.defineProperty(exports, "VeturDataProvider", { enumerable: true, get: function () { return veturProviderParse_2.VeturDataProvider; } });
function getVeturDataProviders(workspaceFolderUri) {
    const packageRoot = vscode_uri_1.URI.parse(workspaceFolderUri).fsPath;
    let veturDataProviders = [];
    let file = path.join(packageRoot, 'package.json');
    if (fs.existsSync(file)) {
        try {
            const packageJSON = JSON.parse(fs.readFileSync(file, 'utf-8'));
            const dependencies = packageJSON.dependencies || {};
            const devDependencies = packageJSON.devDependencies || {};
            if (dependencies['nuxt-buefy'] || devDependencies['nuxt-buefy']) {
                dependencies['buefy'] = true;
            }
            if (dependencies['@nuxtjs/vuetify'] || devDependencies['@nuxtjs/vuetify']) {
                dependencies['vuetify'] = true;
            }
            // Quasar pre v1 on quasar-cli:
            if (devDependencies['quasar-cli']) {
                // pushing dependency so we can check it
                // and enable Quasar later below in the for()
                dependencies['quasar-framework'] = '^0.0.17';
            }
            if (dependencies['nuxt'] || dependencies['nuxt-edge'] || devDependencies['nuxt'] || devDependencies['nuxt-edge']) {
                const nuxtDataProvider = (0, nuxtDataProvider_1.getNuxtDataProvider)(packageRoot);
                if (nuxtDataProvider) {
                    veturDataProviders.push(nuxtDataProvider);
                }
            }
            const workspaceTagProvider = (0, veturProviderParse_1.getWorkspaceDataProvider)(packageRoot, packageJSON);
            if (workspaceTagProvider) {
                veturDataProviders.push(workspaceTagProvider);
            }
            let depSet = new Set();
            for (const dep of [...Object.keys(dependencies), ...Object.keys(devDependencies)]) {
                let depJsonPath;
                try {
                    depJsonPath = require.resolve(path.join(dep, 'package.json'), { paths: [packageRoot] });
                }
                catch (_a) {
                    continue;
                }
                const depJson = JSON.parse(fs.readFileSync(depJsonPath, 'utf-8'));
                if (depJson) {
                    const depDataProvider = (0, veturProviderParse_1.getDependencyDataProvider)(packageRoot, dep, depJson);
                    if (depDataProvider) {
                        depSet.add(dep);
                        veturDataProviders.push(depDataProvider);
                    }
                }
            }
            // 项目中没有依赖vue-router，手动补充
            if (!depSet.has('vue-router')) {
                let routerPackage = path.join(utils_1.hx.getExtensionRootPath(), 'builtin-dts/node_modules/vue-router');
                const pkgFile = path.join(routerPackage, 'package.json');
                if (fs.existsSync(pkgFile)) {
                    const pkgJson = JSON.parse(fs.readFileSync(pkgFile, 'utf-8'));
                    if (pkgJson) {
                        const routerDataProvider = (0, veturProviderParse_1.getDependencyDataProvider)(routerPackage, 'vue-router', pkgJson);
                        if (routerDataProvider) {
                            veturDataProviders.push(routerDataProvider);
                        }
                    }
                }
            }
        }
        catch (e) {
            console.error(e.stack);
        }
    }
    return veturDataProviders;
}
exports.getVeturDataProviders = getVeturDataProviders;
//# sourceMappingURL=veturProvider.js.map