const hx = require('../hbxBridge.js');
const metatypes = require('../api/metatypes.js');
const { Disposable, Position } = require('vs/workbench/api/common/extHostTypes');
const { IndentAction } = require('vs/editor/common/modes/languageConfiguration');
var minimatch = require('minimatch');
const { Emitter } = require('vs/base/common/event');
const { CancellationToken, CancellationTokenSource } = require('vs/base/common/cancellation');
const { ExtHostDocumentData } = require('./vs_texteditor.js');
const { URI } = require('./base/common/uri');
const { docs } = require('./vs_docsinstance.js');
const convert = require('./convert.js');
const range_1 = require('./editor/common/core/range');
const typeConvert = require('./workbench/api/common/extHostTypeConverters');

const ColoringTreatment = require('./hxMarkedHandle.js');

let marked = require('marked');
let markedOpt = {
    renderer: new marked.Renderer(),
};

let formattingProviderId = 0;
let extId;
// markedOpt.renderer.paragraph = function (text) {
//     return text;
// }
marked.setOptions(markedOpt);
metatypes.registerObject('Position', function(o){
    return new Position(o.line, o.character);
});
metatypes.registerObject('Uri', function (options) {
    return new URI(options.scheme, options.authority, options.path, options.query, options.fragment);
});

// 从HX那边的语言ID转换成一般的语言ID
// 注意, 往回转的时候, 部分ID不需要进行转换
const langMatchTable = {
    'html_es6': 'html',
    'javascript_es6': 'javascript',
    'json_tm': 'json',
    'css2': 'css',
};

function matchLangId(l) {
    var newLangId = l;
    if (langMatchTable.hasOwnProperty(newLangId)) {
        newLangId = langMatchTable[newLangId];
    }
    return newLangId;
}

function vsTextDocument(opt) {
    // console.log(opt);
    if (!opt.eol || (opt.eol != '\n' && opt.eol != '\r\n')) {
        opt.eol = '\n';
    }
    // 转换兼容languageid
    var newlangid = opt.languageId;
    newlangid = matchLangId(newlangid);

    let docData = new ExtHostDocumentData(
        opt.uri,
        opt.text ? opt.text.split(/\r\n|\r|\n/) : [],
        opt.eol,
        opt.versionId,
        // opt.languageId,
        newlangid,
        opt.isClosed,
        opt.isDirty,
        opt.workspaceFolder
    );
    return docData.document;
}

metatypes.registerObject('TextDocument', vsTextDocument);

let languageProvider = {
    lastid: 1000,
};

let cache = {
    lastid: 1000,
    tokenid: 0,
    items: {},
};

let cacheCompletion = {
    id: 1000,
    item: {
        //
    },
};

let languageSupports = {
    lastid: 1000,
};

let debug = {
    mark: false,
    markenable: function () {
        this.mark = true;
    },
};
// String.prototype.mark = function(color) {
// 	if (!debug.mark) return '' + this
// 	const colorIndex = {
// 		black: '30',
// 		red: '31',
// 		green: '32',
// 		yellow: '33',
// 		blue: '34',
// 		purple: '35',
// 		cyan: '36',
// 		white: '37'
// 	};
// 	const colorPatternBegin = '\033[1;{color}m'
// 	const colorPatternEnd = '\033[0m'
// 	let cBegin = colorPatternBegin.replace('{color}', colorIndex[color] || colorIndex.black)
// 	return cBegin + this + colorPatternEnd
// }

// console.log = (function(o){
//     return function(){
//         var newCall = [].slice.call(arguments)
//         try{
//             let prefix = `${__filename}`.split('/').pop().mark();
//             o.call(console, ...[`[${prefix}]`].concat(newCall));
//         }catch(e){
//             console.error('console.log error', e);
//         }
//     }
// })(console.log)

// function match(selector /*DocumentSelector*/ , document /*TextDocument*/ ,callname) {

// 	let ret = debug_match(selector, document);
// 	if(!callname){
// 		console.log(`select document:(${ret})`,
// 		selector,
// 		document?`lang:${document.languageId}, schema:${document.uri.schema}, fs:${document.uri.fsPath}`:"undefined");
// 	}
// 	return ret;
// }
function match(selector /*DocumentSelector*/, document /*TextDocument*/, callname) {
    if (document == undefined) {
        return 0;
    }
    let newdocument = document;
    // newdocument.text = '[show nothing in debug]';
    // console.log('match:'.mark(), "selector".mark('blue'), selector, 'document'.mark('blue'), newdocument)
    // console.log("typeof selector===>",typeof selector);
    // console.log("selector.constructor.name===>",selector.constructor.name);

    let languageMatch = function (s, l) {
        if (langMatchTable.hasOwnProperty(l)) {
            let compat = langMatchTable[l];
            if (s === compat) {
                return 1;
            } else {
                return 0;
            }
        } else if (s === l) {
            return 1;
        }
        return 0;
    };

    if (typeof selector === 'string') {
        if (languageMatch(selector.toLowerCase(), document.languageId.toLowerCase())) {
            // console.log('for string return false ', document.languageId, " != ", selector);
            return 1;
        }
    } else if (typeof selector === 'object') {
        // console.log('for object')
        if (selector.constructor.name === 'Array') {
            let ret = 0;
            for (s in selector) {
                // console.log("selector[s]:",selector[s])
                if (match(selector[s], document, 'recursive call') > 0) {
                    // 其中一个通过则通过
                    ret = 1;
                    break;
                }
            }
            // console.log("match_selectors:",ret);
            return ret;
        } else {
            // for DocumentFilter
            var mcount = 0;
            if (selector.hasOwnProperty('language')) {
                if (languageMatch(selector.language.toLowerCase(), document.languageId.toLowerCase())) {
                    mcount++;
                } else {
                    return 0;
                }
            }
            if (selector.hasOwnProperty('scheme')) {
                if (document.uri.scheme.toLowerCase() === selector.scheme.toLowerCase()) {
                    // console.log('=true', document.uri.scheme.toLowerCase(), selector.scheme.toLowerCase())
                    mcount++;
                } else if (selector.scheme == '*') {
                    mcount++;
                } else {
                    return 0;
                }
            }
            if (selector.hasOwnProperty('pattern')) {
                let m = minimatch(document.uri.fsPath, selector.pattern);
                if (m) {
                    // console.log('=', m, document.uri.fsPath, selector.pattern)
                    mcount++;
                } else {
                    return 0;
                }
            }
            return mcount;
        }
    }
    return 0;
}

