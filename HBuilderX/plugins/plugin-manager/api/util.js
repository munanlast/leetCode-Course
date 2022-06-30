const hx = require("../hbxBridge.js")

function _init(connection) {
	
}

function readJSONValue(jsonfile,jsonpath) {
	let result = new Promise((resolve, reject) => {
		hx.request("util.readJSONValue", {
			jsonfile:jsonfile,
			jsonpath:jsonpath
		}
		).then((data)=>{
				resolve(data);
		},reject);
	});
	return result;
}

function writeJSONValue(jsonfile,jsonpath,jsonvalue) {
	let result = new Promise((resolve, reject) => {
		hx.request("util.writeJSONValue", {
			jsonfile:jsonfile,
			jsonpath:jsonpath,
			jsonvalue:jsonvalue
		}
		).then((data)=>{
				resolve(data);
		},reject);
	});
	return result;
}

module.exports = {
	init: _init,
	readJSONValue:readJSONValue,
	writeJSONValue:writeJSONValue
}
