const hx = require("../hbxBridge.js");

function _init(_connection) {

}
function _request(options){
	options._pluginId_ = this._pluginId_;
	return new Promise((resolve, reject) => {
		let result = hx.request("http.request",options);
		result.then((res)=>{
			if(res.error){
				reject({
					error:res.error
				});
			}else{
				resolve(res);
			}
		},reject);
	});
}
module.exports = {
    init: _init,
    request: _request,
	__sandboxable:true
}