async function NOTIMPL() {
    let callee = arguments.callee.name;
    return new Promise((resolve, reject) => {
        reject(`${callee} is valid but function is empty`);
    });
}

function dropCache(uid) {
    if (cache.token) {
        console.log(`cancel last request:${cache.tokenid}`);
        cache.token.cancel();
    }
    for (i in cache.items) {
        delete cache.items[i];
    }
}

// 适配不同插件的返回数据
function getCompletionItemRange(item) {
    let newRange = undefined;
    let startPosition = { line: 0, character: 0 };
    let endPosition = { line: 0, character: 0 };
    if (item.range['replacing']) {
        startPosition.line = item.range['replacing'].start.line;
        startPosition.character = item.range['replacing'].start.character;
        endPosition.line = item.range['replacing'].end.line;
        endPosition.character = item.range['replacing'].end.character;
    } else {
        startPosition.line = item.range.start.line;
        startPosition.character = item.range.start.character;
        endPosition.line = item.range.end.line;
        endPosition.character = item.range.end.character;
    }
    newRange = [startPosition, endPosition];
    return newRange;
}

function getMatchedStrings(data) {
    let reg = /<style>[\s\S]*<\/style>/;
    let reg_g = /<style>[\s\S]*<\/style>/g;
    const result = data.match(reg_g);
    let list = [];
    for (let i = 0; i < result.length; i++) {
        let item = result[i];
        list.push(item.match(reg)[0]);
    }
    return list.join('');
}

//抽取着色的css样式
function extractShading(dataList) {
    let style = '<style></style>';
    for (let i = 0; i < dataList.length; i++) {
        if (dataList[i].includes('<style>')) {
            // 截取字符串, 并获取到截取的数据
            style += getMatchedStrings(dataList[i]);
            dataList[i] = dataList[i].replace(/<style>[\s\S]*<\/style>/g,'');
        }
    }
    style = style.replace(/<style>/g, '');
    style = style.replace(/<\/style>/g, '');
    style = '<style>' + style + '</style>';
    dataList.unshift(style);
    return dataList;
}

//添加分隔线
function addSeparator(dataList) {
    // 先判断是否需要添加分隔线, 少于1行的直接返回
    if (dataList.length < 2) return dataList;

    // 根据是否添加了<style>样式, 进行分别处理

    if (dataList[0].startsWith('<style>')) {
        // 存在样式, 判断是否多于2行, 存在样式时, 第一行必定是样式, 所以需要多于2行, 在第二个标签添加
        if (dataList.length > 2) dataList[1] = '<strong>' + dataList[1] + '</strong><hr>';
        // ⚠️⚠️⚠️注意! 此处的<hr>标签, 涉及C++代码void HoverProposalFrame::fitContentsAndShow(QString html)的部分逻辑
    } else {
        // 不存在样式, 直接在第一个标签添加
        dataList[0] = '<strong>' + dataList[0] + '</strong><hr>';
    }
    return dataList;
}

async function getCompletionItem(item, isResolving) {
    var newRange = undefined;
    if (item.range) newRange = getCompletionItemRange(item);

    if (isResolving) {
        var newDetails = undefined;
        var strDocument = undefined;
        if ((item.documentationFormat == 'markdown' && item.documentation) || typeof item.documentation === 'object') {
            newDetails = marked(item.documentation.value); //换新逻辑
        } else if (typeof item.documentation === 'string') {
            newDetails = marked(item.documentation); //换新逻辑
            strDocument = item.documentation;
        }
        let languageId = item.document ? item.document.languageId : undefined;
        let label = item.detail ? item.detail : item.label;
        if (label !== item.label) {
            let contents = [{ language: languageId, value: item.detail }];
            let options = {type: "completion"};
            const retArray = await ColoringTreatment.getColoredText(contents, options);
            if(retArray.length > 0){
                label = retArray[0];
            }
        }
        var itemDetail = newDetails ? `${label}<br/>${newDetails}` : label;
        if (strDocument == item.detail) {
            itemDetail = item.label;
            if (newDetails) itemDetail = `${item.label}<br/>${newDetails}`;
        }

        let newItem = {
            ...item,

            range: newRange,
            kind: convert(item.kind, item.data),
            detail: itemDetail,
        };
        if (item.data && item.data.hxOption) {
            newItem.hxOption = item.data.hxOption;
        }
        return newItem;
    }

    let retItem = {
        ...item,
        range: newRange,
        kind: convert(item.kind, item.data),
    };
    if (item.data && item.data.hxOption) {
        retItem.hxOption = item.data.hxOption;
    }
    return retItem;
}

