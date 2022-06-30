const hx = require("../hbxBridge.js")

function _init(connection) {
    
}

function log(message)
{
    let result = new Promise((resolve, reject) => {
    	hx.request("cliconsole.log",
    		message).then((data) => {
    		resolve(data);
    	}, reject);
    });
    
    return result
}

module.exports = {
    init:_init,
    log:log
}