"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompletionFilesSync = exports.getCompletionFiles = exports.DefaultFileExtensions = void 0;
const fs = require("fs");
const path = require("path");
const vscode_uri_1 = require("vscode-uri");
const imageSuffix = ['.png', '.jpg', '.jpeg', '.jpe', '.gif', '.bmp', '.wbmp', '.wbm', '.svg', '.webp', '.ico', '.icns'];
const mediaSuffix = [
    '.3gpp',
    '.webm',
    '.wmv',
    '.avi',
    '.mov',
    '.qt',
    '.ogg',
    '.mp3',
    '.wav',
    '.mid',
    '.midi',
    '.asf',
    '.mpa',
    '.m2ts',
    '.swf',
    '.evo',
    '.3gp',
    '.flv',
    '.cda',
    '.rm',
    '.wma',
    '.ram',
    '.ra',
    '.rmvb',
    '.weba',
    '.mp4',
    '.mpg',
    '.mpeg',
];
const vueSuffix = ['.vue', '.nvue'];
const jsSuffix = ['.js'];
const cssSuffix = ['.css'];
const htmlSuffix = ['.html', '.htm'];
const fontSuffix = ['.otf', '.ttf', '.woff', '.woff2', '.svg', '.eot'];
const forwardSlash = '/'.charCodeAt(0);
const filterDirs = ['.git', '.svn', 'node_modules', 'unpackage', '.hbuilderx'];
exports.DefaultFileExtensions = {
    image: imageSuffix,
    media: mediaSuffix,
    js: jsSuffix,
    css: cssSuffix,
    html: htmlSuffix,
    font: fontSuffix,
    vue: vueSuffix
};
/**
 * 获取url路径, 传入参数的option.prefixPath, 如果是单个/开头, 则返回的路径都为项目下的绝对路径
 * 如果是其他开头, 则返回当前文件的相对路径
 * @param workspaceFolder 项目路径
 * @param option 获取路径的设置选项
 * @param documentUri 当前文档的url
 * @returns
 */
async function getCompletionFiles(workspaceFolder, option, documentUri) {
    var _a, _b, _c;
    const rootDir = typeof workspaceFolder == 'string' ? workspaceFolder : vscode_uri_1.URI.parse(workspaceFolder.uri).fsPath;
    if (!fs.existsSync(rootDir))
        return null;
    const docPath = vscode_uri_1.URI.parse(documentUri).fsPath;
    // if (!fs.existsSync(docPath)) return null;
    const limit = (_a = option.limit) !== null && _a !== void 0 ? _a : -1;
    if (limit === 0)
        return null;
    const timeout = (_b = option.timeout) !== null && _b !== void 0 ? _b : -1;
    let prefixPath = (_c = option.prefixPath) !== null && _c !== void 0 ? _c : '';
    let searchRoot = '';
    let relativeRoot = '';
    let absolutePath = false;
    const result = { prefixRoot: '', files: [] };
    // 获取部分已经输入的路径信息
    if (prefixPath) {
        const lastSlash = prefixPath.lastIndexOf('/');
        const prefixDir = lastSlash >= 0 ? prefixPath.slice(0, lastSlash) : '';
        if (prefixPath.startsWith('/') && !prefixPath.startsWith('//')) {
            searchRoot = path.resolve(rootDir, prefixDir.slice(1));
            if (!fs.existsSync(searchRoot))
                return null;
            absolutePath = true;
        }
        else {
            const docDir = path.dirname(vscode_uri_1.URI.parse(documentUri).fsPath);
            searchRoot = path.resolve(docDir, prefixDir);
            if (!fs.existsSync(searchRoot))
                return null;
        }
        result.prefixRoot = prefixDir;
        relativeRoot = searchRoot;
    }
    else {
        searchRoot = rootDir;
        relativeRoot = path.dirname(vscode_uri_1.URI.parse(documentUri).fsPath);
    }
    if (searchRoot) {
        const completionFiles = [];
        const doSearch = (resolve, reject) => {
            let start = process.uptime();
            let dirList = [searchRoot];
            let withRootDirs = !!option.withCurrentLevelFolder;
            let withRootFiles = !!option.withAllCurrentLevelFiles;
            while (dirList.length > 0 && (limit < 0 || completionFiles.length < limit)) {
                let root = dirList.shift();
                let files = fs.readdirSync(root, { withFileTypes: true });
                files.forEach((f) => {
                    const fileName = f.name.toLowerCase();
                    const p = path.join(root, f.name);
                    if (f.isFile()) {
                        let valid = withRootFiles || option.extensionFilters.length == 0;
                        if (!valid) {
                            valid = option.extensionFilters.some((ext) => {
                                return fileName.endsWith(ext);
                            });
                        }
                        if (valid) {
                            let rel = path.relative(relativeRoot, p).replace(/\\/g, '/');
                            if (p !== docPath) {
                                completionFiles.push({ file: p, relative: rel });
                            }
                        }
                    }
                    else if (f.isDirectory() && !filterDirs.includes(f.name.toLocaleLowerCase())) {
                        dirList.push(p);
                        if (withRootDirs) {
                            let rel = path.relative(relativeRoot, p).replace(/\\/g, '/');
                            // p可能与relativeRoot相同，rel为空
                            if (rel) {
                                completionFiles.unshift({ file: p, relative: rel + '/', isDir: true });
                            }
                        }
                    }
                });
                withRootDirs = false;
                withRootFiles = false;
                const now = process.uptime();
                if (timeout > 0 && (now - start) * 1000 > timeout) {
                    break;
                }
            }
            result.files = completionFiles;
            resolve(result);
        };
        return new Promise(doSearch);
    }
    return null;
}
exports.getCompletionFiles = getCompletionFiles;
/**
 * 获取url路径, 传入参数的option.prefixPath, 如果是单个/开头, 则返回的路径都为项目下的绝对路径
 * 如果是其他开头, 则返回当前文件的相对路径
 * @param workspaceFolder 项目路径
 * @param option 获取路径的设置选项
 * @param documentUri 当前文档的url
 * @returns
 */
