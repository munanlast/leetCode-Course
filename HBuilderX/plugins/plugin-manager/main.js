
const rpc = require("vscode-jsonrpc");
const hx = require('./hbxBridge.js');
const constants = require('./constants.js');
const pluginApiHandler = require('./pluginApiHandler.js');
const path = require('path')
var args = process.argv.slice(2);
var pipeName;
//判断是否基于管道进程通讯
if(args && args.length == 2 && args[0] == "--pipe-name"){
	pipeName = args[1];
}
//替换全局require
var $Module = require('module');
var $originalRequire = $Module.prototype.require;
$Module.prototype.require = function(module) {
    return $originalRequire.apply(this, arguments);
};

const internalLoad = $Module._load;
$Module._load = function (request, parent, isMain){
	if (request === 'hbuilderx'){
		//定义全局模块hbuilderx
		let file = parent.filename;
		return pluginApiHandler.findPluginAPIImpl(file,constants.pluginsDir);
	}
	else if(request === 'vscode'){
		//定义全局模块兼容vscode
		let file = parent.filename;		
		return pluginApiHandler.findVSCodePluginAPIImpl(file,constants.pluginsDir);
	}
	else if (request === 'hxnls') {
		return hx.nls;
	}
	else if(request.startsWith('vs/') || request.startsWith('./vs/')){
		let r = request.replace('vs/', 'vscode/');		
		request = path.join(__dirname, r)
		// console.error(request);
		return internalLoad.apply(this, [request, parent, isMain]);
	}
	return internalLoad.apply(this, arguments);
};

if(!constants.inWebpackEnvironment){
	require('./vs/amd-loader');
}

let readerWriter;
if(pipeName && pipeName.length > 0){
	readerWriter = rpc.createServerPipeTransport(pipeName);
	// console.log("use pipe transport:" + pipeName);
}else{
	readerWriter = [
		new rpc.StreamMessageReader(process.stdin),
		new rpc.StreamMessageWriter(process.stdout)
	]
	// console.error("use stdio transport.");
}
//通过stdio建立jsonrpc通讯协议
let connection = rpc.createMessageConnection(readerWriter[0],readerWriter[1]);
hx.init(connection);
connection.listen();
hx.notifyStarted();

//以下处理逻辑，防止未处理的异常发生导致node进程崩溃
//拦截默认的流错误处理
process.on('uncaughtException', (err) => {
    console.error(err);
});
//拦截默认的Promise错误处理
process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
});
