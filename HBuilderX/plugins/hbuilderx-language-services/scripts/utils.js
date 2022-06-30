const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const execa = require('execa');
const targets = [];
const rootDir = path.resolve(__dirname, '../');
targets.push(rootDir);
let compileDirs = [
    'utils',
    'indexlib',
    'serverinterface',
    'indexservice',
    'cssservice/entry',
    'cssservice/client',
    'cssservice/server',
    'htmlservice/entry',
    'htmlservice/index',
    'htmlservice/client',
    'htmlservice/server',
    'jsservice',
    'jsservice/src/tsplugins/node_modules/dcloudio',
    'stylusservice',
];
compileDirs.forEach((value) => {
    targets.push(value);
});

exports.targets = targets;
exports.fuzzyMatchTarget = (partialTargets, includeAllMatching) => {
    const matched = [];
    partialTargets.forEach((partialTarget) => {
        for (const target of targets) {
            if (target.match(partialTarget)) {
                matched.push(target);
                if (!includeAllMatching) {
                    break;
                }
            }
        }
    });
    if (matched.length) {
        return matched.sort((a, b) => priority[b] - priority[a]);
    } else {
        console.log();
        console.error(`  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(`Target ${chalk.underline(partialTargets)} not found!`)}`);
        console.log();

        process.exit(1);
    }
};

exports.copyResource = (builtinDtsPath, dstPath) => {
    console.log(`\n${chalk.blueBright(chalk.bold(`Start Copy File!`))}`);
    let resources = ['builtin-dts', 'frameworkdts'];
    console.log(`${builtinDtsPath} - ${dstPath}`);
    try {
        resources.forEach((resource) => {
            let src = path.join(builtinDtsPath, resource);
            let dst = path.join(dstPath, resource);
            fs.copySync(src, dst);
            console.log(`copy ${src} to ${dst}`);
        });
    } catch (err) {
        console.error(`copy resource ${err}`);
    }
    console.log(`${chalk.blueBright(chalk.bold(`Copy File Ends!`))}\n`);
};

function load(folderPath, regin) {
    let reg = regin;
    let arrFiles = [];
    const files = fs.readdirSync(folderPath);
    for (let i = 0; i < files.length; i++) {
        const item = files[i];
        const stat = fs.lstatSync(resolve(folderPath, item));
        if (stat.isDirectory()) {
            arrFiles = arrFiles.concat(load(resolve(folderPath, item), reg));
        } else {
            if (reg.test(item)) {
                arrFiles.push(resolve(folderPath, item));
            }
        }
    }
    return arrFiles;
}

function loadFile(folderPath, reg) {
    let arrFiles = [];

    const files = fs.readdirSync(folderPath);
    for (let i = 0; i < files.length; i++) {
        const item = files[i];
        const stat = fs.lstatSync(resolve(folderPath, item));
        if (stat.isDirectory()) {
        } else {
            if (reg.test(item)) {
                arrFiles.push(resolve(folderPath, item));
            }
        }
    }
    return arrFiles;
}

exports.checkBuildFile = () => {
    // 獲取到所有的tsconfig.json文件路徑
    // 在路徑下獲取所有*.ts和src文件夾下的*.ts文件路徑
    // 修改路徑為out下的*.js文件
    // 判斷文件是否存在
    console.log(`\n${chalk.blueBright(chalk.bold(`Start Check File!`))}`);

    // 遍歷獲取所有tsconfig.json文件的路徑
    let reg = /^.*(tsconfig.json)$/;
    let tsconfigFilePathList = load(__dirname.substring(0, __dirname.length - 7), reg);
    let tsconfigFilePathListAfter = [];
    // 遍歷獲取到的路徑, 篩選掉存在node_modules的, 清除掉末尾tsconfig.json
    for (const iterator of tsconfigFilePathList) {
        reg = /^.*(node_modules).*$/;
        if (!reg.test(iterator)) {
            let path = iterator.substring(0, iterator.length - 13);
            if (fs.existsSync(path)) {
                tsconfigFilePathListAfter.push(iterator.substring(0, iterator.length - 13));
            }
        }
    }

    let tscPathList = [];
    for (const iterator of tsconfigFilePathListAfter) {
        const stat = fs.lstatSync(iterator);
        if (stat.isDirectory()) {
            tscPathList.push(iterator);
        }
    }

    let tsFilePathList = [];
    let tsFilePathListAfter = [];
    for (const iterator of tscPathList) {
        let reg = /^.*(.ts)$/;
        let tsconfigFilePathList = loadFile(iterator, reg);
        let tsconfigFilePathList2 = load(path.join(iterator, `\\src`), reg);
        tsFilePathList.push(...tsconfigFilePathList);
        tsFilePathList.push(...tsconfigFilePathList2);
    }

    let reg2 = /^.*(d.ts)$/;
    for (const iterator of tsFilePathList) {
        reg = /^.*(node_modules).*$/;
        if (!reg.test(iterator)) {
            if (!reg2.test(iterator)) {
                tsFilePathListAfter.push(iterator);
            }
        }
    }

    let checkFilePathList = [];
    let jsPath = '';
    for (const tsFile of tsFilePathListAfter) {
        jsPath = tsFile.replace('src', 'out');
        jsPath = jsPath.replace('.ts', '.js');
        checkFilePathList.push(jsPath);
    }

    for (const iterator of checkFilePathList) {
        if (!fs.existsSync(iterator)) {
            console.log(`\n${chalk.redBright(chalk.bold(`File Is NoExistent`))}`);
            console.log(`${chalk.greenBright(chalk.bold(`File Path: ${iterator}`))}\n`);
        }
    }
    console.log(`${chalk.blueBright(chalk.bold(`Check File Ends!`))}\n`);
};
