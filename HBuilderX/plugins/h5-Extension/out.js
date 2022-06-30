/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./360.js":
/*!****************!*\
  !*** ./360.js ***!
  \****************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const hx = __webpack_require__(/*! hbuilderx */ "hbuilderx")
const ut = __webpack_require__(/*! ./utils.js */ "./utils.js")
const unicompile = __webpack_require__(/*! ./compile.js */ "./compile.js")

// 发行
async function publish(params) {
	// console.log("publish params@@", params)
	let textStartCompile = "开始编译..."
	let textSuccessCompile = "编译成功"
	let textFailedCompile = "编译失败"

	// 开始编译
	if (params.clientId) {
		hx.cliconsole.log({
			clientId: params.clientId,
			msg: textStartCompile,
			status: "Info"
		});
	}

	let compileResult = await unicompile.compile({
		workspaceFolder: params.workspaceFolder,
		type: 'publish.360',
		name: params.name,
		clientId: params.clientId,
		customId: params.customId,
	});

	// 创建输入通道
	let outputChannel = hx.window.createOutputChannel("HBuilder");
	if (compileResult && compileResult.code == 0) {
		// console.log("compileResult@@",compileResult);
		// 编译失败
		if (!compileResult.buildServerPath && !compileResult.buildClientPath) {
			if (params.clientId) {
				hx.cliconsole.log({
					clientId: params.clientId,
					msg: textFailedCompile,
					status: "Error"
				});
			}
			return;
		}
		// 编译成功打印日志
		if (params.clientId) {
			hx.cliconsole.log({
				clientId: params.clientId,
				msg: textSuccessCompile,
				status: "Error"
			});
		}

	} else {
		outputChannel.appendLine(textFailedCompile);
		if (params.clientId) {
			hx.cliconsole.log({
				clientId: params.clientId,
				msg: textFailedCompile,
				status: "Error"
			});
		}
	}
}

function getFromItems(options) {
	let textSubmitBtn = "发行(&P)"
	let textCancelBtn = "取消(&C)"
	let textTitle = "360小程序发行"
	// let textFooter = "<a href=\"https://hx.dcloud.net.cn/cli/publish-mp-weixin\">cli程序化部署教程</a>"
	let textNameInputPlaceholder = "输入360小程序名称"

	return {
		submitButtonText: textSubmitBtn,
		cancelButtonText: textCancelBtn,
		title: textTitle,
		hideSubTitile: true,
		width: 550,
		height: 200,
		// footer: textFooter,
		formItems: [{
				type: "input",
				name: "nameInput",
				placeholder: textNameInputPlaceholder,
				value: options.nameInput ? options.nameInput : "",
			}
		]
	}
}

// 360发行
async function _360Publish(params) {
	// console.log(params)
	let textError1 = "360小程序名称不能为空"
	let textError3 = "360小程序名称不合法";

	let workspaceFolder = params.workspaceFolder

	if (params.args && params.args.isCli) {
		let cliData = params.args
		let clientId = params.clientId
		
		if (params.name == null || params.name == undefined) {
			hx.cliconsole.log({
				clientId: params.clientId,
				msg: textError1,
				status: "Error"
			});
			return
		}
		
		publish({
			workspaceFolder,
			name: params.name,
			customId: "",
			clientId:clientId
		})
		return
	}

	// 定义全局变量，读写配置文件时使用
	let projectId = workspaceFolder.id
	let nameInput = workspaceFolder.name
	// 读取配置文件
	if (projectId) {
		let projectIdData = ut.readPublishConfig(projectId)
		if (projectIdData) {
			if (projectIdData._360NameInput) {
				nameInput = projectIdData._360NameInput
			}
		}
	}

	// 弹框
	hx.window.showFormDialog({
		validate: async function(options) {
			if (!options.nameInput) {
				this.showError(textError1)
				return false;
			}
			if (ut.getInvalidInputName().includes(options.nameInput)) {
				this.showError(textError3);
				return false;
			}
			return true;
		},
		onChanged: function(changeName, changeValue, options) {},
		...getFromItems({
			nameInput
		})
	}).then(function(options) {
		// 写配置文件
		if (projectId) {
			ut.writePublishConfig(projectId, {
				_360NameInput: options.nameInput
			})
		}

		//开始发行
		publish({
			workspaceFolder,
			name: options.nameInput,
			customId: params.args.customId,
			// clientId:params.args.clientId
		});
	})
}

// 导出
module.exports = {
	_360Publish: _360Publish
}


/***/ }),

/***/ "./alipay.js":
/*!*******************!*\
  !*** ./alipay.js ***!
  \*******************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const hx = __webpack_require__(/*! hbuilderx */ "hbuilderx")
const ut = __webpack_require__(/*! ./utils.js */ "./utils.js")
const unicompile = __webpack_require__(/*! ./compile.js */ "./compile.js")

// 发行
async function publish(params) {
	// console.log("publish params@@", params)
	let textStartCompile = "开始编译..."
	let textSuccessCompile = "编译成功"
	let textFailedCompile = "编译失败"

	// 开始编译
	if (params.clientId) {
		hx.cliconsole.log({
			clientId: params.clientId,
			msg: textStartCompile,
			status: "Info"
		});
	}

	let compileResult = await unicompile.compile({
		workspaceFolder: params.workspaceFolder,
		type: 'publish.alipay',
		name: params.name,
		appid: params.appid,
		clientId: params.clientId,
		customId: params.customId,
		subPackage: params.subPackage
	});

	// 创建输入通道
	let outputChannel = hx.window.createOutputChannel("HBuilder");
	if (compileResult && compileResult.code == 0) {
		// console.log("compileResult@@",compileResult);
		// 编译失败
		if (!compileResult.buildServerPath && !compileResult.buildClientPath) {
			if (params.clientId) {
				hx.cliconsole.log({
					clientId: params.clientId,
					msg: textFailedCompile,
					status: "Error"
				});
			}
			return;
		}
		// 编译成功打印日志
		if (params.clientId) {
			hx.cliconsole.log({
				clientId: params.clientId,
				msg: textSuccessCompile,
				status: "Error"
			});
		}

	} else {
		outputChannel.appendLine(textFailedCompile);
		if (params.clientId) {
			hx.cliconsole.log({
				clientId: params.clientId,
				msg: textFailedCompile,
				status: "Error"
			});
		}
	}
}

function getFromItems(options) {
	let textOptionBtn = "高级(&O)"
	let textSubmitBtn = "发行(&P)"
	let textCancelBtn = "取消(&C)"
	let textTitle = "支付宝小程序发行"
	// let textFooter = "<a href=\"https://hx.dcloud.net.cn/cli/publish-mp-weixin\">cli程序化部署教程</a>"
	let textNameInputPlaceholder = "输入支付宝小程序名称"
	let textAppidInputPlaceholder = "输入支付宝小程序AppId"
	let textSubPackageCheckBoxLabel = "发行为混合分包 <a href=\"https://uniapp.dcloud.net.cn/hybrid\">详情</a>"
	let textSubPackageInputPlaceholder = "请输入分包名称"

	return {
		customButtons: [{
				text: textOptionBtn
			},
			{
				text: textCancelBtn
			},
			{
				text: textSubmitBtn,
				role: 'accept'
			}
		],
		title: textTitle,
		hideSubTitile: true,
		width: 550,
		height: 200,
		// footer: textFooter,
		focusName: "appidInput",
		formItems: [{
				type: "input",
				name: "nameInput",
				placeholder: textNameInputPlaceholder,
				value: options.nameInput ? options.nameInput : "",
			},
			{
				type: "input",
				name: "appidInput",
				placeholder: textAppidInputPlaceholder,
				value: options.appidInput ? options.appidInput : ""
			},
			{
				type: "checkBox",
				name: "subPackageCheckBox",
				label: textSubPackageCheckBoxLabel,
				value: options.subPackageCheckBox ? options.subPackageCheckBox : false
			},
			{
				type: "input",
				name: "subPackageInput",
				placeholder: textSubPackageInputPlaceholder,
				isHidden: options.subPackageCheckBox == true ? false : true,
				value: options.subPackageInput ? options.subPackageInput : ""
			}
		].map((item) => {
			if (item && !item.isHidden) {
				return item;
			}
		})
	}
}

// 支付宝发行
async function aliPublish(params) {
	// console.log(params)
	let textError1 = "支付宝小程序名称不能为空"
	let textError2 = "支付宝小程序appId不能为空"
	let textError3 = "支付宝小程序名称不合法";
	let textError4 = "分包名称不能为空";

	let workspaceFolder = params.workspaceFolder

	if (params.args && params.args.isCli) {
		let cliData = params.args
		let clientId = params.clientId

		if (params.name == null || params.name == undefined) {
			hx.cliconsole.log({
				clientId: params.clientId,
				msg: textError1,
				status: "Error"
			});
			return
		}
		let appid = params.appid
		if (appid == null || appid == undefined) {
			// 从manifest读取
			let alipayInfo = ut.getAppInfo(workspaceFolder, "mp-alipay");
			if (alipayInfo && alipayInfo.appid) {
				appid = alipayInfo.appid
			}
			if (appid == null) {
				hx.cliconsole.log({
					clientId: params.clientId,
					msg: textError2,
					status: "Error"
				});
				return
			}
		}

		publish({
			workspaceFolder,
			name: params.name,
			appid: appid,
			subPackage: params.subPackage,
			customId: "",
			clientId: clientId
		})
		return
	}
			
	// 定义全局变量，读写配置文件时使用
	let projectId = workspaceFolder.id
	let nameInput = workspaceFolder.name
	let appidInput
	
	// 先从manifest读取，读取不到再从配置文件中读取
	let alipayInfo = ut.getAppInfo(workspaceFolder, "mp-alipay");
	if (alipayInfo && alipayInfo.appid) {
		appidInput = alipayInfo.appid
	} 
	// 读取配置文件
	if (projectId) {
		let projectIdData = ut.readPublishConfig(projectId)
		if (projectIdData) {
			if (projectIdData.alipayNameInput) {
				nameInput = projectIdData.alipayNameInput
			}
			if (!appidInput && projectIdData.alipayAppidInput) {
				appidInput = projectIdData.alipayAppidInput
			}
		}
	}

	// 弹框
	hx.window.showFormDialog({
		validate: async function(options) {
			if (!options.nameInput) {
				this.showError(textError1)
				return false;
			}
			if (ut.getInvalidInputName().includes(options.nameInput)) {
				this.showError(textError3);
				return false;
			}
			if (!options.appidInput) {
				this.showError(textError2)
				return false;
			}
			if (options.subPackageCheckBox && !options.subPackageInput) {
				this.showError(textError4)
				return false;
			}
			return true;
		},
		onChanged: function(changeName, changeValue, options) {
			if (changeName == "subPackageCheckBox") {
				let items = getFromItems(options)
				this.updateForm(items)
			}
		},
		...getFromItems({
			nameInput,
			appidInput,
			subPackageCheckBox: false
		})
	}).then(function(options) {
		if (options.buttonIndex === 0) {
			hx.window.showManifestEditPart({
				projectId,
				optionType: "mp-alipay.appid"
			})
			return;
		} else if (options.buttonIndex === 1) {
			return
		}
		const result = options.result
		// 写配置文件
		if (projectId) {
			ut.writePublishConfig(projectId, {
				alipayNameInput: result.nameInput,
				alipayAppidInput: result.appidInput
			})
		}

		//开始发行
		publish({
			workspaceFolder,
			name: result.nameInput,
			appid: result.appidInput,
			subPackage: result.subPackageInput,
			customId: params.args.customId,
			// clientId:params.args.clientId
		});
	})
}

// 导出
module.exports = {
	aliPublish: aliPublish
}


/***/ }),

/***/ "./baidu.js":
/*!******************!*\
  !*** ./baidu.js ***!
  \******************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const hx = __webpack_require__(/*! hbuilderx */ "hbuilderx")
const ut = __webpack_require__(/*! ./utils.js */ "./utils.js")
const unicompile = __webpack_require__(/*! ./compile.js */ "./compile.js")

// 发行
async function publish(params) {
	// console.log("publish params@@", params)
	let textStartCompile = "开始编译..."
	let textSuccessCompile = "编译成功"
	let textFailedCompile = "编译失败"

	// 开始编译
	if (params.clientId) {
		hx.cliconsole.log({
			clientId: params.clientId,
			msg: textStartCompile,
			status: "Info"
		});
	}

	let compileResult = await unicompile.compile({
		workspaceFolder: params.workspaceFolder,
		type: 'publish.baidu',
		name: params.name,
		appid: params.appid,
		clientId: params.clientId,
		customId: params.customId,
		subPackage: params.subPackage
	});

	// 创建输入通道
	let outputChannel = hx.window.createOutputChannel("HBuilder");
	if (compileResult && compileResult.code == 0) {
		// console.log("compileResult@@",compileResult);
		// 编译失败
		if (!compileResult.buildServerPath && !compileResult.buildClientPath) {
			if (params.clientId) {
				hx.cliconsole.log({
					clientId: params.clientId,
					msg: textFailedCompile,
					status: "Error"
				});
			}
			return;
		}
		// 编译成功打印日志
		if (params.clientId) {
			hx.cliconsole.log({
				clientId: params.clientId,
				msg: textSuccessCompile,
				status: "Error"
			});
		}

	} else {
		outputChannel.appendLine(textFailedCompile);
		if (params.clientId) {
			hx.cliconsole.log({
				clientId: params.clientId,
				msg: textFailedCompile,
				status: "Error"
			});
		}
	}
}

function getFromItems(options) {
	let textOptionBtn = "高级(&O)"
	let textSubmitBtn = "发行(&P)"
	let textCancelBtn = "取消(&C)"
	let textTitle = "百度小程序发行"
	// let textFooter = "<a href=\"https://hx.dcloud.net.cn/cli/publish-mp-weixin\">cli程序化部署教程</a>"
	let textNameInputPlaceholder = "输入百度小程序名称"
	let textAppidInputPlaceholder = "输入百度小程序AppId"
	let textSubPackageCheckBoxLabel = "发行为混合分包 <a href=\"https://uniapp.dcloud.net.cn/hybrid\">详情</a>"
	let textSubPackageInputPlaceholder = "请输入分包名称"

	return {
		customButtons: [{
				text: textOptionBtn
			},
			{
				text: textCancelBtn
			},
			{
				text: textSubmitBtn,
				role: 'accept'
			}
		],
		title: textTitle,
		hideSubTitile: true,
		width: 550,
		height: 200,
		// footer: textFooter,
		focusName: "appidInput",
		formItems: [{
				type: "input",
				name: "nameInput",
				placeholder: textNameInputPlaceholder,
				value: options.nameInput ? options.nameInput : "",
			},
			{
				type: "input",
				name: "appidInput",
				placeholder: textAppidInputPlaceholder,
				value: options.appidInput ? options.appidInput : ""
			},
			{
				type: "checkBox",
				name: "subPackageCheckBox",
				label: textSubPackageCheckBoxLabel,
				value: options.subPackageCheckBox ? options.subPackageCheckBox : false
			},
			{
				type: "input",
				name: "subPackageInput",
				placeholder: textSubPackageInputPlaceholder,
				isHidden: options.subPackageCheckBox == true ? false : true,
				value: options.subPackageInput ? options.subPackageInput : ""
			}
		].map((item) => {
			if (item && !item.isHidden) {
				return item;
			}
		})
	}
}

