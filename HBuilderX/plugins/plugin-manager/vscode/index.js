let extTypes = require('vs/workbench/api/common/extHostTypes');
const { IndentAction } = require("vs/editor/common/modes/languageConfiguration");
const cancellation = require("vs/base/common/cancellation")
let hxlanguages = require('./languages.js');
const extHostWorkspace = require('../api/workspace.js')
const extHostDiagnostics = require('./languages.js');
const {docs} = require("./vs_docsinstance.js");
const {Disposable, DisposableStore} = require("./base/common/lifecycle");
const metatypes = require("../api/metatypes.js");
const typeConverters = require('vs/workbench/api/common/extHostTypeConverters');
const fsw = require("./vs_fswinst");
const hx = require('../hbxBridge.js');
const extHostEnv = require("../api/env.js");
const uri_1 = require("vs/base/common/uri");
const range_1 = require("vs/editor/common/core/range");
const texteditor = require('../api/texteditor.js');
// let extHostLanguagesFeatures = require('./vscode/workbench/api/common/extHostLanguageFeatures.js')
// const extentions = require('./base/common')
var ModuleLoader;
if(typeof ModuleLoader != 'undefined'){
	module.exports = function(extid, extdir){
		return ModuleLoader;
	}
	return;
}
(function(loader){
	if(!loader)
		loader = {
			api:undefined
		};        
	loader._toDispose = new DisposableStore();
	
    
	

	const languages = {
		...hxlanguages,		
		createDiagnosticCollection(name/* ?: string */)/* : vscode.DiagnosticCollection */ {
			return extHostDiagnostics.createDiagnosticCollection(/* extension.identifier, */ name);
		},
		// get onDidChangeDiagnostics() {
		// 	return extHostDiagnostics.onDidChangeDiagnostics;
		// },
		getDiagnostics: (resource/* ?: vscode.Uri */) => {
			return extHostDiagnostics.getDiagnostics(resource);
		},
		// getLanguages(): Thenable<string[]> {
		// 	return extHostLanguages.getLanguages();
		// },
		// setTextDocumentLanguage(document: vscode.TextDocument, languageId: string): Thenable<vscode.TextDocument> {
		// 	return extHostLanguages.changeLanguage(document.uri, languageId);
		// },
		// match(selector: vscode.DocumentSelector, document: vscode.TextDocument): number {
		// 	return score(typeConverters.LanguageSelector.from(selector), document.uri, document.languageId, true);
		// },
		// registerCodeActionsProvider(selector: vscode.DocumentSelector, provider: vscode.CodeActionProvider, metadata?: vscode.CodeActionProviderMetadata): vscode.Disposable {
		// 	return extHostLanguageFeatures.registerCodeActionProvider(extension, checkSelector(selector), provider, metadata);
		// },
		// registerCodeLensProvider(selector: vscode.DocumentSelector, provider: vscode.CodeLensProvider): vscode.Disposable {
		// 	return extHostLanguageFeatures.registerCodeLensProvider(extension, checkSelector(selector), provider);
		// },
		// registerDefinitionProvider(selector: vscode.DocumentSelector, provider: vscode.DefinitionProvider): vscode.Disposable {
		// 	return extHostLanguageFeatures.registerDefinitionProvider(extension, checkSelector(selector), provider);
		// },
		// registerDeclarationProvider(selector: vscode.DocumentSelector, provider: vscode.DeclarationProvider): vscode.Disposable {
		// 	return extHostLanguageFeatures.registerDeclarationProvider(extension, checkSelector(selector), provider);
		// },
		// registerImplementationProvider(selector: vscode.DocumentSelector, provider: vscode.ImplementationProvider): vscode.Disposable {
		// 	return extHostLanguageFeatures.registerImplementationProvider(extension, checkSelector(selector), provider);
		// },
		// registerTypeDefinitionProvider(selector: vscode.DocumentSelector, provider: vscode.TypeDefinitionProvider): vscode.Disposable {
		// 	return extHostLanguageFeatures.registerTypeDefinitionProvider(extension, checkSelector(selector), provider);
		// },
		// registerHoverProvider(selector: vscode.DocumentSelector, provider: vscode.HoverProvider): vscode.Disposable {
		// 	return extHostLanguageFeatures.registerHoverProvider(extension, checkSelector(selector), provider, extension.identifier);
		// },
		// registerEvaluatableExpressionProvider(selector: vscode.DocumentSelector, provider: vscode.EvaluatableExpressionProvider): vscode.Disposable {
		// 	return extHostLanguageFeatures.registerEvaluatableExpressionProvider(extension, checkSelector(selector), provider, extension.identifier);
		// },
		// registerInlineValuesProvider(selector: vscode.DocumentSelector, provider: vscode.InlineValuesProvider): vscode.Disposable {
		// 	checkProposedApiEnabled(extension);
		// 	return extHostLanguageFeatures.registerInlineValuesProvider(extension, checkSelector(selector), provider, extension.identifier);
		// },
		// registerDocumentHighlightProvider(selector: vscode.DocumentSelector, provider: vscode.DocumentHighlightProvider): vscode.Disposable {
		// 	return extHostLanguageFeatures.registerDocumentHighlightProvider(extension, checkSelector(selector), provider);
		// },
		// registerLinkedEditingRangeProvider(selector: vscode.DocumentSelector, provider: vscode.LinkedEditingRangeProvider): vscode.Disposable {
		// 	return extHostLanguageFeatures.registerLinkedEditingRangeProvider(extension, checkSelector(selector), provider);
		// },
		// registerReferenceProvider(selector: vscode.DocumentSelector, provider: vscode.ReferenceProvider): vscode.Disposable {
		// 	return extHostLanguageFeatures.registerReferenceProvider(extension, checkSelector(selector), provider);
		// },
		// registerRenameProvider(selector: vscode.DocumentSelector, provider: vscode.RenameProvider): vscode.Disposable {
		// 	return extHostLanguageFeatures.registerRenameProvider(extension, checkSelector(selector), provider);
		// },
		// registerDocumentSymbolProvider(selector: vscode.DocumentSelector, provider: vscode.DocumentSymbolProvider, metadata?: vscode.DocumentSymbolProviderMetadata): vscode.Disposable {
		// 	return extHostLanguageFeatures.registerDocumentSymbolProvider(extension, checkSelector(selector), provider, metadata);
		// },
		// registerWorkspaceSymbolProvider(provider: vscode.WorkspaceSymbolProvider): vscode.Disposable {
		// 	return extHostLanguageFeatures.registerWorkspaceSymbolProvider(extension, provider);
		// },
		// registerDocumentFormattingEditProvider(selector: vscode.DocumentSelector, provider: vscode.DocumentFormattingEditProvider): vscode.Disposable {
		// 	return extHostLanguageFeatures.registerDocumentFormattingEditProvider(extension, checkSelector(selector), provider);
		// },
		// registerDocumentRangeFormattingEditProvider(selector: vscode.DocumentSelector, provider: vscode.DocumentRangeFormattingEditProvider): vscode.Disposable {
		// 	return extHostLanguageFeatures.registerDocumentRangeFormattingEditProvider(extension, checkSelector(selector), provider);
		// },
		// registerOnTypeFormattingEditProvider(selector: vscode.DocumentSelector, provider: vscode.OnTypeFormattingEditProvider, firstTriggerCharacter: string, ...moreTriggerCharacters: string[]): vscode.Disposable {
		// 	return extHostLanguageFeatures.registerOnTypeFormattingEditProvider(extension, checkSelector(selector), provider, [firstTriggerCharacter].concat(moreTriggerCharacters));
		// },
		// registerDocumentSemanticTokensProvider(selector: vscode.DocumentSelector, provider: vscode.DocumentSemanticTokensProvider, legend: vscode.SemanticTokensLegend): vscode.Disposable {
		// 	return extHostLanguageFeatures.registerDocumentSemanticTokensProvider(extension, checkSelector(selector), provider, legend);
		// },
		// registerDocumentRangeSemanticTokensProvider(selector: vscode.DocumentSelector, provider: vscode.DocumentRangeSemanticTokensProvider, legend: vscode.SemanticTokensLegend): vscode.Disposable {
		// 	return extHostLanguageFeatures.registerDocumentRangeSemanticTokensProvider(extension, checkSelector(selector), provider, legend);
		// },
		// registerSignatureHelpProvider(selector: vscode.DocumentSelector, provider: vscode.SignatureHelpProvider, firstItem?: string | vscode.SignatureHelpProviderMetadata, ...remaining: string[]): vscode.Disposable {
		// 	if (typeof firstItem === 'object') {
		// 		return extHostLanguageFeatures.registerSignatureHelpProvider(extension, checkSelector(selector), provider, firstItem);
		// 	}
		// 	return extHostLanguageFeatures.registerSignatureHelpProvider(extension, checkSelector(selector), provider, typeof firstItem === 'undefined' ? [] : [firstItem, ...remaining]);
		// },
		registerCompletionItemProvider(selector, provider, triggerCharacters) {
			//TODO 转发到该模块自己的实现，此处的目的是为了创建一个新的API，防止该API被插件覆盖。
			// return extHostLanguagesFeatures.registerCompletionItemProvider(undefined, selector, provider, triggerCharacters);
			return hxlanguages.registerCompletionItemProvider(selector, provider, triggerCharacters);
		},
		 registerDocumentLinkProvider(selector/* : vscode.DocumentSelector */, provider/* : vscode.DocumentLinkProvider */)/* : vscode.Disposable */ {
		 	// return extHostLanguagesFeatures.registerDocumentLinkProvider(undefined, selector, provider);
            return hxlanguages.registerDocumentLinkProvider(selector, provider);
		 },
		// registerColorProvider(selector: vscode.DocumentSelector, provider: vscode.DocumentColorProvider): vscode.Disposable {
		// 	return extHostLanguageFeatures.registerColorProvider(extension, checkSelector(selector), provider);
		// },
		// registerFoldingRangeProvider(selector: vscode.DocumentSelector, provider: vscode.FoldingRangeProvider): vscode.Disposable {
		// 	return extHostLanguageFeatures.registerFoldingRangeProvider(extension, checkSelector(selector), provider);
		// },
		// registerSelectionRangeProvider(selector: vscode.DocumentSelector, provider: vscode.SelectionRangeProvider): vscode.Disposable {
		// 	return extHostLanguageFeatures.registerSelectionRangeProvider(extension, selector, provider);
		// },
		// registerCallHierarchyProvider(selector: vscode.DocumentSelector, provider: vscode.CallHierarchyProvider): vscode.Disposable {
		// 	return extHostLanguageFeatures.registerCallHierarchyProvider(extension, selector, provider);
		// },
		setLanguageConfiguration: function (language/* : string */, configuration/* : vscode.LanguageConfiguration */)/* : vscode.Disposable =>  */{
			// return extHostLanguageFeatures.setLanguageConfiguration(undefined, language, configuration);
			//return languages.setLanguageConfiguration(language,)
			return hxlanguages.setLanguageConfiguration(language, configuration);
		},
		
		// getTokenInformationAtPosition(doc: vscode.TextDocument, pos: vscode.Position) {
		// 	checkProposedApiEnabled(extension);
		// 	return extHostLanguages.tokenAtPosition(doc, pos);
		// },
		// registerInlineHintsProvider(selector: vscode.DocumentSelector, provider: vscode.InlineHintsProvider): vscode.Disposable {
		// 	checkProposedApiEnabled(extension);
		// 	return extHostLanguageFeatures.registerInlineHintsProvider(extension, selector, provider);
		// }
	};

	let e = require("../pluginmanager.js");
	const extentions = {
		getExtension: function (plugnId) {
			return e.getExtension(plugnId);
		},
		get onDidChange(){
			return e.onDidChange;
		},
		get all(){
			return ["",""]
		}
	};
	// const tasks = require("./task.js");
	// var workspace;
	// function initWorkspace(){
	
	var internal_workspaceFolders = []

	function syncWorkspaceFolders(){
		workspace.getWorkspaceFolders().then((lst)=>{
			internal_workspaceFolders = lst.map(o => {
				return metatypes.newObject(o)			
			})
		})
	}

	extHostWorkspace.assignDocTranslator("didChangeTextDocument", (doc)=>{
		const resource = uri_1.URI.revive(doc.document.uri);			
		const dtext = docs.getDocument(resource);
		return {
			...doc,
			document:dtext.document
		}
	})
	const	workspace = {
			...extHostWorkspace,
			onDidRenameFiles(listener, thisArgsOption, disposableOption){
				if(thisArgsOption){
					return extHostWorkspace.onDidRenameFiles(listener.bind(thisArgsOption));
				}
				return extHostWorkspace.onDidRenameFiles(listener,thisArgsOption,disposableOption);
			},
			createFileSystemWatcher(pattern, ignoreCreate, ignoreChange, ignoreDelete){
				return fsw.extHostFileSystemEvent.createFileSystemWatcher(typeConverters.GlobPattern.from(pattern), ignoreCreate, ignoreChange, ignoreDelete);
			},
			get textDocuments(){
				let newdocs = [];
				for(const docData of docs.allDocuments()){
					newdocs.push(docData.document);
				}
				return newdocs;
			},
			onDidOpenTextDocument: function (listener, thisArgsOption, disposableOption) {
				if(thisArgsOption){
					return extHostWorkspace.onDidOpenTextDocument(listener.bind(thisArgsOption));
				}
				return extHostWorkspace.onDidOpenTextDocument(listener,thisArgsOption,disposableOption);
			},
			onDidChangeTextDocument(listener, thisArgsOption, disposableOption){
				if(thisArgsOption){
					return extHostWorkspace.onDidChangeTextDocument(listener.bind(thisArgsOption));
				}
				return extHostWorkspace.onDidChangeTextDocument(listener,thisArgsOption,disposableOption);
			},
			onDidCloseTextDocument(listener, thisArgsOption, disposableOption){
				if(thisArgsOption){
					return extHostWorkspace.onDidCloseTextDocument(listener.bind(thisArgsOption));
				}
				return extHostWorkspace.onDidCloseTextDocument(listener,thisArgsOption,disposableOption);
			},
			get workspaceFolders(){		
				// console.log('================',JSON.stringify(internal_workspaceFolders))
				return internal_workspaceFolders;
			}
		}

	
	function vsTextDocumentContentChangeEvent(opt) {
		return opt;
	}
	metatypes.registerObject("TextDocumentContentChangeEvent", vsTextDocumentContentChangeEvent);
	// }
	// function initDidAddDocument(connection){
		
	function onDocumentsAndEditorsDelta(delta){
		console.log("[onDocumentsAndEditorsDelta]");
		if(delta.addedDocuments){
			let newLangDoc = delta.addedDocuments.map((o)=>{
				var newid = o.modeId
				newid = hxlanguages.matchLangId(newid)
				return {
					...o,
					modeId:newid,
					debugpath:o.uri.fsPath
				}
			});
			delta.addedDocuments = newLangDoc;
			// console.log("[onDocumentsAndEditorsDelta] add:", newLangDoc);
		}
		if(delta.newActiveEditor === ''){
			delta.newActiveEditor = undefined;
		}
		docs.acceptDocumentsAndEditorsDelta(delta);
	}
	// function onDocumentUpdate(document){
	// 	let d = docs.getDocument(document);
	// 	if(d){
	// 		workspace.fir_DidChangeTextDocumentEvent(d);
	// 	}
	// }
	docs.onDidAddDocuments(docs=>{
		for(const data of docs){
			workspace.fir_DidOpenTextDocumentEvent(data.document);
		}
	}, undefined, loader._toDispose);
    
    docs.onDidRemoveDocuments(docs=>{
    	for(const data of docs){
    		workspace.fir_DidCloseTextDocumentEvent(data.document);
    	}
    }, undefined, loader._toDispose);
	
	let window = require("../api/workbenchwindow.js");
	
	let newWindow = {
		...window,
		get visibleTextEditors(){
			return docs.allEditors();
		},
		get activeTextEditor(){
			return docs.activeEditor();
		},
		onDidChangeVisibleTextEditors(listener){
			//TODO 需要实现
			// console.error("该方法需要实现！！！");
			docs.onDidChangeVisibleTextEditors(listener);
		},
		withProgress:function(opt, disposableOption){
			console.log('withProgress', opt);
		},
		onDidChangeActiveTextEditor:function(listener, thisArgsOption, disposableOption){
			/*
			if(thisArgsOption){
				windowEvents.DidChangeActiveTextEditor.push(listener.bind(thisArgsOption));
			}else{
				windowEvents.DidChangeActiveTextEditor.push(listener);
			}
			return new Disposable(function() {
				let index = windowEvents.DidChangeActiveTextEditor.indexOf(listener);
				if (index > -1) {
					windowEvents.DidChangeActiveTextEditor.splice(index, 1);
				}
			});
			*/
			docs.onDidChangeActiveTextEditor(listener, thisArgsOption, disposableOption);
		},
		updateActiveTextEditor:function(textEditor){			
			let ae = docs.activeEditor();
			if(!ae) return "none";
			
			ae.selections = textEditor.selections.map((o)=>{
				const start = new extTypes.Position(o.start.line, o.start.character);
            	const end = new extTypes.Position(o.end.line, o.end.character);
				return new extTypes.Selection(start, end)
			});	
			ae.options = textEditor.options;
			docs._onDidChangeActiveTextEditor.fire(ae);
			return "done";
		}
	}
	function init(connection){
		// initWorkspace();
		// initDidAddDocument(connection);	
		fsw.init(connection);
		connection.onNotification('syncworkspacefolders', (...lst)=>{
			internal_workspaceFolders = lst.map(o => {
				return metatypes.newObject(o)			
			})
		});
		connection.onRequest('vscode/onDocumentsAndEditorsDelta', onDocumentsAndEditorsDelta);
		// connection.onRequest('vscode/onUpdateDocument', onDocumentUpdate);
		workspace.onBeforeEvent("onDidOpenTextDocument", ()=>{
			syncWorkspaceFolders();
		});
		workspace.onBeforeEvent("onDidChangeWorkspaceFolders",()=>{
			syncWorkspaceFolders();
		});
		// workspace.onBeforeEvent("onDidRenameFiles",(e)=>{
		// 	let files = e.files;
		// 	docs.rename(files[0].newUri, files[0].oldUri);
		// });
		workspace.onBeforeEvent("didChangeTextDocument",(doc)=>{
			const resource = uri_1.URI.revive(doc.document.uri);			
			const dtext = docs.getDocument(resource);
			if(dtext.version + 1 != doc.document.version){
				hx.request("documentsAndEditors.reopen", doc.document.uri);
				return;
			}
			let e = {
				eol:doc.document.eol == 1?'\n':'\r\n',
				changes:doc.contentChanges.map(o=>{return {
					range:
				new range_1.Range(
				o.range.start.line + 1, 
				o.range.start.character + 1, 
				o.range.end.line + 1, 
				o.range.end.character + 1),
				text:o.text
				}}),
				versionId:doc.document.version			
			}
			console.log('event:', JSON.stringify(doc.contentChanges))
			dtext.onEvents(e);
			// console.log(dtext.getText())

		}, undefined, loader._toDispose);
		languages.setWorkSpaceOpenCloseCall(workspace.fir_DidOpenTextDocumentEvent.bind(workspace), workspace.fir_DidCloseTextDocumentEvent.bind(workspace));
		connection.onRequest("updateActiveTextEditor", 
			newWindow.updateActiveTextEditor
		);
		connection.onRequest("language/getDocumentText",async function(td){
			const resource = uri_1.URI.revive(td.document.uri);
			const dtext = docs.getDocument(resource);
            return dtext.getText();
		});
	}
	
	let newEnv = {
		...extHostEnv,
		language:'en'
	}
	loader = {
		get version(){
			return "1.52.0"; // 这个值会在/node_modules/vscode-languageclient/lib/node/main.js 下的 checkVersion中使用
		},
		init,
		languages: languages,
		IndentAction: IndentAction,
		extentions,
		// tasks,
		workspace,
		CancellationTokenSource:cancellation.CancellationTokenSource,
		...extTypes,
		window:newWindow,
		env:newEnv
	}
    let extentionInfo = {
        
    }
	
	module.exports = function(extid, dir){
        extentionInfo.extensionId = extid;
        extentionInfo.extensionDir = dir;
        loader.languages.setExtensionInfoCallBack(function(){
            return extentionInfo;
        });
        
		return loader;
	}
})(ModuleLoader)

