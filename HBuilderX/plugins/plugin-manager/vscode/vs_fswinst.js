const { ExtHostFileSystemEventService } = require("./vs_filesystemeventservice.js");
const typeConverters = require('./workbench/api/common/extHostTypeConverters');
var instance;
class Proxy{
	constructor(conn){
        this.connection = conn;        
    }
    connectFileOperation(fo, thisArg){        
        this.connection.onNotification("FileSystemWatcher/$onFileEvent", fo.bind(thisArg));
    }
}
(function(inst){
    if(!inst.init){	
        inst.init = function(conn){
            if(!this.extHostFileSystemEvent)
                this.extHostFileSystemEvent = new ExtHostFileSystemEventService(new Proxy(conn))
        }
    }
    module.exports = inst;
})(instance || {});