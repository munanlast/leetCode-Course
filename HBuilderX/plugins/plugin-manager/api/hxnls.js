
const nls = require("vscode-nls");

function _init(connection){
	
}

function _config(opt) {
    return nls.config(opt);
}

function _loadMessageBundle(file) {
    return nls.loadMessageBundle(file);
}

module.exports = {
    config: _config,
	init: _init,
    loadMessageBundle: _loadMessageBundle,
    MessageFormat: nls.MessageFormat,
    BundleFormat: nls.BundleFormat
}