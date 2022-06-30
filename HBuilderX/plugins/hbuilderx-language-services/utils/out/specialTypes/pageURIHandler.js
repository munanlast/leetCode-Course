"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doComplete = void 0;
const path = require("path");
const fs = require("fs");
const vscode_languageserver_protocol_1 = require("vscode-languageserver-protocol");
const project_resolve_1 = require("../project-resolve");
const uniCloudPath_1 = require("../common/uniCloudPath");
const vscode_uri_1 = require("vscode-uri");
const c_UnpakcageDir = 'unpackage';
const c_DistDir = 'dist';
const c_UniModules = 'uni_modules';
const c_NodeModules = 'node_modules';
const c_AppVue = 'App.vue';
class CollectingResourceVisitor {
    constructor(list, currentPath, rootPath, isHTML, pageExtends, prefix, configRootPath) {
        this._isHTML = false;
        this._visitedFileCount = 0;
        this._configRootPath = ''; // pages.json root path
        this._isHTML = isHTML;
        this._startTimer = Date.parse(new Date().toString());
        this._result = list;
        this._currentPath = currentPath;
        this._rootPath = rootPath;
        this._pageExtends = pageExtends || ['.vue', 'nvue'];
        this._prefix = prefix;
        this._configRootPath = configRootPath;
    }
    createFileProposal(filePath, name, isHTML) {
        // js ts 中的PageURIString 暂不处理
        return {
            kind: vscode_languageserver_protocol_1.CompletionItemKind.File,
            label: filePath.replace(/\\/g, '/')
        };
    }
    createFileSpecialProposal(list, filePath, name, isHTML) {
        if (filePath.toLocaleLowerCase() === c_AppVue.toLocaleLowerCase())
            return;
        if (this._configRootPath.length > 0) {
            if (!filePath.startsWith(this._configRootPath))
                return;
            filePath = filePath.substring(0, this._configRootPath.length);
        }
        let index = filePath.lastIndexOf('.');
        if (this._pageExtends.findIndex(value => value == '.png') == -1)
            filePath = filePath.substring(0, index);
        let item = this.createFileProposal(filePath, name, isHTML);
        list.add(item);
    }
    shouleAppendRelativeFile(filePath) {
        return !filePath.startsWith('../') && !filePath.startsWith('./') && !filePath.startsWith('/') && !filePath.startsWith('@/');
    }
    getResults() {
        return this._result;
    }
    visit(filePath) {
        this._visitedFileCount++;
        let oriFilePath = filePath;
        if (this._visitedFileCount % 100 === 0) {
            this.checkTimout();
        }
        let relativePath = path.relative(this._rootPath, filePath);
        if (relativePath.startsWith(c_UnpakcageDir)
            || ((0, project_resolve_1.isUniAppVue)(this._rootPath) && relativePath.startsWith(c_DistDir))) {
            return false;
        }
        let basename = path.basename(filePath);
        let { computeAbsoluePath, pathPrefix } = checkComputeAbsolute(this._prefix);
        let isFile = fs.existsSync(filePath) && fs.statSync(filePath).isFile();
        if (isFile) {
            let extname = path.extname(filePath);
            if (this._pageExtends.indexOf(extname) === -1)
                return false;
            let resourceRelativePath = path.relative(this._rootPath, filePath);
            console.log(`CollectingResourceVisitor::visit: resourceRelativePath - ${resourceRelativePath}`);
            //uni_modules/xxx/pages.json 只扫描 uni_modules/xxx/ 下的 vue nuve文件
            if (relativePath.startsWith(c_UniModules)) {
                let index = relativePath.lastIndexOf('/');
                if (index !== -1) {
                    let subString = relativePath.substring(0, index + 1);
                    if (!resourceRelativePath.startsWith(subString))
                        return false;
                }
            }
            if (resourceRelativePath.startsWith(c_UniModules) && (0, uniCloudPath_1.isUniMoudlesPages)(resourceRelativePath))
                return false;
            // file count > 100 return;
            if (basename.startsWith('.'))
                return false;
            filePath = computeFileNameWithCurrentFile(filePath, computeAbsoluePath, pathPrefix, this._rootPath, this._currentPath);
            if (filePath == '')
                return false;
            this.createFileSpecialProposal(this._result, filePath, basename, this._isHTML);
            if (this.shouleAppendRelativeFile(filePath)) {
                filePath = './' + filePath;
                this.createFileSpecialProposal(this._result, filePath, basename, this._isHTML);
            }
            else {
                let relativePath = '/' + path.relative(this._rootPath, oriFilePath);
                this.createFileSpecialProposal(this._result, relativePath, basename, this._isHTML);
            }
            return false;
        }
        let isDir = fs.existsSync(filePath) && fs.statSync(filePath).isDirectory();
        if (isDir) {
            if (basename === c_UniModules || basename === c_NodeModules)
                return false;
        }
        return true;
    }
    checkTimout() {
        return Date.parse(new Date().toString()) - this._startTimer > CollectingResourceVisitor.VISIT_TIMEOUT;
    }
}
CollectingResourceVisitor.VISIT_TIMEOUT = 100;
function relativeURI(parentPath, absolutePath) {
    parentPath = parentPath.replace(/\\/g, '/');
    absolutePath = absolutePath.replace(/\\/g, '/');
    let parentPaths = parentPath.split('/');
    let editorPaths = absolutePath.split('/');
    let start = 0;
    for (let i = 0; i < parentPaths.length; ++i) {
        if (editorPaths.length - 1 >= i) {
            if (parentPaths[i].toLocaleLowerCase() === editorPaths[i].toLocaleLowerCase())
                start++;
            else
                break;
        }
        else {
            break;
        }
    }
    let ends = [];
    for (let i = start + 1; i < parentPaths.length; ++i) {
        ends.push('../');
    }
    for (let i = start; i < editorPaths.length; ++i) {
        ends.push(editorPaths[i]);
        ends.push((i < editorPaths.length - 1) ? `/` : '');
    }
    return ends.join('');
}
function computeFileNameWithCurrentFile(filePath, computeAbsoluePath, pathPrefix, rootPath, currentPath) {
    if (computeAbsoluePath) {
        let relativePath = path.relative(rootPath, filePath);
        if (path.isAbsolute(relativePath)) {
            return pathPrefix + relativePath;
        }
        return '';
    }
    else {
        if ('./' === pathPrefix) {
            let dirPath = path.dirname(currentPath);
            if (!filePath.startsWith(dirPath)) {
                return '';
            }
        }
        let resPath = relativeURI(currentPath, filePath);
        return pathPrefix + resPath;
    }
}
function accept(visitor, initFiles, rootPath) {
    if (fs.existsSync(rootPath)) {
        let visitStack = [];
        visitStack.push(rootPath);
        initFiles.forEach(value => visitStack.unshift(value));
        let visitedFiles = new Set();
        while (visitStack.length > 0) {
            let filePath = visitStack.pop();
            if (!fs.existsSync(filePath))
                continue;
            if (visitedFiles.has(filePath))
                continue;
            visitedFiles.add(filePath);
            if (!visitor.visit(filePath))
                continue;
            if (fs.statSync(filePath).isDirectory()) {
                fs.readdirSync(filePath).forEach(value => {
                    visitStack.push(path.join(filePath, value));
                });
            }
        }
    }
}
function doComplete(position, document, options) {
    var _a;
    let result = [];
    let items = new Set();
    let rootPath = options === null || options === void 0 ? void 0 : options.workspaceFolder;
    let initFiles = [];
    let currentPath = (_a = vscode_uri_1.URI.parse(document.uri)) === null || _a === void 0 ? void 0 : _a.fsPath;
    let { configRootPath, prefix } = getRootPath(options === null || options === void 0 ? void 0 : options.jsonDocument, document.offsetAt(position));
    let visitor = new CollectingResourceVisitor(items, currentPath, rootPath, false, options === null || options === void 0 ? void 0 : options.extends, prefix, configRootPath);
    while (currentPath != vscode_uri_1.URI.file(rootPath).fsPath) {
        let isDir = fs.existsSync(currentPath) && fs.statSync(currentPath).isDirectory();
        if (isDir) {
            initFiles.push(currentPath);
        }
        currentPath = path.dirname(currentPath);
    }
    accept(visitor, initFiles, rootPath);
    result.push(...visitor.getResults());
    return result;
}
exports.doComplete = doComplete;
function getRootPath(jsonDocument, offset) {
    var _a;
    let node = jsonDocument === null || jsonDocument === void 0 ? void 0 : jsonDocument.getNodeFromOffset(offset);
    let nodeValue = node === null || node === void 0 ? void 0 : node.value;
    let parentNode = node === null || node === void 0 ? void 0 : node.parent;
    if ((parentNode === null || parentNode === void 0 ? void 0 : parentNode.type) === 'property') {
        parentNode = parentNode === null || parentNode === void 0 ? void 0 : parentNode.parent;
        if ((parentNode === null || parentNode === void 0 ? void 0 : parentNode.type) === 'object') {
            parentNode = parentNode === null || parentNode === void 0 ? void 0 : parentNode.parent;
            if ((parentNode === null || parentNode === void 0 ? void 0 : parentNode.type) === 'array') {
                parentNode = parentNode === null || parentNode === void 0 ? void 0 : parentNode.parent;
                if ((parentNode === null || parentNode === void 0 ? void 0 : parentNode.type) === 'property') {
                    parentNode = parentNode === null || parentNode === void 0 ? void 0 : parentNode.parent;
                    if ((parentNode === null || parentNode === void 0 ? void 0 : parentNode.type) === 'object') {
                        for (let property of (_a = parentNode) === null || _a === void 0 ? void 0 : _a.properties) {
                            if (property.keyNode.value === 'root') {
                                if (typeof (property.valueNode.value) === 'string') {
                                    let configPath = property.valueNode.value;
                                    return {
                                        configRootPath: configPath + '/',
                                        prefix: nodeValue || ''
                                    };
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    return {
        configRootPath: '',
        prefix: nodeValue || ''
    };
}
function checkComputeAbsolute(prefix) {
    if (prefix.startsWith('/')) {
        return {
            computeAbsoluePath: true,
            pathPrefix: '/'
        };
    }
    else if (prefix.startsWith('./')) {
        return {
            computeAbsoluePath: false,
            pathPrefix: './'
        };
    }
    else {
        return {
            computeAbsoluePath: false,
            pathPrefix: ''
        };
    }
}
//# sourceMappingURL=pageURIHandler.js.map