// 百度发行
async function bdPublish(params) {
	// console.log(params)
	let textError1 = "百度小程序名称不能为空"
	let textError2 = "百度小程序appId不能为空"
	let textError3 = "百度小程序名称不合法";
	let textError4 = "分包名称不能为空";

	let workspaceFolder = params.workspaceFolder

	if (params.args && params.args.isCli) {
		let cliData = params.args
		let clientId = params.clientId

		if (params.name == null || params.name == undefined) {
			hx.cliconsole.log({
				clientId: params.clientId,
				msg: textError1,
				status: "Error"
			});
			return
		}
		let appid = params.appid
		if (appid == null || appid == undefined) {
			// 从manifest读取
			let baiduInfo = ut.getAppInfo(workspaceFolder, "mp-baidu");
			if (baiduInfo && baiduInfo.appid) {
				appid = baiduInfo.appid
			}
			if (appid == null) {
				hx.cliconsole.log({
					clientId: params.clientId,
					msg: textError2,
					status: "Error"
				});
				return
			}
		}

		publish({
			workspaceFolder,
			name: params.name,
			appid: appid,
			subPackage: params.subPackage,
			customId: "",
			clientId: clientId
		})
		return
	}

	// 定义全局变量，读写配置文件时使用
	let projectId = workspaceFolder.id
	let nameInput = workspaceFolder.name
	let appidInput
	
	// 先从manifest读取，读取不到再从配置文件中读取
	let baiduInfo = ut.getAppInfo(workspaceFolder, "mp-baidu");
		console.log("baiduInfo",baiduInfo)
	if (baiduInfo && baiduInfo.appid) {
		appidInput = baiduInfo.appid
	}
	// 读取配置文件
	if (projectId) {
		let projectIdData = ut.readPublishConfig(projectId)
		if (projectIdData) {
			if (projectIdData.baiduNameInput) {
				nameInput = projectIdData.baiduNameInput
			}
			if (!appidInput && projectIdData.baiduAppidInput) {
				appidInput = projectIdData.baiduAppidInput
			}
		}
	}

	// 弹框
	hx.window.showFormDialog({
		validate: async function(options) {
			if (!options.nameInput) {
				this.showError(textError1)
				return false;
			}
			if (ut.getInvalidInputName().includes(options.nameInput)) {
				this.showError(textError3);
				return false;
			}
			if (!options.appidInput) {
				this.showError(textError2)
				return false;
			}
			if (options.subPackageCheckBox && !options.subPackageInput) {
				this.showError(textError4)
				return false;
			}
			return true;
		},
		onChanged: function(changeName, changeValue, options) {
			if (changeName == "subPackageCheckBox") {
				let items = getFromItems(options)
				this.updateForm(items)
			}
		},
		...getFromItems({
			nameInput,
			appidInput,
			subPackageCheckBox: false
		})
	}).then(function(options) {
		if (options.buttonIndex === 0) {
			hx.window.showManifestEditPart({
				projectId,
				optionType: "mp-baidu.appid"
			})
			return;
		} else if (options.buttonIndex === 1) {
			return
		}
		const result = options.result
		// 写配置文件
		if (projectId) {
			ut.writePublishConfig(projectId, {
				baiduNameInput: result.nameInput,
				baiduAppidInput: result.appidInput
			})
		}

		//开始发行
		publish({
			workspaceFolder,
			name: result.nameInput,
			appid: result.appidInput,
			subPackage: result.subPackageInput,
			customId: params.args.customId,
			// clientId:params.args.clientId
		});
	})
}

// 导出
module.exports = {
	bdPublish: bdPublish
}


/***/ }),

/***/ "./bytedance.js":
/*!**********************!*\
  !*** ./bytedance.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const hx = __webpack_require__(/*! hbuilderx */ "hbuilderx")
const ut = __webpack_require__(/*! ./utils.js */ "./utils.js")
const unicompile = __webpack_require__(/*! ./compile.js */ "./compile.js")

// 发行
async function publish(params) {
	// console.log("publish params@@", params)
	let textStartCompile = "开始编译..."
	let textSuccessCompile = "编译成功"
	let textFailedCompile = "编译失败"

	// 开始编译
	if (params.clientId) {
		hx.cliconsole.log({
			clientId: params.clientId,
			msg: textStartCompile,
			status: "Info"
		});
	}

	let compileResult = await unicompile.compile({
		workspaceFolder: params.workspaceFolder,
		type: 'publish.bytedance',
		name: params.name,
		appid: params.appid,
		clientId: params.clientId,
		customId: params.customId,
		subPackage: params.subPackage
	});

	// 创建输入通道
	let outputChannel = hx.window.createOutputChannel("HBuilder");
	if (compileResult && compileResult.code == 0) {
		// console.log("compileResult@@",compileResult);
		// 编译失败
		if (!compileResult.buildServerPath && !compileResult.buildClientPath) {
			if (params.clientId) {
				hx.cliconsole.log({
					clientId: params.clientId,
					msg: textFailedCompile,
					status: "Error"
				});
			}
			return;
		}
		// 编译成功打印日志
		if (params.clientId) {
			hx.cliconsole.log({
				clientId: params.clientId,
				msg: textSuccessCompile,
				status: "Error"
			});
		}

	} else {
		outputChannel.appendLine(textFailedCompile);
		if (params.clientId) {
			hx.cliconsole.log({
				clientId: params.clientId,
				msg: textFailedCompile,
				status: "Error"
			});
		}
	}
}

function getFromItems(options) {
	let textOptionBtn = "高级(&O)"
	let textSubmitBtn = "发行(&P)"
	let textCancelBtn = "取消(&C)"
	let textTitle = "字节跳动小程序发行"
	// let textFooter = "<a href=\"https://hx.dcloud.net.cn/cli/publish-mp-weixin\">cli程序化部署教程</a>"
	let textNameInputPlaceholder = "输入字节跳动小程序名称"
	let textAppidInputPlaceholder = "输入字节跳动小程序AppId"
	let textSubPackageCheckBoxLabel = "发行为混合分包 <a href=\"https://uniapp.dcloud.net.cn/hybrid\">详情</a>"
	let textSubPackageInputPlaceholder = "请输入分包名称"

	return {
		customButtons: [{
				text: textOptionBtn
			},
			{
				text: textCancelBtn
			},
			{
				text: textSubmitBtn,
				role: 'accept'
			}
		],
		title: textTitle,
		hideSubTitile: true,
		width: 550,
		height: 200,
		// footer: textFooter,
		focusName: "appidInput",
		formItems: [{
				type: "input",
				name: "nameInput",
				placeholder: textNameInputPlaceholder,
				value: options.nameInput ? options.nameInput : "",
			},
			{
				type: "input",
				name: "appidInput",
				placeholder: textAppidInputPlaceholder,
				value: options.appidInput ? options.appidInput : ""
			},
			{
				type: "checkBox",
				name: "subPackageCheckBox",
				label: textSubPackageCheckBoxLabel,
				value: options.subPackageCheckBox ? options.subPackageCheckBox : false
			},
			{
				type: "input",
				name: "subPackageInput",
				placeholder: textSubPackageInputPlaceholder,
				isHidden: options.subPackageCheckBox == true ? false : true,
				value: options.subPackageInput ? options.subPackageInput : ""
			}
		].map((item) => {
			if (item && !item.isHidden) {
				return item;
			}
		})
	}
}

// 字节跳动发行
async function btPublish(params) {
	// console.log(params)
	let textError1 = "字节跳动小程序名称不能为空"
	let textError2 = "字节跳动小程序appId不能为空"
	let textError3 = "字节跳动小程序名称不合法";
	let textError4 = "分包名称不能为空";

	let workspaceFolder = params.workspaceFolder

	if (params.args && params.args.isCli) {
		let cliData = params.args
		let clientId = params.clientId
		
		if (params.name == null || params.name == undefined) {
			hx.cliconsole.log({
				clientId: params.clientId,
				msg: textError1,
				status: "Error"
			});
			return
		}
		let appid = params.appid
		if (appid == null || appid == undefined) {
			// 从manifest读取
			let bytedanceInfo = ut.getAppInfo(workspaceFolder, "mp-toutiao");
			if (bytedanceInfo && bytedanceInfo.appid) {
				appid = bytedanceInfo.appid
			}
			if (appid == null) {
				hx.cliconsole.log({
					clientId: params.clientId,
					msg: textError2,
					status: "Error"
				});
				return
			}
		}
		
		publish({
			workspaceFolder,
			name: params.name,
			appid: appid,
			subPackage: params.subPackage,
			customId: "",
			clientId:clientId
		})
		return
	}

	// 定义全局变量，读写配置文件时使用
	let projectId = workspaceFolder.id
	let nameInput = workspaceFolder.name
	let appidInput
	// 先从manifest读取，读取不到再从配置文件中读取
	let bytedanceInfo = ut.getAppInfo(workspaceFolder, "mp-toutiao");
	if (bytedanceInfo && bytedanceInfo.appid) {
		appidInput = bytedanceInfo.appid
	}
	// 读取配置文件
	if (projectId) {
		let projectIdData = ut.readPublishConfig(projectId)
		if (projectIdData) {
			if (projectIdData.bytedanceNameInput) {
				nameInput = projectIdData.bytedanceNameInput
			}
			if (!appidInput && projectIdData.bytedanceAppidInput) {
				appidInput = projectIdData.bytedanceAppidInput
			}
		}
	}

	// 弹框
	hx.window.showFormDialog({
		validate: async function(options) {
			if (!options.nameInput) {
				this.showError(textError1)
				return false;
			}
			if (ut.getInvalidInputName().includes(options.nameInput)) {
				this.showError(textError3);
				return false;
			}
			if (!options.appidInput) {
				this.showError(textError2)
				return false;
			}
			if (options.subPackageCheckBox && !options.subPackageInput) {
				this.showError(textError4)
				return false;
			}
			return true;
		},
		onChanged: function(changeName, changeValue, options) {
			if (changeName == "subPackageCheckBox") {
				let items = getFromItems(options)
				this.updateForm(items)
			}
		},
		...getFromItems({
			nameInput,
			appidInput,
			subPackageCheckBox: false
		})
	}).then(function(options) {
		if (options.buttonIndex === 0) {
			hx.window.showManifestEditPart({
				projectId,
				optionType: "mp-toutiao.appid"
			})
			return;
		}else if(options.buttonIndex === 1){
			return
		}
		const result = options.result
		// 写配置文件
		if (projectId) {
			ut.writePublishConfig(projectId, {
				bytedanceNameInput: result.nameInput,
				bytedanceAppidInput: result.appidInput
			})
		}

		//开始发行
		publish({
			workspaceFolder,
			name: result.nameInput,
			appid: result.appidInput,
			subPackage: result.subPackageInput,
			customId: params.args.customId,
			// clientId:params.args.clientId
		});
	})
}

// 导出
module.exports = {
	btPublish: btPublish
}


/***/ }),

/***/ "./compile.js":
/*!********************!*\
  !*** ./compile.js ***!
  \********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var hx = __webpack_require__(/*! hbuilderx */ "hbuilderx");

function compile(data) {
    let result = new Promise((resolve,reject) => {
        hx.request("MainHostPublish.compile", data).then((param) => {
            resolve(param);
        }, reject);
	});
    return result;
}

module.exports = {
	compile: compile
}

/***/ }),

/***/ "./extension.js":
/*!**********************!*\
  !*** ./extension.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var hx = __webpack_require__(/*! hbuilderx */ "hbuilderx");
const weapp = __webpack_require__(/*! ./weapp.js */ "./weapp.js")
const h5 = __webpack_require__(/*! ./h5.js */ "./h5.js")
const jd = __webpack_require__(/*! ./jingdong.js */ "./jingdong.js")
const bd = __webpack_require__(/*! ./baidu.js */ "./baidu.js")
const ali = __webpack_require__(/*! ./alipay.js */ "./alipay.js")
const bt = __webpack_require__(/*! ./bytedance.js */ "./bytedance.js")
const qq = __webpack_require__(/*! ./qq.js */ "./qq.js")
const _360 = __webpack_require__(/*! ./360.js */ "./360.js")
const ks = __webpack_require__(/*! ./kuaishou.js */ "./kuaishou.js")
const hw = __webpack_require__(/*! ./huawei.js */ "./huawei.js")
const qau = __webpack_require__(/*! ./quickappunion.js */ "./quickappunion.js")
const nApp = __webpack_require__(/*! ./native_app.js */ "./native_app.js")

function activate(context) {
	hx.workspace.registerWorkspaceFolderLauncher("uniapp.publish.weapp", (params) => {
		weapp.weAppPublish(params);
	});
	hx.workspace.registerWorkspaceFolderLauncher("uniapp.publish.h5", (params) => {
		h5.h5Publish(params);
	});	
	hx.workspace.registerWorkspaceFolderLauncher("uniapp.publish.jingdong", (params) => {
		jd.jdPublish(params);
	});	
	hx.workspace.registerWorkspaceFolderLauncher("uniapp.publish.baidu", (params) => {
		bd.bdPublish(params);
	});
	hx.workspace.registerWorkspaceFolderLauncher("uniapp.publish.alipay", (params) => {
		ali.aliPublish(params);
	});	
	hx.workspace.registerWorkspaceFolderLauncher("uniapp.publish.bytedance", (params) => {
		bt.btPublish(params);
	});
	hx.workspace.registerWorkspaceFolderLauncher("uniapp.publish.qq", (params) => {
		qq.qqPublish(params);
	});
	hx.workspace.registerWorkspaceFolderLauncher("uniapp.publish.360", (params) => {
		_360._360Publish(params);
	});
	hx.workspace.registerWorkspaceFolderLauncher("uniapp.publish.kuaishou", (params) => {
		ks.ksPublish(params);
	});
	hx.workspace.registerWorkspaceFolderLauncher("uniapp.publish.huawei", (params) => {
		hw.hwPublish(params);
	});
	hx.workspace.registerWorkspaceFolderLauncher("uniapp.publish.quickappunion", (params) => {
		qau.qauPublish(params);
	});	
	// 
	hx.workspace.registerWorkspaceFolderLauncher("uniapp.publish.nApp.export.wgt", (params) => {
		nApp.exportWgt(params);
	});
	hx.workspace.registerWorkspaceFolderLauncher("uniapp.publish.nApp.export.resource", (params) => {
		nApp.exportResource(params);
	});
	
	//订阅销毁钩子，插件禁用的时候，自动注销该command。
	// context.subscriptions.push(disposa:ble);
}
//该方法将在插件禁用的时候调用（目前是在插件卸载的时候触发）
function deactivate() {

}

module.exports = {
	activate,
	deactivate
}


/***/ }),

/***/ "./h5.js":
/*!***************!*\
  !*** ./h5.js ***!
  \***************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var hx = __webpack_require__(/*! hbuilderx */ "hbuilderx")
var fs = __webpack_require__(/*! fs */ "fs")
var os = __webpack_require__(/*! os */ "os")
var unicompile = __webpack_require__(/*! ./compile.js */ "./compile.js")
// 引入读写配置文件
var util = __webpack_require__(/*! ./utils.js */ "./utils.js");

function getFormItems(formData, ssr, spaceFolder) {
	let publishFormTitle = "H5发行";
	let publishFormCorner = "<a href=\"https://hx.dcloud.net.cn/cli/publish-h5\">cli程序化部署教程</a>";
	let publishFormFooter = "欢迎开通<a href=\"https://uniad.dcloud.net.cn\">uniAD</a>广告进行变现，<a href=\"https://uniad.dcloud.net.cn/login\">申请入口</a>|<a href=\"https://uniapp.dcloud.io/component/ad.html\">开发文档</a>";
	let publishFormLabel1 = "网站标题";
	let publishFormPlaceholder1 = "输入网站标题";
	let publishFormLabel2 = "网站域名";
	let publishFormPlaceholder2 = "输入网站域名";
	let publishFormLabel3 = "以SSR方式发行 <a href='https://uniapp.dcloud.net.cn/ssr?id=distribute'>帮助</a>";
	let publishFormLabel4 = "将编译后的资源部署到前端网页托管，<a href=\"https://uniapp.dcloud.io/uniCloud/hosting.html\">详情</a>";

	let forms = {
		title: publishFormTitle,
		hideSubTitile: true,
		width: 600,
		height: formData.webHostingCheckBox ? 480 : 200,
		footer: publishFormFooter,
		cornerWidget:{
			type:"label",
			name:"cornerTip",
			text:publishFormCorner
		},
		formItems: [{
				type: "input",
				name: "websiteTitle",
				label: publishFormLabel1,
				placeholder: publishFormPlaceholder1,
				value: formData.websiteTitle ? formData.websiteTitle : ''
			},
			{
				type: "input",
				name: "websiteDomain",
				label: publishFormLabel2,
				placeholder: publishFormPlaceholder2,
				value: formData.websiteDomain ? formData.websiteDomain : ''
			},
			{
				type: "checkBox",
				name: "ssrCheckBox",
				label: publishFormLabel3,
				value: formData.ssrCheckBox,
				isHidden: !ssr
			},
			{
				type: "checkBox",
				name: "webHostingCheckBox",
				label: publishFormLabel4,
				value: formData.webHostingCheckBox
			},
			{
				type: "spaceList",
				name: "selectSpaceList",
				isHidden: !formData.webHostingCheckBox,
				projectId: spaceFolder.id,
				selectedSpaceId: formData.selectedSpaceId !== undefined ? formData.selectedSpaceId : ""
			}
		].map((item) => {
			if (item && !item.isHidden) {
				return item;
			}
		})
	};

	return forms;
}