let providerCallTable = {
    CompletionItemProvider: {
        fire_provideCompletionItems: async function (...args) {
            // params should be {rid:id, document: TextDocument, position: Position, ????token: CancellationToken, context: CompletionContext}
            // CancellationToken传过来的时候是一个index,这边包装成一个可调用的function
            // token = {cancelMethod:'xxxxx', params:{}}
            const params = args[0];

            let rawDocument = metatypes.newObject(params.document, true);
            const resource = URI.revive(rawDocument.uri);
            let document = docs.getDocument(resource).document;
            // call update
            // docs.updateDocument(document);
            console.log('-------------------- onRequest language/fire_provideCompletionItems', {
                position: params.position,
            });

            // 	token: params.token,
            // 	context: params.context
            // });

            var retall = [];
            cacheCompletion.id++;
            for (let i in languageProvider.CompletionItemProvider.provider) {
                var debug = false;
                if (params.fromProvider) {
                    // should be array
                    if (params.fromProvider.find((o) => o != i)) {
                        continue;
                    } else {
                        debug = true;
                    }
                }
                if (cacheCompletion.item[i]) {
                    cacheCompletion.item[i].token.cancel();
                    for (let tempid in cacheCompletion.item[i].items) {
                        delete cacheCompletion.item[i].items[tempid];
                    }
                    delete cacheCompletion.item[i];
                }

                let cache = {
                    items: {},
                };
                let cancelSource = new CancellationTokenSource();
                cache.token = cancelSource.token;
                cacheCompletion.item[i] = cache;
                // 判断是否符合documentselector
                const p = languageProvider.CompletionItemProvider.provider[i];
                const selector = p[0];
                const provider = p[1];
                const context = p[2];
                if (!provider || !provider.provideCompletionItems || match(selector, document) <= 0) {
                    continue;
                }
                // console.log('call provideCompletionItems@',i,provider.constructor.name, params.position, params.context);
                // retall.push(

                let ret = new Promise((resolve, reject) => {
                    let position = new Position(params.position.line, params.position.character);

                    Promise.resolve(provider.provideCompletionItems(document, position, cancelSource.token, context)).then(async (CompletionList) => {
                        if (!CompletionList) {
                            resolve([]);
                            return;
                        }
                        // console.log(JSON.stringify(CompletionList));

                        let lst = [];
                        let beginid = i * 100000;
                        var id = beginid;
                        console.log('isIncomplete:', CompletionList.isIncomplete);
                        console.log('fromProvider:', parseInt(i));
                        if (CompletionList.items) {
                            console.log('firstItem:', JSON.stringify(CompletionList.items[0]));
                        }
                        for (index in CompletionList.items) {
                            var item = CompletionList.items[index];
                            let newItem = await getCompletionItem(item);
                            id++;
                            cache.items[id] = {
                                item,
                                provider: provider,
                            };
                            lst.push({
                                item: newItem,
                                id,
                            });
                            // console.log('add ', id, newItem);
                        }
                        // console.log(lst);
                        let r = {
                            incomplete: {
                                isIncomplete: CompletionList.isIncomplete,
                                fromProvider: parseInt(i),
                            },
                            items: lst,
                        };
                        if (debug) {
                            console.log(r);
                        }
                        resolve(r);
                    }, reject);
                });
                retall.push(ret);
            }
            return Promise.all(retall);
        },
        fire_provideCompletionItemSync: async function (...args) {
            // 回车的时候清空cache数据
            // params should be {id}
            let params = args[0];
            let index = parseInt(params.id / 100000);
            if (!cacheCompletion.item[index].items.hasOwnProperty(params.id)) throw new Error('No item id find!');
            let ctoken = cacheCompletion.item[index].token;
            let providerParent = cacheCompletion.item[index].items[params.id];
            if (!providerParent || !providerParent.provider) throw new Error('No item id find!');
            if (typeof providerParent.provider.resolveCompletionItem === 'function') {
                let item = providerParent;
                if (item.resolved) {
                    return item.resolved;
                }
                return (item.resolved = Promise.resolve(item.provider.resolveCompletionItem(item.item, ctoken)).then(async (obj) => {
                    return await getCompletionItem(obj, true);
                }));
            } else {
                let item = providerParent;
                return new Promise(async (o, r) => {
                    let newItem = await getCompletionItem(item.item, true);
                    o(newItem);
                });
                // console.log('no resolveCompletionItem for', params.id)
            }
        },
        cancel_provideCompletionItems: async function (...args) {
            params = args[0];
            console.log('onRequest language/cancel_provideCompletionItems', params);
            // cancel all and clear
        },
    },
    CallHierarchyProvider: function (...args) {
        return NOTIMPL();
    },
    CodeActionsProvider: function (...args) {
        return NOTIMPL();
    },
    CodeLensProvider: function (...args) {
        return NOTIMPL();
    },
    DocumentColorProvider: function (...args) {
        return NOTIMPL();
    },
    DeclarationProvider: {
        fire_provideDeclaration: async function (...args) {
            /**
             * Provide the declaration of the symbol at the given position and document.
             * 	provideDeclaration(model: model.ITextModel, position: Position, token: CancellationToken): ProviderResult<Definition | LocationLink[]>;
             */
            let params = args[0];
            console.log('onRequest language/fire_provideDeclaration', {
                position: params.position,
            });
        },
    },
    DefinitionProvider: {
        fire_provideDefinition: async function (...args) {
            /**
             * Provide the definition of the symbol at the given position and document.
             *
             * @param document The document in which the command was invoked.
             * @param position The position at which the command was invoked.
             * @param token A cancellation token.
             * @return A definition or a thenable that resolves to such. The lack of a result can be
             * signaled by returning `undefined` or `null`.
             */
            // provideDefinition(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Definition | DefinitionLink[]>;

            let params = args[0];

            let rawDocument = metatypes.newObject(params.document, true);
            const resource = URI.revive(rawDocument.uri);
            let document = docs.getDocument(resource).document;
            let position = new Position(params.position.line, params.position.character);
            let cancelSource = new CancellationTokenSource();
            var retlst = [];
            dropCache();
            cache.token = cancelSource.token;
            for (const i in languageProvider.DefinitionProvider.provider) {
                let p = languageProvider.DefinitionProvider.provider[i];
                selector = p[0];
                provider = p[1];
                if (!provider) continue;
                if (!(provider.provideDefinition && match(selector, document) > 0)) {
                    continue;
                }
                let ret = new Promise((resolve, reject) => {
                    let r = Promise.resolve(provider.provideDefinition(document, position, cancelSource.token)).then((result) => {
                        console.log(JSON.stringify(result));
                        let retValue = [];
                        if (result instanceof Array) {
                            retValue.push(result[0]);
                        } else {
                            retValue.push(result);
                        }
                        console.log(JSON.stringify(retValue));
                        resolve(retValue);
                    }, reject);
                });
                retlst.push(ret);
            }
            return Promise.all(retlst);
        },
    },
    DocumentFormattingEditProvider: {
        fire_provideDocumentFormattingEdits: async function (...args) {
            /*            
			* Provide formatting edits for a whole document.            
			provideDocumentFormattingEdits(model: model.ITextModel, options: FormattingOptions, token: CancellationToken): ProviderResult<TextEdit[]>;
            */
            const params = args[0];
            let rawDocument = metatypes.newObject(params.document, true);
            const resource = URI.revive(rawDocument.uri);
            let document = docs.getDocument(resource).document;
            let cancelSource = new CancellationTokenSource();
            cacheCompletion.token = cancelSource.token;
            let retall = [];
            let id = params.id;
            let formattingOptions = params.formattingOptions;
            for (let i in languageProvider.DocumentFormattingEditProvider.provider) {
                // 判断是否符合documentselector
                const p = languageProvider.DocumentFormattingEditProvider.provider[i];
                const selector = p[0];
                const provider = p[1];
                const providerId = p[2];
                if (providerId != id) continue;
                if (!provider || !provider.provideDocumentFormattingEdits || match(selector, document) <= 0) {
                    continue;
                }
                // console.log('call provideCompletionItems@',i,provider.constructor.name, params.position, params.context);
                // retall.push(

                let ret = new Promise((resolve, reject) => {
                    Promise.resolve(provider.provideDocumentFormattingEdits(document, formattingOptions, cancelSource.token)).then((obj) => {
                        resolve(obj);
                    });
                });
                retall.push(ret);
            }
            return Promise.all(retall);
        },
    },
    DocumentHighlightProvider: function (...args) {
        return NOTIMPL();
    },
    DocumentLinkProvider: function (...args) {
        return NOTIMPL();
    },
    DocumentRangeFormattingEditProvider: {
        /**
		 * Provide formatting edits for a range in a document.
		 *
		 * The given range is a hint and providers can decide to format a smaller
		 * or larger range. Often this is done by adjusting the start and end
		 * of the range to full syntax nodes.         
		    provideDocumentRangeFormattingEdits(model: model.ITextModel, range: Range, options: FormattingOptions, token: CancellationToken): ProviderResult<TextEdit[]>;
		*/
        fire_provideDocumentRangeFormattingEdits: async function (...args) {
            const params = args[0];
            let rawDocument = metatypes.newObject(params.document, true);
            const resource = URI.revive(rawDocument.uri);
            let document = docs.getDocument(resource).document;
            let cancelSource = new CancellationTokenSource();
            cacheCompletion.token = cancelSource.token;
            let formattingOptions = params.formattingOptions;
            let range = params.range;

            let retall = [];
            let id = params.id;
            for (let i in languageProvider.DocumentRangeFormattingEditProvider.provider) {
                // 判断是否符合documentselector
                const p = languageProvider.DocumentRangeFormattingEditProvider.provider[i];
                const selector = p[0];
                const provider = p[1];
                const providerId = p[2];

                if (providerId != id) continue;

                if (!provider || !provider.provideDocumentRangeFormattingEdits || match(selector, document) <= 0) {
                    continue;
                }

                let ret = new Promise((resolve, reject) => {
                    Promise.resolve(provider.provideDocumentRangeFormattingEdits(document, range, formattingOptions, cancelSource.token)).then((obj) => {
                        console.log('obj:::', obj);
                        resolve(obj);
                    });
                });
                retall.push(ret);
            }
            return Promise.all(retall);
        },
    },
    DocumentRangeSemanticTokensProvider: function (...args) {
        return NOTIMPL();
    },
    DocumentSemanticTokensProvider: function (...args) {
        return NOTIMPL();
    },
    DocumentSymbolProvider: {
        /**
         * displayName?: string;
         * Provide symbol information for the given document.
         * provideDocumentSymbols(model: model.ITextModel, token: CancellationToken): ProviderResult<DocumentSymbol[]>;
         */
        fire_provideDocumentSymbols: async function (...args) {
            let params = args[0];
            let rawDocument = metatypes.newObject(params.document, true);
            const resource = URI.revive(rawDocument.uri);
            let document = docs.getDocument(resource).document;
            let cancelSource = new CancellationTokenSource();
            var retlst = [];
            dropCache();
            cache.token = cancelSource.token;

            let _asDocumentSymbolTree = function (infos) {
                var _a;
                // first sort by start (and end) and then loop over all elements
                // and build a tree based on containment.
                infos = infos.slice(0).sort((a, b) => {
                    let res = a.location.range.start.compareTo(b.location.range.start);
                    if (res === 0) {
                        res = b.location.range.end.compareTo(a.location.range.end);
                    }
                    return res;
                });
                const res = [];
                const parentStack = [];
                for (const info of infos) {
                    let locationRange = [
                        {
                            line: info.location.range.start.line,
                            character: info.location.range.start.character,
                        },
                        {
                            line: info.location.range.end.line,
                            character: info.location.range.end.character,
                        },
                    ];
                    const element = {
                        name: info.name || '!!MISSING: name!!',
                        kind: typeConvert.SymbolKind.from(info.kind),
                        hxKind: info.hxKind,
                        tags: ((_a = info.tags) === null || _a === void 0 ? void 0 : _a.map(typeConvert.SymbolTag.from)) || [],
                        detail: '',
                        containerName: info.containerName,
                        _range: typeConvert.Range.from(info.location.range),
                        range: locationRange,
                        selectionRange: locationRange,
                        children: [],
                    };
                    while (true) {
                        if (parentStack.length === 0) {
                            parentStack.push(element);
                            res.push(element);
                            break;
                        }
                        const parent = parentStack[parentStack.length - 1];
                        if (range_1.Range.containsRange(parent._range, element._range) && !range_1.Range.equalsRange(parent._range, element._range)) {
                            if (parent.children) {
                                parent.children.push(element);
                            }
                            parentStack.push(element);
                            break;
                        }
                        parentStack.pop();
                    }
                }
                return res;
            };
            for (const i in languageProvider.DocumentSymbolProvider.provider) {
                let p = languageProvider.DocumentSymbolProvider.provider[i];
                selector = p[0];
                provider = p[1];
                if (!provider) continue;
                if (!(provider.provideDocumentSymbols && match(selector, document) > 0)) {
                    continue;
                }
                let ret = new Promise((resolve, reject) => {
                    Promise.resolve(provider.provideDocumentSymbols(document, cancelSource.token)).then((result) => {
                        if (result && result.length && result[0].location) {
                            let root = _asDocumentSymbolTree(result);
                            if (root.length == 1 && root[0].children && root[0].children.length > 0) {
                                resolve(root[0].children);
                            } else {
                                resolve(root);
                            }
                        } else {
                            resolve(result);
                        }
                    }, reject);
                });
                retlst.push(ret);
            }
            return Promise.all(retlst);
        },
    },
    EvaluatableExpressionProvider: {
        fire_provideEvaluatableExpression: async function (...args) {
            // provideEvaluatableExpression
            let params = args[0];
            let rawDocument = metatypes.newObject(params.document, true);
            const resource = URI.revive(rawDocument.uri);
            let document = docs.getDocument(resource).document;
            let position = new Position(params.position.line, params.position.character);
            let cancelSource = new CancellationTokenSource();
            var retlst = [];
            if (!languageProvider.hasOwnProperty('EvaluatableExpressionProvider')) return Promise.reject();
            dropCache();

            cache.token = cancelSource.token;

            for (const i in languageProvider.EvaluatableExpressionProvider.provider) {
                let p = languageProvider.EvaluatableExpressionProvider.provider[i];
                selector = p[0];
                provider = p[1];

                if (!provider || !(provider.providEvaluatableExpression && match(selector, document) > 0)) {
                    continue;
                }
                let ret = Promise.resolve(provider.providEvaluatableExpression(document, position, cancelSource.token));
                retlst.push(ret);
            }
            return Promise.all(retlst);
        },
    },
    FoldingRangeProvider: function (...args) {
        return NOTIMPL();
    },
    HoverProvider: {
        /**
		 * Provide a hover for the given position and document. Multiple hovers at the same
		 * position will be merged by the editor. A hover can have a range which defaults
		 * to the word range at the position when omitted.
		 
		provideHover(model: model.ITextModel, position: Position, token: CancellationToken): ProviderResult<Hover>;
		*/
        fire_provideHover: async function (...args) {
            let params = args[0];
            let rawDocument = metatypes.newObject(params.document, true);
            const resource = URI.revive(rawDocument.uri);
            const syncDoc = docs.getDocument(resource);
            if(!syncDoc) return Promise.all([]);
            
            let document = docs.getDocument(resource).document;
            let position = new Position(params.position.line, params.position.character);
            let cancelSource = new CancellationTokenSource();
            var retlst = [];
            dropCache();
            let id = cache.lastid++;
            cache.token = cancelSource.token;

            // console.log('----------hoverprovider:' ,languageProvider.HoverProvider.provider);
            for (const i in languageProvider.HoverProvider.provider) {
                // console.log('i:', i);
                let p = languageProvider.HoverProvider.provider[i];
                selector = p[0];
                provider = p[1];

                if (!provider || !(provider.provideHover && match(selector, document) > 0)) {
                    continue;
                }
                let ret = new Promise((resolve, reject) => {
                    provider.provideHover(document, position, cancelSource.token).then(async (result) => {
                        /**
                         * Hover:{contents:[markdownstring], range?}
                         */

                        let retValue = {};
                        if (result) {
                            let options = {type: "hover"};
                            let html = await ColoringTreatment.getColoredText(result.contents, options);
                            // 去除空项
                            html = html.filter((item) => item != '');
                            // 提取css样式, 统一样式
                            if(html.length){
                                html = extractShading(html);
                                // 根据返回的数据, 进行分割线的添加
                                html = addSeparator(html);

                                retValue = {
                                    html: html.join(''),
                                };
                                resolve(retValue);
                                return;
                            }
                        }
                        
                        resolve({
                            notvalid: true,
                        });                        
                    });
                });
                retlst.push(ret);
            }
            return Promise.all(retlst);
        },
    },
    ImplementationProvider: function (...args) {
        return NOTIMPL();
    },
    InlineValuesProvider: function (...args) {
        return NOTIMPL();
    },
    LinkedEditingRangeProvider: function (...args) {
        return NOTIMPL();
    },
    OnTypeFormattingEditProvider: function (...args) {
        return NOTIMPL();
    },
    ReferenceProvider: {
        /**
	 * Provide a set of project-wide references for the given position and document.
	
	provideReferences(model: model.ITextModel, position: Position, context: ReferenceContext, token: CancellationToken): ProviderResult<Location[]>;
     */
        fire_provideReferences: async function (...args) {},
    },
    RenameProvider: function (...args) {
        return NOTIMPL();
    },
    SelectionRangeProvider: function (...args) {
        return NOTIMPL();
    },
    SignatureHelpProvider: {
        fire_provideSignatureHelp: async function (...args) {
            let params = args[0];
            let rawDocument = metatypes.newObject(params.document, true);
            const resource = URI.revive(rawDocument.uri);
            let document = docs.getDocument(resource).document;
            let position = new Position(params.position.line, params.position.character);
            let cancelSource = new CancellationTokenSource();
            var retlst = [];
            dropCache();

            cache.token = cancelSource.token;

            for (const i in languageProvider.SignatureHelpProvider.provider) {
                // console.log('i:', i);
                let p = languageProvider.SignatureHelpProvider.provider[i];
                let selector = p[0];
                let provider = p[1];
                let metaOrargs = p[2];

                if (!provider || !(provider.provideSignatureHelp && match(selector, document) > 0)) {
                    continue;
                }
                let ret = new Promise((resolve, reject) => {
                    resolve(
                        provider.provideSignatureHelp(document, position, cancelSource.token, metaOrargs).then((result) => {
                            /*
						export class ParameterInformation {
							label: string | [number, number];
							documentation?: string | MarkdownString;
						}
						export class SignatureInformation {
							label: string;
							documentation?: string | MarkdownString;
							parameters: ParameterInformation[];
							activeParameter?: number;
						}						
						export class SignatureHelp {
						 	signatures: SignatureInformation[];
						 	activeSignature: number;
						 	activeParameter: number;
						 	}
						*/
                            if (result && result.signatures) {
                                let signatures = result.signatures.map(function (obj) {
                                    var info = { ...obj };
                                    if (info.documentation) {
                                        if (typeof info.documentation !== 'string') {
                                            // parse markdown
                                            info.documentation = marked(info.documentation.value);
                                        }
                                    }
                                    info.parameters = info.parameters.map(function (pinfo) {
                                        let paramInfo = { ...pinfo };
                                        if (paramInfo.documentation) {
                                            if (typeof paramInfo.documentation !== 'string') {
                                                paramInfo.documentation = marked(paramInfo.documentation.value).trim();
                                            }
                                        }
                                        // 分理出:两边，分别是变量名称和类型
                                        if (Array.isArray(paramInfo.label)) {
                                            let stringPart = info.label.substr(paramInfo.label[0], paramInfo.label[1] - paramInfo.label[0]);
                                            let name = stringPart.substr(0, stringPart.indexOf(':'));
                                            let type = stringPart.substr(stringPart.indexOf(':') + 1);
                                            paramInfo.label = name.trim();
                                            paramInfo.type = type.trim();
                                        } else if (typeof paramInfo.label === 'string') {
                                            let name = paramInfo.label.substr(0, paramInfo.label.indexOf(':'));
                                            let type = paramInfo.label.substr(paramInfo.label.indexOf(':') + 1);
                                            paramInfo.label = name.trim();
                                            paramInfo.type = type.trim();
                                        }
                                        return paramInfo;
                                    });
                                    if (info.label.lastIndexOf(':') != -1) {
                                        info.rettype = info.label.substr(info.label.lastIndexOf(':') + 1).trim();
                                    }
                                    if (Array.isArray(metaOrargs)) {
                                        // 找到其中一个
                                        var newLabel = info.label;
                                        for (const s of metaOrargs) {
                                            if (typeof s === 'string') {
                                                if (newLabel.indexOf(s) != -1) {
                                                    newLabel = newLabel.substr(0, newLabel.indexOf(s));
                                                    break;
                                                }
                                            } else if (typeof s === 'object' && Array.isArray(s.triggerCharacters)) {
                                                // 取第一个
                                                const tc = s.triggerCharacters;
                                                const c = tc[0];
                                                if (newLabel.indexOf(c) != -1) {
                                                    newLabel = newLabel.substr(0, newLabel.indexOf(c));
                                                    break;
                                                }
                                            }
                                        }
                                        info.label = newLabel.trim();
                                    }
                                    return info;
                                });
                                return {
                                    ...result,
                                    signatures: signatures,
                                };
                            }
                        })
                    );
                });
                retlst.push(ret);
            }
            return Promise.all(retlst);
        },
    },
    // SignatureHelpProvider: function(...args) {
    // 	return NOTIMPL()
    // },
    TypeDefinitionProvider: function (...args) {
        return NOTIMPL();
    },
    TypeHierarchyProvider: function (...args) {
        return NOTIMPL();
    },
    WorkspaceSymbolProvider: function (...args) {
        return NOTIMPL();
    },
};

