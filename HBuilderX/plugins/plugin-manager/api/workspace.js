const hx = require("../hbxBridge.js");
const metatypes = require("./metatypes.js");
const Disposable = require("./disposable.js");
// const TextDocument = require("./texteditor.js").TextDocument;
const TextEdit = require("./texteditor.js").TextEdit;
const configService = require("./configuration.js");
const { URI } = require('vs/base/common/uri');
const { docs } = require('vs/vs_docsinstance.js');

let hasInited = false;
let documentListeners = {
	willSaveTextDocument: [],
	didChangeTextDocument: [],
	onDidSaveTextDocument: [],
	onDidOpenTextDocument: [],
	onDidChangeWorkspaceFolders: [],
	onDidChangeConfiguration: [],
	onDidCloseTextDocument:[],
	onDidRenameFiles:[]
}
let BeforeEventListeners = {
};
let docTranslator = {
	
};
let messageId = 0;
let messageCallbacks = {};

let launcherCallbacks = {};

function _init(connection) {
	if (hasInited) {
		return;
	}
	hasInited = true;
	configService.init(connection);
	connection.onRequest("sendEvent", function(event) {
		console.log("sendEvent", event.id);
		let eventId = event.id;
		if (eventId in documentListeners) {
			let listeners = documentListeners[eventId];
			let doc = metatypes.newObject(event.data, true);
			let before = BeforeEventListeners[eventId];
			if(before){
				for(const event of before){
					event(doc);
				}
			}
			var newDoc = doc;
			if(docTranslator[eventId]){
				newDoc = docTranslator[eventId](doc);
			}
			for (let i = 0; i < listeners.length; i++) {
				let listener = listeners[i];
				if (listener) {
					listener(newDoc);
				}
			}
		}
		return true;
	});
	connection.onNotification("postEvent", function(event) {
		// console.log("postEvent", event.id);
		let eventId = event.id;
		if (eventId in documentListeners) {
			let listeners = documentListeners[eventId];				
			let doc = metatypes.newObject(event.data, true);
			let before = BeforeEventListeners[eventId];
			if(before){
				for(const event of before){
					event(doc);
				}
			}
			var newDoc = doc;
			if(docTranslator[eventId]){
				newDoc = docTranslator[eventId](doc);
			}
			for (let i = 0; i < listeners.length; i++) {
				let listener = listeners[i];
				if (listener) {
					listener(newDoc);
				}
			}
		}
	});

	connection.onRequest("workspace/copyOptions/filter", function(params) {
		if (params.id in messageCallbacks) {
			return messageCallbacks[params.id](params.url);
			//delete messageCallbacks[params.id];
		}
	});

	connection.onRequest("workspace/copyOptions/errorHandler", function(params) {
		if (params.id in messageCallbacks) {
			return messageCallbacks[params.id](params.url);
			//delete messageCallbacks[params.id];
		}
	});
	
	connection.onRequest("workspace/launcher/handler", function(params) {
		if (params.id in launcherCallbacks) {
			return launcherCallbacks[params.id](params.data);
		}
	});
}

function WorkspaceFolder(options) {
	this.name = options.name;
	this.nature = options.nature;
	this.id = options.id;
	this.uri = new hx.Uri(options.uri.scheme, options.uri.authority,
		options.uri.path, options.uri.query, options.uri.fragment);
}
WorkspaceFolder.prototype.metatype = "WorkspaceFolder";

metatypes.registerObject(WorkspaceFolder.prototype.metatype, WorkspaceFolder);
metatypes.registerObject("WorkspaceFoldersChangeEvent", function(options) {
	if (options.added) {
		this.added = options.added.map(function(item) {
			return metatypes.newObject(item, true);
		});
	}
	if (options.removed) {
		this.removed = options.removed.map(function(item) {
			return metatypes.newObject(item, true);
		});
	}
});

metatypes.registerObject("ConfigurationChangeEvent", function(options) {
	this.section = options.section || '';
	this.affectsConfiguration = function(section) {
		return this.section == section;
	}
});

function WorkspaceEdit() {
	let entries = {};

	this.set = function(uri, edits) {
		let uriKey = uri;
		if (typeof uri !== "string") {
			if (uri.fsPath) {
				uriKey = uri.fsPath;
			} else {
				uriKey = uri.toString();
			}
		}
		entries[uriKey] = edits;
	}

	this.entries = function() {
		return entries;
	}
}