function getDomainItems(formData) {
	let formTitle = "选择一个自定义域名";

	let itemsArray = [];
	for (var i = 0; i < formData.length; i++) {
		var column = [{
			"label": formData[i].domain
		}];
		itemsArray.push({
			"columns": column
		});
	}

	let forms = {
		title: formTitle,
		width: 480,
		height: 320,
		formItems: [{
			type: "list",
			title: "",
			name: "domainList",
			columnStretches: [1, 2],
			items: itemsArray
		}]
	};
	return forms;
}

// 获取选中信息
function getSelectedSpaceListInfo(listInfo, id) {
	for (let index in listInfo) {
		let info = listInfo[index]
		// console.log("insfo@@", info, id)
		if (info.id == id) {
			return {
				spaceId: id,
				spaceType: info.provider === "aliyun" ? 1 : 2,
				spaceName: info.name,
				apiEndpoint: info.apiEndpoint,
				clientSecret: info.clientSecret,
				isOpenHostingService: info.haveHostingService,
				isOwner: info.isOwner
			}
		}
	}
	return {
		spaceId: "",
		spaceType: 1,
		spaceName: "",
		apiEndpoint: "",
		clientSecret: "",
		isOpenHostingService: false,
		isOwner: true
	}
}

// 发行
async function publish(params) {
	/* params{
			workspaceFolder,
			ssr,
			domain,
			customId,
			webTitle,
			webDomain,
			webHosting,
			isCli,
			clientId,
			funcitonPath,
			selectSpaceList
		}
	 */
	// console.log("params@@", params);

	let startCompile = "开始编译...";
	let successCompile = "编译成功";
	let failedCompile = "编译失败";
	let startFunctionHostingTip = "开始部署编译后的h5到前端网页托管、云函数uni-ssr...";
	let startHostingTip = "开始部署编译后的h5到前端网页托管...";
	let afterHostingTip = "部署完成后,需要配置uni-ssr云函数的url化地址,具体参考:https://uniapp.dcloud.net.cn/uniCloud/http";
	let afterHostingTip1 = "配置云函数uni-ssr地址后,访问配置的地址即可看到服务端渲染的页面";
	let deployFinished = "部署完成";
	// let publishFinished = "发行完成";
	const publishCliEndText = "欢迎开通[uniAD](https://uniad.dcloud.net.cn/)广告进行变现，[申请入口](https://uniad.dcloud.net.cn/login) | [开发文档](https://uniapp.dcloud.io/component/ad.html)"

	let fileExistTip = '文件%1 已存在,是否替换';

	// 开始编译
	if (params.clientId) {
		hx.cliconsole.log({
			clientId: params.clientId,
			msg: startCompile,
			status: "Info"
		});
	}
	let compileResult = await unicompile.compile({
		workspaceFolder: params.workspaceFolder,
		issuessr: params.ssr,
		domain: params.domain,
		type: 'h5',
		customId: params.customId,
		websiteTitle: params.webTitle,
		websiteDomain: params.webDomain,
		clientId: params.clientId
	});

	let outputChannel = hx.window.createOutputChannel("HBuilder");
	if (compileResult && compileResult.code == 0) {
		// console.log("compileResult@@",compileResult);
		// 编译失败
		if(!compileResult.buildServerPath && !compileResult.buildClientPath)
		{
			if (params.clientId) {
				hx.cliconsole.log({
					clientId: params.clientId,
					msg: failedCompile,
					status: "Error"
				});
			}
			return;
		}
		// 编译成功打印日志
		if (params.clientId) {
			hx.cliconsole.log({
				clientId: params.clientId,
				msg: successCompile,
				status: "Info"
			});
		}

		// 如果进行前端网页托管继续执行，否则直接退出
		if (params.webHosting) {
			// 进行前端网页托管前打印日志
			if (params.ssr) {
				outputChannel.appendLine(startFunctionHostingTip);
				if (params.clientId) {
					hx.cliconsole.log({
						clientId: params.clientId,
						msg: startFunctionHostingTip,
						status: "Info"
					});
				}
			} else {
				outputChannel.appendLine(startHostingTip);
				if (params.clientId) {
					hx.cliconsole.log({
						clientId: params.clientId,
						msg: startHostingTip,
						status: "Info"
					});
				}
			}

			// 开始前端网页托管
			let buildServerPath = compileResult.buildServerPath;
			let webHostingresult = hx.unicloud.staticDeployFiles(params.workspaceFolder,
				params.selectSpaceList,
				compileResult.buildClientPath,
				function each(par) {},
				function success(par) {
					if (params.ssr) {
						if (buildServerPath.endsWith != '/') {
							buildServerPath = buildServerPath + "/";
						}

						var serverFuncitonPath = params.funcitonPath + "/server"
						let copyResult = hx.workspace.copyFileWithPrompt({
							src: hx.Uri.file(buildServerPath),
							dest: hx.Uri.file(serverFuncitonPath),
							rootPromptTips: fileExistTip,
							filePromptTips: fileExistTip,
							defaction: 'replace',
							showcomparebutton: false,
							filter: function(par) {
								return 0;
							},
							errorHandler: function(err) {
								return 0;
							}
						});
						copyResult.then(async (par) => {
							// console.log("par", par);
							if (par == 0) {
								outputChannel.appendLine(afterHostingTip)
								outputChannel.appendLine(afterHostingTip1);
								if (params.clientId) {
									hx.cliconsole.log({
										clientId: params.clientId,
										msg: afterHostingTip,
										status: "Info"
									});
									hx.cliconsole.log({
										clientId: params.clientId,
										msg: afterHostingTip1,
										status: "Info"
									});
								}
								// let uploadRes = 
								await hx.unicloud.uploadCloudFuntion(params.workspaceFolder, params
									.funcitonPath);
								// console.log("uploadRes@@", uploadRes);
								outputChannel.appendLine(deployFinished);
								if (params.clientId) {
									hx.cliconsole.log({
										clientId: params.clientId,
										msg: deployFinished,
										status: "Info"
									});
									hx.cliconsole.log({
										clientId: params.clientId,
										msg: publishCliEndText,
										status: "Error"
									});
								}
							}
						});
					} else {
						outputChannel.appendLine(deployFinished);
						if (params.clientId) {
							hx.cliconsole.log({
								clientId: params.clientId,
								msg: deployFinished,
								status: "Info"
							});
							hx.cliconsole.log({
								clientId: params.clientId,
								msg: publishCliEndText,
								status: "Error"
							});
						}
					}
				},
				{
					isCli:params.isCli ? true : false,
					clientId:params.clientId
				}
			);
		} else {
			hx.cliconsole.log({
				clientId: params.clientId,
				msg: publishCliEndText,
				status: "Error"
			});
		}

	} else {
		outputChannel.appendLine(failedCompile);
		if (params.clientId) {
			hx.cliconsole.log({
				clientId: params.clientId,
				msg: failedCompile,
				status: "Info"
			});
			hx.cliconsole.log({
				clientId: params.clientId,
				msg: publishCliEndText,
				status: "Error"
			});
		}
	}

}

// 走发行流程
async function h5Publish(params) {
	// console.log("params", params);

	// 国际化
	let formBtnPublish = "发行(&P)";
	let fromBtnCancel = "取消(&C)";
	let tipErrorText = "网站标题不能为空";
	let tipErrorinvalidInputName = "网站标题不合法";
	let ssrPublishTip = "选择SSR发行部署依赖uni_modules插件uni-ssr,请先安装该插件";
	let btnInstall = "安装";
	let btnCancel = "取消";
	let extensionError = "can't resolve extension:";
	let tipErrorText1 = "请选择一个服务空间";
	let tipErrorText2 = "服务空间未开通前端网页托管";
	let spaceBtnOk = "确定(&O)";
	let spaceBtnCanlcel = "取消(&C)";
	let tipErrorText3 = "当前项目没有绑定服务空间,确定要继续操作?";
	let tipErrorText4 = "当前服务空间的前端网页托管未绑定自定义域名,请绑定域名后再试";
	let domainBtnOk = "确定(&S)";
	let domainBtnCancel = "取消(&C)";
	let tipErrorText5 = "请选择域名";
	let uniCloudErrorTip = "当前项目没有uniCloud云开发环境，请先创建uniCloud";
	let spaceBindErrorTip = "当前项目没有绑定服务空间,请先绑定服务空间";
	// 国际化

	let spaceFolder = params.workspaceFolder;
	let funcitonPath;

	// 开始cli操作
	let cliData = params.args;
	let clientId = cliData.clientId;
	// console.log("cliData@@", cliData);
	// console.log("clientId@@", clientId);
	if (cliData && cliData.isCli) {
		// 校验名称是否合法
		if(util.getInvalidInputName().includes(cliData.webTitle))
		{
			hx.cliconsole.log({
				clientId: clientId,
				msg: tipErrorinvalidInputName,
				status: "Error"
			});
			return;
		}
		// 选中ssr发行
		if (cliData.ssrPublish) {
			// 判断uni-ssr插件是否存在
			var existsfuncResult = await hx.unicloud.unimodulesExistsModule(spaceFolder, "uni-ssr");
			funcitonPath = existsfuncResult.funcitonPath;
			if (false == existsfuncResult.exist) {
				hx.cliconsole.log({
					clientId: clientId,
					msg: ssrPublishTip,
					status: "Error"
				});
				return;
			}
		}

		let selectSpaceList;
		let selectdomain;

		// 选中前端网页托管
		if (cliData.webHosting) {
			// 发送获取云空间请求，请求失败直接return
			let requesResult = await hx.http.request({
				url: "https://ide.liuyingyong.cn/serverless/space/list",
				method: "post",
				serviceOptions: {
					serviceRequest: true,
					body: {
						provider: cliData.provider,
						appid: spaceFolder.appid
					},
				}
			});
			if (requesResult.service && requesResult.service.code == 1001) {
				// 将获取信息进行筛选
				selectSpaceList = getSelectedSpaceListInfo(requesResult.service.body.spaces, cliData.spaceId);

				// 判断服务空间是否开启前端网页托管，没有直接return
				if (selectSpaceList.isOpenHostingService == false) {
					hx.cliconsole.log({
						clientId: clientId,
						msg: tipErrorText2,
						status: "Error"
					});
					return;
				}
			} else {
				// 错误信息
				let errString;
				if (requesResult.httpStatusCode == 200) {
					errString = requesResult.service.description;
				} else {
					errString = requesResult.error;
				}
				hx.cliconsole.log({
					clientId: clientId,
					msg: errString,
					status: "Error"
				});
				return;
			}

			if (cliData.ssrPublish) {
				// 获取当前项目是否绑定服务空间，没有绑定直接return
				// var bindspaceResult = await hx.unicloud.getProjectBindSpace(spaceFolder); // 不能使用此方法，此方法会自动弹框
				// console.log("bindspaceResult@@",bindspaceResult);

				let result = await hx.unicloud.getExistsUnicloudAndBindSpace({
					workspaceFolder: spaceFolder
				});
				if (result.code == 0) {
					if (!result.unicloud) {
						hx.cliconsole.log({
							clientId: clientId,
							msg: uniCloudErrorTip,
							status: "Error"
						});
						return;
					}
					let bindSpaceid = result.spaceId;
					if (bindSpaceid == '' || bindSpaceid == null || bindSpaceid == undefined) {
						hx.cliconsole.log({
							clientId: clientId,
							msg: spaceBindErrorTip,
							status: "Error"
						});
						return;
					}
				} else {
					hx.cliconsole.log({
						clientId: clientId,
						msg: spaceBindErrorTip,
						status: "Error"
					});
					return;
				}

				// 发送请求，获取绑定域名列表
				let requesResult = await hx.http.request({
					url: "https://ide.liuyingyong.cn/serverless/host/domain-list",
					method: "post",
					serviceOptions: {
						serviceRequest: true,
						body: {
							provider: cliData.provider,
							spaceId: cliData.spaceId,
							appid:spaceFolder.appid
						},
					}
				});
				let domains;
				if (requesResult.service && requesResult.service.code == 1001) {
					domains = requesResult.service.body.domains;
				} else {
					if (requesResult.httpStatusCode == 200) {
						hx.cliconsole.log({
							clientId: clientId,
							msg: requesResult.service.description,
							status: "Error"
						});
					} else {
						hx.cliconsole.log({
							clientId: clientId,
							msg: requesResult.error,
							status: "Error"
						});
					}
					return;
				}

				// 如果存在多个域名刚默认选择第一个
				if (domains.length > 0) {
					selectdomain = domains[0].domain;
				} else {
					hx.cliconsole.log({
						clientId: clientId,
						msg: tipErrorText4,
						status: "Error"
					});
					return;
				}
			}
		}

		// 开始发行
		await publish({
			workspaceFolder: params.workspaceFolder,
			ssr: cliData.ssrPublish,
			domain: selectdomain,
			customId: cliData.customId,
			webTitle: cliData.webTitle,
			webDomain: cliData.webDomain,
			webHosting: cliData.webHosting,
			clientId: cliData.clientId,
			funcitonPath: funcitonPath,
			selectSpaceList: selectSpaceList,
			isCli: true
		});

		return;
	}

	// 开始界面操作
	let ssr = spaceFolder.vueVersion == 3 ? true : false;
	let customId = params.args.customId;
	let bindSpace;

	// 读取配置文件
	let websiteTitle;
	let websiteDomain;
	let webHostingCheckBox = false;
	let selectedSpaceId;
	if(spaceFolder.id)
	{
		let configData = util.readPublishConfig(spaceFolder.id);
		// console.log("configData:",configData);
		if(configData)
		{
			if(configData.websiteTitle)
			{
				websiteTitle = configData.websiteTitle;
			}
			if(configData.websiteDomain)
			{
				websiteDomain = configData.websiteDomain;
			}
			if(configData.webHostingCheckBox !== undefined)
			{
				webHostingCheckBox = configData.webHostingCheckBox;
			}
			if(configData.selectedSpaceId)
			{
				selectedSpaceId = configData.selectedSpaceId;
			}
		}
	}

	let form = hx.window.showFormDialog({
		submitButtonText: formBtnPublish,
		cancelButtonText: fromBtnCancel,
		validate: async function(formData) {
			if (!formData.websiteTitle) {
				this.showError(tipErrorText);
				return false;
			}
			if (util.getInvalidInputName().includes(formData.websiteTitle)) {
				this.showError(tipErrorinvalidInputName);
				return false;
			}
			if (formData.ssrCheckBox && formData.webHostingCheckBox) {
				var existsfuncResult = await hx.unicloud.unimodulesExistsModule(spaceFolder,
					"uni-ssr");
				funcitonPath = existsfuncResult.funcitonPath;
				if (false == existsfuncResult.exist) {
					var result = await hx.window.showMessageBox({
						type: 'Info',
						title: ssrPublishTip,
						text: '',
						buttons: [btnInstall, btnCancel]
					});
					if (result == btnInstall) {
						var extension = hx.extensions.getExtension("uni_modules");
						if (extension) {
							extension.installDeps({
								fsPath: spaceFolder.uri.fsPath,
								deps: ["uni-ssr"]
							});
						} else {
							console.error(extensionError, extensionId);
						}
					}
					this.showError("");
					return false;
				}

				var bindspaceResult = await hx.unicloud.getProjectBindSpace(spaceFolder);
				if (bindspaceResult.code == 0) {
					bindSpace = bindspaceResult.space;
					let bindSpaceid = bindSpace.spaceId;
					if (formData.webHostingCheckBox && (bindSpaceid == '' || bindSpaceid ==
							null || bindSpaceid == undefined)) {
						this.showError(spaceBindErrorTip);
						return false;
					}
				} else {
					this.showError(spaceBindErrorTip);
					return false;
				}
			}

			let selectSpaceList = formData.selectSpaceList;
			let spaceid;
			if (selectSpaceList) {
				spaceid = selectSpaceList.spaceId;
			}

			if (formData.webHostingCheckBox && (spaceid == '' || spaceid == null || spaceid ==
					undefined)) {
				this.showError(tipErrorText1);
				return false;
			}

			if (formData.webHostingCheckBox && formData.selectSpaceList.isOpenHostingService ==
				false) {
				this.showError(tipErrorText2);
				return false;
			}

			this.showError("");
			return true;
		},
		onChanged: function(field, value, formData) {
			if(!formData.selectSpaceList){
				formData.selectedSpaceId = selectedSpaceId
			}
			if (field == 'webHostingCheckBox') {
				this.updateForm(getFormItems(formData, ssr, spaceFolder));
			}
			return true;
		},
		...getFormItems({
			"websiteTitle": websiteTitle ? websiteTitle : spaceFolder.name,
			"websiteDomain": websiteDomain ? websiteDomain : '',
			"ssrCheckBox": false,
			"webHostingCheckBox": webHostingCheckBox,
			"selectedSpaceId":selectedSpaceId
		}, ssr, spaceFolder)
	});

	form.then(async (res) => {
		// console.log("res",res)
		// 写配置文件
		if(spaceFolder.id)
		{
			// 序列化数据
			let jsonData = {};
			if(res.websiteTitle)
			{
				jsonData.websiteTitle = res.websiteTitle;
			}
			if(res.websiteDomain !== undefined)
			{
				jsonData.websiteDomain = res.websiteDomain
			}
			if(res.webHostingCheckBox !== undefined){
				jsonData.webHostingCheckBox = res.webHostingCheckBox;
			}
			if(res.selectSpaceList && res.selectSpaceList.spaceId)
			{
				jsonData.selectedSpaceId = res.selectSpaceList.spaceId
			}
			// 写文件
			util.writePublishConfig(spaceFolder.id,jsonData);
		}
		
		let issuessr = false;
		if (res.ssrCheckBox == true) {
			issuessr = true;
		}
		let webHosting = false;
		if (res.webHostingCheckBox) {
			webHosting = true;
		}

		let result;
		try {
			result = await hx.unicloud.getExistsUnicloudAndBindSpace({
				workspaceFolder: spaceFolder
			});
		} catch (e) {
			//TODO handle the exception
		}
		if (result && result.code == 0 && true == result.unicloud) {
			if (!result.spaceId) {
				let okText = spaceBtnOk;
				let cancelText = spaceBtnCanlcel;
				let buttons = [];
				buttons.push(okText);
				buttons.push(cancelText);
				let continueOperation = tipErrorText3;
				let messageBoxresult = await hx.window.showMessageBox({
					type: 'question',
					title: '',
					text: continueOperation,
					buttons: buttons
				});
				if (messageBoxresult != okText) {
					return;
				}
			}
		}
		let outputChannel = hx.window.createOutputChannel("HBuilder");
		let selectdomain;
		if (issuessr && webHosting && res.selectSpaceList) {
			let provider;
			let domains;
			if (res.selectSpaceList.spaceType == 1) {
				provider = "aliyun";
			} else if (res.selectSpaceList.spaceType == 2) {
				provider = "tcb";
			}
			let requesResult = await hx.http.request({
				url: "https://ide.liuyingyong.cn/serverless/host/domain-list",
				method: "post",
				serviceOptions: {
					serviceRequest: true,
					body: {
						provider: provider,
						spaceId: res.selectSpaceList.spaceId,
						appid:spaceFolder.appid
					},
				}
			});
			if (requesResult.service && requesResult.service.code == 1001) {
				domains = requesResult.service.body.domains;
			} else {
				if (requesResult.httpStatusCode == 200) {
					outputChannel.appendLine(requesResult.service.description);
				} else {
					outputChannel.appendLine(requesResult.error);
				}
				return;
			}
			if (domains.length == 1) {
				selectdomain = domains[0].domain;
			} else if (domains.length < 1) {
				outputChannel.appendLine({
					line: tipErrorText4,
					level: "warning"
				});
				return;
			} else {
				let domainform = await hx.window.showFormDialog({
					submitButtonText: domainBtnOk,
					cancelButtonText: domainBtnCancel,
					validate: function(formData) {
						return true;
					},
					onChanged: function(field, value, formData) {},
					...getDomainItems(domains),
				});
				if (domainform.domainList < 0) {
					outputChannel.appendLine(tipErrorText5);
					return;
				}
				selectdomain = domains[domainform.domainList].domain;
			}
		}
		
		// 发行
		publish({
			workspaceFolder: spaceFolder,
			ssr: issuessr,
			domain: selectdomain,
			customId: customId,
			webTitle: res.websiteTitle,
			webDomain: res.websiteDomain,
			webHosting: webHosting,
			clientId: "",
			funcitonPath: funcitonPath,
			selectSpaceList: res.selectSpaceList,
			isCli: false
		})

	}).catch((info) => {
		// console.log("info", info);
	});
}

