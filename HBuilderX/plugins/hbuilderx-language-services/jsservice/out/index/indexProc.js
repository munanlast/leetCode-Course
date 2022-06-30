"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFileIndexProcessor = void 0;
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const ts = require("typescript");
const indexlib_1 = require("../../../indexlib");
const utils_1 = require("../../../utils");
const vueRouterProc_1 = require("./vueRouterProc");
const vuexProc_1 = require("./vuexProc");
const utils_2 = require("./utils");
let docVersion = 0.0;
function getLanguageSerivceHost() {
    let currentTextDocument = vscode_languageserver_textdocument_1.TextDocument.create('init', 'javascript', 1, '');
    const documentProvider = {
        get version() {
            return "" + (currentTextDocument.version + docVersion);
        },
        get compilerOptions() {
            return {
                allowNonTsExtensions: true,
                allowJs: true,
                lib: ["lib.es6.d.ts"],
                target: ts.ScriptTarget.Latest,
                moduleResolution: ts.ModuleResolutionKind.Classic,
                experimentalDecorators: false
            };
        },
        get documents() {
            return [currentTextDocument.uri];
        },
        getDocumentSnapshot(uri) {
            let text = '';
            if (uri === currentTextDocument.uri) {
                text = currentTextDocument.getText();
            }
            return {
                getText: (start, end) => text.substring(start, end),
                getLength: () => text.length,
                getChangeRange: () => undefined
            };
        },
        getDocumentVersion(uri) {
            if (uri == currentTextDocument.uri) {
                return "" + (currentTextDocument.version + docVersion);
            }
            return "1";
        },
        hasDocument(uri) {
            if (uri == currentTextDocument.uri) {
                return true;
            }
            return false;
        }
    };
    return {
        getLanguaserService(document, ws) {
            currentTextDocument = document;
            docVersion++;
            let proj = utils_1.hx.getProject(ws.uri);
            if (proj) {
                return proj.createTSLanguageService(documentProvider);
            }
            return undefined;
        }
    };
}
function mergeIndexData(from, to) {
    from.categories.forEach((cate => {
        if (to.categories.indexOf(cate) === -1) {
            to.categories.push(cate);
            to[cate] = [];
        }
        let items = from[cate];
        if (items.length > 0) {
            to[cate].push(...items);
        }
    }));
    to.references.push(...from.references);
}
const host = getLanguageSerivceHost();
class JavascriptIndexProcessor {
    constructor(manager) {
        this.lastUri = '';
        this.lastProcTime = -1;
        this.astIndexProcs = [];
        this.processorMnger = manager;
    }
    support(doc, _ws, _source) {
        if (this.lastUri && doc.uri == this.lastUri) {
            if (process.uptime() - this.lastProcTime < 1) { // 避免频繁重复调用doIndex
                return false;
            }
        }
        this.lastUri = ''; // 清除掉
        if (doc.languageId == 'javascript' || doc.languageId == 'javascript_es6') {
            return true;
        }
        const ext = doc.uri.toLowerCase();
        return ext.endsWith('.js');
    }
    searchAst(doc, sourceFile, result) {
        function getExpressAfterNew(node) {
            let children = node.getChildren();
            let newKeywordInex = children.findIndex((child) => { return child.kind == ts.SyntaxKind.NewKeyword; });
            if (newKeywordInex >= 0) {
                let identifier = children[newKeywordInex + 1];
                if (identifier) {
                    switch (identifier.kind) {
                        case ts.SyntaxKind.Identifier:
                        case ts.SyntaxKind.PropertyAccessExpression:
                            return identifier;
                            break;
                        default:
                            break;
                    }
                }
            }
            return undefined;
        }
        let that = this;
        function searchChildren(root, level) {
            if (level < 10) {
                const children = root.getChildren();
                for (let i = 0; i < children.length; i++) {
                    let child = children[i];
                    let newExp = utils_2.tsConvert.asNewExpression(children[i]);
                    if (newExp) {
                        let expression = getExpressAfterNew(newExp);
                        if (expression) {
                            that.astIndexProcs.forEach((proc) => {
                                var _a;
                                let data = (_a = proc.onNewExpression) === null || _a === void 0 ? void 0 : _a.call(proc, doc, newExp, expression);
                                if (data) {
                                    mergeIndexData(data, result);
                                }
                            });
                        }
                    }
                    let callExp = utils_2.tsConvert.asCallExpression(children[i]);
                    if (callExp) {
                        that.astIndexProcs.forEach((proc) => {
                            var _a;
                            let data = (_a = proc.onCallExpression) === null || _a === void 0 ? void 0 : _a.call(proc, doc, callExp);
                            if (data) {
                                mergeIndexData(data, result);
                            }
                        });
                    }
                    searchChildren(child, level + 1);
                }
            }
        }
        return searchChildren(sourceFile, 0);
    }
    doIndex(doc, ws, _source) {
        if (!ws) {
            return new indexlib_1.IndexData();
        }
        let option = { source: _source, ws, };
        this.astIndexProcs = [];
        let vuerouterIndexProc = (0, vueRouterProc_1.getVueRouterIndexProc)(ws);
        let vuexIndexProc = (0, vuexProc_1.getVuexIndexProc)(ws);
        [vuerouterIndexProc, vuexIndexProc].forEach(proc => {
            if (proc.support(doc, option)) {
                this.astIndexProcs.push(proc);
            }
        });
        if (this.astIndexProcs.length === 0) {
            return new indexlib_1.IndexData();
        }
        let result = new indexlib_1.IndexData();
        let dataItems = [];
        let service = host.getLanguaserService(doc, ws);
        if (service) {
            let program = service.getProgram();
            let tc = program.getTypeChecker();
            let sf = program.getSourceFile(doc.uri);
            if (sf) {
                for (let i = 0; i < sf.statements.length; i++) {
                    let importStatement = utils_2.tsConvert.asImportStatement(sf.statements[i]);
                    if (importStatement) {
                        this.astIndexProcs.forEach((proc) => {
                            var _a;
                            let indextData = (_a = proc.onImportStatement) === null || _a === void 0 ? void 0 : _a.call(proc, doc, importStatement);
                            if (indextData) {
                                mergeIndexData(indextData, result);
                            }
                        });
                    }
                }
                this.searchAst(doc, sf, result);
            }
        }
        this.lastUri = doc.uri;
        this.lastProcTime = process.uptime();
        return result;
    }
}
function createFileIndexProcessor(_manager) {
    let ret = new JavascriptIndexProcessor(_manager);
    return ret;
}
exports.createFileIndexProcessor = createFileIndexProcessor;
//# sourceMappingURL=indexProc.js.map