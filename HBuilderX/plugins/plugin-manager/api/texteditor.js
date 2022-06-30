const hx = require("../hbxBridge.js")
const metatypes = require("./metatypes.js");
const extTypes = require('vs/workbench/api/common/extHostTypes');

function Selection(options){
	this.active = options.active;
	this.anchor = options.anchor;
	this.start = Math.min(options.active,options.anchor);
	this.end = Math.max(options.active,options.anchor);
	this.isEmpty = function(){
		return this.active === this.anchor;
	}
}
Selection.prototype.metatype = "Selection";

function TextEdit(range, newText) {
	this.range = range;
	this.newText = newText;
}

TextEdit.replace = function(range, newText) {
	let replaceRange = range;
	if(typeof range === 'number'){
		replaceRange = {
			start:range,
			end:range
		}
	}else if(range.metatype && range.metatype === 'Selection'){
		replaceRange = {
			start:range.start,
			end:range.end
		}
	}
	return new TextEdit(replaceRange, newText);
}

function TextEditorEdit(){
	let edits = [];
	this.delete = function(range){
		edits.push(TextEdit.replace(range,''));
	}
	
	this.insert = function(pos,value){
		edits.push(TextEdit.replace(pos,value));
	}
	
	this.replace = function(pos,value){
		edits.push(TextEdit.replace(pos,value));
	}
	
	this.getEdits = function(){
		return edits;
	}
}

function toOffsetSelection(doc,selection){   
    return {
        active:doc.offsetAt(metatypes.newObject({...selection.active, 'metatype':'Position'})),
        anchor:doc.offsetAt(metatypes.newObject({...selection.anchor, 'metatype':'Position'}))
    }
}

function TextEditor(options){
    const docData = metatypes.newObject(options.document)
	this.document = docData;
    
    this.selection = new Selection(toOffsetSelection(this.document, options.selection));
    this.selections = [];
    if(options.selections){
    	for(let i = 0;i < options.selections.length;i++){
    		this.selections.push(new Selection(toOffsetSelection(this.document, options.selections[i])));
    	}
    }
	this.options = options.options;
    function getEditorId(){
        let uriKey = this.document.uri;
        if(typeof uriKey !== "string"){
            if(uriKey.fsPath){
                uriKey = uriKey.fsPath;
            }else{
                uriKey = uriKey.toString();
            }
        }
        return uriKey;
    }
    
	this.edit = function(callback){
		let editBuilder = new TextEditorEdit();
		callback(editBuilder);
        /**
         * @type {TextEdit[]}
         */
		let edits = editBuilder.getEdits();
		if (edits && edits.length > 0) {
			let uriKey = getEditorId.apply(this) ;
			let applyEdits = {};
            let editsAtPosition = edits.map(edit=>{
                return new TextEdit({
                    start:docData.positionAt(edit.range.start),
                    end:docData.positionAt(edit.range.end),
                },edit.newText);
            });
			applyEdits[uriKey] = editsAtPosition;
			hx.request("workspace.applyEdit",applyEdits);
		}
	}
    
    this.setSelection = function(active,anchor){
        return hx.request("texteditor.setSelection",{
            editorId:getEditorId.apply(this),
            active:docData.positionAt(active),
            anchor:docData.positionAt(anchor)
        });
    }
    this.addSelection = function(active,anchor){
        return hx.request("texteditor.addSelection",{
            editorId:getEditorId.apply(this),
            active:docData.positionAt(active),
            anchor:docData.positionAt(anchor)
        });
    }

	this.gotoLine = function(line) {
		return hx.request("texteditor.gotoLine", {
			editorId: getEditorId.apply(this),
			lineNum: line
		});
	}
}
TextEditor.prototype.metatype = "TextEditor";

metatypes.registerObject(TextEditor.prototype.metatype,TextEditor);
metatypes.registerObject(Selection.prototype.metatype,Selection);
metatypes.registerObject("TextDocumentWillSaveEvent",function(options){
	this.document = metatypes.newObject(options.document);
	this.reason = 1;
});
metatypes.registerObject("TextDocumentChangeEvent",function(options){
	this.document = metatypes.newObject(options.document);
	this.contentChanges = options.contentChanges;  
});
metatypes.registerObject("Uri", function(options){
	return new hx.Uri(options.scheme,options.authority,
		options.path,options.query,options.fragment);
});
module.exports = {
	Selection:Selection,
	TextEditor:TextEditor,
	TextEdit:TextEdit
}