// 导出
module.exports = {
	h5Publish: h5Publish
}


/***/ }),

/***/ "./hjson.min.js":
/*!**********************!*\
  !*** ./hjson.min.js ***!
  \**********************/
/***/ ((module) => {

/*!
 * Hjson v3.2.1
 * https://hjson.github.io
 *
 * Copyright 2014-2017 Christian Zangl, MIT license
 * Details and documentation:
 * https://github.com/hjson/hjson-js
 *
 * This code is based on the the JSON version by Douglas Crockford:
 * https://github.com/douglascrockford/JSON-js (json_parse.js, json2.js)
 */
!function(n){if(true)module.exports=n();else { var r; }}(function(){return function(){function n(r,e,t){function o(a,s){if(!e[a]){if(!r[a]){var u=undefined;if(!s&&u)return require(a,!0);if(i)return i(a,!0);var f=new Error("Cannot find module '"+a+"'");throw f.code="MODULE_NOT_FOUND",f}var c=e[a]={exports:{}};r[a][0].call(c.exports,function(n){return o(r[a][1][n]||n)},c,c.exports,n,r,e,t)}return e[a].exports}for(var i=undefined,a=0;a<t.length;a++)o(t[a]);return o}return n}()({1:[function(n,r,e){"use strict";function t(n,r,e){var t;return n&&(t={b:n}),r&&((t=t||{}).a=r),e&&((t=t||{}).x=e),t}function o(n,r){if(null!==n&&"object"==typeof n){var e=h.getComment(n);e&&h.removeComment(n);var i,a,u,f;if("[object Array]"===Object.prototype.toString.apply(n)){for(f={a:{}},i=0,a=n.length;i<a;i++)s(f.a,i,e.a[i],o(n[i]))&&(u=!0);!u&&e.e&&(f.e=t(e.e[0],e.e[1]),u=!0)}else{f={s:{}};var c,l=Object.keys(n);for(e&&e.o?(c=[],e.o.concat(l).forEach(function(r){Object.prototype.hasOwnProperty.call(n,r)&&c.indexOf(r)<0&&c.push(r)})):c=l,f.o=c,i=0,a=c.length;i<a;i++){var p=c[i];s(f.s,p,e.c[p],o(n[p]))&&(u=!0)}!u&&e.e&&(f.e=t(e.e[0],e.e[1]),u=!0)}return r&&e&&e.r&&(f.r=t(e.r[0],e.r[1])),u?f:void 0}}function i(){var n="";return[].forEach.call(arguments,function(r){r&&""!==r.trim()&&(n&&(n+="; "),n+=r.trim())}),n}function a(n,r){var e=[];if(c(n,r,e,[]),e.length>0){var t=l(r,null,1);t+="\n# Orphaned comments:\n",e.forEach(function(n){t+=("# "+n.path.join("/")+": "+i(n.b,n.a,n.e)).replace("\n","\\n ")+"\n"}),l(r,t,1)}}function s(n,r,e,o){var i=t(e?e[0]:void 0,e?e[1]:void 0,o);return i&&(n[r]=i),i}function u(n,r){var e=t(r.b,r.a);return e.path=n,e}function f(n,r,e){if(n){var t,o;if(n.a)for(t=0,o=n.a.length;t<o;t++){var i=e.slice().concat([t]),a=n.a[t];a&&(r.push(u(i,a)),f(a.x,r,i))}else n.o&&n.o.forEach(function(t){var o=e.slice().concat([t]),i=n.s[t];i&&(r.push(u(o,i)),f(i.x,r,o))});n.e&&r.push(u(e,n.e))}}function c(n,r,e,t){if(n){if(null===r||"object"!=typeof r)return void f(n,e,t);var o,i=h.createComment(r);if(0===t.length&&n.r&&(i.r=[n.r.b,n.r.a]),"[object Array]"===Object.prototype.toString.apply(r)){i.a=[];var a=n.a||{};for(var s in a)if(a.hasOwnProperty(s)){o=parseInt(s);var l=n.a[s];if(l){var p=t.slice().concat([o]);o<r.length?(i.a[o]=[l.b,l.a],c(l.x,r[o],e,p)):(e.push(u(p,l)),f(l.x,e,p))}}0===o&&n.e&&(i.e=[n.e.b,n.e.a])}else i.c={},i.o=[],(n.o||[]).forEach(function(o){var a=t.slice().concat([o]),s=n.s[o];Object.prototype.hasOwnProperty.call(r,o)?(i.o.push(o),s&&(i.c[o]=[s.b,s.a],c(s.x,r[o],e,a))):s&&(e.push(u(a,s)),f(s.x,e,a))}),n.e&&(i.e=[n.e.b,n.e.a])}}function l(n,r,e){var t=h.createComment(n,h.getComment(n));return t.r||(t.r=["",""]),(r||""===r)&&(t.r[e]=h.forceComment(r)),t.r[e]||""}var h=n("./hjson-common");r.exports={extract:function(n){return o(n,!0)},merge:a,header:function(n,r){return l(n,r,0)},footer:function(n,r){return l(n,r,1)}}},{"./hjson-common":2}],2:[function(n,r,e){"use strict";function t(n,r){function e(){return o=n.charAt(u),u++,o}var t,o,i="",a=0,s=!0,u=0;for(e(),"-"===o&&(i="-",e());o>="0"&&o<="9";)s&&("0"==o?a++:s=!1),i+=o,e();if(s&&a--,"."===o)for(i+=".";e()&&o>="0"&&o<="9";)i+=o;if("e"===o||"E"===o)for(i+=o,e(),"-"!==o&&"+"!==o||(i+=o,e());o>="0"&&o<="9";)i+=o,e();for(;o&&o<=" ";)e();return r&&(","!==o&&"}"!==o&&"]"!==o&&"#"!==o&&("/"!==o||"/"!==n[u]&&"*"!==n[u])||(o=0)),t=+i,o||a||!isFinite(t)?void 0:t}function o(n,r){return Object.defineProperty&&Object.defineProperty(n,"__COMMENTS__",{enumerable:!1,writable:!0}),n.__COMMENTS__=r||{}}function i(n){Object.defineProperty(n,"__COMMENTS__",{value:void 0})}function a(n){return n.__COMMENTS__}function s(n){if(!n)return"";var r,e,t,o,i=n.split("\n");for(t=0;t<i.length;t++)for(r=i[t],o=r.length,e=0;e<o;e++){var a=r[e];if("#"===a)break;if("/"===a&&("/"===r[e+1]||"*"===r[e+1])){"*"===r[e+1]&&(t=i.length);break}if(a>" "){i[t]="# "+r;break}}return i.join("\n")}var u=n("os");r.exports={EOL:u.EOL||"\n",tryParseNumber:t,createComment:o,removeComment:i,getComment:a,forceComment:s}},{os:8}],3:[function(n,r,e){"use strict";function t(n,r){function e(n){return"[object Function]"==={}.toString.call(n)}if("[object Array]"!==Object.prototype.toString.apply(n)){if(n)throw new Error("dsf option must contain an array!");return i}if(0===n.length)return i;var t=[];return n.forEach(function(n){if(!n.name||!e(n.parse)||!e(n.stringify))throw new Error("extension does not match the DSF interface");t.push(function(){try{if("parse"==r)return n.parse.apply(null,arguments);if("stringify"==r){var e=n.stringify.apply(null,arguments);if(void 0!==e&&("string"!=typeof e||0===e.length||'"'===e[0]||[].some.call(e,function(n){return a(n)})))throw new Error("value may not be empty, start with a quote or contain a punctuator character except colon: "+e);return e}throw new Error("Invalid type")}catch(r){throw new Error("DSF-"+n.name+" failed; "+r.message)}})}),o.bind(null,t)}function o(n,r){if(n)for(var e=0;e<n.length;e++){var t=n[e](r);if(void 0!==t)return t}}function i(){}function a(n){return"{"===n||"}"===n||"["===n||"]"===n||","===n}function s(){return{name:"math",parse:function(n){switch(n){case"+inf":case"inf":case"+Inf":case"Inf":return 1/0;case"-inf":case"-Inf":return-1/0;case"nan":case"NaN":return NaN}},stringify:function(n){if("number"==typeof n)return 1/n==-1/0?"-0":n===1/0?"Inf":n===-1/0?"-Inf":isNaN(n)?"NaN":void 0}}}function u(n){var r=n&&n.out;return{name:"hex",parse:function(n){if(/^0x[0-9A-Fa-f]+$/.test(n))return parseInt(n,16)},stringify:function(n){if(r&&Number.isInteger(n))return"0x"+n.toString(16)}}}function f(){return{name:"date",parse:function(n){if(/^\d{4}-\d{2}-\d{2}$/.test(n)||/^\d{4}-\d{2}-\d{2}T\d{2}\:\d{2}\:\d{2}(?:.\d+)(?:Z|[+-]\d{2}:\d{2})$/.test(n)){var r=Date.parse(n);if(!isNaN(r))return new Date(r)}},stringify:function(n){if("[object Date]"===Object.prototype.toString.call(n)){var r=n.toISOString();return-1!==r.indexOf("T00:00:00.000Z",r.length-14)?r.substr(0,10):r}}}}s.description="support for Inf/inf, -Inf/-inf, Nan/naN and -0",u.description="parse hexadecimal numbers prefixed with 0x",f.description="support ISO dates",r.exports={loadDsf:t,std:{math:s,hex:u,date:f}}},{}],4:[function(n,r,e){"use strict";r.exports=function(r,e){function t(){j=0,w=" "}function o(n){return"{"===n||"}"===n||"["===n||"]"===n||","===n||":"===n}function i(n){var r,e=0,t=1;for(r=j-1;r>0&&"\n"!==b[r];r--,e++);for(;r>0;r--)"\n"===b[r]&&t++;throw new Error(n+" at line "+t+","+e+" >>>"+b.substr(j-e,20)+" ...")}function a(){return w=b.charAt(j),j++,w}function s(n){return b.charAt(j+n)}function u(n){for(var r="",e=w;a();){if(w===e)return a(),n&&"'"===e&&"'"===w&&0===r.length?(a(),f()):r;if("\\"===w)if(a(),"u"===w){for(var t=0,o=0;o<4;o++){a();var s,u=w.charCodeAt(0);w>="0"&&w<="9"?s=u-48:w>="a"&&w<="f"?s=u-97+10:w>="A"&&w<="F"?s=u-65+10:i("Bad \\u char "+w),t=16*t+s}r+=String.fromCharCode(t)}else{if("string"!=typeof C[w])break;r+=C[w]}else"\n"===w||"\r"===w?i("Bad string containing newline"):r+=w}i("Bad string")}function f(){function n(){for(var n=t;w&&w<=" "&&"\n"!==w&&n-- >0;)a()}for(var r="",e=0,t=0;;){var o=s(-t-5);if(!o||"\n"===o)break;t++}for(;w&&w<=" "&&"\n"!==w;)a();for("\n"===w&&(a(),n());;){if(w){if("'"===w){if(e++,a(),3===e)return"\n"===r.slice(-1)&&(r=r.slice(0,-1)),r;continue}for(;e>0;)r+="'",e--}else i("Bad multiline string");"\n"===w?(r+="\n",a(),n()):("\r"!==w&&(r+=w),a())}}function c(){if('"'===w||"'"===w)return u(!1);for(var n="",r=j,e=-1;;){if(":"===w)return n?e>=0&&e!==n.length&&(j=r+e,i("Found whitespace in your key name (use quotes to include)")):i("Found ':' but no key name (for an empty key name use quotes)"),n;w<=" "?w?e<0&&(e=n.length):i("Found EOF while looking for a key name (check your syntax)"):o(w)?i("Found '"+w+"' where a key name was expected (check your syntax or use quotes if the key name includes {}[],: or whitespace)"):n+=w,a()}}function l(){for(;w;){for(;w&&w<=" ";)a();if("#"===w||"/"===w&&"/"===s(0))for(;w&&"\n"!==w;)a();else{if("/"!==w||"*"!==s(0))break;for(a(),a();w&&("*"!==w||"/"!==s(0));)a();w&&(a(),a())}}}function h(){var n=w;for(o(w)&&i("Found a punctuator character '"+w+"' when expecting a quoteless string (check your syntax)");;){a();var r="\r"===w||"\n"===w||""===w;if(r||","===w||"}"===w||"]"===w||"#"===w||"/"===w&&("/"===s(0)||"*"===s(0))){var e=n[0];switch(e){case"f":if("false"===n.trim())return!1;break;case"n":if("null"===n.trim())return null;break;case"t":if("true"===n.trim())return!0;break;default:if("-"===e||e>="0"&&e<="9"){var t=k.tryParseNumber(n);if(void 0!==t)return t}}if(r){n=n.trim();var u=O(n);return void 0!==u?u:n}}n+=w}}function p(n,r){var e;for(n--,e=j-2;e>n&&b[e]<=" "&&"\n"!==b[e];e--);"\n"===b[e]&&e--,"\r"===b[e]&&e--;var t=b.substr(n,e-n+1);for(e=0;e<t.length;e++)if(t[e]>" "){var o=t.indexOf("\n");if(o>=0){var i=[t.substr(0,o),t.substr(o+1)];return r&&0===i[0].trim().length&&i.shift(),i}return[t]}return[]}function m(n){function r(n,e){var t,o,i,a;switch(typeof n){case"string":n.indexOf(e)>=0&&(a=n);break;case"object":if("[object Array]"===Object.prototype.toString.apply(n))for(t=0,i=n.length;t<i;t++)a=r(n[t],e)||a;else for(o in n)Object.prototype.hasOwnProperty.call(n,o)&&(a=r(n[o],e)||a)}return a}function e(e){var t=r(n,e);return t?"found '"+e+"' in a string value, your mistake could be with:\n  > "+t+"\n  (unquoted strings contain everything up to the next line!)":""}return e("}")||e("]")}function d(){var n,r,e,t=[];try{if(x&&(n=k.createComment(t,{a:[]})),a(),r=j,l(),n&&(e=p(r,!0).join("\n")),"]"===w)return a(),n&&(n.e=[e]),t;for(;w;){if(t.push(v()),r=j,l(),","===w&&(a(),r=j,l()),n){var o=p(r);n.a.push([e||"",o[0]||""]),e=o[1]}if("]"===w)return a(),n&&(n.a[n.a.length-1][1]+=e||""),t;l()}i("End of input while parsing an array (missing ']')")}catch(n){throw n.hint=n.hint||m(t),n}}function g(n){var r,e,t,o="",s={};try{if(x&&(r=k.createComment(s,{c:{},o:[]})),n?e=1:(a(),e=j),l(),r&&(t=p(e,!0).join("\n")),"}"===w&&!n)return r&&(r.e=[t]),a(),s;for(;w;){if(o=c(),l(),":"!==w&&i("Expected ':' instead of '"+w+"'"),a(),s[o]=v(),e=j,l(),","===w&&(a(),e=j,l()),r){var u=p(e);r.c[o]=[t||"",u[0]||""],t=u[1],r.o.push(o)}if("}"===w&&!n)return a(),r&&(r.c[o][1]+=t||""),s;l()}if(n)return s;i("End of input while parsing an object (missing '}')")}catch(n){throw n.hint=n.hint||m(s),n}}function v(){switch(l(),w){case"{":return g();case"[":return d();case"'":case'"':return u(!0);default:return h()}}function y(n,r){var e=j;if(l(),w&&i("Syntax error, found trailing characters"),x){var t=r.join("\n"),o=p(e).join("\n");if(o||t){k.createComment(n,k.getComment(n)).r=[t,o]}}return n}var b,j,w,x,O,k=n("./hjson-common"),E=n("./hjson-dsf"),C={'"':'"',"'":"'","\\":"\\","/":"/",b:"\b",f:"\f",n:"\n",r:"\r",t:"\t"};if("string"!=typeof r)throw new Error("source is not a string");var q=null,S=!0;return e&&"object"==typeof e&&(x=e.keepWsc,q=e.dsf,S=!1!==e.legacyRoot),O=E.loadDsf(q,"parse"),b=r,t(),S?function(){l();var n=x?p(1):null;switch(w){case"{":return y(g(),n);case"[":return y(d(),n)}try{return y(g(!0),n)}catch(r){t();try{return y(v(),n)}catch(n){throw r}}}():function(){l();var n=x?p(1):null;switch(w){case"{":return y(g(),n);case"[":return y(d(),n);default:return y(v(),n)}}()}},{"./hjson-common":2,"./hjson-dsf":3}],5:[function(n,r,e){"use strict";r.exports=function(r,e){function t(n,r){return L+=n[0].length+n[1].length-n[2]-n[3],n[0]+r+n[1]}function o(n){return n.replace(N,function(n){var r=A[n];return"string"==typeof r?t(O.esc,r):t(O.uni,("0000"+n.charCodeAt(0).toString(16)).slice(-4))})}function i(n,r,e,i){return n?(I.lastIndex=0,F.lastIndex=0,v||e||I.test(n)||void 0!==f.tryParseNumber(n,!0)||F.test(n)?(N.lastIndex=0,_.lastIndex=0,N.test(n)?_.test(n)||i||!b?t(O.qstr,o(n)):a(n,r):t(O.qstr,n)):t(O.str,n)):t(O.qstr,"")}function a(n,r){var e,o=n.replace(/\r/g,"").split("\n");if(r+=p,1===o.length)return t(O.mstr,o[0]);var i=h+r+O.mstr[0];for(e=0;e<o.length;e++)i+=h,o[e]&&(i+=r+o[e]);return i+h+r+O.mstr[1]}function s(n){return n?g||P.test(n)?(N.lastIndex=0,t(O.qkey,N.test(n)?o(n):n)):t(O.key,n):'""'}function u(n,r,e,o){function a(n){return n&&"\n"===n["\r"===n[0]?1:0]}function c(n){return n&&!a(n)}function l(n,r,e){if(!n)return"";n=f.forceComment(n);var o,i=n.length;for(o=0;o<i&&n[o]<=" ";o++);return e&&o>0&&(n=n.substr(o)),o<i?r+t(O.rem,n):n}var g=q(n);if(void 0!==g)return t(O.dsf,g);switch(typeof n){case"string":return i(n,D,r,o);case"number":return isFinite(n)?t(O.num,String(n)):t(O.lit,"null");case"boolean":return t(O.lit,String(n));case"object":if(!n)return t(O.lit,"null");var w;m&&(w=f.getComment(n));var k="[object Array]"===Object.prototype.toString.apply(n),E=D;D+=p;var C,S,N,I,_,F,A,P,M,T,$=h+E,R=h+D,B=e||d?"":$,W=[],U=y?[]:null,Z=v,H=b,z=j?"":O.com[0],G=0;if(k){for(S=0,N=n.length;S<N;S++){if(C=S<N-1,w?(A=w.a[S]||[],P=c(A[1]),W.push(l(A[0],"\n")+R),U&&(A[0]||A[1]||P)&&(U=null)):W.push(R),L=0,_=n[S],W.push(u(_,!!w&&P,!0)+(C?j:"")),U){switch(typeof _){case"string":L=0,v=!0,b=0,U.push(u(_,!1,!0)+(C?O.com[0]:"")),v=Z,b=H;break;case"object":if(_){U=null;break}default:U.push(W[W.length-1]+(C?z:""))}C&&(L+=O.com[0].length-O.com[2]),G+=L}w&&A[1]&&W.push(l(A[1],P?" ":"\n",P))}0===N?w&&w.e&&W.push(l(w.e[0],"\n")+$):W.push($),0===W.length?M=t(O.arr,""):(M=B+t(O.arr,W.join("")),U&&(T=U.join(" "),T.length-G<=y&&(M=t(O.arr,T))))}else{var J=w?w.o.slice():[],K=[];for(I in n)Object.prototype.hasOwnProperty.call(n,I)&&J.indexOf(I)<0&&K.push(I);x&&K.sort();var Q=J.concat(K);for(S=0,N=Q.length;S<N;S++)if(C=S<N-1,I=Q[S],w?(A=w.c[I]||[],P=c(A[1]),W.push(l(A[0],"\n")+R),U&&(A[0]||A[1]||P)&&(U=null)):W.push(R),L=0,_=n[I],F=u(_,w&&P),W.push(s(I)+O.col[0]+(a(F)?"":" ")+F+(C?j:"")),w&&A[1]&&W.push(l(A[1],P?" ":"\n",P)),U){switch(typeof _){case"string":L=0,v=!0,b=0,F=u(_,!1),v=Z,b=H,U.push(s(I)+O.col[0]+" "+F+(C?O.com[0]:""));break;case"object":if(_){U=null;break}default:U.push(W[W.length-1]+(C?z:""))}L+=O.col[0].length-O.col[2],C&&(L+=O.com[0].length-O.com[2]),G+=L}0===N?w&&w.e&&W.push(l(w.e[0],"\n")+$):W.push($),0===W.length?M=t(O.obj,""):(M=B+t(O.obj,W.join("")),U&&(T=U.join(" "),T.length-G<=y&&(M=t(O.obj,T))))}return D=E,M}}var f=n("./hjson-common"),c=n("./hjson-dsf"),l={obj:["{","}"],arr:["[","]"],key:["",""],qkey:['"','"'],col:[":",""],com:[",",""],str:["",""],qstr:['"','"'],mstr:["'''","'''"],num:["",""],lit:["",""],dsf:["",""],esc:["\\",""],uni:["\\u",""],rem:["",""]},h=f.EOL,p="  ",m=!1,d=!1,g=!1,v=!1,y=0,b=1,j="",w=null,x=!1,O=l;if(e&&"object"==typeof e){e.quotes="always"===e.quotes?"strings":e.quotes,"\n"!==e.eol&&"\r\n"!==e.eol||(h=e.eol),m=e.keepWsc,y=e.condense||0,d=e.bracesSameLine,g="all"===e.quotes||"keys"===e.quotes,v="all"===e.quotes||"strings"===e.quotes||!0===e.separator,b=v||"off"==e.multiline?0:"no-tabs"==e.multiline?2:1,j=!0===e.separator?O.com[0]:"",w=e.dsf,x=e.sortProps,"number"==typeof e.space?p=new Array(e.space+1).join(" "):"string"==typeof e.space&&(p=e.space),!0===e.colors&&(O={obj:["[37m{[0m","[37m}[0m"],arr:["[37m[[0m","[37m][0m"],key:["[33m","[0m"],qkey:['[33m"','"[0m'],col:["[37m:[0m",""],com:["[37m,[0m",""],str:["[37;1m","[0m"],qstr:['[37;1m"','"[0m'],mstr:["[37;1m'''","'''[0m"],num:["[36;1m","[0m"],lit:["[36m","[0m"],dsf:["[37m","[0m"],esc:["[31m\\","[0m"],uni:["[31m\\u","[0m"],rem:["[35m","[0m"]});var k,E=Object.keys(l);for(k=E.length-1;k>=0;k--){var C=E[k];O[C].push(l[C][0].length,l[C][1].length)}}var q,S="-­؀-؄܏឴឵‌-‏\u2028- ⁠-⁯\ufeff￰-￿",N=new RegExp('[\\\\\\"\0-'+S+"]","g"),I=new RegExp("^\\s|^\"|^'|^#|^\\/\\*|^\\/\\/|^\\{|^\\}|^\\[|^\\]|^:|^,|\\s$|[\0-"+S+"]","g"),_=new RegExp("'''|^[\\s]+$|[\0-"+(2===b?"\t":"\b")+"\v\f-"+S+"]","g"),F=new RegExp("^(true|false|null)\\s*((,|\\]|\\}|#|//|/\\*).*)?$"),A={"\b":"b","\t":"t","\n":"n","\f":"f","\r":"r",'"':'"',"\\":"\\"},P=/[,\{\[\}\]\s:#"']|\/\/|\/\*/,D="",L=0;q=c.loadDsf(w,"stringify");var M="",T=m?T=(f.getComment(r)||{}).r:null;return T&&T[0]&&(M=T[0]+"\n"),M+=u(r,null,!0,!0),T&&(M+=T[1]||""),M}},{"./hjson-common":2,"./hjson-dsf":3}],6:[function(n,r,e){r.exports="3.2.1"},{}],7:[function(n,r,e){/*!
 * Hjson v3.2.1
 * https://hjson.github.io
 *
 * Copyright 2014-2017 Christian Zangl, MIT license
 * Details and documentation:
 * https://github.com/hjson/hjson-js
 *
 * This code is based on the the JSON version by Douglas Crockford:
 * https://github.com/douglascrockford/JSON-js (json_parse.js, json2.js)
 */
"use strict";var t=n("./hjson-common"),o=n("./hjson-version"),i=n("./hjson-parse"),a=n("./hjson-stringify"),s=n("./hjson-comments"),u=n("./hjson-dsf");r.exports={parse:i,stringify:a,endOfLine:function(){return t.EOL},setEndOfLine:function(n){"\n"!==n&&"\r\n"!==n||(t.EOL=n)},version:o,rt:{parse:function(n,r){return(r=r||{}).keepWsc=!0,i(n,r)},stringify:function(n,r){return(r=r||{}).keepWsc=!0,a(n,r)}},comments:s,dsf:u.std}},{"./hjson-comments":1,"./hjson-common":2,"./hjson-dsf":3,"./hjson-parse":4,"./hjson-stringify":5,"./hjson-version":6}],8:[function(n,r,e){},{}]},{},[7])(7)});


/***/ }),

/***/ "./huawei.js":
/*!*******************!*\
  !*** ./huawei.js ***!
  \*******************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const hx = __webpack_require__(/*! hbuilderx */ "hbuilderx")
const ut = __webpack_require__(/*! ./utils.js */ "./utils.js")
const unicompile = __webpack_require__(/*! ./compile.js */ "./compile.js")

// 发行
async function publish(params) {
	// console.log("publish params@@", params)
	let textStartCompile = "开始编译..."
	let textSuccessCompile = "编译成功"
	let textFailedCompile = "编译失败"

	// 开始编译
	if (params.clientId) {
		hx.cliconsole.log({
			clientId: params.clientId,
			msg: textStartCompile,
			status: "Info"
		});
	}

	let compileResult = await unicompile.compile({
		workspaceFolder: params.workspaceFolder,
		type: 'publish.huawei',
		name: params.name,
		clientId: params.clientId,
		customId: params.customId,
	});

	// 创建输入通道
	let outputChannel = hx.window.createOutputChannel("HBuilder");
	if (compileResult && compileResult.code == 0) {
		// console.log("compileResult@@",compileResult);
		// 编译失败
		if (!compileResult.buildServerPath && !compileResult.buildClientPath) {
			if (params.clientId) {
				hx.cliconsole.log({
					clientId: params.clientId,
					msg: textFailedCompile,
					status: "Error"
				});
			}
			return;
		}
		// 编译成功打印日志
		if (params.clientId) {
			hx.cliconsole.log({
				clientId: params.clientId,
				msg: textSuccessCompile,
				status: "Error"
			});
		}

	} else {
		outputChannel.appendLine(textFailedCompile);
		if (params.clientId) {
			hx.cliconsole.log({
				clientId: params.clientId,
				msg: textFailedCompile,
				status: "Error"
			});
		}
	}
}

function getFromItems(options) {
	let textSubmitBtn = "发行(&P)"
	let textCancelBtn = "取消(&C)"
	let textTitle = "华为快应用发行"
	// let textFooter = "<a href=\"https://hx.dcloud.net.cn/cli/publish-mp-weixin\">cli程序化部署教程</a>"
	let textNameInputPlaceholder = "输入华为快应用名称"

	return {
		submitButtonText: textSubmitBtn,
		cancelButtonText: textCancelBtn,
		title: textTitle,
		hideSubTitile: true,
		width: 550,
		height: 200,
		// footer: textFooter,
		formItems: [{
				type: "input",
				name: "nameInput",
				placeholder: textNameInputPlaceholder,
				value: options.nameInput ? options.nameInput : "",
			}
		]
	}
}

// 华为发行
async function hwPublish(params) {
	// console.log(params)
	let textError1 = "华为快应用名称不能为空"
	let textError3 = "华为快应用名称不合法";

	let workspaceFolder = params.workspaceFolder

	if (params.args && params.args.isCli) {
		let cliData = params.args
		let clientId = params.clientId
		
		if (params.name == null || params.name == undefined) {
			hx.cliconsole.log({
				clientId: params.clientId,
				msg: textError1,
				status: "Error"
			});
			return
		}
		
		publish({
			workspaceFolder,
			name: params.name,
			customId: "",
			clientId:clientId
		})
		return
	}

	// 定义全局变量，读写配置文件时使用
	let projectId = workspaceFolder.id
	let nameInput = workspaceFolder.name
	// 读取配置文件
	if (projectId) {
		let projectIdData = ut.readPublishConfig(projectId)
		if (projectIdData) {
			if (projectIdData.huaweiNameInput) {
				nameInput = projectIdData.huaweiNameInput
			}
		}
	}

	// 弹框
	hx.window.showFormDialog({
		validate: async function(options) {
			if (!options.nameInput) {
				this.showError(textError1)
				return false;
			}
			if (ut.getInvalidInputName().includes(options.nameInput)) {
				this.showError(textError3);
				return false;
			}
			return true;
		},
		onChanged: function(changeName, changeValue, options) {},
		...getFromItems({
			nameInput
		})
	}).then(function(options) {
		// 写配置文件
		if (projectId) {
			ut.writePublishConfig(projectId, {
				huaweiNameInput: options.nameInput
			})
		}

		//开始发行
		publish({
			workspaceFolder,
			name: options.nameInput,
			customId: params.args.customId,
			// clientId:params.args.clientId
		});
	})
}

// 导出
module.exports = {
	hwPublish: hwPublish
}


/***/ }),