function getLanguages() {
    return new Promise((resolve, reject) => {
        const ls = Object.keys(languageSupports);
        // 兼容_es6等
        var cls = [];
        const nameMap = Object.keys(langMatchTable);
        for (const compatl of nameMap) {
            const v = langMatchTable[compatl];
            if (ls.indexOf(v) != -1) {
                cls.push(compatl);
            }
        }
        resolve([...ls, ...cls]);
        // resolve(['css', 'html', 'scss', 'javascript'])
    });
}

/*
CancellationToken 是一个远程调用的接口，所以传过来的是一个index编号
 */
function _init(connection) {
    for (callid in providerCallTable) {
        if (typeof providerCallTable[callid] === 'object') {
            let obj = providerCallTable[callid];
            for (const o in obj) {
                const handler = obj[o];
                connection.onRequest(`language/${o}`, handler);
                console.log(`language/${o}`);
            }
        } else if (typeof providerCallTable[callid] === 'function') {
            connection.onRequest(`language/fire_${callid}`, providerCallTable[callid]);
        }
    }
    connection.onRequest('languages/dropCache', dropCache);
    connection.onRequest('languages/getLanguages', getLanguages);
    // language/setTextDocumentLanguage
    connection.onRequest('language/setTextDocumentLanguage', function (param) {
        return setTextDocumentLanguage(param.document, param.languageId);
    });

    connection.onRequest('language/getMatchFormatProvider', function (param) {
        const params = param;
        let rawDocument = metatypes.newObject(params.document, true);
        const resource = URI.revive(rawDocument.uri);
        let document = docs.getDocument(resource).document;
        let retall = [];
        let info = getExtensionInfo();
        // console.log('getExtensionInfo::::::', info);
        if (languageProvider.DocumentFormattingEditProvider) {
            for (let i in languageProvider.DocumentFormattingEditProvider.provider) {
                const p = languageProvider.DocumentFormattingEditProvider.provider[i];
                const selector = p[0];
                const provider = p[1];
                const id = p[2];
                if (!provider || !provider.provideDocumentFormattingEdits || match(selector, document) <= 0) {
                    continue;
                }
                let ret = {
                    'isFomat': true,
                    'isRangeFomat': false,
                    'id': id,
                    'extensionId': info.extensionId,
                };
                retall.push(ret);
                // console.log('Format:', retall);
            }
        }

        if (languageProvider.DocumentRangeFormattingEditProvider) {
            for (let i in languageProvider.DocumentRangeFormattingEditProvider.provider) {
                const p = languageProvider.DocumentRangeFormattingEditProvider.provider[i];
                const selector = p[0];
                const provider = p[1];
                const id = p[2];
                if (!provider || !provider.provideDocumentRangeFormattingEdits || match(selector, document) <= 0) {
                    continue;
                }
                let ret = {
                    'isFomat': false,
                    'isRangeFomat': true,
                    'id': id,
                    'extensionId': info.extensionId,
                };
                retall.push(ret);
                // console.log('range Format:', retall);
            }
        }
        // console.log('all Format:', retall);
        return retall;
    });
}

