var hx = require("hbuilderx");
var fs = require("fs")
var os = require("os")
var hjson = require("./hjson.min.js");
const nls = require("hxnls");
const localize = nls.loadMessageBundle(__filename);
function getProjectPublishData(type, projectId) {
	if (!projectId) {
		return;
	}
	
	if (!type) {
		return;
	}
	projectId = projectId + "-" + type;
	
	let publishPath = os.tmpdir();
	publishPath = publishPath + "/publish_uni.json";
	if (projectId && fs.existsSync(publishPath)) {
		let readData = fs.readFileSync(publishPath);
		let jsonData = JSON.parse(readData);
		let projectData = jsonData['' + projectId + ''];
		if (projectData) {
				return {
					name: projectData.name,
					appid: projectData.appid,
					behavior:projectData.behavior
				};
		}
	}
	
	return;
}
function saveProjectPublishData(type, projectId,name,appid,behavior) {
	if (!projectId) {
		return;
	}
	
	if (!type) {
		return;
	}
	projectId = projectId + "-" + type;
	
	let publishPath = os.tmpdir();
	publishPath = publishPath + "/publish_uni.json";
	if(projectId)
	{
		let jsonData;
		if( projectId &&  fs.existsSync(publishPath))
		{
		  let readData = fs.readFileSync(publishPath);
		  jsonData = JSON.parse(readData);
		}
		if(!jsonData)
		{
			jsonData = {};
		}
		
		let json = {name:name,appid:appid,behavior:behavior};
		jsonData[''+projectId+'']  = json;;
		let data = JSON.stringify(jsonData,null,'\t');;
		fs.writeFileSync(publishPath,data);
	}
	
	return;
}
function compile(data) {
	let result = new Promise((resolve, reject) => {
		hx.request("MainHostPublish.compile", data).then((param) => {
			resolve(param);
		}, reject);
	});
	
	return result;
}
function getFormItems(formData) {
	let larkPublish = localize(0, null);
	let nameInputPlaceholder = localize(1, null);
	let appidInputPlaceholder = localize(2, null);
	let behaviorText = localize(3, null);
	let subPackgeInputPlaceholder = localize(4, null);
	let footerText = localize(5, null);
	let forms = {
		title: larkPublish,
		hideSubTitile: true,
		width: 600,
		height: 200,
		footer: footerText,
		formItems: [{
				type: "input",
				name: "nameInput",
				placeholder: nameInputPlaceholder,
				value: formData.nameInput ? formData.nameInput : ""
			},
			{
				type: "input",
				name: "appidInput",
				placeholder: appidInputPlaceholder,
				value: formData.appidInput ? formData.appidInput : ""
			},
			{
				type: "checkBox",
				name: "behaviorCheckBox",
				label: behaviorText,
				value: formData.behaviorCheckBox ? formData.behaviorCheckBox : false
			},
			{
				type: "input",
				name: "subPackgeInput",
				placeholder: subPackgeInputPlaceholder,
				isHidden: formData.behaviorCheckBox && formData.behaviorCheckBox == true ? false : true
			},
		].map((item) => {
			if (item && !item.isHidden) {
				return item;
			}
		})
	};
	
	return forms;
}
//该方法将在插件激活的时候调用
function activate(context) {
	let disposable = hx.workspace.registerWorkspaceFolderLauncher('uniapp.publish.flyingBook', (params) => {
		let spaceFolder = params.workspaceFolder;
		let historyData  = getProjectPublishData("publish.flyingBook",spaceFolder.id);
		let nameInput;
		if(historyData && historyData.name)
		{
			nameInput = historyData.name;
		}
		
		if(!nameInput && spaceFolder)
		{
			nameInput = spaceFolder.name;
		}
		
		let appidInput;
		if(historyData && historyData.appid)
		{
			appidInput = historyData.appid;
		}
		if(!appidInput && spaceFolder && spaceFolder.uri)
		{
			let mainfestPath = spaceFolder.uri.fsPath;
			mainfestPath = mainfestPath +"/manifest.json";
			if(mainfestPath && fs.existsSync(mainfestPath))
			{
				let readFile = fs.readFileSync(mainfestPath,'utf8');
				let  jsonData = hjson.parse(readFile);
				if(jsonData && jsonData['mp-lark'])
				{
					appidInput = jsonData['mp-lark'].appid;
				}
			}
		}
		
		let behaviorCheckBox = false;
		// if(historyData && historyData.behavior)
		//
		//     if(historyData.behavior == true)
		// 	{
		// 		behaviorCheckBox = true;
		// 	}
		// }
		let initForm ={
			nameInput:nameInput,
			appidInput:appidInput,
			behaviorCheckBox:behaviorCheckBox
		};
		
		let submitText = localize(6, null);
		let cancelText = localize(7, null);
		let plesaseInputName = localize(8, null);
		let plesaseInputAppid = localize(9, null);
		let plesaseInputAppidsubPack = localize(10, null);
		let form = hx.window.showFormDialog({
			submitButtonText: submitText,
			cancelButtonText: cancelText,
			validate: async function(formData) {
				if (!formData.nameInput) {
					this.showError(plesaseInputName);
					return false;
				}
				if (!formData.appidInput) {
					this.showError(plesaseInputAppid);
					return false;
				}
				if (formData.behaviorCheckBox && !formData.subPackgeInput) {
					this.showError(plesaseInputAppidsubPack);
					return false;
				}
				this.showError("");
				return true;
			},
			onChanged: function(field, value, formData) {
				if( field == "behaviorCheckBox")
				{
					this.updateForm(getFormItems(formData));
				}
				return true;
			},
			...getFormItems(initForm)
		});
		form.then(async (formData) => {
			let name  = formData.nameInput;
			let appid  = formData.appidInput;
			let behavior = formData.behaviorCheckBox;
			
			let result = await hx.unicloud.getExistsUnicloudAndBindSpace({workspaceFolder:spaceFolder});
	
			if( result && result.code == 0 && true == result.unicloud )
			{
				if(!result.spaceId)
				{
					let okText = localize(11, null);
					let buttons = [];
					buttons.push(okText);
					buttons.push(cancelText);
					let continueOperation = localize(12, null);
					let messageBoxresult = await hx.window.showMessageBox({
						type: 'question',
						title: '',
						text: continueOperation,
						buttons: buttons
					});
					if(messageBoxresult != okText)
					{
						return;
					}
				}
			}
			saveProjectPublishData("publish.flyingBook",spaceFolder.id,name,appid,behavior);
			let subPackge;
			if(behavior)
			{
				subPackge = formData.subPackgeInput;
			}
			let compileResult = await compile({
				workspaceFolder: spaceFolder,
				type: 'publish.flyingBook',
				name:name,
				appid:appid,
				subPackge: subPackge
			});
		}).catch((info)=>
		{
			//console.log("info",info);
		});
	})
	//订阅销毁钩子，插件禁用的时候，自动注销该command。
	context.subscriptions.push(disposable);
}
//该方法将在插件禁用的时候调用（目前是在插件卸载的时候触发）
function deactivate() {
}
module.exports = {
	activate,
	deactivate
}
