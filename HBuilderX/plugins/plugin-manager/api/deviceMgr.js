const hx = require("../hbxBridge.js");

function _init(_connection) {

}

function getWinSysInfo(options){
		let result = new Promise((resolve, reject) => {
		hx.request("DeviceManager.getWinSysInfo", {
			options: options
		}).then((success) => {
			resolve(success);
		}, reject);
	});
	return result;
}

function getLauncherInfo(options){
		let result = new Promise((resolve, reject) => {
		hx.request("DeviceManager.getLauncherInfo", {
			options: options
		}).then((success) => {
			resolve(success);
		}, reject);
	});
	return result;
}

function getADBInfo(options){
		let result = new Promise((resolve, reject) => {
		hx.request("DeviceManager.getADBInfo", {
			options: options
		}).then((success) => {
			resolve(success);
		}, reject);
	});
	return result;
}

function setDeviceState(options){
		let result = new Promise((resolve, reject) => {
		hx.request("DeviceManager.setDeviceState", {
			options: options
		}).then((success) => {
			resolve(success);
		}, reject);
	});
	return result;
}

module.exports = {
	init:_init,
	setDeviceState: setDeviceState,
	getADBInfo: getADBInfo,
	getLauncherInfo: getLauncherInfo,
	getWinSysInfo: getWinSysInfo
}