const hx = require("../hbxBridge.js");
const objects = require("./objects.js");
const net = require('net');
const stream = require('stream');
const cp = require('child_process');
const path = require('path');
const fs = require('fs');
const nls = hx.nls;
let g_debugAdapters = {
};
let g_debugAdapterFactories = {
};
function getExactExpressionStartAndEnd(lineContent, looseStart, looseEnd){
	let matchingExpression = undefined;
	let startOffset = 0;

	// Some example supported expressions: myVar.prop, a.b.c.d, myVar?.prop, myVar->prop, MyClass::StaticProp, *myVar
	// Match any character except a set of characters which often break interesting sub-expressions
	let expression= /([^()\[\]{}<>\s+\-/%~#^;=|,`!]|\->)+/g;
	let result = null;

	// First find the full expression under the cursor
	while (result = expression.exec(lineContent)) {
		let start = result.index + 1;
		let end = start + result[0].length;

		if (start <= looseStart && end >= looseEnd) {
			matchingExpression = result[0];
			startOffset = start;
			break;
		}
	}

	// If there are non-word characters after the cursor, we want to truncate the expression then.
	// For example in expression 'a.b.c.d', if the focus was under 'b', 'a.b' would be evaluated.
	if (matchingExpression) {
		let subExpression = /\w+/g;
		let subExpressionResult = null;
		while (subExpressionResult = subExpression.exec(matchingExpression)) {
			let subEnd = subExpressionResult.index + 1 + startOffset + subExpressionResult[0].length;
			if (subEnd >= looseEnd) {
				break;
			}
		}

		if (subExpressionResult) {
			matchingExpression = matchingExpression.substring(0, subExpression.lastIndex);
		}
	}

	// console.log('=====================',matchingExpression);
	return matchingExpression;
}

function _init(connection) {    
    connection.onRequest("debugger/createDebugAdapter", async (params) => {
        let debugAdapterId = params.id;
        let type = params.type;
        let descriptor = await getDebugAdapterDescriptor(type, params.debugConfiguration);
        if (!descriptor) {
            throw new Error(`Couldn't find a debug adapter descriptor for debug type '${type}'`);
        }
        const da = createDebugAdapter(descriptor, type);
        g_debugAdapters[debugAdapterId] = da;
        da.onMessage(async (message) => {
            if (message.type === 'request' && message.command === 'handshake') {
                const request = message;

                const response = {
                    type: 'response',
                    seq: 0,
                    command: request.command,
                    request_seq: request.seq,
                    success: true
                };

                try {
                    debugAdapter.sendResponse(response);
                } catch (e) {
                    response.success = false;
                    response.message = e.message;
                    debugAdapter.sendResponse(response);
                }
            } else {
                // DA -> HBuilderX
                connection.sendRequest("debugger.acceptDAMessage", {
                    adapterId: debugAdapterId,
                    message: message
                });
            }
        });

        da.onError(err => {
            console.log(err);
            //this._debugServiceProxy.$acceptDAError(debugAdapterHandle, err.name, err.message, err.stack);
        });
        da.onExit((code) => {
            console.log(code);
            //this._debugServiceProxy.$acceptDAExit(debugAdapterHandle, withNullAsUndefined(code), undefined);
        });
        return da.startSession();
    });

    connection.onRequest("debugger/sendDAMessage", async (params) => {
        let debugAdapterId = params.id;
        let da = g_debugAdapters[debugAdapterId];
        if (da) {
            da.sendMessage(params.message);
        }
    });

    connection.onRequest("debugger/stopDASession", async (params) => {
        let debugAdapterId = params.id;
        let da = g_debugAdapters[debugAdapterId];
        g_debugAdapters[debugAdapterId] = undefined;
        if (da) {
            return da.stopSession();
        }
        return 0;
    });
    connection.onRequest("debugger/getevaluateexpression", async (params) => {
        return getExactExpressionStartAndEnd(params.lineContent, params.start, params.end)
    });
}

/**
 * Abstract implementation of the low level API for a debug adapter.
 * Missing is how this API communicates with the debug adapter.
 */
class AbstractDebugAdapter {
    constructor() {
        this.sequence = 1;
        this.pendingRequests = new Map();
        this.requestCallback = function(request) {};
        this.eventCallback = function(request) {};
        this.messageCallback = function(message) {};
        this.queue = [];
        this._onError = new hx.EventEmitter();
        this._onExit = new hx.EventEmitter();
    }

    get onError() {
        return this._onError.event;
    }
    get onExit() {
        return this._onExit.event;
    }

    async startSession() {}

    async stopSession() {}

    sendMessage(message) {}

    onMessage(callback) {
        if (this.messageCallback) {
            this._onError.fire(new Error(`attempt to set more than one 'Message' callback`));
        }
        this.messageCallback = callback;
    }

    onEvent(callback) {
        if (this.eventCallback) {
            this._onError.fire(new Error(`attempt to set more than one 'Event' callback`));
        }
        this.eventCallback = callback;
    }

    onRequest(callback) {
        if (this.requestCallback) {
            this._onError.fire(new Error(`attempt to set more than one 'Request' callback`));
        }
        this.requestCallback = callback;
    }

    sendResponse(response) {
        if (response.seq > 0) {
            this._onError.fire(new Error(`attempt to send more than one response for command ${response.command}`));
        } else {
            this.internalSend('response', response);
        }
    }

    sendRequest(command, args, clb, timeout) {
        const request = {
            command: command
        };
        if (args && Object.keys(args).length > 0) {
            request.arguments = args;
        }
        this.internalSend('request', request);
        if (typeof timeout === 'number') {
            const timer = setTimeout(() => {
                clearTimeout(timer);
                const clb = this.pendingRequests.get(request.seq);
                if (clb) {
                    this.pendingRequests.delete(request.seq);
                    const err = {
                        type: 'response',
                        seq: 0,
                        request_seq: request.seq,
                        success: false,
                        command,
                        message: `Timeout after ${timeout} ms for '${command}'`
                    };
                    clb(err);
                }
            }, timeout);
        }
        if (clb) {
            // store callback for this request
            this.pendingRequests.set(request.seq, clb);
        }

        return request.seq;
    }

    acceptMessage(message) {
        if (this.messageCallback) {
            this.messageCallback(message);
        } else {
            this.queue.push(message);
            if (this.queue.length === 1) {
                // first item = need to start processing loop
                this.processQueue();
            }
        }
    }

    /**
     * Returns whether we should insert a timeout between processing messageA
     * and messageB. Artificially queueing protocol messages guarantees that any
     * microtasks for previous message finish before next message is processed.
     * This is essential ordering when using promises anywhere along the call path.
     *
     * For example, take the following, where `chooseAndSendGreeting` returns
     * a person name and then emits a greeting event:
     *
     * ```
     * let person: string;
     * adapter.onGreeting(() => console.log('hello', person));
     * person = await adapter.chooseAndSendGreeting();
     * ```
     *
     * Because the event is dispatched synchronously, it may fire before person
     * is assigned if they're processed in the same task. Inserting a task
     * boundary avoids this issue.
     */
    needsTaskBoundaryBetween(messageA, messageB) {
        return messageA.type !== 'event' || messageB.type !== 'event';
    }

    /**
     * Reads and dispatches items from the queue until it is empty.
     */
    async processQueue() {
        let message;
        while (this.queue.length) {
            if (!message || this.needsTaskBoundaryBetween(this.queue[0], message)) {
                await timeout(0);
            }

            message = this.queue.shift();
            if (!message) {
                return; // may have been disposed of
            }

            switch (message.type) {
                case 'event':
                    if (this.eventCallback) {
                        this.eventCallback(message);
                    }
                    break;
                case 'request':
                    if (this.requestCallback) {
                        this.requestCallback(message);
                    }
                    break;
                case 'response':
                    const response = message;
                    const clb = this.pendingRequests.get(response.request_seq);
                    if (clb) {
                        this.pendingRequests.delete(response.request_seq);
                        clb(response);
                    }
                    break;
            }
        }
    }

    internalSend(typ, message) {
        message.type = typ;
        message.seq = this.sequence++;
        this.sendMessage(message);
    }

    async cancelPendingRequests() {
        if (this.pendingRequests.size === 0) {
            return Promise.resolve();
        }

        const pending = new Map();
        this.pendingRequests.forEach((value, key) => pending.set(key, value));
        await timeout(500);
        pending.forEach((callback, request_seq) => {
            const err = {
                type: 'response',
                seq: 0,
                request_seq,
                success: false,
                command: 'canceled',
                message: 'canceled'
            };
            callback(err);
            this.pendingRequests.delete(request_seq);
        });
    }

    getPendingRequestIds() {
        return Array.from(this.pendingRequests.keys());
    }

    dispose() {
        this.queue = [];
    }
}


/**
 * An implementation that communicates via two streams with the debug adapter.
 */
class StreamDebugAdapter extends AbstractDebugAdapter {
    constructor() {
        super();
        this.outputStream = undefined;
        this.rawData = Buffer.allocUnsafe(0);
        this.contentLength = -1;
    }

    connect(readable, writable) {

        this.outputStream = writable;
        this.rawData = Buffer.allocUnsafe(0);
        this.contentLength = -1;

        readable.on('data', (data) => this.handleData(data));
    }

    sendMessage(message) {
        if (this.outputStream) {
            const json = JSON.stringify(message);
            this.outputStream.write(
                `Content-Length: ${Buffer.byteLength(json, 'utf8')}${StreamDebugAdapter.TWO_CRLF}${json}`,
                'utf8');
        }
    }

    handleData(data) {
        this.rawData = Buffer.concat([this.rawData, data]);
        while (true) {
            if (this.contentLength >= 0) {
                if (this.rawData.length >= this.contentLength) {
                    const message = this.rawData.toString('utf8', 0, this.contentLength);
                    this.rawData = this.rawData.slice(this.contentLength);
                    this.contentLength = -1;
                    if (message.length > 0) {
                        try {
                            this.acceptMessage(JSON.parse(message));
                        } catch (e) {
                            this._onError.fire(new Error((e.message || e) + '\n' + message));
                        }
                    }
                    continue; // there may be more complete messages to process
                }
            } else {
                const idx = this.rawData.indexOf(StreamDebugAdapter.TWO_CRLF);
                if (idx !== -1) {
                    const header = this.rawData.toString('utf8', 0, idx);
                    const lines = header.split(StreamDebugAdapter.HEADER_LINESEPARATOR);
                    for (const h of lines) {
                        const kvPair = h.split(StreamDebugAdapter.HEADER_FIELDSEPARATOR);
                        if (kvPair[0] === 'Content-Length') {
                            this.contentLength = Number(kvPair[1]);
                        }
                    }
                    this.rawData = this.rawData.slice(idx + StreamDebugAdapter.TWO_CRLF.length);
                    continue;
                }
            }
            break;
        }
    }
}
StreamDebugAdapter.TWO_CRLF = '\r\n\r\n';
StreamDebugAdapter.HEADER_LINESEPARATOR = /\r?\n/; // allow for non-RFC 2822 conforming line separators
StreamDebugAdapter.HEADER_FIELDSEPARATOR = /: */;

class NetworkDebugAdapter extends StreamDebugAdapter {

    createConnection(connectionListener) {}

    startSession() {
        return new Promise((resolve, reject) => {
            let connected = false;
            this.socket = this.createConnection(() => {
                this.connect(this.socket, this.socket);
                resolve();
                connected = true;
            });

            this.socket.on('close', () => {
                if (connected) {
                    this._onError.fire(new Error('connection closed'));
                } else {
                    reject(new Error('connection closed'));
                }
            });

            this.socket.on('error', error => {
                if (connected) {
                    this._onError.fire(error);
                } else {
                    reject(error);
                }
            });
        });
    }

    async stopSession() {
        await this.cancelPendingRequests();
        if (this.socket) {
            this.socket.end();
            this.socket = undefined;
        }
    }
}

/**
 * An implementation that connects to a debug adapter via a socket.
 */
class SocketDebugAdapter extends NetworkDebugAdapter {

    constructor(adapterServer) {
        super();
        this.adapterServer = adapterServer;
    }

    createConnection(connectionListener) {
        return net.createConnection(this.adapterServer.port, this.adapterServer.host || '127.0.0.1',
            connectionListener);
    }
}

/**
 * An implementation that launches the debug adapter as a separate process and communicates via stdin/stdout.
 */
class ExecutableDebugAdapter extends StreamDebugAdapter {

    constructor(adapterExecutable, debugType, outputService) {
        super();
        this.adapterExecutable = adapterExecutable;
        this.debugType = debugType;
        this.outputService = outputService;
    }

    async startSession() {

        const command = this.adapterExecutable.command;
        const args = this.adapterExecutable.args;
        const options = this.adapterExecutable.options || {
};

        try {
            // verify executables asynchronously
            // if (command) {
            //     const commandExists = fs.existsSync(command);
            //     if (!commandExists) {
            //         throw new Error(nls.localize('debugAdapterBinNotFound',
            //             "Debug adapter executable '{0}' does not exist.", command));
            //     }
            // } else {
            //     throw new Error(nls.localize({
            //             key: 'debugAdapterCannotDetermineExecutable',
            //             comment: ['Adapter executable file not found']
            //         },
            //         "Cannot determine executable for debug adapter '{0}'.", this.debugType));
            // }

            let env = process.env;
            if (options.env && Object.keys(options.env).length > 0) {
                env = objects.mixin(objects.deepClone(process.env), options.env);
            }

            if (command === 'node') {
                if (Array.isArray(args) && args.length > 0) {
                    const forkOptions = {
                        env: env,
                        execArgv: [],
                        silent: true
                    };
                    if (options.cwd) {
                        forkOptions.cwd = options.cwd;
                    }
                    const child = cp.fork(args[0], args.slice(1), forkOptions);
                    if (!child.pid) {
                        throw new Error(nls.localize('unableToLaunchDebugAdapter',
                            "Unable to launch debug adapter from '{0}'.", args[0]));
                    }
                    this.serverProcess = child;
                } else {
                    throw new Error(nls.localize('unableToLaunchDebugAdapterNoArgs',
                        "Unable to launch debug adapter."));
                }
            } else {
                const spawnOptions = {
                    env: env
                };
                if (options.cwd) {
                    spawnOptions.cwd = options.cwd;
                }
                this.serverProcess = cp.spawn(command, args, spawnOptions);
            }

            this.serverProcess.on('error', err => {
                this._onError.fire(err);
            });
            this.serverProcess.on('exit', (code, signal) => {
                this._onExit.fire(code);
            });

            this.serverProcess.stdout.on('close', () => {
                this._onError.fire(new Error('read error'));
            });
            this.serverProcess.stdout.on('error', error => {
                this._onError.fire(error);
            });

            this.serverProcess.stdin.on('error', error => {
                this._onError.fire(error);
            });

            const outputService = this.outputService;
            if (outputService) {
                const sanitize = (s) => s.toString().replace(/\r?\n$/mg, '');
                this.serverProcess.stderr.on('data', (data) => {
                    const channel = outputService.getChannel(ExtensionsChannelId);
                    if (channel) {
                        channel.append(sanitize(data));
                    }
                });
            } else {
                this.serverProcess.stderr.resume();
            }

            // finally connect to the DA
            this.connect(this.serverProcess.stdout, this.serverProcess.stdin);

        } catch (err) {
            this._onError.fire(err);
        }
    }

    async stopSession() {

        if (!this.serverProcess) {
            return Promise.resolve(undefined);
        }

        // when killing a process in windows its child
        // processes are *not* killed but become root
        // processes. Therefore we use TASKKILL.EXE
        await this.cancelPendingRequests();
        if (platform.isWindows) {
            return new Promise((c, e) => {
                const killer = cp.exec(`taskkill /F /T /PID ${this.serverProcess.pid}`, function(err,
                    stdout, stderr) {
                    if (err) {
                        return e(err);
                    }
                });
                killer.on('exit', c);
                killer.on('error', e);
            });
        } else {
            this.serverProcess.kill('SIGTERM');
            return Promise.resolve(undefined);
        }
    }
}

function createDebugAdapter(descriptor, type) {
    switch (descriptor.type) {
        case 'server':
            return new SocketDebugAdapter(descriptor);
            // case 'pipeServer':
            //     return new NamedPipeDebugAdapter(descriptor);
        case 'executable':
            return new ExecutableDebugAdapter(descriptor, type);
    }
    return undefined;
}

async function getDebugAdapterDescriptor(type, config) {
    if (g_debugAdapterFactories[type]) {
        return g_debugAdapterFactories[type].createDebugAdapterDescriptor();
    }
    return {
        command: config.runtime,
        args: [config.program],
        options: config.options,
        type: "executable"
    };
}

module.exports = {
    init: _init,
};