function DiagnosticCollection(name) {
    this.name = name;
    this.clear = function () {};

    this.dispose = function () {};

    this.delete = function (uri) {};
    this.set = function (uri, diagnostics) {
        let source = this.name;
        hx.request('diagnostics.set', {
            uri: uri,
            source: source,
            diagnostics: diagnostics,
        });
    };
}

/**
 * @param {String} name
 * @return {DiagnosticCollection}
 */
function createDiagnosticCollection(name) {
    return new DiagnosticCollection(name);
}

/**
 * @param {Uri | undefined} resource
 * @return {Diagnostic[] | [Uri,Diagnostic[]]}
 */
function getDiagnostics(resource) {}

function GeneralRegisterProvider(nameOfProvider, args) {
    let newid = languageProvider.lastid++;
    // console.log(`register provider(${nameOfProvider})`, newid)
    // console.log('args:', args)
    if (languageProvider[nameOfProvider] === undefined) {
        languageProvider[nameOfProvider] = {
            provider: {},
        };
    }

    languageProvider[nameOfProvider].provider[newid] = args;
    return new Disposable(function () {
        delete languageProvider[nameOfProvider].provider[newid];
    });
}
/**
 * 2021/10/14 tangxiaobo@dcloud.io
 * DocumentSelector:{language?:string(e.g. typescript), pattern?:GlobPattern(e.g. **\/*.{ts,js}| *.{ts,js}), scheme?:string(e.g. uri|file|untitled)}
 */
