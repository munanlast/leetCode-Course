const { targets: allTargets, fuzzyMatchTarget, copyResource, checkBuildFile } = require("./utils");

const args = require("minimist")(process.argv.slice(2));
const targets = args._;
const devOnly = args.devOnly || args.d;
const buildAllMatching = args.all || args.a;

run();

async function run() {
	checkBuildFile();
}
