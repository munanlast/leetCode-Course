const hx = require("../hbxBridge.js")

let messageId = 0;
let eachfileCallbacks = {};
let successCallbacks = {};

function _init(connection) {

	connection.onRequest("unicloud/staticDeploy/eachfile", function(params) {
		if (params.id in eachfileCallbacks) {
			return eachfileCallbacks[params.id](params.data);
		}
	});

	connection.onRequest("unicloud/staticDeploy/success", function(params) {
		if (params.id in successCallbacks) {
			return successCallbacks[params.id](params.data);
		}
	});
}

function getSpaceInfo(workspaceFolder) {
	let result = new Promise((resolve, reject) => {
		hx.request("unicloud.getSpaceInfo", {
			workspaceFolder: workspaceFolder
		}).then((data) => {
			resolve(data);
		}, reject);
	});
	return result;
}

function getRelationWorkspaceFolder(workspaceFolder, provider) {
	let result = new Promise((resolve, reject) => {
		hx.request("unicloud.getRelationOrCoverRelationWorkspaceFolder", {
			workspaceFolder: workspaceFolder,
			provider: provider,
			isRelation: true
		}).then((data) => {
			resolve(data);
		}, reject);
	});
	return result;
}

function getCoverRelationWorkspaceFolder(workspaceFolder, provider) {
	let result = new Promise((resolve, reject) => {
		hx.request("unicloud.getRelationOrCoverRelationWorkspaceFolder", {
			workspaceFolder: workspaceFolder,
			provider: provider,
			isRelation: false
		}).then((data) => {
			resolve(data);
		}, reject);
	});
	return result;
}

function staticDeployFiles(workspaceFolder, space, path, eachfile, success,args) {
	let eachfileId = "eachfile-" + messageId++;
	let successId = "success-" + messageId;
	eachfileCallbacks[eachfileId] = eachfile;
	successCallbacks[successId] = success;
	let result = new Promise((resolve, reject) => {
		hx.request("unicloud.staticDeployFiles", {
			workspaceFolder: workspaceFolder,
			space: space,
			path: path,
			eachfile:eachfileId,
			success:successId,
			args:args
		}).then((data) => {
			resolve(data);
		}, reject);
	});
	return result;
}

function uploadCloudFuntion(workspaceFolder, path) {
	let result = new Promise((resolve, reject) => {
		hx.request("unicloud.uploadCloudFuntion", {
			workspaceFolder: workspaceFolder,
			path: path
		}).then((data) => {
			resolve(data);
		}, reject);
	});
	return result;
}

function unimodulesExistsModule(workspaceFolder, name) {
	let result = new Promise((resolve, reject) => {
		hx.request("unicloud.unimodulesExistsModule", {
			workspaceFolder: workspaceFolder,
			name:name
		}).then((data) => {
			resolve(data);
		}, reject);
	});
	return result;
}

function getProjectBindSpace(workspaceFolder) {
	let result = new Promise((resolve, reject) => {
		hx.request("unicloud.getProjectBindSpace", {
			workspaceFolder: workspaceFolder
		}).then((data) => {
			resolve(data);
		}, reject);
	});
	return result;
}

//获取自定义域名
function getCustomDomain(space) {
	let result = new Promise((resolve, reject) => {
		hx.request("unicloud.getCustomDomain",space).then((data) => {
			resolve(data);
		}, reject);
	});
	return result;
}

function getExistsUnicloudAndBindSpace(space) {
	let result = new Promise((resolve, reject) => {
		hx.request("unicloud.getExistsUnicloudAndBindSpace",space).then((data) => {
			resolve(data);
		}, reject);
	});
	return result;
}

module.exports = {
	init: _init,
	getSpaceInfo: getSpaceInfo,
	getRelationWorkspaceFolder: getRelationWorkspaceFolder,
	getCoverRelationWorkspaceFolder: getCoverRelationWorkspaceFolder,
	staticDeployFiles: staticDeployFiles,
	uploadCloudFuntion: uploadCloudFuntion,
	unimodulesExistsModule: unimodulesExistsModule,
	getProjectBindSpace: getProjectBindSpace,
	getCustomDomain:getCustomDomain,
	getExistsUnicloudAndBindSpace:getExistsUnicloudAndBindSpace
}