function registerCompletionItemProvider(selector /*DocumentSelector*/, provider /*CompletionItemProvider*/, ...triggerCharacters /* [0 .. n]string*/) {
    return GeneralRegisterProvider('CompletionItemProvider', [selector, provider, ...triggerCharacters]);
}

function registerCallHierarchyProvider(selector /*: DocumentSelector*/, provider /*: CallHierarchyProvider*/) /*: Disposable*/ {
    return GeneralRegisterProvider('CallHierarchyProvider', [selector, provider]);
}

function registerCodeActionsProvider(selector /*: DocumentSelector*/, provider /*: CodeActionProvider*/, metadata /*?: CodeActionProviderMetadata*/) /*: Disposable*/ {
    return GeneralRegisterProvider('CodeActionsProvider', [selector, provider, metadata]);
}

function registerCodeLensProvider(selector /*: DocumentSelector*/, provider /*: CodeLensProvider*/) /*: Disposable*/ {
    return GeneralRegisterProvider('CodeLensProvider', [selector, provider]);
}

function registerColorProvider(selector /*: DocumentSelector*/, provider /*: DocumentColorProvider*/) /*: Disposable*/ {
    return GeneralRegisterProvider('ColorProvider', [selector, provider]);
}

function registerDeclarationProvider(selector /*: DocumentSelector*/, provider /*: DeclarationProvider*/) /*: Disposable*/ {
    return GeneralRegisterProvider('DeclarationProvider', [selector, provider]);
}

