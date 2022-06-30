const net = require('net');


let connection;
function _init(_connection){
    connection = _connection;
    if(!connection){
        console.error("严重的错误：进程间通讯服务初始化失败。");
    }
	
	connection.onNotification("startHeartbeat",function(pid){
		//开始心跳检测
		_startHeartbeat(pid);
	});
    const pluginMgr = require("./pluginmanager.js");
	pluginMgr.init(_connection);
	
    const commandMgr = require("./api/commandmanager.js");
	commandMgr.init(_connection);
	
	const win = require("./api/workbenchwindow.js");
	win.init(_connection);
	
	const ws = require("./api/workspace.js");
	ws.init(_connection);
	
	const deviceManager = require("./api/deviceMgr.js");
	deviceManager.init(_connection);
	
	const languages = require("./vscode/languages.js");
	languages.init(_connection);
    
	const snippets = require("./services/SnippetService.js");
	snippets.init(_connection);
    
    const env = require("./api/env.js");
    env.init(_connection);
    
    const debug = require("./api/debugger.js");
    debug.init(_connection);
    
    const auth = require("./api/authorize.js");
    auth.init(_connection);
	
	const http = require("./api/http.js");
	http.init(_connection);
	
	const util = require("./api/util.js");
	util.init(_connection);
	
	const app = require("./api/app.js");
	app.init(_connection);
	
	const unicloud = require("./api/unicloud.js");
	unicloud.init(_connection);

    const scm = require("./api/hxscm.js");
    scm.init(_connection);

    const gitnative = require("./api/gitnative.js");
    gitnative.init(_connection);

    const vscode = require("./vscode/index.js");
    vscode("pluginmanager", __dirname).init(_connection);
    
    const cliconsole= require("./api/cliconsole.js");
    cliconsole.init(_connection);
}

function _request(method,params){
    //console.error("request " + method + " with params :" + JSON.stringify(params));
    return connection.sendRequest(method, params);
}

function _notifyEvent(event,data){
    connection.sendNotification(event, data);
}

function _onRequest(method,handler){
    connection.onRequest(method,handler);
}

function _onNotify(event,handler){
    connection.onNotification(event,handler);
}

function _qDebug(log) {
    connection.sendRequest("workbench.log", {
        level: "debug",
        log: log
    });
}
function _notifyStarted(){
    connection.sendNotification("started", true);
}

function _startHeartbeat(pid){
    var count = 0;
    function heartbeat(){
        var client = new net.Socket();
        client.connect(pid, function(){
            count = 0;
            client.destroy();
            setTimeout(heartbeat, 2000);
        });
        client.on('error',function(error){
            if(error.code === 'ENOENT'
                || error.code === 'ECONNREFUSED'){
                count++;
            }
			//只允许失败一次
            if(count > 1){
                process.exit(999);
            }else{
                setTimeout(heartbeat, 2000);
            }
        });
    }
    setTimeout(heartbeat, 2000);
}

let HBXProxy = {
    get: function(target, name) {
        if (name in target) {
            return target[name];
        }
        
        let getProperty = {
                     
            window: function() {
                let win = require("./api/workbenchwindow.js");
                return win;
            },
            workspace:function(){
                let ws = require("./api/workspace.js");
                return ws;
            },
			deviceMgr:function(){
				let deviceManager =require("./api/deviceMgr.js");
				return deviceManager;
			},
            commands:function(){
                let commands = require("./api/commandmanager.js");
                return commands;
            }, 
		   languages:function(){
			   let languages = require("./api/languages.js");
			   return languages;
		   }, 
            WorkspaceEdit:function(){
                let ws = require("./api/workspace.js");
                return ws.WorkspaceEdit;
            },
            TextEdit:function(){
                let ws = require("./api/workspace.js");
                return ws.TextEdit;
            },
            Uri: function() {
                let ws = require("./api/uri.js");
                return ws.default;
            },
            env :function(){
                let env = require("./api/env.js");
                return env;
            },
            debug:function(){
                let debug = require('./api/debugger.js');
                return debug;
            },
            EventEmitter: function() {
                let ws = require("./api/event.js");
                return ws.Emitter;
            },
            TreeDataProvider:function(){
                let treeModule = require("./api/treeview.js");
                return treeModule.TreeDataProvider;
            },
            CustomEditor: function () {
                return require("./api/customeditor.js");
            },
            authorize: function () {
                return require("./api/authorize.js");
            },
			http:function(){
				return require("./api/http.js");
			},
			util:function(){
				return require("./api/util.js");
			},
			app:function(){
				return require("./api/app.js");
			},
			unicloud:function(){
				return require("./api/unicloud.js");
			},
            extensions: function () {
                let e = require("./pluginmanager.js");
                return {
                    getExtension: function (plugnId) {
                        return e.getExtension(plugnId);
                    },
					existsPlugin: function (plugnId) {
					    return e.existsPlugin(plugnId);
					},
					installPlugin: function (plugnId) {
					    return e.installPlugin(plugnId);
					},
                    onDidChange:function(c){
                        return e.onDidChange(c);
                    }
                };
            },
            scm:function () {
                return require("./api/hxscm.js");
            },
            nls: function () {
                return require("./api/hxnls.js");
            },
            cliconsole: function () {
                return require("./api/cliconsole.js");
            }
        };
        if (name in getProperty) {
            let prop = getProperty[name]();
            //缓存下类型
            target[name] = prop;
            return prop;
        }
        return undefined;
    }
};

const hx = new Proxy({
    init:_init,
    qDebug:_qDebug,
    notifyStarted:_notifyStarted,
    request:_request,
    notifyEvent:_notifyEvent,
    onRequest:_onRequest,
    onNotify:_onNotify

},HBXProxy);

module.exports = hx;
