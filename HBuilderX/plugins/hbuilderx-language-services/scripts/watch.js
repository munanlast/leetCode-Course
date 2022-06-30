const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const execa = require("execa");

const { targets: allTargets, fuzzyMatchTarget, copyResource, addPackage } = require("./utils");

const args = require("minimist")(process.argv.slice(2));
const targets = args._;
const devOnly = args.devOnly || args.d;
const buildAllMatching = args.all || args.a;

run();

async function run() {
	copyResource();
	const args = [
	  "-b",
	  "-w",
	  "--listEmittedFiles",
	  "--verbose"
	];
	await execa("tsc", args, {
	  stdio: "inherit",
	  cwd:path.dirname(__dirname)
	});
}