function onWillSaveTextDocument(listener) {
	documentListeners.willSaveTextDocument.push(listener);
	return new Disposable(function() {
		let index = documentListeners.willSaveTextDocument.indexOf(listener);
		if (index > -1) {
			documentListeners.willSaveTextDocument.splice(index, 1);
		}
	});
}

function onDidChangeWorkspaceFolders(listener) {
	documentListeners.onDidChangeWorkspaceFolders.push(listener);
	return new Disposable(function() {
		let index = documentListeners.onDidChangeWorkspaceFolders.indexOf(listener);
		if (index > -1) {
			documentListeners.onDidChangeWorkspaceFolders.splice(index, 1);
		}
	});
}
function onBeforeEvent(eventName, listener) {
	if(!BeforeEventListeners[eventName]){
		BeforeEventListeners[eventName] = [];
	}
	BeforeEventListeners[eventName].push(listener);
	return new Disposable(function() {
		let index = BeforeEventListeners[eventName].indexOf(listener);
		if (index > -1) {
			BeforeEventListeners[eventName].splice(index, 1);
		}
	});
}
function assignDocTranslator(eventName, f){
	docTranslator[eventName] = f;
	return new Disposable(function() {
		delete docTranslator[eventName];
	});
}

function onDidChangeTextDocument(listener) {
	documentListeners.didChangeTextDocument.push(listener);
	return new Disposable(function() {
		let index = documentListeners.didChangeTextDocument.indexOf(listener);
		if (index > -1) {
			documentListeners.didChangeTextDocument.splice(index, 1);
		}
	});
}
//onDidSaveTextDocument
function onDidSaveTextDocument(listener) {
	documentListeners.onDidSaveTextDocument.push(listener);
	return new Disposable(function() {
		let index = documentListeners.onDidSaveTextDocument.indexOf(listener);
		if (index > -1) {
			documentListeners.onDidSaveTextDocument.splice(index, 1);
		}
	});
}

function onDidOpenTextDocument(listener) {
	documentListeners.onDidOpenTextDocument.push(listener);
	let ret = new Disposable(function() {
		let index = documentListeners.onDidOpenTextDocument.indexOf(listener);
		if (index > -1) {
			documentListeners.onDidOpenTextDocument.splice(index, 1);
		}
	});	
	return ret;
}
function onDidCloseTextDocument(listener) {
	documentListeners.onDidCloseTextDocument.push(listener);
	let ret = new Disposable(function() {
		let index = documentListeners.onDidCloseTextDocument.indexOf(listener);
		if (index > -1) {
			documentListeners.onDidCloseTextDocument.splice(index, 1);
		}
	});	
	return ret;
}
function onDidRenameFiles(listener) {
	documentListeners.onDidRenameFiles.push(listener);
	let ret = new Disposable(function() {
		let index = documentListeners.onDidRenameFiles.indexOf(listener);
		if (index > -1) {
			documentListeners.onDidRenameFiles.splice(index, 1);
		}
	});	
	return ret;
}



function onDidChangeConfiguration(listener) {
	documentListeners.onDidChangeConfiguration.push(listener);
	return new Disposable(function() {
		let index = documentListeners.onDidChangeConfiguration.indexOf(listener);
		if (index > -1) {
			documentListeners.onDidChangeConfiguration.splice(index, 1);
		}
	});
}


/**
 * 修改文档
 * @param {WorkspaceEdit} edit
 */
function applyEdit(edit) {
    
	if (edit) {
        const entries = edit.entries();
        let newEntries = {};
        for(const uri in entries){
            const resource = URI.revive(URI.file(uri));
            const docData = docs.getDocument(resource).document;
            newEntries[uri] = entries[uri].map(edit=>{
                return new TextEdit({
                    start:docData.positionAt(edit.range.start),
                    end:docData.positionAt(edit.range.end),
                },edit.newText);
            });
            
        }
		hx.request("workspace.applyEdit",  newEntries);
	}
}

function openTextDocument(uri) {
	if(!uri){
		return hx.request("workspace.openTextDocument", {
			content:'',
			language:'text'
		});
	}
	return hx.request("workspace.openTextDocument", uri);
}

/**
 * 获取当前项目
 * @param {Uri} uri
 */
function getWorkspaceFolder(uri) {
	return hx.request("workspace.getWorkspaceFolder", {
		uri: uri
	});
}

function getWorkspaceFolders() {
	return hx.request("workspace.getWorkspaceFolders");
}

