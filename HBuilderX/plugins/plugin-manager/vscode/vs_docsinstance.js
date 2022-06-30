const {ExtHostDocumentsAndEditors} = require("./vs_docsandeditors");
const hx = require('../hbxBridge.js');
const typeConverters = require('vs/workbench/api/common/extHostTypeConverters');
var instance;
class Proxy{
	// insertSnippet(snippet: SnippetString, location?: Position | Range | Position[] | Range[], options?: { undoStopBefore: boolean; undoStopAfter: boolean; }): Thenable<boolean>;
	// return this._proxy.$tryInsertSnippet(this.id, snippet.value, ranges, options);
	/**
		 * A snippet string is a template which allows to insert text
		 * and to control the editor cursor when insertion happens.
		 *
		 * A snippet can define tab stops and placeholders with `$1`, `$2`
		 * and `${3:foo}`. `$0` defines the final tab stop, it defaults to
		 * the end of the snippet. Variables are defined with `$name` and
		 * `${name:default value}`. The full snippet syntax is documented
		 * [here](http://code.visualstudio.com/docs/editor/userdefinedsnippets#_creating-your-own-snippets).
		 */
	$tryInsertSnippet(id/*string*/, template/*string*/, ranges/*readonly IRange[]*/, opts/*IUndoStopOptions*/){
		// 在extHostTextEditor里已经都转成range了
		let hostRange = ranges.map(typeConverters.Range.to)
		console.log(hostRange);
		return hx.request("documentsAndEditors.tryInsertSnippet",[id, template, hostRange, opts]);
	}
}
(function(inst){
	if(!inst.docs)
		inst.docs = new ExtHostDocumentsAndEditors(new Proxy);
	
    module.exports = inst;
})(instance || {});