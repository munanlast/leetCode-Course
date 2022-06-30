const hx = require("../hbxBridge.js");
const Disposable = require("./disposable.js");

let authorizeListeners = {
    onLogin : [],
    onLogout : []
}

function _init(_connection) {
    _connection.onRequest("authorize/userLogin", function (params) {
        console.log("authorize/userLogin");
        let listeners = authorizeListeners["onLogin"];
        for (let i = 0; i < listeners.length; i++) {
            let listener = listeners[i];
            if (listener) {
                listener();
            }
        }
    });
    _connection.onRequest("authorize/userLogout", function (params) {
        console.log("authorize/userLogout");
        let listeners = authorizeListeners["onLogout"];
        for (let i = 0; i < listeners.length; i++) {
            let listener = listeners[i];
            if (listener) {
                listener();
            }
        }
    });
}


function _onUserLogin(listener) {
    authorizeListeners.onLogin.push(listener);
    return new Disposable(function () {
        let index = authorizeListeners.onLogin.indexOf(listener);
        if (index > -1) {
            authorizeListeners.onLogin.splice(index, 1);
        }
    });
}

function _onUserLogout(listener) {
    authorizeListeners.onLogout.push(listener);
    return new Disposable(function () {
        let index = authorizeListeners.onLogout.indexOf(listener);
        if (index > -1) {
            authorizeListeners.onLogout.splice(index, 1);
        }
    });
}

function _authorize_login(option){
    var file = this._pluginFile_;
    var data = {from:file, options: option};
    return hx.request("authorize.login", data);
}

module.exports = {
    init: _init,
	__sandboxable:true,
    login: _authorize_login,
    onUserLogin : _onUserLogin,
    onUserLogout : _onUserLogout
}