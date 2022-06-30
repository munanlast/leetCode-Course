const hbx = require('./hbxBridge.js');
const qDebug = hbx.qDebug;
const constants = require('./constants.js');
const metatypes = require("./api/metatypes.js");
const { Disposable } = require('./api/lifecycle.js');
const path = require('path')
let plugins = {
};

//webpack打包时部分require不能被替换。
const requireFunc = (constants.inWebpackEnvironment) ? __non_webpack_require__ : require;
function PluginContext(id, pluginPath /** 有可能是调试时使用的路径，不一定是constants下定义的位置 */){
    this.subscriptions = [];
    this.id = id;
    this.extensionPath = pluginPath;
    this.asAbsolutePath = function(relativePath/* 插件的相对路径 */){        
        return path.join(pluginPath, relativePath);
    }
	this.workspaceState = {
		state:{},
		get(key,defaultVal){
			if(this.state.hasOwnProperty(key))
				return this.state[key]
			return defaultVal;
		},
		update(key,value){
			this.state[key] = value;
		}
	}
	this.extensionMode = 1;//Production = 1
	let developmentExtensions = process.env["EXTENSION_DEVELOPMENT_MODE"];
	if(developmentExtensions){
		let extensionIds = developmentExtensions.split("|");
		if(extensionIds.indexOf(id) >= 0){
			this.extensionMode = 2;//Development = 2
		}
	}
    this.dispose = function(){
        if(this.subscriptions.length > 0){
            let pluginId = this.id;
            this.subscriptions.forEach(function(item){
                if(item && item.dispose && typeof item.dispose === 'function'){
                    item.dispose();
                }
            });
        }
    };
}

function _init(connection){
	connection.onRequest("plugin/activate", function(param){
        try{
            return _activatePlugin(param);
        }catch(e){
            console.error(e);
        }
        return false;
	});
	//deactivate
	connection.onRequest("plugin/deactivate", function(param){
	    console.log("deactivate plugin:" + JSON.stringify(param));
	    return _deactivatePlugin(param);
	});
    
    connection.onRequest("plugin/invokeApi",function(param){
        let pluginId = param.pluginId;
        let fnName = param.fn;
        if(plugins[pluginId] 
            && plugins[pluginId].exports
            && plugins[pluginId].exports.hasOwnProperty(fnName)
            && (typeof plugins[pluginId].exports[fnName] == "function")){
            let apiFn = plugins[pluginId].exports[fnName];
            return apiFn(metatypes.newObject(param.args,true));
        }
        console.error("Plugin [" + pluginId + "] has no exports api:" + fnName + ".");
    });
    connection.onRequest("aboutToClosedWorkbench", function(event) {
        for(const pid in plugins){
            console.log('call deactive', pid);
            _deactivatePlugin({id:pid});
        }
    });
}

function _activatePlugin(pluginInfo){
    const id = pluginInfo.id;
    if(!id || id.length == 0){
        console.error("Must contains a valid id in plugin info!");
        return false;
    }
	let pluginsDir = constants.pluginsDir;
	let pluginPath = pluginsDir + '/' + id;
	if(pluginInfo.path){
		pluginPath = pluginInfo.path;
	}
	const plugin = requireFunc(pluginPath);
	if(!plugin || !plugin.activate){
		console.error("Not a valid plugin package.");
		return false;
	}
    if(plugin.activated){
        console.error(`Plugin [${id}] has already activated,won't activate again.`);
        return true;
    }
	plugins[id] = {
		instance:plugin,
		context:new PluginContext(id, pluginPath),
        path:pluginPath
	};
	if(plugin && plugin.activate && !plugin.activated ){
		let api = plugin.activate(plugins[id].context);
        if(api){
            plugins[id].exports = api;
        }
		plugin.activated = true;
	}
    return plugin.activated;
}

function _deactivatePlugin(pluginInfo){
    const id = pluginInfo.id;
    if(!id || id.length == 0){
        console.error("Must contains a valid id in plugin info!");
        return false;
    }
    try{
        const pluginBundle = plugins[id];
        if(!pluginBundle || !pluginBundle.instance){
            console.error("Not a valid plugin package.");
            return false;
        }
        let plugin = pluginBundle.instance;
        if(plugin && plugin.deactivate && plugin.activated){
            plugin.deactivate();
        }
        plugin.activated = false;
        pluginBundle.context.dispose();
        let pluginPath = plugins[id].path;
        plugins[id] = undefined;
        //要删除require的缓存，插件单独升级或者卸载重装时需要重新加载。
        delete requireFunc.cache[requireFunc.resolve(pluginPath)];
    }catch(e){
        //TODO handle the exception
        console.error(e.message, e.stack);
        return false;
    }
    return true;
}

function _getExtension(plugnId) {
    let api = plugins[plugnId];
    if(api)
    {
        return new Proxy(api.exports, {
            get: function(target, key) {
                if (key in target) {
                    return target[key];
                }
            }
        });
    }
    return undefined;
}

function existsPlugin(pluginId) {
   let result = new Promise((resolve, reject) => {
   	hbx.request("pluginmangerhost.existsPlugin",
   		{pluginId:pluginId}).then((data) => {
   		resolve(data);
   	}, reject);
   });
   return result
}

function installPlugin(pluginId) {
   let result = new Promise((resolve, reject) => {
   	hbx.request("pluginmangerhost.installPlugin",
   		{pluginId:pluginId}).then((data) => {
   		resolve(data);
   	}, reject);
   });
   return result
}

function onDidChange(didchange){
    return new Disposable(function(){
        didchange()
    })
}

function getAll(){
    // return packageJSON, id, extensionPath
    let ret = []    
    for(id in plugins){   
        let p_path = plugins[id].path
	    let pluginPathPackagJson = path.join(p_path ,"package.json")
		let packageJSON = requireFunc(pluginPathPackagJson)
		ret.push({
            packageJSON, id, extensionPath:p_path
        })
    }
    
    return ret;
}
module.exports = {
	init:_init,
    activatePlugin:_activatePlugin,
    deactivatePlugin:_deactivatePlugin,
    getExtension: _getExtension,
    onDidChange,
    all:getAll,
    existsPlugin:existsPlugin,
    installPlugin:installPlugin
};