/***/ "./jingdong.js":
/*!*********************!*\
  !*** ./jingdong.js ***!
  \*********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const hx = __webpack_require__(/*! hbuilderx */ "hbuilderx")
const ut = __webpack_require__(/*! ./utils.js */ "./utils.js")
const unicompile = __webpack_require__(/*! ./compile.js */ "./compile.js")

// 具体发行函数
async function publish(params) {
	let textStartCompile = "开始编译..."
	let textSuccessCompile = "编译成功"
	let textFailedCompile = "编译失败"
	
	// 开始编译
	if (params.clientId) {
		hx.cliconsole.log({
			clientId: params.clientId,
			msg: textStartCompile,
			status: "Info"
		});
	}
	
	let compileResult = await unicompile.compile({
		workspaceFolder: params.workspaceFolder,
		type: 'publish.jingdong',
		name: params.name,
		appid: params.appid,
		clientId: params.clientId,
		customId:params.customId
	});

	// 创建输入通道
	let outputChannel = hx.window.createOutputChannel("HBuilder");
	if (compileResult && compileResult.code == 0) {
		// console.log("compileResult@@",compileResult);
		// 编译失败
		if (!compileResult.buildServerPath && !compileResult.buildClientPath) {
			if (params.clientId) {
				hx.cliconsole.log({
					clientId: params.clientId,
					msg: textFailedCompile,
					status: "Error"
				});
			}
			return;
		}
		// 编译成功打印日志
		if (params.clientId) {
			hx.cliconsole.log({
				clientId: params.clientId,
				msg: textSuccessCompile,
				status: "Error"
			});
		}
		
	} else {
		outputChannel.appendLine(textFailedCompile);
		if (params.clientId) {
			hx.cliconsole.log({
				clientId: params.clientId,
				msg: textFailedCompile,
				status: "Error"
			});
		}
	}
}

