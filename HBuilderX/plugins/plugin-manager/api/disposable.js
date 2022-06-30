let retObject = function(callOnDispose){
	this.dispose = function(){
		callOnDispose();
	}	
}
retObject.from = function(...disposables){
	return function(){
		if(disposables.length){
			// 每一个都是一个disposable
			for(a in args){
				if(typeof args[a].dispose === 'function'){
					args[a].dispose()
				}
			}
			disposables = undefined
		}
	}}
module.exports = retObject