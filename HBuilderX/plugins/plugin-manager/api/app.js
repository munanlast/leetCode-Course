const hx = require("../hbxBridge.js")

let callbacks = {};

function _init(connection) {
	connection.onRequest("app/execService", function(params){
		if (params.id in callbacks) {
			return callbacks[params.id](params.data);
		}
	})
}

function registService(id,handler) {
	console.log('id'+id);
	console.log('handler'+handler);
	if(id == null)
	{
		console.log('id is null')
	}
	
	if(handler == null)
	{
		console.log('handler is null')
	}
	
	if( id != null && handler != null)
	{
		if(callbacks[id] == undefined)
		{
			callbacks[id] = handler;
		}
		else
		{
			console.log('id is exists')
		}
	}
}

function getMobileList(options) {
	let result = new Promise((resolve, reject) => {
		hx.request("appHost.getMobileList", {
			options: options
		}).then((success) => {
			resolve(success);
		}, reject);
	});
	return result;
}

module.exports = {
	init: _init,
	registService:registService,
	getMobileList: getMobileList
}