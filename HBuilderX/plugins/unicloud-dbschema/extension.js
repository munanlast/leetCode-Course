var hx = require("hbuilderx");
var path = require("path");
var fs = require('fs');
const nls = require("hxnls");
const localize =  nls.loadMessageBundle();

//根据路径获取文件列表
function walkSync(currentDirPath, callback) {
	fs.readdirSync(currentDirPath).forEach(function (name) {
		var filePath = path.join(currentDirPath, name);
		var stat = fs.statSync(filePath);
		if (stat.isFile()) {
			callback(filePath, stat);
		} 
		// else if (stat.isDirectory()) {
		// 	walkSync(filePath, callback);
		// }
	});
}

//根据绝对路径创建目录
function makeDir(dirpath) {
    if (!fs.existsSync(dirpath)) {
        var pathtmp;
        dirpath.split("/").forEach(function(dirname) {
            if (pathtmp) {
                pathtmp = path.join(pathtmp, dirname);
            }
            else {
                if(dirname){
                    pathtmp = dirname;
                }else{
                    pathtmp = "/"; 
                }
            }
            if (!fs.existsSync(pathtmp)) {
                if (!fs.mkdirSync(pathtmp)) {
                    return false;
                }
            }
        });
    }
    return true;
}

function isTemplateFile(filePath)
{
	if(filePath)
	{
		let baseName = path.basename(filePath);
		if(baseName == "config.json" || baseName.startsWith("config.") || baseName.startsWith(".") || baseName.startsWith("readme.txt") )
		{
			return false;
		}
		return true;
	}
	
	return false;
}

