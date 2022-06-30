const fs = require("fs-extra");
const f = require("fs");
const path = require("path");
const execa = require("execa");
const glob = require("glob");
const os = require('os');

run();

async function run() {
	
	let buildTask = execa("npm", ["run", "build"], {
		stdio: "inherit",
	});
	try{
		await buildTask;
	}catch(e){
		console.error(e)
		process.exit(buildTask.exitCode)
		return ;
	}
	let workingDir = path.dirname(__dirname);
	let distDir = path.join(workingDir,'dist');
	if(fs.pathExistsSync(distDir)){
		fs.removeSync(distDir);
	}
	
	const filterFunc = (src, dest) => {
		let stat = f.lstatSync(src);
		if(stat.isDirectory()){
			if(src.indexOf("/builtin-dts/") < 0){
				if(src.endsWith("/node_modules")
					|| src.endsWith("/.vscode")
					|| src.endsWith("/.git")){
					return false;
				}
			}
			return true;
		}
		if(/package-lock\.json$/.test(src) ){
			return false;
		}
		if( /.*\.js$/.test(src) 
		|| /.*\.json/.test(src) || src.indexOf("/builtin-dts/") >= 0 || src.indexOf('/frameworkdts/') >= 0){
			console.log("+" +src);
			return true;
		}
		return false;
	}
	let tempOutDir = path.join(os.tmpdir(), "hbuilderx-language-services-tmp")
	if(fs.pathExistsSync(tempOutDir)){
		fs.removeSync(tempOutDir);
	}
	// fs.mkdirsSync(tempOutDir);
	f.mkdirSync(tempOutDir);
	
	fs.copySync(path.dirname(__dirname), tempOutDir, {
		filter: filterFunc
	}, err => {
		if (err) return console.error(err)
		console.log('success!')
	})
	fs.moveSync(tempOutDir,distDir, {
		overwrite: true
	}, err => {
		if (err) return console.error(err)
		console.log('copy to dist success!')
	})
	//copy dcloudio插件
	fs.copySync(path.dirname(__dirname) + "/jsservice/out/tsplugins", distDir+"/jsservice/out/tsplugins", {
		filter(){
			return true;
		}
	}, err => {
		if (err) return console.error(err)
		console.log('copy dcloudio插件 success!')
	})
	await execa("npm", ["install", "--production","--registry=https://registry.npmmirror.com"], {
		stdio: "inherit",
		cwd: distDir
	});
	let removeFiles = [
		"/node_modules/typescript/bin/",
		"/node_modules/typescript/loc/",
		"/node_modules/typescript/lib/typescript.js",
		"/node_modules/typescript/lib/tsserver.js",
		"/node_modules/typescript/lib/tsserverlibrary.js",
		"/node_modules/typescript/lib/typescript.d.ts",
		"/node_modules/typescript/lib/typescriptServices.js",
		"/node_modules/typescript/lib/typescriptServices.d.ts",
		"/node_modules/typescript/lib/tsc.js"
	];
	removeFiles.forEach((item)=>{
		fs.removeSync(distDir + item);
	});
	//因为修改了typescript源码，所以要将修改后的源码覆盖到新安装的插件内
	let copyTypeScriptFiles = [
		"tsserver.js","tsserverlibrary.js"
	];
	copyTypeScriptFiles.forEach(lib=>{
		fs.copyFileSync(path.join(workingDir,"node_modules/typescript/lib",lib),
						path.join(distDir,"node_modules/typescript/lib",lib));
		//检查typescript内的内容是否正确
		let sourceText = fs.readFileSync(path.join(distDir,"node_modules/typescript/lib",lib));
		if(sourceText.indexOf("IMPORT:hack by dcloudio") < 0){
			console.error("typescript库文件["+ lib + "],未检查到修改的代码！")
			process.exit(999);
		}
	})
	let tsPkgFile = path.join(distDir,"node_modules/typescript/package.json")
	let typePkg = require(tsPkgFile);
	typePkg.main = "./lib/tsserverlibrary.js";
	fs.writeFileSync(tsPkgFile,JSON.stringify(typePkg));
	
	removeFilterFiles([".d.ts",".js.map",".md"],path.join(distDir,"node_modules"),["typescript"]);
	console.log("BUILD RELEASE PKG:OK");
}

function removeFilterFiles(filterExts,workingDir,skipDirs){
	let children = fs.readdirSync(workingDir,{
		withFileTypes:true
	})
	for(let i = 0;i < children.length;i++){
		let child = children[i];
		if(child.isDirectory()){
			if(skipDirs && skipDirs.indexOf(child.name) >= 0){
				continue ;
			}
			removeFilterFiles(filterExts,path.join(workingDir,child.name));
		}else if(child.isFile()){
			filterExts.forEach(filterExt=>{
				if(child.name.endsWith(filterExt)){
					fs.removeSync(path.join(workingDir,child.name));
					console.log("-" +path.join(workingDir,child.name));
				}
			});
		}
	}
}