function getJdFromItems(options) {
	let textOptionBtn = "高级(&O)"
	let textSubmitBtn = "发行(&P)"
	let textCancelBtn = "取消(&C)"
	let textTitle = "京东小程序发行"
	// let textFooter = "<a href=\"https://hx.dcloud.net.cn/cli/publish-mp-weixin\">cli程序化部署教程</a>"
	let textNameInputPlaceholder = "输入京东小程序名称"
	let textAppidInputPlaceholder = "输入京东小程序AppId"

	return {
		customButtons: [{
				text: textOptionBtn
			},
			{
				text: textCancelBtn
			},
			{
				text: textSubmitBtn,
				role: 'accept'
			}
		],
		title: textTitle,
		hideSubTitile: true,
		width: 550,
		height: 270,
		// footer: textFooter,
		focusName:"appidInput",
		formItems: [{
				type: "input",
				name: "nameInput",
				placeholder: textNameInputPlaceholder,
				value: options.nameInput ? options.nameInput : "",
			},
			{
				type: "input",
				name: "appidInput",
				placeholder: textAppidInputPlaceholder,
				value: options.appidInput ? options.appidInput : ""
			}
		]
	}
}

async function jdPublish(params) {
	let textError1 = "京东小程序名称不能为空"
	let invalidInputName = "京东小程序名称不合法";
	let textError2 = "京东小程序appId不能为空"
	// console.log("params@@", params)

	let workspaceFolder = params.workspaceFolder

	// 进行cli操作
	if (params.args && params.args.isCli) {
		let cliData = params.args;
		let clientId = cliData.clientId
		
		// 校验名称是否合法
		if(ut.getInvalidInputName().includes(cliData.name))
		{
			hx.cliconsole.log({
				clientId: clientId,
				msg: invalidInputName,
				status: "Error"
			});
			return;
		}
		// 校验appid
		if (!cliData.appid) {
			hx.cliconsole.log({
				clientId: clientId,
				msg: textError2,
				status: "Error"
			});
			return;
		}

		// 开始发行
		publish({
			workspaceFolder: workspaceFolder,
			name: cliData.name,
			appid: cliData.appid,
			clientId:clientId,
			customId:""
		})
		return
	}

	// 进行界面操作
	// 定义全局变量，读写配置文件时使用
	let projectId = workspaceFolder.id
	let nameInput = workspaceFolder.name
	let appidInput

	// 先从manifest读取，读取不到再从配置文件中读取
	let jingdongInfo = ut.getAppInfo(workspaceFolder, "mp-jd");
	console.log("jingdongInfo@@",jingdongInfo);
	if (jingdongInfo && jingdongInfo.appid) {
		appidInput = jingdongInfo.appid
	} 
	// 读取配置文件
	if (projectId) {
		let projectIdData = ut.readPublishConfig(projectId)
		console.log("projectIdData@@",projectIdData);
		if (projectIdData) {
			if (projectIdData.jdNameInput) {
				nameInput = projectIdData.jdNameInput
			}
			// 如果appinput没有值配置文件有值则再从配置文件获取
			if (!appidInput && projectIdData.jdAppidInput) {
				appidInput = projectIdData.jdAppidInput
			}
		}
	}
	// 弹出界面
	hx.window.showFormDialog({
		validate: async function(options) {
			if (!options.nameInput) {
				this.showError(textError1)
				return false;
			}
			if (ut.getInvalidInputName().includes(options.nameInput)) {
				this.showError(invalidInputName);
				return false;
			}
			if (!options.appidInput) {
				this.showError(textError2)
				return false;
			}
			return true;
		},
		onChanged: function(changeName, changeValue, options) {},
		...getJdFromItems({
			nameInput,
			appidInput
		})
	}).then(function(options) {
		if(options.buttonIndex === 0){
			hx.window.showManifestEditPart({
				projectId,
				optionType:"mp-jd.appid"
			})
			return;
		}else if(options.buttonIndex === 1){
			return
		}
		// console.log("options@@", options)
		const result = options.result
		// 写配置文件
		if (projectId) {
			ut.writePublishConfig(projectId, {
				jdNameInput: result.nameInput,
				jdAppidInput: result.appidInput
			})
		}

		// 开始发行
		publish({
			workspaceFolder: workspaceFolder,
			name: result.nameInput,
			appid: result.appidInput,
			customId:params.args.customId
		})
	})
}

module.exports = {
	jdPublish: jdPublish
}


/***/ }),

/***/ "./kuaishou.js":
/*!*********************!*\
  !*** ./kuaishou.js ***!
  \*********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const hx = __webpack_require__(/*! hbuilderx */ "hbuilderx")
const ut = __webpack_require__(/*! ./utils.js */ "./utils.js")
const unicompile = __webpack_require__(/*! ./compile.js */ "./compile.js")

// 发行
async function publish(params) {
	// console.log("publish params@@", params)
	let textStartCompile = "开始编译..."
	let textSuccessCompile = "编译成功"
	let textFailedCompile = "编译失败"

	// 开始编译
	if (params.clientId) {
		hx.cliconsole.log({
			clientId: params.clientId,
			msg: textStartCompile,
			status: "Info"
		});
	}

	let compileResult = await unicompile.compile({
		workspaceFolder: params.workspaceFolder,
		type: 'publish.kuaishou',
		name: params.name,
		clientId: params.clientId,
		customId: params.customId,
	});

	// 创建输入通道
	let outputChannel = hx.window.createOutputChannel("HBuilder");
	if (compileResult && compileResult.code == 0) {
		// console.log("compileResult@@",compileResult);
		// 编译失败
		if (!compileResult.buildServerPath && !compileResult.buildClientPath) {
			if (params.clientId) {
				hx.cliconsole.log({
					clientId: params.clientId,
					msg: textFailedCompile,
					status: "Error"
				});
			}
			return;
		}
		// 编译成功打印日志
		if (params.clientId) {
			hx.cliconsole.log({
				clientId: params.clientId,
				msg: textSuccessCompile,
				status: "Error"
			});
		}

	} else {
		outputChannel.appendLine(textFailedCompile);
		if (params.clientId) {
			hx.cliconsole.log({
				clientId: params.clientId,
				msg: textFailedCompile,
				status: "Error"
			});
		}
	}
}

function getFromItems(options) {
	let textSubmitBtn = "发行(&P)"
	let textCancelBtn = "取消(&C)"
	let textTitle = "快手小程序发行"
	// let textFooter = "<a href=\"https://hx.dcloud.net.cn/cli/publish-mp-weixin\">cli程序化部署教程</a>"
	let textNameInputPlaceholder = "输入快手小程序名称"

	return {
		submitButtonText: textSubmitBtn,
		cancelButtonText: textCancelBtn,
		title: textTitle,
		hideSubTitile: true,
		width: 550,
		height: 200,
		// footer: textFooter,
		formItems: [{
				type: "input",
				name: "nameInput",
				placeholder: textNameInputPlaceholder,
				value: options.nameInput ? options.nameInput : "",
			}
		]
	}
}

// 快手发行
async function ksPublish(params) {
	// console.log(params)
	let textError1 = "快手小程序名称不能为空"
	let textError3 = "快手小程序名称不合法";

	let workspaceFolder = params.workspaceFolder

	if (params.args && params.args.isCli) {
		let cliData = params.args
		let clientId = params.clientId
		
		if (params.name == null || params.name == undefined) {
			hx.cliconsole.log({
				clientId: params.clientId,
				msg: textError1,
				status: "Error"
			});
			return
		}
		
		publish({
			workspaceFolder,
			name: params.name,
			customId: "",
			clientId:clientId
		})
		return
	}

	// 定义全局变量，读写配置文件时使用
	let projectId = workspaceFolder.id
	let nameInput = workspaceFolder.name
	// 读取配置文件
	if (projectId) {
		let projectIdData = ut.readPublishConfig(projectId)
		if (projectIdData) {
			if (projectIdData.kuaishouNameInput) {
				nameInput = projectIdData.kuaishouNameInput
			}
		}
	}

	// 弹框
	hx.window.showFormDialog({
		validate: async function(options) {
			if (!options.nameInput) {
				this.showError(textError1)
				return false;
			}
			if (ut.getInvalidInputName().includes(options.nameInput)) {
				this.showError(textError3);
				return false;
			}
			return true;
		},
		onChanged: function(changeName, changeValue, options) {},
		...getFromItems({
			nameInput
		})
	}).then(function(options) {
		// 写配置文件
		if (projectId) {
			ut.writePublishConfig(projectId, {
				kuaishouNameInput: options.nameInput
			})
		}

		//开始发行
		publish({
			workspaceFolder,
			name: options.nameInput,
			customId: params.args.customId,
			// clientId:params.args.clientId
		});
	})
}

// 导出
module.exports = {
	ksPublish: ksPublish
}


/***/ }),

/***/ "./native_app.js":
/*!***********************!*\
  !*** ./native_app.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const hx = __webpack_require__(/*! hbuilderx */ "hbuilderx")
const path = __webpack_require__(/*! path */ "path")
const compile = __webpack_require__(/*! ./compile.js */ "./compile.js")
const utils = __webpack_require__(/*! ./utils.js */ "./utils.js")
const fs = __webpack_require__(/*! fs */ "fs")
const os = __webpack_require__(/*! os */ "os")

// 发行
function publish(options) {
	const {
		clientId
	} = options

	compile.compile(options).then(function() {
		if (clientId) {
			hx.cliconsole.log({
				clientId: clientId,
				msg: "",
				status: "Error"
			});
		}
	}, function() {
		if (clientId) {
			hx.cliconsole.log({
				clientId: clientId,
				msg: "",
				status: "Error"
			});
		}
	})
}

// 获取导出wgt界面表单
function getExportWgtFormItem(options) {
	const {
		appId,
		pathInput,
		confuse
	} = options

	const dialogTitleText = "制作应用wgt包"
	const itemLabelText1 = "wgt全称为widget，是前端应用资源包，\
		可用于<a href=\"https://ask.dcloud.net.cn/article/182\">[App的前端打码热更新]</a>\
		或<a href=\"https://ask.dcloud.net.cn/docs/#https://ask.dcloud.net.cn/article/36941\">[uni小程序发布]</a>"
	const itemLabelText2 = `请为应用${appId === undefined?"":appId}选择要生成的wgt包的存放路径：`
	const itemInputText = "请输入wgt包名称"
	const itemFileInputText = "请选择wgt包存放路径"
	const itemCheckBoxText = "对配置的js/nvue文件进行原生混淆<a href=\"https://ask.dcloud.net.cn/article/36437\">[配置指南]</a>"

	return {
		title: dialogTitleText,
		formItems: [{
				type: "label",
				name: "label1",
				text: itemLabelText1
			},
			{
				type: "label",
				name: "label2",
				text: itemLabelText2
			},
			{
				type: "fileSelectInput",
				name: "pathInput",
				mode: "folder",
				appendSuffix:`/${appId}.wgt`,
				placeholder: itemFileInputText,
				value: pathInput
			},
			{
				type: "checkBox",
				name: "confuse",
				label: itemCheckBoxText,
				value: confuse === undefined ? false : confuse
			}
		]
	}
}