function registerDefinitionProvider(selector /*: DocumentSelector*/, provider /*: DefinitionProvider*/) /*: Disposable*/ {
    return GeneralRegisterProvider('DefinitionProvider', [selector, provider]);
}

function registerDocumentFormattingEditProvider(selector /*: DocumentSelector*/, provider /*: DocumentFormattingEditProvider*/) /*: Disposable*/ {
    formattingProviderId++;
    return GeneralRegisterProvider('DocumentFormattingEditProvider', [selector, provider, formattingProviderId]);
}

function registerDocumentHighlightProvider(selector /*: DocumentSelector*/, provider /*: DocumentHighlightProvider*/) /*: Disposable*/ {
    return GeneralRegisterProvider('DocumentHighlightProvider', [selector, provider]);
}

function registerDocumentLinkProvider(selector /*: DocumentSelector*/, provider /*: DocumentLinkProvider*/) /*: Disposable*/ {
    return GeneralRegisterProvider('DocumentLinkProvider', [selector, provider]);
}

function registerDocumentRangeFormattingEditProvider(selector /*: DocumentSelector*/, provider /*: DocumentRangeFormattingEditProvider*/) /*: Disposable*/ {
    formattingProviderId++;
    return GeneralRegisterProvider('DocumentRangeFormattingEditProvider', [selector, provider, formattingProviderId]);
}

function registerDocumentRangeSemanticTokensProvider(
    selector /*: DocumentSelector*/,
    provider /*: DocumentRangeSemanticTokensProvider*/,
    legend /*: SemanticTokensLegend*/
) /*: Disposable*/ {
    return GeneralRegisterProvider('DocumentRangeSemanticTokensProvider', [selector, provider, legend]);
}

function registerDocumentSemanticTokensProvider(
    selector /*: DocumentSelector*/,
    provider /*: DocumentSemanticTokensProvider*/,
    legend /*: SemanticTokensLegend*/
) /*: Disposable*/ {
    return GeneralRegisterProvider('DocumentSemanticTokensProvider', [selector, provider, legend]);
}

function registerDocumentSymbolProvider(
    selector /*: DocumentSelector*/,
    provider /*: DocumentSymbolProvider*/,
    metaData /*?: DocumentSymbolProviderMetadata*/
) /*: Disposable*/ {
    return GeneralRegisterProvider('DocumentSymbolProvider', [selector, provider, metaData]);
}

function registerEvaluatableExpressionProvider(selector /*: DocumentSelector*/, provider /*: EvaluatableExpressionProvider*/) /*: Disposable*/ {
    return GeneralRegisterProvider('EvaluatableExpressionProvider', [selector, provider]);
}

function registerFoldingRangeProvider(selector /*: DocumentSelector*/, provider /*: FoldingRangeProvider*/) /*: Disposable*/ {
    return GeneralRegisterProvider('FoldingRangeProvider', [selector, provider]);
}

function registerHoverProvider(selector /*: DocumentSelector*/, provider /*: HoverProvider*/) /*: Disposable*/ {
    return GeneralRegisterProvider('HoverProvider', [selector, provider]);
}

function registerImplementationProvider(selector /*: DocumentSelector*/, provider /*: ImplementationProvider*/) /*: Disposable*/ {
    return GeneralRegisterProvider('ImplementationProvider', [selector, provider]);
}

function registerInlineValuesProvider(selector /*: DocumentSelector*/, provider /*: InlineValuesProvider*/) /*: Disposable*/ {
    return GeneralRegisterProvider('InlineValuesProvider', [selector, provider]);
}

function registerLinkedEditingRangeProvider(selector /*: DocumentSelector*/, provider /*: LinkedEditingRangeProvider*/) /*: Disposable*/ {
    return GeneralRegisterProvider('LinkedEditingRangeProvider', [selector, provider]);
}

function registerOnTypeFormattingEditProvider(
    selector /*: DocumentSelector*/,
    provider /*: OnTypeFormattingEditProvider*/,
    firstTriggerCharacter /*: string,*/,
    ...moreTriggerCharacter /*: string[]*/
) /*: Disposable*/ {
    return GeneralRegisterProvider('OnTypeFormattingEditProvider', [selector, provider, firstTriggerCharacter, ...moreTriggerCharacter]);
}

