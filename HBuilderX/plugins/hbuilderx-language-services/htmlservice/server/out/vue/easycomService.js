"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchVueComponentInfo = exports.collectEasycoms = void 0;
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const vscode_html_languageservice_1 = require("vscode-html-languageservice");
const vscode_uri_1 = require("vscode-uri");
const jsonc_1 = require("jsonc");
const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const utils_1 = require("../../../../utils");
function visitFiles(containerDir, callback) {
    if (!fs.existsSync(containerDir)) {
        return;
    }
    let componentsDirInfo = fs.statSync(containerDir);
    if (componentsDirInfo.isDirectory()) {
        let children = fs.readdirSync(containerDir);
        for (let child of children) {
            let childInfo = fs.statSync(path.join(containerDir, child));
            if (childInfo.isDirectory()) {
                visitFiles(path.join(containerDir, child), callback);
            }
            else {
                callback(path.join(containerDir, child));
            }
        }
    }
}
function scanComponents(componentsDir) {
    let easycoms = [];
    if (!fs.existsSync(componentsDir)) {
        return easycoms;
    }
    let componentsDirInfo = fs.statSync(componentsDir);
    if (componentsDirInfo.isDirectory()) {
        let components = fs.readdirSync(componentsDir);
        for (let compName of components) {
            if (!fs.statSync(path.join(componentsDir, compName)).isDirectory()) {
                continue;
            }
            let compExts = [".vue", ".nvue"];
            for (let ext of compExts) {
                let compfile = path.join(componentsDir, compName, compName + ext);
                if (fs.existsSync(compfile)) {
                    easycoms.push({
                        name: compName,
                        filePath: compfile
                    });
                    break;
                }
            }
        }
    }
    return easycoms;
}
function collectRuleRegexGroups(ruleRegex) {
    let groups = new Map();
    let group = 0;
    let groupStart = -1;
    for (let i = 0; i < ruleRegex.length; i++) {
        let ch = ruleRegex.charAt(i);
        if (ch == '(') {
            group++;
            groupStart = i;
        }
        else if (ch == ')') {
            if (groupStart != -1 && i > groupStart) {
                groups.set(group, {
                    start: groupStart,
                    end: i + 1
                });
            }
            groupStart = -1;
        }
    }
    return groups;
}
function buildGroupMappings(filePathRegex, groups) {
    let groupMaps = new Map();
    if (groups.size > 0) {
        let prevChar = '\0';
        let groupIndex = 0;
        for (let i = 0; i < filePathRegex.length; i++) {
            let ch = filePathRegex.charAt(i);
            if (ch >= '0' && ch <= '9' && prevChar == '$') {
                let groupRefIndex = Number.parseInt(ch);
                if (groups.has(groupRefIndex)) {
                    groupIndex++;
                    groupMaps.set(groupIndex, groupRefIndex);
                }
            }
            prevChar = ch;
        }
    }
    return groupMaps;
}
function scanAllEasycomByCustomRule(filePathRegex, easycomRuleRegex, easycomRuleFullpath, groups, groupMaps, project) {
    let easycoms = [];
    let reg = new RegExp(filePathRegex);
    let subpaths = filePathRegex.split("/");
    let searchFolder = vscode_uri_1.URI.parse(project.uri).fsPath;
    while (subpaths.length > 0) {
        let subpath = subpaths.shift();
        let nextSearchFolder = path.join(searchFolder, subpath);
        if (fs.existsSync(nextSearchFolder)) {
            searchFolder = nextSearchFolder;
        }
        else {
            break;
        }
    }
    visitFiles(searchFolder, (file) => {
        let relativePath = path.relative(vscode_uri_1.URI.parse(project.uri).fsPath, file);
        let matches = reg.exec(relativePath);
        if (matches) {
            const replaceRanges = [];
            const groupRefIndexs = new Map();
            for (let i = 1; i < matches.length; i++) {
                if (groupMaps.has(i)) {
                    let groupMatch = matches[i];
                    let groupRefIndex = groupMaps.get(i);
                    let range = groups.get(groupRefIndex);
                    let exists = replaceRanges.find(r => r.start == range.start && r.end == range.end);
                    if (!exists) {
                        replaceRanges.push({
                            start: range === null || range === void 0 ? void 0 : range.start,
                            end: range === null || range === void 0 ? void 0 : range.end,
                            newText: groupMatch
                        });
                    }
                    groupRefIndexs.set(groupRefIndex, groupMatch);
                }
            }
            replaceRanges.sort((a, b) => b.start - a.start);
            let tagName = easycomRuleRegex;
            for (let r of replaceRanges) {
                tagName = tagName.substring(0, r.start) + r.newText + tagName.substring(r.end);
            }
            let easycomFile = easycomRuleFullpath;
            groupRefIndexs.forEach((value, key) => {
                easycomFile = easycomFile.replace(new RegExp("\\$" + key, 'g'), value);
            });
            easycomFile = path.join(vscode_uri_1.URI.parse(project.uri).fsPath, easycomFile);
            if (tagName.length > 0 && fs.existsSync(easycomFile)) {
                if (tagName.startsWith('^')) {
                    tagName = tagName.substring(1);
                }
                if (/^[A-Za-z][A-Za-z0-9\-_]+$/.test(tagName)) {
                    easycoms.push({
                        name: tagName,
                        filePath: easycomFile
                    });
                }
            }
        }
        return true;
    });
    return easycoms;
}
function collectEasycoms(document, htmlDocument, project) {
    var _a, _b;
    let easycoms = [];
    if (project == undefined) {
        return easycoms;
    }
    //首先算当前文件中手动导入的组件
    let instance = parseVuePageInstanceOptions(document, htmlDocument);
    if (instance) {
        let componentsImport = instance.options.find(node => node.name.getText() == 'components');
        let compInfos = componentsImport === null || componentsImport === void 0 ? void 0 : componentsImport.initializer;
        if (compInfos && ts.isObjectLiteralExpression(compInfos)) {
            let importMap = new Map();
            for (let stmt of instance.sourceFile.statements) {
                if (ts.isImportDeclaration(stmt)) {
                    let importStmt = stmt;
                    let importName = (_b = (_a = importStmt.importClause) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.getText();
                    let moduleSpec = importStmt.moduleSpecifier;
                    if (importName && moduleSpec && ts.isStringLiteral(moduleSpec)) {
                        let moduleUri = moduleSpec.text;
                        importMap.set(importName, moduleUri);
                    }
                }
            }
            let realCompInfos = compInfos;
            realCompInfos.properties.forEach(comp => {
                var _a;
                let compName = (_a = comp.name) === null || _a === void 0 ? void 0 : _a.getText();
                if (compName) {
                    let compfile = "";
                    if (importMap.has(compName)) {
                        let moduleUri = importMap.get(compName);
                        if (moduleUri.startsWith("@/")) {
                            compfile = path.join(vscode_uri_1.URI.parse(project.uri).fsPath, moduleUri.substring(2));
                        }
                        else {
                            let _dir = path.dirname(vscode_uri_1.URI.parse(document.uri).fsPath);
                            compfile = path.resolve(_dir, moduleUri);
                        }
                        if (!compfile.endsWith(".vue") && !compfile.endsWith(".nvue")) {
                            for (let ext of [".vue", ".nvue"]) {
                                if (fs.existsSync(compfile + ext)) {
                                    compfile += ext;
                                    break;
                                }
                            }
                        }
                    }
                    easycoms.push({
                        name: compName,
                        filePath: fs.existsSync(compfile) ? compfile : ""
                    });
                    let converted_comp_name = compName.replace(/([A-Z])/g, "-$1").toLowerCase();
                    easycoms.push({
                        name: converted_comp_name.startsWith("-") ? converted_comp_name.substring(1) : converted_comp_name,
                        filePath: fs.existsSync(compfile) ? compfile : ""
                    });
                }
            });
        }
    }
    let sourceRoot = vscode_uri_1.URI.parse(project.uri).fsPath;
    let prj = utils_1.hx.getProject(sourceRoot);
    if (!prj) {
        return easycoms;
    }
    sourceRoot = prj.sourceRoot;
    let pages_json = path.join(sourceRoot, "pages.json");
    if (fs.existsSync(pages_json)) {
        let pagesOption = jsonc_1.jsonc.readSync(pages_json);
        let easycomOptions = pagesOption.easycom || {
            autoscan: true,
            custom: {}
        };
        let customRules = easycomOptions.custom;
        for (let ruleRegex in customRules) {
            let ruleFilepath = customRules[ruleRegex];
            let groups = collectRuleRegexGroups(ruleRegex);
            let groupMaps = buildGroupMappings(ruleFilepath, groups);
            /**
             * @type {string} filePathRegex
             */
            let filePathRegex = ruleFilepath;
            groups.forEach((value, key) => {
                let _groupRegex = ruleRegex.substring(value.start, value.end);
                filePathRegex = filePathRegex.replace(new RegExp("\\$" + key, 'g'), _groupRegex);
            });
            if (filePathRegex.startsWith("@/")) {
                let customComponents = scanAllEasycomByCustomRule(filePathRegex.substr(2), ruleRegex, ruleFilepath.substr(2), groups, groupMaps, project);
                customComponents.forEach(com => {
                    easycoms.push(com);
                });
            }
            else {
                let customComponents = scanAllEasycomByCustomRule("node_modules/" + filePathRegex, ruleRegex, "node_modules/" + ruleFilepath, groups, groupMaps, project);
                customComponents.forEach(com => {
                    easycoms.push(com);
                });
            }
        }
        //自动扫描的优先级低于自定义规则的优先级
        if (easycomOptions.autoscan) {
            //扫描根目录下的组件
            let componentsDir = path.join(sourceRoot, "components");
            let rootComonents = scanComponents(componentsDir);
            rootComonents.forEach(item => {
                easycoms.push(item);
            });
            //扫描uni-modules下的组件
            let unimoduleDir = path.join(sourceRoot, "uni_modules");
            if (fs.existsSync(unimoduleDir)) {
                let unimodules = fs.readdirSync(unimoduleDir);
                for (let unimod of unimodules) {
                    let uniModCompDir = path.join(unimoduleDir, unimod, "components");
                    let uniModComonents = scanComponents(uniModCompDir);
                    uniModComonents.forEach(item => {
                        easycoms.push(item);
                    });
                }
            }
        }
    }
    return easycoms;
}
exports.collectEasycoms = collectEasycoms;
function parseVuePageInstanceOptions(document, htmlDoc) {
    let properties = [];
    if (!htmlDoc) {
        return undefined;
    }
    let scriptRoot = htmlDoc.roots.find(node => node.tag === 'script');
    if (scriptRoot) {
        let instance = {
            options: []
        };
        let scriptRangeStart = document.positionAt(scriptRoot.startTagEnd);
        let scriptRangeEnd = document.positionAt(scriptRoot.endTagStart);
        let scriptText = document.getText({
            start: scriptRangeStart,
            end: scriptRangeEnd
        });
        let easycomAst = ts.createSourceFile(document.uri, scriptText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
        instance.sourceFile = easycomAst;
        let exportAssignNode = easycomAst.statements.find(ts.isExportAssignment);
        if (exportAssignNode) {
            // @ts-ignore
            let jsDoc = exportAssignNode.jsDoc;
            //解析vuedoc内的信息
            if (jsDoc && jsDoc.length > 0) {
                instance.vuedoc = jsDoc[0];
            }
            let exprNode = exportAssignNode.expression;
            //解析源码中的信息
            if (exprNode && ts.isObjectLiteralExpression(exprNode)) {
                let objNode = exprNode;
                objNode.properties.forEach(prop => {
                    if (prop && prop.kind == ts.SyntaxKind.PropertyAssignment) {
                        let propDeclarNode = prop;
                        instance.options.push(propDeclarNode);
                    }
                });
            }
        }
        return instance;
    }
    return undefined;
}
function fetchVueComponentInfo(easycomFile) {
    //首先应该检查下当前打开的文档下有没有该文件，如果有则用打开后的内容，如果没有则读取磁盘上的文件；
    if (!fs.existsSync(easycomFile)) {
        return undefined;
    }
    let htmlService = (0, vscode_html_languageservice_1.getLanguageService)();
    let document = vscode_languageserver_textdocument_1.TextDocument.create(easycomFile, "html", 1, fs.readFileSync(easycomFile).toString());
    let htmlDoc = htmlService.parseHTMLDocument(document);
    let vueInstance = parseVuePageInstanceOptions(document, htmlDoc);
    if (vueInstance) {
        let _properties = new Map();
        let _events = new Map();
        let _compInfo = {
            filePath: easycomFile,
            properties: [],
            events: []
        };
        if (vueInstance.options.length > 0) {
            let propsDeclarNode = vueInstance.options.find(child => { var _a; return ((_a = child.name) === null || _a === void 0 ? void 0 : _a.getText()) === "props"; });
            if (propsDeclarNode) {
                let allProps = propsDeclarNode.initializer;
                if (ts.isObjectLiteralExpression(allProps)) {
                    let allPropsObj = allProps;
                    allPropsObj.properties.forEach(propAssign => {
                        var _a;
                        let propName = (_a = propAssign.name) === null || _a === void 0 ? void 0 : _a.getText();
                        if (propName) {
                            let typeDefinition = propAssign.initializer;
                            let typeName = "";
                            if (ts.isIdentifier(typeDefinition)) {
                                typeName = typeDefinition.getText();
                            }
                            else if (ts.isObjectLiteralExpression(typeDefinition)) {
                                let typeDefinition2 = typeDefinition.properties.find(child => { var _a; return ((_a = child.name) === null || _a === void 0 ? void 0 : _a.getText()) === "type"; });
                                if (typeDefinition2) {
                                    typeName = typeDefinition2.initializer.getText();
                                }
                            }
                            _properties.set(propName, {
                                name: propName,
                                type: typeName
                            });
                        }
                    });
                }
            }
            let events = vueInstance.options.find(child => { var _a; return ((_a = child.name) === null || _a === void 0 ? void 0 : _a.getText()) === "emits"; });
            if (events) {
                let allEvents = events.initializer;
                if (allEvents && ts.isArrayLiteralExpression(allEvents)) {
                    let allEventElements = allEvents.elements;
                    allEventElements.forEach(el => {
                        if (ts.isStringLiteral(el)) {
                            let eventName = el.text;
                            _events.set(eventName, {
                                name: eventName,
                                description: ""
                            });
                        }
                    });
                }
            }
        }
        let vueDoc = vueInstance.vuedoc;
        //解析VueDoc
        if (vueDoc) {
            let _desc = vueDoc.comment;
            let _tutorialLink, _example;
            if (vueDoc.tags) {
                let currentProperty;
                for (let tag of vueDoc.tags) {
                    let tagName = tag.tagName.getText();
                    if (tagName === 'description') {
                        _desc = tag.comment;
                        continue;
                    }
                    else if (tagName === 'tutorial') {
                        _tutorialLink = tag.comment;
                    }
                    else if (tagName === 'property') {
                        let comment = tag.comment;
                        if (comment) {
                            let propWithValuesReg = /\s*{(.*)}\s+(\w+)\s*=\s*\[(.*)\]\s+(.*)/;
                            let matches = propWithValuesReg.exec(comment);
                            if (matches) {
                                let propType = matches[1];
                                let propName = matches[2];
                                let propValues = matches[3];
                                let propDesc = matches[4];
                                let _values = new Map();
                                propValues.split("|").forEach(val => {
                                    _values.set(val, {
                                        value: val
                                    });
                                });
                                _properties.set(propName, {
                                    name: propName,
                                    type: propType,
                                    description: propDesc,
                                    values: _values
                                });
                                currentProperty = propName;
                            }
                            else {
                                let propReg = /\s*{(.*)}\s+(\w+)\s+(.*)/;
                                let propMatches = propReg.exec(comment);
                                if (propMatches) {
                                    let propType = propMatches[1];
                                    let propName = propMatches[2];
                                    let propDesc = propMatches[3];
                                    _properties.set(propName, {
                                        name: propName,
                                        type: propType,
                                        description: propDesc
                                    });
                                    currentProperty = propName;
                                }
                            }
                        }
                    }
                    else if (tagName === 'value') {
                        let comment = tag.comment;
                        if (comment && currentProperty && _properties.has(currentProperty)) {
                            let valueReg = /\s*(\w+)\s+(.*)/;
                            let matches = valueReg.exec(comment);
                            if (matches) {
                                let valueName = matches[1];
                                let valueDesc = matches[2];
                                let propInfo = _properties.get(currentProperty);
                                if (!propInfo.values) {
                                    propInfo.values = new Map();
                                }
                                propInfo.values.set(valueName, {
                                    value: valueName,
                                    description: valueDesc
                                });
                            }
                        }
                    }
                    else if (tagName === 'event') {
                        let comment = tag.comment;
                        if (comment) {
                            let eventReg = /\s*{(.*)}\s+(\w+)\s+(.*)/;
                            let matches = eventReg.exec(comment);
                            if (matches) {
                                let evType = matches[1];
                                let evName = matches[2];
                                let evDesc = matches[3];
                                _events.set(evName, {
                                    name: evName,
                                    description: evDesc
                                });
                            }
                        }
                    }
                    else if (tagName === 'example') {
                        _example = tag.comment;
                    }
                    if (tagName != 'property' && tagName != 'value') {
                        currentProperty = undefined;
                    }
                }
            }
            _compInfo.description = _desc;
            _compInfo.example = _example;
            _compInfo.tutorial = _tutorialLink;
        }
        _properties.forEach(value => {
            var _a;
            (_a = _compInfo.properties) === null || _a === void 0 ? void 0 : _a.push(value);
        });
        _events.forEach(value => {
            var _a;
            (_a = _compInfo.events) === null || _a === void 0 ? void 0 : _a.push(value);
        });
        return _compInfo;
    }
    return undefined;
}
exports.fetchVueComponentInfo = fetchVueComponentInfo;
//# sourceMappingURL=easycomService.js.map