/*************************以下函数导出*************************/
// 制作wgt包
function exportWgt(params) {
	// console.log("wgt par", params)
	const {
		args,
		workspaceFolder
	} = params

	const errText = "项目的AppID不能为空，请在该项目下的manifest.json中重新获取"
	const errText1 = "路径不能为空"
	const errText2 = "指定的路径不存在，请检查路径正确性后再试"
	const errText3 = "请输入wgt包名，或重新选择路径"
	const dialogBtnTextOK = "确定(&O)"
	const dialogBtnTextCancel = "取消(&C)"


	if (args.isCli === true) {
		const name = args.name
		const targetPath = args.path
		const clientId = args.clientId

		if (targetPath === '') {
			hx.cliconsole.log({
				clientId: clientId,
				msg: errText1,
				status: "Error"
			});
			return
		}

		// 发行
		publish({
			type: "export.wgt",
			workspaceFolder,
			path: path.join(targetPath, name),
			confuse: args.confuse,
			clientId: clientId
		})
		return
	}

	let formData = {
		appId: workspaceFolder.appid,
		pathInput: path.join(workspaceFolder.uri.fsPath, "unpackage/release", workspaceFolder.appid + ".wgt"),
		confuse: false
	}

	// 读取配置文件
	const configData = utils.readPublishConfig(workspaceFolder.id)
	if (configData) {
		if (configData.wgtConfuse !== undefined) {
			formData.confuse = configData.wgtConfuse
		}
	}

	// 显示界面
	hx.window.showFormDialog({
		width: 420,
		height: 300,
		submitButtonText:dialogBtnTextOK,
		cancelButtonText:dialogBtnTextCancel,
		...getExportWgtFormItem(formData),
		onOpened() {
			if (workspaceFolder.appid === undefined || workspaceFolder.appid === "") {
				this.showError(errText);
			}
		},
		onChanged(name, value, options) {},
		validate(options) {
			// console.log("options", options)
			const {
				pathInput
			} = options

			// if (workspaceFolder.appid === undefined || workspaceFolder.appid === "") {
			// 	this.showError(errText);
			// 	return false
			// }

			if (pathInput === '') {
				this.showError(errText1)
				return false
			}
			
			// 判断当前系统
			const slash = (os.type() === "Windows_NT")?"\\":"/"

			if (pathInput.split(slash).length <= 1) {
				this.showError(errText2)
				return false
			}

			const passPath = path.join(workspaceFolder.uri.fsPath, "unpackage/release")
			// console.log("passPath", passPath)
			// 判断路径是否以/结尾
			if (pathInput.endsWith(slash)) {
				this.showError(errText3)
				return false
			} else {
				// 不以/结尾则当做路径加文件名，去掉文件名再做判断
				let pathSplit = pathInput.split(slash)
				pathSplit.length = pathSplit.length - 1
				// console.log("pathSplit", pathSplit)
				let newPath = pathSplit.join(slash)
				// console.log("newPath", newPath)
				if (newPath != passPath && !fs.existsSync(newPath)) {
					this.showError(errText2)
					return false
				}
			}
			return true
		}
	}).then(function(options) {
		// console.log("options", options)
		const {
			pathInput,
			confuse
		} = options

		// 写配置文件
		utils.writePublishConfig(workspaceFolder.id, {
			wgtConfuse: confuse
		})

		// 发行
		publish({
			type: "export.wgt",
			workspaceFolder,
			path: pathInput,
			confuse
		})
	})
}

// 生成本地打包App资源
function exportResource(params) {
	// console.log("resource par", params)
	const {
		args,
		workspaceFolder
	} = params

	let clientId = ""
	clientId = args.clientId

	publish({
		type: "export.resource",
		workspaceFolder,
		clientId
	})
}

module.exports = {
	exportWgt,
	exportResource
}


/***/ }),

/***/ "./qq.js":
/*!***************!*\
  !*** ./qq.js ***!
  \***************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const hx = __webpack_require__(/*! hbuilderx */ "hbuilderx")
const ut = __webpack_require__(/*! ./utils.js */ "./utils.js")
const unicompile = __webpack_require__(/*! ./compile.js */ "./compile.js")

// 发行
async function publish(params) {
	// console.log("publish params@@", params)
	let textStartCompile = "开始编译..."
	let textSuccessCompile = "编译成功"
	let textFailedCompile = "编译失败"

	// 开始编译
	if (params.clientId) {
		hx.cliconsole.log({
			clientId: params.clientId,
			msg: textStartCompile,
			status: "Info"
		});
	}

	let compileResult = await unicompile.compile({
		workspaceFolder: params.workspaceFolder,
		type: 'publish.qq',
		name: params.name,
		appid: params.appid,
		clientId: params.clientId,
		customId: params.customId,
		subPackage: params.subPackage
	});

	// 创建输入通道
	let outputChannel = hx.window.createOutputChannel("HBuilder");
	if (compileResult && compileResult.code == 0) {
		// console.log("compileResult@@",compileResult);
		// 编译失败
		if (!compileResult.buildServerPath && !compileResult.buildClientPath) {
			if (params.clientId) {
				hx.cliconsole.log({
					clientId: params.clientId,
					msg: textFailedCompile,
					status: "Error"
				});
			}
			return;
		}
		// 编译成功打印日志
		if (params.clientId) {
			hx.cliconsole.log({
				clientId: params.clientId,
				msg: textSuccessCompile,
				status: "Error"
			});
		}

	} else {
		outputChannel.appendLine(textFailedCompile);
		if (params.clientId) {
			hx.cliconsole.log({
				clientId: params.clientId,
				msg: textFailedCompile,
				status: "Error"
			});
		}
	}
}

function getFromItems(options) {
	let textOptionBtn = "高级(&O)"
	let textSubmitBtn = "发行(&P)"
	let textCancelBtn = "取消(&C)"
	let textTitle = "QQ小程序发行"
	// let textFooter = "<a href=\"https://hx.dcloud.net.cn/cli/publish-mp-weixin\">cli程序化部署教程</a>"
	let textNameInputPlaceholder = "输入QQ小程序名称"
	let textAppidInputPlaceholder = "输入QQ小程序AppId"
	let textSubPackageCheckBoxLabel = "发行为混合分包 <a href=\"https://uniapp.dcloud.net.cn/hybrid\">详情</a>"
	let textSubPackageInputPlaceholder = "请输入分包名称"

	return {
		customButtons: [{
				text: textOptionBtn
			},
			{
				text: textCancelBtn
			},
			{
				text: textSubmitBtn,
				role: 'accept'
			}
		],
		title: textTitle,
		hideSubTitile: true,
		width: 550,
		height: 200,
		// footer: textFooter,
		focusName: "appidInput",
		formItems: [{
				type: "input",
				name: "nameInput",
				placeholder: textNameInputPlaceholder,
				value: options.nameInput ? options.nameInput : "",
			},
			{
				type: "input",
				name: "appidInput",
				placeholder: textAppidInputPlaceholder,
				value: options.appidInput ? options.appidInput : ""
			},
			{
				type: "checkBox",
				name: "subPackageCheckBox",
				label: textSubPackageCheckBoxLabel,
				value: options.subPackageCheckBox ? options.subPackageCheckBox : false
			},
			{
				type: "input",
				name: "subPackageInput",
				placeholder: textSubPackageInputPlaceholder,
				isHidden: options.subPackageCheckBox == true ? false : true,
				value: options.subPackageInput ? options.subPackageInput : ""
			}
		].map((item) => {
			if (item && !item.isHidden) {
				return item;
			}
		})
	}
}

// QQ发行
async function qqPublish(params) {
	// console.log(params)
	let textError1 = "QQ小程序名称不能为空"
	let textError2 = "QQ小程序appId不能为空"
	let textError3 = "QQ小程序名称不合法";
	let textError4 = "分包名称不能为空";

	let workspaceFolder = params.workspaceFolder

	if (params.args && params.args.isCli) {
		let cliData = params.args
		let clientId = params.clientId
		
		if (params.name == null || params.name == undefined) {
			hx.cliconsole.log({
				clientId: params.clientId,
				msg: textError1,
				status: "Error"
			});
			return
		}
		let appid = params.appid
		if (appid == null || appid == undefined) {
			// 从manifest读取
			let qqInfo = ut.getAppInfo(workspaceFolder, "mp-qq");
			if (qqInfo && qqInfo.appid) {
				appid = qqInfo.appid
			}
			if (appid == null) {
				hx.cliconsole.log({
					clientId: params.clientId,
					msg: textError2,
					status: "Error"
				});
				return
			}
		}
		
		publish({
			workspaceFolder,
			name: params.name,
			appid: appid,
			subPackage: params.subPackage,
			customId: "",
			clientId:clientId
		})
		return
	}

	// 定义全局变量，读写配置文件时使用
	let projectId = workspaceFolder.id
	let nameInput = workspaceFolder.name
	let appidInput
	// 先从manifest读取，读取不到再从配置文件中读取
	let qqInfo = ut.getAppInfo(workspaceFolder, "mp-qq");
	if (qqInfo && qqInfo.appid) {
		appidInput = qqInfo.appid
	}
	// 读取配置文件
	if (projectId) {
		let projectIdData = ut.readPublishConfig(projectId)
		if (projectIdData) {
			if (projectIdData.qqNameInput) {
				nameInput = projectIdData.qqNameInput
			}
			if (!appidInput && projectIdData.qqAppidInput) {
				appidInput = projectIdData.qqAppidInput
			}
		}
	}

	// 弹框
	hx.window.showFormDialog({
		validate: async function(options) {
			if (!options.nameInput) {
				this.showError(textError1)
				return false;
			}
			if (ut.getInvalidInputName().includes(options.nameInput)) {
				this.showError(textError3);
				return false;
			}
			if (!options.appidInput) {
				this.showError(textError2)
				return false;
			}
			if (options.subPackageCheckBox && !options.subPackageInput) {
				this.showError(textError4)
				return false;
			}
			return true;
		},
		onChanged: function(changeName, changeValue, options) {
			if (changeName == "subPackageCheckBox") {
				let items = getFromItems(options)
				this.updateForm(items)
			}
		},
		...getFromItems({
			nameInput,
			appidInput,
			subPackageCheckBox: false
		})
	}).then(function(options) {
		if(options.buttonIndex === 0){
			hx.window.showManifestEditPart({
				projectId,
				optionType:"mp-qq.appid"
			})
			return;
		}
		else if(options.buttonIndex === 1)
		{
			return
		}
		const result = options.result
		// 写配置文件
		if (projectId) {
			ut.writePublishConfig(projectId, {
				qqNameInput: result.nameInput,
				qqAppidInput: result.appidInput
			})
		}

		//开始发行
		publish({
			workspaceFolder,
			name: result.nameInput,
			appid: result.appidInput,
			subPackage: result.subPackageInput,
			customId: params.args.customId,
			// clientId:params.args.clientId
		});
	})
}

// 导出
module.exports = {
	qqPublish: qqPublish
}


/***/ }),

/***/ "./quickappunion.js":
/*!**************************!*\
  !*** ./quickappunion.js ***!
  \**************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const hx = __webpack_require__(/*! hbuilderx */ "hbuilderx")
const ut = __webpack_require__(/*! ./utils.js */ "./utils.js")
const unicompile = __webpack_require__(/*! ./compile.js */ "./compile.js")

// 发行
async function publish(params) {
	// console.log("publish params@@", params)
	let textStartCompile = "开始编译..."
	let textSuccessCompile = "编译成功"
	let textFailedCompile = "编译失败"

	// 开始编译
	if (params.clientId) {
		hx.cliconsole.log({
			clientId: params.clientId,
			msg: textStartCompile,
			status: "Info"
		});
	}

	let compileResult = await unicompile.compile({
		workspaceFolder: params.workspaceFolder,
		type: 'publish.quickappunion',
		name: params.name,
		clientId: params.clientId,
		customId: params.customId,
	});

	// 创建输入通道
	let outputChannel = hx.window.createOutputChannel("HBuilder");
	if (compileResult && compileResult.code == 0) {
		// console.log("compileResult@@",compileResult);
		// 编译失败
		if (!compileResult.buildServerPath && !compileResult.buildClientPath) {
			if (params.clientId) {
				hx.cliconsole.log({
					clientId: params.clientId,
					msg: textFailedCompile,
					status: "Error"
				});
			}
			return;
		}
		// 编译成功打印日志
		if (params.clientId) {
			hx.cliconsole.log({
				clientId: params.clientId,
				msg: textSuccessCompile,
				status: "Error"
			});
		}

	} else {
		outputChannel.appendLine(textFailedCompile);
		if (params.clientId) {
			hx.cliconsole.log({
				clientId: params.clientId,
				msg: textFailedCompile,
				status: "Error"
			});
		}
	}
}

function getFromItems(options) {
	let textSubmitBtn = "发行(&P)"
	let textCancelBtn = "取消(&C)"
	let textTitle = "快应用发行"
	// let textFooter = "<a href=\"https://hx.dcloud.net.cn/cli/publish-mp-weixin\">cli程序化部署教程</a>"
	let textNameInputPlaceholder = "输入快应用名称"

	return {
		submitButtonText: textSubmitBtn,
		cancelButtonText: textCancelBtn,
		title: textTitle,
		hideSubTitile: true,
		width: 550,
		height: 200,
		// footer: textFooter,
		formItems: [{
				type: "input",
				name: "nameInput",
				placeholder: textNameInputPlaceholder,
				value: options.nameInput ? options.nameInput : "",
			}
		]
	}
}

// 快应用发行
async function qauPublish(params) {
	// console.log(params)
	let textError1 = "快应用名称不能为空"
	let textError3 = "快应用名称不合法";

	let workspaceFolder = params.workspaceFolder

	if (params.args && params.args.isCli) {
		let cliData = params.args
		let clientId = params.clientId
		
		if (params.name == null || params.name == undefined) {
			hx.cliconsole.log({
				clientId: params.clientId,
				msg: textError1,
				status: "Error"
			});
			return
		}
		
		publish({
			workspaceFolder,
			name: params.name,
			customId: "",
			clientId:clientId
		})
		return
	}

	// 定义全局变量，读写配置文件时使用
	let projectId = workspaceFolder.id
	let nameInput = workspaceFolder.name
	// 读取配置文件
	if (projectId) {
		let projectIdData = ut.readPublishConfig(projectId)
		if (projectIdData) {
			if (projectIdData.quickappNameInput) {
				nameInput = projectIdData.quickappNameInput
			}
		}
	}

	// 弹框
	hx.window.showFormDialog({
		validate: async function(options) {
			if (!options.nameInput) {
				this.showError(textError1)
				return false;
			}
			if (ut.getInvalidInputName().includes(options.nameInput)) {
				this.showError(textError3);
				return false;
			}
			return true;
		},
		onChanged: function(changeName, changeValue, options) {},
		...getFromItems({
			nameInput
		})
	}).then(function(options) {
		// 写配置文件
		if (projectId) {
			ut.writePublishConfig(projectId, {
				quickappNameInput: options.nameInput
			})
		}

		//开始发行
		publish({
			workspaceFolder,
			name: options.nameInput,
			customId: params.args.customId,
			// clientId:params.args.clientId
		});
	})
}

// 导出
module.exports = {
	qauPublish: qauPublish
}