function registerReferenceProvider(selector /*: DocumentSelector*/, provider /*: ReferenceProvider*/) /*: Disposable*/ {
    return GeneralRegisterProvider('ReferenceProvider', [selector, provider]);
}

function registerRenameProvider(selector /*: DocumentSelector*/, provider /*: RenameProvider*/) /*: Disposable*/ {
    return GeneralRegisterProvider('RenameProvider', [selector, provider]);
}

function registerSelectionRangeProvider(selector /*: DocumentSelector*/, provider /*: SelectionRangeProvider*/) /*: Disposable*/ {
    return GeneralRegisterProvider('SelectionRangeProvider', [selector, provider]);
}

// function registerSignatureHelpProvider(selector /*: DocumentSelector*/ , provider /*: SignatureHelpProvider*/ , ...
//	triggerCharacters /*: string[]*/ ) /*: Disposable*/ {
function registerSignatureHelpProvider(selector /*: DocumentSelector*/, provider /*: SignatureHelpProvider*/, ...argsLeft) {
    return GeneralRegisterProvider('SignatureHelpProvider', [selector, provider, argsLeft]);
}

//  function registerSignatureHelpProvider(selector /*: DocumentSelector*/ , provider /*: SignatureHelpProvider*/ ,
//  	metadata /*: SignatureHelpProviderMetadata*/ ) /*: Disposable*/ {
//  	return GeneralRegisterProvider('SignatureHelpProvider2', [selector, provider, metadata]);
//  }

function registerTypeDefinitionProvider(selector /*: DocumentSelector*/, provider /*: TypeDefinitionProvider*/) /*: Disposable*/ {
    return GeneralRegisterProvider('TypeDefinitionProvider', [selector, provider]);
}

function registerTypeHierarchyProvider(selector /*: DocumentSelector*/, provider /*: TypeHierarchyProvider*/) /*: Disposable*/ {
    return GeneralRegisterProvider('TypeHierarchyProvider', [selector, provider]);
}
/*
Register a workspace symbol provider.

Multiple providers can be registered. In that case providers are asked in parallel and the results are merged. A failing provider (rejected promise or exception) will not cause a failure of the whole operation.

Parameter	Description
provider: WorkspaceSymbolProvider	
A workspace symbol provider.

Returns	Description
Disposable	
A Disposable that unregisters this provider when being disposed.
 */
function registerWorkspaceSymbolProvider(provider /*: WorkspaceSymbolProvider*/) /*: Disposable*/ {
    return GeneralRegisterProvider('WorkspaceSymbolProvider', [provider]);
}

function setLanguageConfiguration(language /*: string*/, configuration /*: LanguageConfiguration*/) /*: Disposable*/ {
    var compatLang = language;
    if (langMatchTable.hasOwnProperty(language)) compatLang = langMatchTable[language];
    if (!languageSupports[compatLang]) {
        languageSupports[compatLang] = {
            configuration: {},
        };
    }
    let newid = languageSupports.lastid + 1;
    languageSupports[compatLang].configuration[newid] = configuration;
    languageSupports.lastid = newid;
    return new Disposable(function () {
        delete languageSupports[compatLang].configuration[newid];
    });
}

let workspceHook = {
    openCall: undefined,
    closeCall: undefined,
};

function setWorkSpaceOpenCloseCall(o, c) {
    workspceHook.openCall = o;
    workspceHook.closeCall = c;
}
/*
Set (and change) the language that is associated with the given document.

Note that calling this function will trigger the onDidCloseTextDocument event followed by the onDidOpenTextDocument event.

Parameter	Description
document: TextDocument	
The document which language is to be changed

languageId: string	
The new language identifier.

Returns	Description
Thenable<TextDocument>	
A thenable that resolves with the updated document.
*/
function setTextDocumentLanguage(documentIn /*: TextDocument*/, languageId /*: string*/) /*: Thenable<TextDocument>*/ {
    let rawDocument = metatypes.newObject(documentIn, true);
    var compatLang = languageId;
    const resource = URI.revive(rawDocument.uri);
    let documentData = docs.getDocument(resource);
    if (!documentData) return Promise.resolve(documentIn);

    if (langMatchTable.hasOwnProperty(languageId)) compatLang = langMatchTable[languageId];

    if (rawDocument.languageId == languageId) return Promise.resolve(documentData.document);

    return new Promise((o, j) => {
        if (workspceHook.closeCall) {
            workspceHook.closeCall(documentData.document);
        }
        documentData._acceptLanguageId(languageId);
        if (workspceHook.openCall) {
            workspceHook.openCall(documentData.document);
        }
        o(documentData.document);
    });
}

var getExtensionInfo = undefined;
function setExtensionInfoCallBack(c) {
    getExtensionInfo = c;
}

module.exports = {
    setExtensionInfoCallBack,
    getExtensionInfo,
    init: _init,
    createDiagnosticCollection: createDiagnosticCollection,
    getDiagnostics: getDiagnostics,
    debug,
    match,
    matchLangId,
    getLanguages,
    setWorkSpaceOpenCloseCall,
    registerCompletionItemProvider,
    registerDefinitionProvider,
    registerDocumentFormattingEditProvider,
    registerDocumentHighlightProvider,
    registerDocumentLinkProvider,
    registerDocumentRangeFormattingEditProvider,
    registerDocumentRangeSemanticTokensProvider,
    registerDocumentSemanticTokensProvider,
    registerDocumentSymbolProvider,
    registerEvaluatableExpressionProvider,
    registerFoldingRangeProvider,
    registerHoverProvider,
    registerImplementationProvider,
    registerInlineValuesProvider,
    registerLinkedEditingRangeProvider,
    registerOnTypeFormattingEditProvider,
    registerReferenceProvider,
    registerRenameProvider,
    registerSelectionRangeProvider,
    registerSignatureHelpProvider,
    // registerSignatureHelpProvider,
    registerTypeDefinitionProvider,
    registerTypeHierarchyProvider,
    registerWorkspaceSymbolProvider,
    setLanguageConfiguration,
    setTextDocumentLanguage,
    registerDeclarationProvider,
    registerCallHierarchyProvider,
    registerCodeActionsProvider,
    registerCodeLensProvider,
    registerColorProvider,
};