function getCompletionFilesSync(workspaceFolder, option, documentUri) {
    var _a, _b, _c;
    const rootDir = typeof workspaceFolder == 'string' ? workspaceFolder : vscode_uri_1.URI.parse(workspaceFolder.uri).fsPath;
    if (!fs.existsSync(rootDir))
        return null;
    const docPath = vscode_uri_1.URI.parse(documentUri).fsPath;
    // if (!fs.existsSync(docPath)) return null;
    const limit = (_a = option.limit) !== null && _a !== void 0 ? _a : -1;
    if (limit === 0)
        return null;
    const timeout = (_b = option.timeout) !== null && _b !== void 0 ? _b : -1;
    let prefixPath = (_c = option.prefixPath) !== null && _c !== void 0 ? _c : '';
    let searchRoot = '';
    let relativeRoot = '';
    let absolutePath = false;
    const result = { prefixRoot: '', files: [] };
    // 获取部分已经输入的路径信息
    if (prefixPath) {
        const lastSlash = prefixPath.lastIndexOf('/');
        const prefixDir = lastSlash >= 0 ? prefixPath.slice(0, lastSlash) : '';
        if (prefixPath.startsWith('/') && !prefixPath.startsWith('//')) {
            searchRoot = path.resolve(rootDir, prefixDir.slice(1));
            if (!fs.existsSync(searchRoot))
                return null;
            absolutePath = true;
        }
        else {
            const docDir = path.dirname(vscode_uri_1.URI.parse(documentUri).fsPath);
            searchRoot = path.resolve(docDir, prefixDir);
            if (!fs.existsSync(searchRoot))
                return null;
        }
        result.prefixRoot = prefixDir;
        relativeRoot = searchRoot;
    }
    else {
        searchRoot = rootDir;
        relativeRoot = path.dirname(vscode_uri_1.URI.parse(documentUri).fsPath);
    }
    if (searchRoot) {
        const rootSep = absolutePath ? '/' : '';
        const completionFiles = [];
        const doSearch = () => {
            let start = process.uptime();
            let dirList = [searchRoot];
            let withRootDirs = !!option.withCurrentLevelFolder;
            let withRootFiles = !!option.withAllCurrentLevelFiles;
            while (dirList.length > 0 && (limit < 0 || completionFiles.length < limit)) {
                let root = dirList.shift();
                let files = fs.readdirSync(root, { withFileTypes: true });
                files.forEach((f) => {
                    const fileName = f.name.toLowerCase();
                    const p = path.join(root, f.name);
                    if (f.isFile()) {
                        let valid = withRootFiles || option.extensionFilters.length == 0;
                        if (!valid) {
                            valid = option.extensionFilters.some((ext) => {
                                return fileName.endsWith(ext);
                            });
                        }
                        if (valid) {
                            let rel = path.relative(relativeRoot, p).replace(/\\/g, '/');
                            if (p !== docPath) {
                                completionFiles.push({ file: p, relative: rootSep + rel });
                            }
                        }
                    }
                    else if (f.isDirectory() && !filterDirs.includes(f.name.toLocaleLowerCase())) {
                        dirList.push(p);
                        if (withRootDirs) {
                            let rel = path.relative(relativeRoot, p).replace(/\\/g, '/');
                            // p可能与relativeRoot相同，rel为空
                            if (rel) {
                                completionFiles.push({ file: p, relative: rootSep + rel + '/', isDir: true });
                            }
                        }
                    }
                });
                withRootDirs = false;
                withRootFiles = false;
                const now = process.uptime();
                if (timeout > 0 && (now - start) * 1000 > timeout) {
                    break;
                }
            }
            result.files = completionFiles;
            return result;
        };
        return doSearch();
    }
    return null;
}
exports.getCompletionFilesSync = getCompletionFilesSync;
//# sourceMappingURL=ProjectFileFilter.js.map