/***/ }),

/***/ "./utils.js":
/*!******************!*\
  !*** ./utils.js ***!
  \******************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var fs = __webpack_require__(/*! fs */ "fs")
var os = __webpack_require__(/*! os */ "os")
var hjson = __webpack_require__(/*! ./hjson.min.js */ "./hjson.min.js");


function readPublishConfig(projectId) {
	let projectIdData;
	try {
		let publishPath = os.tmpdir();
		publishPath = publishPath + "/publish_uni.json";
		let website;
		let domain;
		let path = os.tmpdir();
		path = path + "/publish_uni.json";

		if (projectId && fs.existsSync(path)) {
			let readData = fs.readFileSync(path);
			let jsonData;
			try {
				jsonData = JSON.parse(readData);
			} catch (e) {}

			if (jsonData) {
				projectIdData = jsonData['' + projectId + ''];
				// console.log("projectIdData:", projectIdData);
			}
		}
	} catch (e) {

	}
	return projectIdData;
}

function writePublishConfig(projectId, configData) {
	try {
		let path = os.tmpdir();
		if (projectId && fs.existsSync(path)) {
			path = path + "/publish_uni.json";
			let jsonData;
			if (projectId && fs.existsSync(path)) {
				let readData = fs.readFileSync(path);
				try {
					jsonData = JSON.parse(readData);
				} catch (e) {
					//TODO handle the exception
				}
			}

			if (!jsonData || typeof jsonData != 'object') {
				jsonData = {
					id: ""
				};
			}

			let json = jsonData[projectId];
			if (!json) {
				json = {};
			}

			if (configData) {
				for (var key in configData) {
					json['' + key + ''] = configData[key];
				}
			}

			jsonData['' + projectId + ''] = json;
			let data = JSON.stringify(jsonData, null, '\t');
			if (data) {
				fs.writeFileSync(path, data);
			}
		}
	} catch (e) {}
}

function getAppInfo(spaceFolder, key) {
	let mainfestPath = spaceFolder.uri.fsPath;
	mainfestPath = mainfestPath + "/manifest.json";
	let info;
	if (mainfestPath && fs.existsSync(mainfestPath)) {
		let readFile = fs.readFileSync(mainfestPath, 'utf8');
		let jsonData = hjson.parse(readFile);
		if (jsonData && jsonData[key]) {
			info = jsonData[key];
		}
	}

	return info;
}

function getInvalidInputName() {
	return ["test", "测试", "abc", "asd", "sdf"]
}

module.exports = {
	readPublishConfig: readPublishConfig,
	writePublishConfig: writePublishConfig,
	getAppInfo: getAppInfo,
	getInvalidInputName:getInvalidInputName
}


/***/ }),

/***/ "./weapp.js":
/*!******************!*\
  !*** ./weapp.js ***!
  \******************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var hx = __webpack_require__(/*! hbuilderx */ "hbuilderx");
var fs = __webpack_require__(/*! fs */ "fs")
var os = __webpack_require__(/*! os */ "os")
const unicompile = __webpack_require__(/*! ./compile.js */ "./compile.js")
var hjson = __webpack_require__(/*! ./hjson.min.js */ "./hjson.min.js");
var util = __webpack_require__(/*! ./utils.js */ "./utils.js");

function getWeappFormItems(formData) {
	let weappPublish = "微信小程序发行";
	let nameInputPlaceholder = "输入微信小程序名称";
	let appidInputPlaceholder = "输入微信小程序AppId";
	let behaviorText = "发行为混合分包 <a href=\"https://uniapp.dcloud.net.cn/hybrid\">详情</a>";
	let subPackgeInputPlaceholder = "输入分包名称";
	let uplodaWeappText =
		"自动上传到微信平台(不会打开微信开发者工具) <a href=\"https://hx.dcloud.net.cn/cli/publish-mp-weixin?id=uploadPrivateKey\">详情</a>";
	let weappVersionText = "输入版本号";
	let fileSelectInputText = "请选择微信代码上传密钥文件";
	let weappDescText = "输入版本描述";
	let footerText = "<a href=\"https://hx.dcloud.net.cn/cli/publish-mp-weixin\">cli程序化部署教程</a>";
	let forms = {
		title: weappPublish,
		hideSubTitile: true,
		width: 600,
		height: 200,
		footer: footerText,
		formItems: [{
				type: "input",
				name: "nameInput",
				placeholder: nameInputPlaceholder,
				value: formData.nameInput ? formData.nameInput : '',
			},
			{
				type: "input",
				name: "appidInput",
				placeholder: appidInputPlaceholder,
				value: formData.appidInput
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
				isHidden: formData.behaviorCheckBox && formData.behaviorCheckBox == true ? false : true,
				value: formData.subPackgeInput
			},
			{
				type: "checkBox",
				name: "uplodaWeappCheckBox",
				label: uplodaWeappText,
				value: formData.uplodaWeappCheckBox ? formData.uplodaWeappCheckBox : false
			},
			{
				type: "input",
				name: "weappVersionInput",
				placeholder: weappVersionText,
				isHidden: formData.uplodaWeappCheckBox && formData.uplodaWeappCheckBox == true ? false : true,
				value: formData.weappVersionInput
			},
			{
				type: "fileSelectInput",
				name: "fileSelectInput",
				placeholder: fileSelectInputText,
				isHidden: formData.uplodaWeappCheckBox && formData.uplodaWeappCheckBox == true ? false : true,
				value: formData.fileSelectInput ? formData.fileSelectInput : ''
			},
			{
				type: "input",
				name: "weappDescInput",
				placeholder: weappDescText,
				isHidden: formData.uplodaWeappCheckBox && formData.uplodaWeappCheckBox == true ? false : true,
				value: formData.weappDescInput
			}
		].map((item) => {
			if (item && !item.isHidden) {
				return item;
			}
		})
	};
	return forms;
}

async function publishToweap(params) {
	let tipText1 = "当前操作依赖插件【weapp-miniprogram-ci】,请安装后再试";
	let msgBoxBtnInstall = "安装";
	let msgBoxBtnCancel = "取消";

	if (params && params.uplodaWeapp) {
		let outputChannel = hx.window.createOutputChannel("HBuilder");
		let res = await hx.extensions.existsPlugin("weapp-miniprogram-ci");
		if (res.code == 0) {
			// 判断插件是否存在
			if (!res.exists) {
				if (params.clientId) {
					hx.cliconsole.log({
						clientId: params.clientId,
						msg: tipText1,
						status: "Info"
					});
					// 安装插件
					hx.extensions.installPlugin("weapp-miniprogram-ci");
				} else {
					let result = hx.window.showMessageBox({
						type: 'warning',
						title: '',
						text: tipText1,
						buttons: [msgBoxBtnInstall, msgBoxBtnCancel]
					});
					result.then((button) => {
						console.log(button)
						if (button == msgBoxBtnInstall) {
							hx.extensions.installPlugin("weapp-miniprogram-ci");
						}
					});
				}
				return;
			}

		} else {
			if (params.clientId) {
				hx.cliconsole.log({
					clientId: params.clientId,
					msg: res.msg,
					status: "Error"
				});
			} else {
				outputChannel.appendLine(res.msg);
			}
			return;
		}
	}

	let compileResult = await unicompile.compile({
		workspaceFolder: params.workspaceFolder,
		type: 'publish.weapp',
		name: params.name,
		appid: params.appid,
		customId: params.customId,
		subPackge: params.subPackge,
		clientId: params.clientId,
		uplodaWeapp: params.uplodaWeapp
	});

	if (compileResult && compileResult.code == 0 && params && params.uplodaWeapp) {
		let buildPath = compileResult.buildClientPath;
		let privatekey = params.privatekey;
		let version = params.version;
		let description = params.description;

		if (buildPath && fs.existsSync(buildPath)) {
			let extension = hx.extensions.getExtension("weapp-miniprogram-ci");
			if (extension) {
				await extension.upload({
					appid: params.appid,
					buildClientPath: buildPath,
					privatekey: privatekey,
					version: version,
					description: description,
					clientId: params.clientId
				});
			} else {
				if (params.clientId) {
					hx.cliconsole.log({
						clientId: params.clientId,
						msg: tipText1,
						status: "Errors"
					});
				}
				// console.error("插件不存在", extension);
			}
		}
	}
}

function getAppInfo(spaceFolder, key) {
	let mainfestPath = spaceFolder.uri.fsPath;
	mainfestPath = mainfestPath + "/manifest.json";
	let info;
	if (mainfestPath && fs.existsSync(mainfestPath)) {
		let readFile = fs.readFileSync(mainfestPath, 'utf8');
		let jsonData = hjson.parse(readFile);
		if (jsonData && jsonData[key]) {
			info = jsonData[key];
		}
	}

	return info;
}

async function weAppPublish(params) {
	let isCli = false;
	if (params && params.args && params.args.isCli) {
		isCli = params.args.isCli;
	}

	let optionText = "高级(&O)";
	let submitText = "发行(&P)";
	let cancelText = "取消(&C)";
	let plesaseInputName = "微信小程序名称不能为空";
	let invalidInputName = "微信小程序名称不合法";
	let plesaseInputAppid = "微信小程序AppId不能为空";
	let plesaseInputAppidsubPack = "分包名称不能为空";
	let pleaseInputweappVersion = "版本号不能为空";
	let pleaseInputfileSelectInput = "小程序代码上传密钥不能为空";
	let pleaseInputweappDesc = "描述不能为空";
	let spaceFolder = params.workspaceFolder;

	if (isCli == true) {
		console.log("name -----",params.args.name)
		// 校验名称是否合法
		if(util.getInvalidInputName().includes(params.args.name))
		{
			hx.cliconsole.log({
				clientId: params.args.clientId,
				msg: invalidInputName,
				status: "Error"
			});
			return;
		}
		if (params.args.upload && !params.args.version) {
			let version = getAppInfo(spaceFolder, "versionName");
			if (version) {
				params.args.version = version;
			} else {
				await hx.cliconsole.log({
					clientId: params.args.clientId,
					msg: pleaseInputweappVersion,
					status: "Error"
				});
				return;
			}
		}

		if (params.args.upload && !params.args.description) {
			await hx.cliconsole.log({
				clientId: params.args.clientId,
				msg: pleaseInputweappDesc,
				status: "Error"
			});
			return;
		}

		if (!params.args.appid) {
			let mpweappinfo = getAppInfo(spaceFolder, "mp-weixin");
			if (mpweappinfo && mpweappinfo.appid) {
				params.args.appid = mpweappinfo.appid;
			} else {
				await hx.cliconsole.log({
					clientId: params.args.clientId,
					msg: plesaseInputAppid,
					status: "Error"
				});
				return;
			}
		}

		let publishResult = await publishToweap({
			workspaceFolder: spaceFolder,
			name: params.args.name,
			appid: params.args.appid,
			subPackge: params.args.subPackge,
			uplodaWeapp: params.args.upload,
			clientId: params.args.clientId,
			version: params.args.version,
			description: params.args.description,
			privatekey: params.args.privatekey
		});

		await hx.cliconsole.log({
			clientId: params.args.clientId,
			msg: "",
			status: "Error"
		});
		return;
	}

	let projectId = spaceFolder.id;

	let version = getAppInfo(spaceFolder, "versionName");
	let description;
	let privatekey;

	let weappName = getAppInfo(spaceFolder, "name");
	// let appid;
	let mpweappinfo = getAppInfo(spaceFolder, "mp-weixin");
	let weappAppid;
	if (mpweappinfo) {
		weappAppid = mpweappinfo.appid;
	}
	// 读取配置文件
	if (projectId) {
		let configData = util.readPublishConfig(projectId);
		if (configData && configData.weappName) {
			weappName = configData.weappName;
		}
		if (configData && configData.weappAppid) {
			weappAppid = configData.weappAppid
		}
		if (configData && configData.weappPrivatekey) {
			privatekey = configData.weappPrivatekey
		}
	}

	let form = hx.window.showFormDialog({
		customButtons: [{
				text: optionText
			},
			{
				text: cancelText
			},
			{
				text: submitText,
				role: 'accept'
			}
		],
		validate: async function(formData) {
			if (!formData.nameInput) {
				this.showError(plesaseInputName);
				return false;
			}
			if (util.getInvalidInputName().includes(formData.nameInput)) {
				this.showError(invalidInputName);
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

			if (formData.uplodaWeappCheckBox && !formData.weappVersionInput) {
				this.showError(pleaseInputweappVersion);
				return false;
			}

			if (formData.uplodaWeappCheckBox && !formData.fileSelectInput) {
				this.showError(pleaseInputfileSelectInput);
				return false;
			}

			if (formData.uplodaWeappCheckBox && !formData.weappDescInput) {
				this.showError(pleaseInputweappDesc);
				return false;
			}

			this.showError("");
			return true;
		},
		onChanged: function(field, value, formData) {
			if (field == "behaviorCheckBox" || field == "uplodaWeappCheckBox") {
				if (field == "uplodaWeappCheckBox" && !formData.weappVersionInput) {
					formData['weappVersionInput'] = version;
				}
				if (field == "uplodaWeappCheckBox" && !formData.fileSelectInput) {
					formData['fileSelectInput'] = privatekey;
				}
				if (field == "behaviorCheckBox" && true == formData.behaviorCheckBox) {
					formData['uplodaWeappCheckBox'] = false;
				}
				if (field == "uplodaWeappCheckBox" && true == formData.uplodaWeappCheckBox) {
					formData['behaviorCheckBox'] = false;
				}
				let updateFormdata = getWeappFormItems(formData);
				this.updateForm(updateFormdata);
			}
			return true;
		},
		...getWeappFormItems({
			nameInput: weappName,
			appidInput: weappAppid,
			weappDescInput: description,
			fileSelectInput: privatekey
		})
	});

	form.then(async (res) => {
		if (res.buttonIndex == 0) {
			hx.window.showManifestEditPart({
				projectId,
				optionType: "mp-weixin.appid"
			})
			return;
		} else if (res.buttonIndex == 1) {
			return
		}
		const result = res.result;
		let weappName = result.nameInput;
		let weappAppid = result.appidInput;
		let behavior = result.behaviorCheckBox;
		let uplodaWeapp = result.uplodaWeappCheckBox;
		version = result.weappVersionInput;
		description = result.weappDescInput;
		privatekey = result.fileSelectInput;
		let existsResult = await hx.unicloud.getExistsUnicloudAndBindSpace({
			workspaceFolder: spaceFolder
		});
		if (existsResult && existsResult.code == 0 && true == existsResult.unicloud) {
			if (!existsResult.spaceId) {
				let okText = "确定(&O)";
				let buttons = [];
				buttons.push(okText);
				buttons.push(cancelText);
				let continueOperation = "当前项目没有绑定服务空间,确定要继续操作?";
				let messageBoxresult = await hx.window.showMessageBox({
					type: 'question',
					title: '',
					text: continueOperation,
					buttons: buttons
				});
				if (messageBoxresult != okText) {
					return;
				}
			}
		}

		let jsonData = {
			weappName: weappName,
			weappAppid: weappAppid,
			weappPrivatekey: privatekey
		};
		
		util.writePublishConfig(projectId, jsonData);

		let subPackge;
		if (behavior) {
			subPackge = result.subPackgeInput;
		}

		await publishToweap({
			workspaceFolder: spaceFolder,
			type: 'publish.weapp',
			name: weappName,
			appid: weappAppid,
			customId: params.args.customId,
			subPackge: subPackge,
			uplodaWeapp: uplodaWeapp,
			version: version,
			description: description,
			privatekey: privatekey
		});
	}).catch((info) => {
		//console.log("info:",info);
	});
}

module.exports = {
	weAppPublish: weAppPublish
}


/***/ }),

/***/ "hbuilderx":
/*!****************************!*\
  !*** external "hbuilderx" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("hbuilderx");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./extension.js");
/******/ 	var __webpack_export_target__ = exports;
/******/ 	for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
/******/ 	if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ 	
/******/ })()
;