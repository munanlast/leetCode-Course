
const Disposable = require("./disposable.js");
let handleMap = new Map();

function _init(conn) {
    conn.onRequest("hxscm/execute", function (from) {
        executeCommand(from.id, from.params);
    });
}

function registerSCMHandler(command, callback, thisArg) {
    if (handleMap.has(command))
    {
        console.error("hx scm handle command [" + command + "] already exists.");
        return;
    }
    if(thisArg){
        callback = callback.bind(thisArg);
    }
    handleMap.set(command, callback)

    return new Disposable(function() {
        handleMap.delete(command);
    });
}

function executeCommand(id, params) {
    if (handleMap.has(id)) {
        handleMap.get(id)(params);
    }
}

module.exports = {
    init: _init,
    registerSCMHandler: registerSCMHandler
}