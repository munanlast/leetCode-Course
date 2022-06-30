const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const execa = require("execa");

const { targets: allTargets, fuzzyMatchTarget, copyResource, checkBuildFile } = require("./utils");

const args = require("minimist")(process.argv.slice(2));
const targets = args._;
const devOnly = args.devOnly || args.d;
const buildAllMatching = args.all || args.a;

run();

async function run() {
	const args = [
	  "-b",
	  "--listEmittedFiles",
	  "--verbose"
	];
	let task = execa("tsc", args, {
	  stdio: "inherit",
	  cwd:path.dirname(__dirname)
	});
	try{
		await task;
	}catch(e){
		console.error(e);
		process.exit(task.exitCode);
	}
}