//该方法将在插件激活的时候调用
function activate(context) {
	let disposable = hx.commands.registerCommand('uniClound.newdbSchemaResource',(params) => {			
		let templateData = [];
		let dirPath = params.fsPath;
		let customTemplateDir = hx.env.appData + "/templates/file/database";
		let builtinDir = hx.env.appRoot + "/plugins/templates/file/database";
		let newschemaTitle= localize("newschema.title", "新建数据集合Schema文件");
		let defualtTemplateName = localize("newschema.defualtTemplateName", "默认模板");
		let customTemplateName = localize("newschema.customTemplateName", "自定义模板");
		let newResourceResult = hx.window.openNewResourceDialog({
			title:newschemaTitle,
			defultResourceName:"new.schema.json",
			dirPath:dirPath,
			customTemplateDir:customTemplateDir,
			cornerWidget:{
				   type:"label",
				   text:"<a href='custom'>[" + customTemplateName +"]",
				   onEvent:()=>{
					   if(customTemplateName)
					   {
						   makeDir(customTemplateDir);
						   let str = customTemplateDir.startsWith("/")?"file://":"file:///";
						   hx.env.openExternal(str + customTemplateDir);
					   }
				   }
			},
			templateProvider:function TemplateDataProvider(params){
				let opendbResult = hx.http.request({
					url: "https://ide.liuyingyong.cn/serverless/opendb/search",
					method: "post",
					serviceOptions: {
						serviceRequest: true
					}
				});
				let result = new Promise((resolve, reject) => {
					opendbResult.then(async (opendbRes) =>
					{
						//本地模板
						walkSync(builtinDir.toString(), function(filePath, stat) {
							let baseName = path.basename(filePath);
							if(isTemplateFile(filePath))
							{
								baseName = baseName.substring(0,baseName.indexOf("."));
								templateData.push({
									name:baseName,
									path:filePath,
									title:defualtTemplateName,
									local:false
								});
							}
						});				
						walkSync(customTemplateDir, function(filePath, stat) {
							let baseName = path.basename(filePath);
							if(isTemplateFile(filePath))
							{
								baseName = baseName.substring(0,baseName.indexOf("."));
								templateData.push({
									name:baseName,
									path:filePath,
									title:customTemplateName,
									local:false
								});
							}
						});
						
						//远程数据
						if(opendbRes && opendbRes.service && opendbRes.service.code == 1001)
						{
							let opendb_pkgs =  opendbRes.service.body.opendb_pkgs;
							for (var i = 0; i < opendb_pkgs.length; i++)
							{
								let dependencies = opendb_pkgs[i].dependencies;
								for (var j = 0; j < dependencies.length; j++)
								{
									templateData.push({
										name:dependencies[j].name,
										path:"",
										title:dependencies[j].title,
										local:true
									});
								}
							}
						}
						else
						{
							console.error(opendbRes);
						}
						resolve(templateData);
					}).catch((error) => {
						console.error(error);
						//本地模板
						walkSync(builtinDir.toString(), function(filePath, stat) {
							let baseName = path.basename(filePath);
							if(isTemplateFile(filePath))
							{
								baseName = baseName.substring(0,baseName.indexOf("."));
								templateData.push({
									name:baseName,
									path:filePath,
									title:defualtTemplateName,
									local:false
								});
							}
						});				
						walkSync(customTemplateDir, function(filePath, stat) {
							let baseName = path.basename(filePath);
							if(isTemplateFile(filePath))
							{
								baseName = baseName.substring(0,baseName.indexOf("."));
								templateData.push({
									name:baseName,
									path:filePath,
									title:customTemplateName,
									local:false
								});
							}
						});
						resolve(templateData);
					})
				});
				
				return result;
			},
			validate: async function(data)
			{
				this.showError("");
				if(!data.fileNameInput)
				{
					let plesaseInputFileName = localize("newschema.plesaseInputFileName", "请输入文件名");
					this.showError(plesaseInputFileName);
					return false;
				}
				if(!data.dirPathInput)
				{
					let plesaseSelectPath = localize("newschema.plesaseSelectPath", "请选择文件路径");
					this.showError(plesaseSelectPath);
					return false;
				}
				if(data.templateList < 0)
				{
					let plesaseSelectTemplate = localize("newschema.plesaseSelectTemplate", "请选择模板");
					this.showError(plesaseSelectTemplate);
					return false;
				}
				if(fs.existsSync(data.dirPathInput + "/" + data.fileNameInput))
				{
					let locationSmameSchema = localize("newschema.locationSmameSchema", "选择的位置已存在同名的数据集合Schema");
					this.showError(locationSmameSchema);
					return false;
				}
				let template = templateData[data.templateList];
				if(template.local == false)
				{
					return true;
				}
				let opendbDataResult = await hx.http.request({
					url: "https://ide.liuyingyong.cn/serverless/opendb/meta-data",
					method: "post",
					serviceOptions: {
						serviceRequest: true,
						body: {
							name: template.name
						},
					}
				});
				if(opendbDataResult && opendbDataResult.service && opendbDataResult.service.code == 1001)
				{
				    return true;
				}
				this.showError(opendbDataResult.error);
				return false;
			}
		});
		
		newResourceResult.then(async (data)=>
		{
			let template = templateData[data.templateList];
			if(!template) return;
			let dbSchamePath = data.dirPathInput;
			if(!fs.existsSync(dbSchamePath))
			{
				makeDir(dbSchamePath);
			}
			
			dbSchamePath = dbSchamePath + "/" + data.fileNameInput;
			
			if(template.local)
			{
				let opendbDataResult = await hx.http.request({
					url: "https://ide.liuyingyong.cn/serverless/opendb/meta-data",
					method: "post",
					serviceOptions: {
						serviceRequest: true,
						body: {
							name: template.name
						},
					}
				});
				
				if(opendbDataResult && opendbDataResult.service && opendbDataResult.service.code && opendbDataResult.service.code == 1001)
				{
					let schema =  opendbDataResult.service.body.collection.schema;
					let   schemaData =  JSON.stringify(schema,null,'\t');
					if(schemaData)
					{
						fs.open(dbSchamePath, 'w+', function(err,fd){
							if(err){
								throw err;
							}
							fs.writeSync(fd, schemaData, 0 , 'utf-8');
							fs.close(fd,function(err){
								if(err){
									throw err;
								}
							});
							hx.workspace.openTextDocument(dbSchamePath);
						  });
					}
				}
				else
				{
					console.error(opendbDataResult);
				}
				return;
			}
			else{
				var schemaData =fs.readFileSync(template.path,'utf-8');
				if(schemaData)
				{
					fs.open(dbSchamePath, 'w+', function(err,fd){
						if(err){
							throw err;
						}
						fs.writeSync(fd, schemaData, 0 , 'utf-8');
						fs.close(fd,function(err){
							if(err){
								throw err;
							}
						});
					});
					hx.workspace.openTextDocument(dbSchamePath);
				}
			}
		}).catch((info)=>
		{
			//console.log("info",err);
		});			
	});
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