/**
 * @param {String} section
 * @param {ConfigurationScope} scope
 */
function getConfiguration(section, scope) {
	return new configService.Configuration(section, scope);
}

/**
 * 
 * @param {String} uri 
 */
function closeTextDocument(uri) {
	return hx.request("workspace.closeTextDocument", {
		uri: uri
	});
}

function copyFileWithPrompt(options) {
	let filterId = "copyfiles-filter-" + messageId++;
	let errorId = "copyfiles-errorhandler-" + messageId++;
	
	//messageCallbacks[filterId] = options.filter;
	//messageCallbacks[errorId] = options.errorHandler;
	let filterFunction = options.filter;
	let errorHandlerFunction = options.filter;
	messageCallbacks[filterId] = filterFunction;
	messageCallbacks[errorId] = errorHandlerFunction;
	
	if(options.filter == null)
	{
		options.filter = 'default'
	}
	if(options.errorHandler == null)
	{
		options.errorHandler = 'default'
	}

	let result = new Promise((resolve, reject) => {
		hx.request("workspace.copyFileWithPrompt", {
			options: options,
			filterId: filterId,
			errorHandlerId: errorId
		}).then((success) => {
			resolve(success);
			if (filterId in messageCallbacks) {
				delete messageCallbacks[filterId]
			}
			if (errorId in messageCallbacks) {
				delete messageCallbacks[errorId]
			}
		}, reject);
	});
	return result;
}

function registerWorkspaceFolderLauncher(id,launcherhandler)
{
	launcherCallbacks[id] = launcherhandler;
}

function specialFileOperate(options) {
	let result = new Promise((resolve, reject) => {
		hx.request("workspace.specialFileOperate", {
			options: options
		}).then((success) => {
			resolve(success);
		}, reject);
	});
	return result;
}

function showSubPackgeWindow(options) {
	let result = new Promise((resolve, reject) => {
		hx.request("workspace.showSubPackgeWindow", {
			options: options
		}).then((success) => {
			resolve(success);
		}, reject);
	});
	return result;
}
function fir_DidOpenTextDocumentEvent(){
	if(BeforeEventListeners["onDidOpenTextDocument"]){
		for(const event of BeforeEventListeners["onDidOpenTextDocument"]){
			event(...arguments);
		}		
	}		
	for(const event of documentListeners.onDidOpenTextDocument){
		event(...arguments);
	}
}
function fir_DidCloseTextDocumentEvent(){
	for(const event of documentListeners.onDidCloseTextDocument){
		event(...arguments);
	}
}
function fir_DidChangeTextDocumentEvent(){
	if(BeforeEventListeners["didChangeTextDocument"]){
		for(const event of BeforeEventListeners["didChangeTextDocument"]){
			event(...arguments);
		}		
	}
	var doc = arguments[0];
	if(docTranslator["didChangeTextDocument"]){
		doc = docTranslator["didChangeTextDocument"](doc);
	}
	let t = arguments;
	t[0] = doc;
	for(const event of documentListeners.didChangeTextDocument){
		event(t);
	}
}
module.exports = {
	assignDocTranslator,
	fir_DidOpenTextDocumentEvent,
	fir_DidChangeTextDocumentEvent,
	fir_DidCloseTextDocumentEvent,
	init: _init,
	fs: {},
	getWorkspaceFolders: getWorkspaceFolders,
	onDidChangeWorkspaceFolders: onDidChangeWorkspaceFolders,
	onDidChangeConfiguration: onDidChangeConfiguration,
	onWillSaveTextDocument: onWillSaveTextDocument,
	onDidChangeTextDocument: onDidChangeTextDocument,
	onDidSaveTextDocument: onDidSaveTextDocument,
	onDidOpenTextDocument: onDidOpenTextDocument,
	onDidCloseTextDocument,
	onDidRenameFiles,
	openTextDocument: openTextDocument,
	applyEdit: applyEdit,
	getWorkspaceFolder: getWorkspaceFolder,
	getConfiguration: getConfiguration,
	WorkspaceEdit: WorkspaceEdit,
	TextEdit,
	closeTextDocument: closeTextDocument,
	copyFileWithPrompt: copyFileWithPrompt,
	specialFileOperate: specialFileOperate,
	showSubPackgeWindow: showSubPackgeWindow,
	registerWorkspaceFolderLauncher:registerWorkspaceFolderLauncher,
	onBeforeEvent,		// 在所有事件之前调用
}
