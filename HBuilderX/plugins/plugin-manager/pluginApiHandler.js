const hbx = require("./hbxBridge.js");
const pluignApis = {};

function getPluginId(pluginFile,extensionsDir){
	let extensionFile = pluginFile.substring(extensionsDir.length+1);
	//将windows路径统一转换成macOS路径
	extensionFile = extensionFile.replace(new RegExp('\\\\','g'),'/');
	return extensionFile.split("/")[0];
}

function findPluginAPIImpl(pluginFile,extensionsDir){
	// /Users/xxx/HBuilderX.app/contents/HBuilderX/plugins/extension-test/test/test.js
	let pluginId = getPluginId(pluginFile,extensionsDir);
	if(pluginId in pluignApis){
		return pluignApis[pluginId];
	}
	let currentPluginApi = new Proxy({},{
		get:(apiRoot,name)=>{
			//hx.workspace,hx.workspace
			if(name in apiRoot){
				return apiRoot[name];
			}
			
			if(hbx[name] && hbx[name].__sandboxable){
				let baseModuleImpl = {
					_pluginId_:pluginId,
					_pluginFile_:pluginFile,
					__sandboxable:false
				};
				return apiRoot[name] = new Proxy(baseModuleImpl,{
					get:(secModule,apiName)=>{
						//不能重复代理
						if(apiName in secModule){
							return secModule[apiName];
						}
						let api = hbx[name][apiName];
						if(typeof api === 'function'){
							//将this环境指向代理类
							return api.bind(apiRoot[name]);
						}
						return api;
					}
				});
			}
			return hbx[name]
		}
	});
	return pluignApis[pluginId] = currentPluginApi;
}

function findVSCodePluginAPIImpl(pluginFile,extensionsDir){
	let hbxAPIImpl = findPluginAPIImpl(pluginFile,extensionsDir);
	let pid = getPluginId(pluginFile, extensionsDir);

	let vscodeAPIs =  require('./vscode/index.js');	
	let APIS = vscodeAPIs(pid, extensionsDir);	
	
	for(let apiName in APIS){
		hbxAPIImpl[apiName] = APIS[apiName];
	}
	
	// require('./vscode/bootstrap-amd').load('./vscode/index.js', (vs)=>{
	// 	let vscodeAPIs = vs.createVSCodeAPI();
	// 	for(let apiName in vscodeAPIs){
	// 		hbxAPIImpl[apiName] = vscodeAPIs[apiName];
	// 	}
	// });
	return hbxAPIImpl;
}

module.exports = {
	findPluginAPIImpl:findPluginAPIImpl,
	findVSCodePluginAPIImpl:findVSCodePluginAPIImpl
}