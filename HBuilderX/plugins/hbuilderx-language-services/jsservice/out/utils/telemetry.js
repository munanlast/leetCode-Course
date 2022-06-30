"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VSCodeTelemetryReporter = void 0;
const vscode = require("vscode");
const memoize_1 = require("./memoize");
class VSCodeTelemetryReporter {
    // private _reporter: VsCodeTelemetryReporter | null = null;
    constructor(clientVersionDelegate) {
        this.clientVersionDelegate = clientVersionDelegate;
    }
    logTelemetry(eventName, properties = {}) {
        // const reporter = this.reporter;
        // if (!reporter) {
        // 	return;
        // }
        // /* __GDPR__FRAGMENT__
        // 	"TypeScriptCommonProperties" : {
        // 		"version" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
        // 	}
        // */
        // properties['version'] = this.clientVersionDelegate();
        // reporter.sendTelemetryEvent(eventName, properties);
    }
    dispose() {
        // if (this._reporter) {
        // 	this._reporter.dispose();
        // 	this._reporter = null;
        // }
    }
    get packageInfo() {
        const { packageJSON } = vscode.extensions.getExtension('vscode.typescript-language-features');
        if (packageJSON) {
            return {
                name: packageJSON.name,
                version: packageJSON.version,
                aiKey: packageJSON.aiKey
            };
        }
        return null;
    }
}
__decorate([
    memoize_1.memoize
    // private get reporter(): VsCodeTelemetryReporter | null {
    // 	if (this.packageInfo && this.packageInfo.aiKey) {
    // 		this._reporter = new VsCodeTelemetryReporter(
    // 			this.packageInfo.name,
    // 			this.packageInfo.version,
    // 			this.packageInfo.aiKey);
    // 		return this._reporter;
    // 	}
    // 	return null;
    // }
    ,
    memoize_1.memoize
], VSCodeTelemetryReporter.prototype, "packageInfo", null);
exports.VSCodeTelemetryReporter = VSCodeTelemetryReporter;
//# sourceMappingURL=telemetry.js.map