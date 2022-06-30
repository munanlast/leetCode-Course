const hx = require("../hbxBridge.js");
const metatypes = require("./metatypes.js");

function OutputChannel(name,view){
	this.name = name;
		
	let outView;
	this.show = function(){
		return view.show();
	}
	
	this.append = function(line){
        this.appendLine(line);
    }
	this.appendLine = function(line){
		let channelName = this.name;
		if(typeof(line)=="string")
		{
			view.appendLine({
				channel:channelName,
				line:line
			});
		}
		else
		{
			view.appendLine({
				channel:channelName,
				...line
			});
	    }
	}
}

ConsoleView = class {
    constructor(id, title) {
        this._id = id;
        this._title = title;
        this._hyperlinksid = 0;
        this._hyperlinks = {};
    }
    show() { //显示该控制台
        hx.request("window.showOutputView", {id:this._id,title: this._title});
    }

    close() { //关闭该控制台
        hx.request("window.closeOutputView", this._id);
        // hx.request("window.closeWebViewDialog", this._id);
    }
	
	createOutputChannel(channel){
		return new OutputChannel(channel,this);
	}

    appendLine(lineParams) {
        // hyperlinks
        /*
        Hyperlink{
         //超链接的位置，注意位置计算需要基于字节，不能基于字符
         linkPosition:Position{start:Number,end:Number}
         //点击超链接时需要执行的自定义动作函数
         onOpen:Function<void()>
         }
        */
        let links = {}
        if (lineParams.hyperlinks) {
            lineParams.hyperlinks.forEach(element => {
                links[this._hyperlinksid.toString()] = element.linkPosition;
                this._hyperlinks[this._hyperlinksid.toString()] = element;
                this._hyperlinksid++;
            });
        }
        let forceshow = true
        if(lineParams.forceshow != undefined){
            forceshow = lineParams.forceshow
        }
        let params = {
            id: this._id,
            title: this._title,
            line: lineParams.line,
            level: lineParams.level || "info",
			channel:lineParams.channel || "",
            forceshow,
            links: links
        }
		
        hx.request("window.appendLine", params);
    }
    fireonOpen(hyperid) {
        let openFunc = this._hyperlinks[hyperid].onOpen;
        if (!openFunc)
            throw new Error("can not fire onOpen event for:" + hyperid);
        this._hyperlinks[hyperid].onOpen()
    }

}
metatypes.registerObject("ConsoleView",function(obj){
	return new ConsoleView(obj.id,obj.title);
});
module.exports = ConsoleView;
