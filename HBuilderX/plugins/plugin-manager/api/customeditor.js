const hx = require("../hbxBridge.js");

CustomDocumentEditEvent = class {
    constructor(document) {
        this.document = document;
    }
}

CustomEditorProvider = class{
    constructor(){
        this.onDidChangeCustomDocument = new hx.EventEmitter();
        this.onDidChangeCustomDocument.event(function (event) {
            if (event.document)
            {
                let message = { uri: event.document.uri, dirty: true };
                hx.request("window.customDocumentChanged", message);
            }
        });
    }
    openCustomDocument(uri){
        throw new Error("must implement openCustomDocument function.");
    }
    resolveCustomEditor(document, webViewPanel){
        throw new Error("must implement resolveCustomEditor function.");
    }
    saveCustomDocument(document){
        throw new Error("must implement saveCustomDocument function.");
    }
    saveCustomDocumentAs(document, destination){
        throw new Error("must implement saveCustomDocumentAs function.");
    }
}

CustomDocument = class{
    constructor(uri){
        this._uri = uri;
    }
    get uri(){
        return this._uri;
    }
    dispose(){
    }
}

module.exports = { CustomEditorProvider, CustomDocument, CustomDocumentEditEvent};