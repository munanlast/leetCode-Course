"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerServerProcess = void 0;
class WorkerServerProcess {
    constructor(worker, args) {
        this.worker = worker;
        this._onDataHandlers = new Set();
        this._onErrorHandlers = new Set();
        this._onExitHandlers = new Set();
        worker.addEventListener('message', (msg) => {
            for (const handler of this._onDataHandlers) {
                handler(msg.data);
            }
        });
        worker.postMessage(args);
    }
    static fork(tsServerPath, args, _kind, _configuration) {
        const worker = new Worker(tsServerPath);
        return new WorkerServerProcess(worker, args);
    }
    write(serverRequest) {
        this.worker.postMessage(serverRequest);
    }
    onData(handler) {
        this._onDataHandlers.add(handler);
    }
    onError(handler) {
        this._onErrorHandlers.add(handler);
        // Todo: not implemented
    }
    onExit(handler) {
        this._onExitHandlers.add(handler);
        // Todo: not implemented
    }
    kill() {
        this.worker.terminate();
    }
}
exports.WorkerServerProcess = WorkerServerProcess;
//# sourceMappingURL=serverProcess.browser.js.map