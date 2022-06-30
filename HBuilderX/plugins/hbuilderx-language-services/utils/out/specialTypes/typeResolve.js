"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenAtPosition = exports.getRelevantTokens = exports.getTypeName = exports.isInString = exports.getArgumentsSpecialStringType = void 0;
const ts = require("typescript/lib/tsserverlibrary");
function getArgumentsSpecialStringType(fileName, position, info) {
    var _a;
    let signatureHelpItems = info.languageService.getSignatureHelpItems(fileName, position, undefined);
    if (signatureHelpItems) {
        let signatureItems = signatureHelpItems.items;
        if (signatureItems.length > 0) {
            let signatureItem = signatureItems[0];
            let argumentIndex = signatureHelpItems.argumentIndex;
            if ((signatureItem === null || signatureItem === void 0 ? void 0 : signatureItem.parameters) && ((_a = signatureItem === null || signatureItem === void 0 ? void 0 : signatureItem.parameters) === null || _a === void 0 ? void 0 : _a.length) > argumentIndex) {
                let parameter = signatureItem.parameters[argumentIndex];
                let signature = "";
                parameter === null || parameter === void 0 ? void 0 : parameter.displayParts.forEach(element => {
                    signature += element.text;
                });
                let parts = signature.split(':');
                if (parts.length === 2) {
                    let types = parts[1].split('|');
                    return types;
                }
            }
        }
    }
    return [];
}
exports.getArgumentsSpecialStringType = getArgumentsSpecialStringType;
function getTokenAtPosition(sourceFile, position) {
    return getTokenAtPositionWorker(sourceFile, position, /*allowPositionInLeadingTrivia*/ true, /*includePrecedingTokenAtEndPosition*/ undefined, /*includeEndPosition*/ false);
}
exports.getTokenAtPosition = getTokenAtPosition;
/** Get the token whose text contains the position */
function getTokenAtPositionWorker(sourceFile, position, allowPositionInLeadingTrivia, includePrecedingTokenAtEndPosition, includeEndPosition) {
    let current = sourceFile;
    outer: while (true) {
        // find the child that contains 'position'
        for (const child of current.getChildren(sourceFile)) {
            const start = allowPositionInLeadingTrivia ? child.getFullStart() : child.getStart(sourceFile, /*includeJsDoc*/ true);
            if (start > position) {
                // If this child begins after position, then all subsequent children will as well.
                break;
            }
            const end = child.getEnd();
            if (position < end || (position === end && (child.kind === ts.SyntaxKind.EndOfFileToken || includeEndPosition))) {
                current = child;
                continue outer;
            }
            else if (includePrecedingTokenAtEndPosition && end === position) {
                const previousToken = findPrecedingToken(position, sourceFile, child);
                if (previousToken && includePrecedingTokenAtEndPosition(previousToken)) {
                    return previousToken;
                }
            }
        }
        return current;
    }
}
function isNonWhitespaceToken(n) {
    return ts.isToken(n); //&& !isWhiteSpaceOnlyJsxText(n);
}
function some(array, predicate) {
    if (array) {
        if (predicate) {
            for (const v of array) {
                if (predicate(v)) {
                    return true;
                }
            }
        }
        else {
            return array.length > 0;
        }
    }
    return false;
}
function binarySearchKey(array, key, keySelector, keyComparer, offset) {
    if (!some(array)) {
        return -1;
    }
    let low = offset || 0;
    let high = array.length - 1;
    while (low <= high) {
        const middle = low + ((high - low) >> 1);
        const midKey = keySelector(array[middle], middle);
        switch (keyComparer(midKey, key)) {
            case -1 /* LessThan */:
                low = middle + 1;
                break;
            case 0 /* EqualTo */:
                return middle;
            case 1 /* GreaterThan */:
                high = middle - 1;
                break;
        }
    }
    return ~low;
}
/* modified */
function nodeHasTokens(n, sourceFile) {
    // If we have a token or node that has a non-zero width, it must have tokens.
    // Note: getWidth() does not take trivia into account.
    return n.kind === ts.SyntaxKind.EndOfFileToken ? false /*!!(n as ts.EndOfFileToken).jsDoc*/ : n.getWidth(sourceFile) !== 0;
}
/* modified */
function findRightmostChildNodeWithTokens(children, exclusiveStartPosition, sourceFile) {
    // console.log(`findRightmostChildNodeWithTokens params: exclusiveStartPosition ${exclusiveStartPosition}`);
    for (let i = exclusiveStartPosition - 1; i >= 0; i--) {
        const child = children[i];
        // if (isWhiteSpaceOnlyJsxText(child)) {
        //   Debug.assert(i > 0, "`JsxText` tokens should not be the first child of `JsxElement | JsxSelfClosingElement`");
        // }else
        if (nodeHasTokens(children[i], sourceFile)) {
            // console.log(`findRightmostChildNodeWithTokens nodeHasTokens i:${i}`);
            return children[i];
        }
    }
}
function findRightmostToken(n, sourceFile) {
    if (isNonWhitespaceToken(n)) {
        return n;
    }
    const children = n.getChildren(sourceFile);
    if (children.length === 0) {
        return n;
    }
    const candidate = findRightmostChildNodeWithTokens(children, /*exclusiveStartPosition*/ children.length, sourceFile);
    return candidate && findRightmostToken(candidate, sourceFile);
}
function findPrecedingToken(position, sourceFile, startNode, excludeJsdoc) {
    const result = find(startNode || sourceFile);
    // Debug.assert(!(result && isWhiteSpaceOnlyJsxText(result)));
    return result;
    function find(n) {
        if (isNonWhitespaceToken(n) && n.kind !== ts.SyntaxKind.EndOfFileToken) {
            return n;
        }
        const children = n.getChildren(sourceFile);
        const i = binarySearchKey(children, position, (_, i) => i, (middle, _) => {
            // This last callback is more of a selector than a comparator -
            // `EqualTo` causes the `middle` result to be returned
            // `GreaterThan` causes recursion on the left of the middle
            // `LessThan` causes recursion on the right of the middle
            if (position < children[middle].end) {
                // first element whose end position is greater than the input position
                if (!children[middle - 1] || position >= children[middle - 1].end) {
                    return 0 /* EqualTo */;
                }
                return 1 /* GreaterThan */;
            }
            return -1 /* LessThan */;
        });
        // console.log(`findPrecedingToken children count: ${children.length}`);
        // console.log(`findPrecedingToken i: ${i}`);
        if (i >= 0 && children[i]) {
            const child = children[i];
            // Note that the span of a node's tokens is [node.getStart(...), node.end).
            // Given that `position < child.end` and child has constituent tokens, we distinguish these cases:
            // 1) `position` precedes `child`'s tokens or `child` has no tokens (ie: in a comment or whitespace preceding `child`):
            // we need to find the last token in a previous child.
            // 2) `position` is within the same span: we recurse on `child`.
            if (position < child.end) {
                const start = child.getStart(sourceFile, /*includeJsDoc*/ !excludeJsdoc);
                const lookInPreviousChild = (start >= position) || // cursor in the leading trivia
                    !nodeHasTokens(child, sourceFile);
                //  || isWhiteSpaceOnlyJsxText(child);
                if (lookInPreviousChild) {
                    // actual start of the node is past the position - previous token should be at the end of previous child
                    const candidate = findRightmostChildNodeWithTokens(children, /*exclusiveStartPosition*/ i, sourceFile);
                    return candidate && findRightmostToken(candidate, sourceFile);
                }
                else {
                    // candidate should be in this node
                    return find(child);
                }
            }
        }
        // Debug.assert(startNode !== undefined || n.kind === SyntaxKind.SourceFile || n.kind === SyntaxKind.EndOfFileToken || isJSDocCommentContainingNode(n));
        // Here we know that none of child token nodes embrace the position,
        // the only known case is when position is at the end of the file.
        // Try to find the rightmost token in the file without filtering.
        // Namely we are skipping the check: 'position < node.end'
        const candidate = findRightmostChildNodeWithTokens(children, /*exclusiveStartPosition*/ children.length, sourceFile);
        return candidate && findRightmostToken(candidate, sourceFile);
    }
}
function getRelevantTokens(position, sourceFile) {
    console.log(`getRelevantTokens params: ${position}`);
    const previousToken = findPrecedingToken(position, sourceFile);
    console.log(`previous token pos: ${previousToken === null || previousToken === void 0 ? void 0 : previousToken.pos}`);
    console.log(`previous token end: ${previousToken === null || previousToken === void 0 ? void 0 : previousToken.end}`);
    console.log(`previous token kind: ${previousToken === null || previousToken === void 0 ? void 0 : previousToken.kind}`);
    if (previousToken && position <= previousToken.end && (isMemberName(previousToken) || isKeyword(previousToken.kind))) {
        console.log(`getRelevatTokens enter if`);
        const contextToken = findPrecedingToken(previousToken.getFullStart(), sourceFile, /*startNode*/ undefined); // TODO: GH#18217
        console.log(`context token pos: ${contextToken === null || contextToken === void 0 ? void 0 : contextToken.pos}`);
        console.log(`context token end: ${contextToken === null || contextToken === void 0 ? void 0 : contextToken.end}`);
        return { contextToken, previousToken };
    }
    return { contextToken: previousToken, previousToken: previousToken };
}
exports.getRelevantTokens = getRelevantTokens;
function isMemberName(node) {
    return node.kind === ts.SyntaxKind.Identifier; // || node.kind === SyntaxKind.PrivateIdentifier;
}
function isKeyword(token) {
    return ts.SyntaxKind.FirstKeyword <= token && token <= ts.SyntaxKind.LastKeyword;
}
/* modified */
function getTouchingPropertyName(sourceFile, position) {
    return getTouchingToken(sourceFile, position, n => isPropertyNameLiteral(n) || isKeyword(n.kind)); //|| isPrivateIdentifier(n));
}
/**
 * Returns the token if position is in [start, end).
 * If position === end, returns the preceding token if includeItemAtEndPosition(previousToken) === true
 */
function getTouchingToken(sourceFile, position, includePrecedingTokenAtEndPosition) {
    return getTokenAtPositionWorker(sourceFile, position, /*allowPositionInLeadingTrivia*/ false, includePrecedingTokenAtEndPosition, /*includeEndPosition*/ false);
}
function isPropertyNameLiteral(node) {
    switch (node.kind) {
        case ts.SyntaxKind.Identifier:
        case ts.SyntaxKind.StringLiteral:
        case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
        case ts.SyntaxKind.NumericLiteral:
            return true;
        default:
            return false;
    }
}
function getLeftmostAccessExpression(expr) {
    while (isAccessExpression(expr)) {
        expr = expr.expression;
    }
    return expr;
}
function isAccessExpression(node) {
    return node.kind === ts.SyntaxKind.PropertyAccessExpression || node.kind === ts.SyntaxKind.ElementAccessExpression;
}
function nodeIsMissing(node) {
    if (node === undefined) {
        return true;
    }
    return node.pos === node.end && node.pos >= 0 && node.kind !== ts.SyntaxKind.EndOfFileToken;
}
function isCallExpression(node) {
    return node.kind === ts.SyntaxKind.CallExpression;
}
/* modified */
function last(array) {
    // Debug.assert(array.length !== 0);
    return array[array.length - 1];
}
function isLiteralImportTypeNode(n) {
    return ts.isImportTypeNode(n) && ts.isLiteralTypeNode(n.argument) && ts.isStringLiteral(n.argument.literal);
}
/* modified */
function isInRightSideOfInternalImportEqualsDeclaration(node) {
    while (node.parent.kind === ts.SyntaxKind.QualifiedName) {
        node = node.parent;
    }
    return isInternalModuleImportEqualsDeclaration(node.parent); //&& node.parent.moduleReference === node;
}
function isInternalModuleImportEqualsDeclaration(node) {
    return node.kind === ts.SyntaxKind.ImportEqualsDeclaration && node.moduleReference.kind !== ts.SyntaxKind.ExternalModuleReference;
}
function skipAlias(symbol, checker) {
    return symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
}
/* modified */
function symbolCanBeReferencedAtTypeLocation(symbol, checker, seenModules = new Map()) {
    const sym = symbol; //skipAlias(symbol.exportSymbol || symbol, checker);
    return !!(sym.flags & ts.SymbolFlags.Type) || checker.isUnknownSymbol(sym) ||
        !!(sym.flags & ts.SymbolFlags.Module)
            // && addToSeen(seenModules, getSymbolId(sym))
            &&
                checker.getExportsOfModule(sym).some(e => symbolCanBeReferencedAtTypeLocation(e, checker, seenModules));
}
function isInString(sourceFile, position, previousToken = findPrecedingToken(position, sourceFile)) {
    if (previousToken && isStringTextContainingNode(previousToken)) {
        const start = previousToken.getStart(sourceFile);
        const end = previousToken.getEnd();
        // To be "in" one of these literals, the position has to be:
        //   1. entirely within the token text.
        //   2. at the end position of an unterminated token.
        //   3. at the end of a regular expression (due to trailing flags like '/foo/g').
        if (start < position && position < end) {
            return true;
        }
        if (position === end) {
            return !!previousToken.isUnterminated;
        }
    }
    return false;
}
exports.isInString = isInString;
function isStringTextContainingNode(node) {
    return node.kind === ts.SyntaxKind.StringLiteral || isTemplateLiteralKind(node.kind);
}
function isTemplateLiteralKind(kind) {
    return ts.SyntaxKind.FirstTemplateToken <= kind && kind <= ts.SyntaxKind.LastTemplateToken;
}
function getTypeName(program, sourceFile, position) {
    // The decision to provide completion depends on the contextToken, which is determined through the previousToken.
    // Note: 'previousToken' (and thus 'contextToken') can be undefined if we are the beginning of the file
    const tokens = getRelevantTokens(position, sourceFile);
    const previousToken = tokens.previousToken;
    let contextToken = tokens.contextToken;
    console.log(`context token start:  ${contextToken === null || contextToken === void 0 ? void 0 : contextToken.pos}`);
    console.log(`context token end: ${contextToken === null || contextToken === void 0 ? void 0 : contextToken.end}`);
    console.log(`context token kind:  ${contextToken === null || contextToken === void 0 ? void 0 : contextToken.kind}`);
    const typeChecker = program.getTypeChecker();
    let currentToken = getTokenAtPosition(sourceFile, position); // TODO: GH#15853
    // We will check for jsdoc comments with insideComment and getJsDocTagAtPosition. (TODO: that seems rather inefficient to check the same thing so many times.)
    // const insideComment = isInComment(sourceFile, position, currentToken);
    let insideJsDocTagTypeExpression = false;
    let isInSnippetScope = false;
    // if (insideComment) {
    //     if (hasDocComment(sourceFile, position)) {
    //         if (sourceFile.text.charCodeAt(position - 1) === CharacterCodes.at) {
    //             // The current position is next to the '@' sign, when no tag name being provided yet.
    //             // Provide a full list of tag names
    //             return { kind: CompletionDataKind.JsDocTagName };
    //         }
    //         else {
    //             // When completion is requested without "@", we will have check to make sure that
    //             // there are no comments prefix the request position. We will only allow "*" and space.
    //             // e.g
    //             //   /** |c| /*
    //             //
    //             //   /**
    //             //     |c|
    //             //    */
    //             //
    //             //   /**
    //             //    * |c|
    //             //    */
    //             //
    //             //   /**
    //             //    *         |c|
    //             //    */
    //             const lineStart = getLineStartPositionForPosition(position, sourceFile);
    //             if (!/[^\*|\s(/)]/.test(sourceFile.text.substring(lineStart, position))) {
    //                 return { kind: CompletionDataKind.JsDocTag };
    //             }
    //         }
    //     }
    //     // Completion should work inside certain JsDoc tags. For example:
    //     //     /** @type {number | string} */
    //     // Completion should work in the brackets
    //     const tag = getJsDocTagAtPosition(currentToken, position);
    //     if (tag) {
    //         if (tag.tagName.pos <= position && position <= tag.tagName.end) {
    //             return { kind: CompletionDataKind.JsDocTagName };
    //         }
    //         if (isTagWithTypeExpression(tag) && tag.typeExpression && tag.typeExpression.kind === SyntaxKind.JSDocTypeExpression) {
    //             currentToken = getTokenAtPosition(sourceFile, position);
    //             if (!currentToken ||
    //                 (!isDeclarationName(currentToken) &&
    //                     (currentToken.parent.kind !== SyntaxKind.JSDocPropertyTag ||
    //                         (currentToken.parent as JSDocPropertyTag).name !== currentToken))) {
    //                 // Use as type location if inside tag's type expression
    //                 insideJsDocTagTypeExpression = isCurrentlyEditingNode(tag.typeExpression);
    //             }
    //         }
    //         if (!insideJsDocTagTypeExpression && isJSDocParameterTag(tag) && (nodeIsMissing(tag.name) || tag.name.pos <= position && position <= tag.name.end)) {
    //             return { kind: CompletionDataKind.JsDocParameterName, tag };
    //         }
    //     }
    //     if (!insideJsDocTagTypeExpression) {
    //         // Proceed if the current position is in jsDoc tag expression; otherwise it is a normal
    //         // comment or the plain text part of a jsDoc comment, so no completion should be available
    //         log("Returning an empty list because completion was inside a regular comment or plain text part of a JsDoc comment.");
    //         return undefined;
    //     }
    // }
    // Find the node where completion is requested on.
    // Also determine whether we are trying to complete with members of that node
    // or attributes of a JSX tag.
    let node = currentToken;
    let propertyAccessToConvert;
    let isRightOfDot = false;
    let isRightOfQuestionDot = false;
    // let isRightOfOpenTag = false;
    // let isStartingCloseTag = false;
    // let isJsxInitializer: IsJsxInitializer = false;
    // let isJsxIdentifierExpected = false;
    // let importCompletionNode: Node | undefined;
    // let location = getTouchingPropertyName(sourceFile, position);
    if (contextToken) {
        // const importCompletionCandidate = getImportCompletionNode(contextToken);
        // if (importCompletionCandidate === ts.SyntaxKind.FromKeyword) {
        //     return { kind: CompletionDataKind.Keywords, keywords: [SyntaxKind.FromKeyword] };
        // }
        // Import statement completions use `insertText`, and also require the `data` property of `CompletionEntryIdentifier`
        // added in TypeScript 4.3 to be sent back from the client during `getCompletionEntryDetails`. Since this feature
        // is not backward compatible with older clients, the language service defaults to disabling it, allowing newer clients
        // to opt in with the `includeCompletionsForImportStatements` user preference.
        // if (importCompletionCandidate && preferences.includeCompletionsForImportStatements && preferences.includeCompletionsWithInsertText) {
        //     importCompletionNode = importCompletionCandidate;
        // }
        // // Bail out if this is a known invalid completion location
        // if (!importCompletionNode && isCompletionListBlocker(contextToken)) {
        //     log("Returning an empty list because completion was requested in an invalid position.");
        //     return undefined;
        // }
        // console.log('contextToken');
        let parent = contextToken.parent;
        console.log(`parent kind: ${parent.kind}`);
        console.log(`parent pos: ${parent.pos}`);
        console.log(`parent end: ${parent.end}`);
        // console.log('contextToken kind id: ', contextToken.kind);
        if (contextToken.kind === ts.SyntaxKind.DotToken || contextToken.kind === ts.SyntaxKind.QuestionDotToken) {
            console.log('contextToken kind dot');
            isRightOfDot = contextToken.kind === ts.SyntaxKind.DotToken;
            isRightOfQuestionDot = contextToken.kind === ts.SyntaxKind.QuestionDotToken;
            console.log(`parent kind: ${parent.kind}`);
            switch (parent.kind) {
                case ts.SyntaxKind.PropertyAccessExpression:
                    console.log(`parent pos: ${parent.pos}`);
                    console.log(`parent end: ${parent.end}`);
                    propertyAccessToConvert = parent;
                    node = propertyAccessToConvert.expression;
                    // console.log(`parent left: ${node.}`);
                    const leftmostAccessExpression = getLeftmostAccessExpression(propertyAccessToConvert);
                    console.log(`node kind: ${node.kind}`);
                    if (nodeIsMissing(leftmostAccessExpression) ||
                        ((isCallExpression(node) || ts.isFunctionLike(node)) &&
                            node.end === contextToken.pos &&
                            node.getChildCount(sourceFile) &&
                            last(node.getChildren(sourceFile)).kind !== ts.SyntaxKind.CloseParenToken)) {
                        // This is likely dot from incorrectly parsed expression and user is starting to write spread
                        // eg: Math.min(./**/)
                        // const x = function (./**/) {}
                        // ({./**/})
                        return undefined;
                    }
                    break;
                case ts.SyntaxKind.QualifiedName:
                    node = parent.left;
                    break;
                case ts.SyntaxKind.ModuleDeclaration:
                    node = parent.name;
                    break;
                case ts.SyntaxKind.ImportType:
                    node = parent;
                    break;
                case ts.SyntaxKind.MetaProperty:
                    node = parent.getFirstToken(sourceFile);
                    // Debug.assert(node.kind === SyntaxKind.ImportKeyword || node.kind === SyntaxKind.NewKeyword);
                    break;
                default:
                    // There is nothing that precedes the dot, so this likely just a stray character
                    // or leading into a '...' token. Just bail out instead.
                    return undefined;
            }
        }
        // else if (!importCompletionNode && sourceFile.languageVariant === LanguageVariant.JSX) {
        //     // <UI.Test /* completion position */ />
        //     // If the tagname is a property access expression, we will then walk up to the top most of property access expression.
        //     // Then, try to get a JSX container and its associated attributes type.
        //     if (parent && parent.kind === SyntaxKind.PropertyAccessExpression) {
        //         contextToken = parent;
        //         parent = parent.parent;
        //     }
        //     // Fix location
        //     if (currentToken.parent === location) {
        //         switch (currentToken.kind) {
        //             case SyntaxKind.GreaterThanToken:
        //                 if (currentToken.parent.kind === SyntaxKind.JsxElement || currentToken.parent.kind === SyntaxKind.JsxOpeningElement) {
        //                     location = currentToken;
        //                 }
        //                 break;
        //             case SyntaxKind.SlashToken:
        //                 if (currentToken.parent.kind === SyntaxKind.JsxSelfClosingElement) {
        //                     location = currentToken;
        //                 }
        //                 break;
        //         }
        //     }
        //     switch (parent.kind) {
        //         case SyntaxKind.JsxClosingElement:
        //             if (contextToken.kind === SyntaxKind.SlashToken) {
        //                 isStartingCloseTag = true;
        //                 location = contextToken;
        //             }
        //             break;
        //         case SyntaxKind.BinaryExpression:
        //             if (!binaryExpressionMayBeOpenTag(parent as BinaryExpression)) {
        //                 break;
        //             }
        //         // falls through
        //         case SyntaxKind.JsxSelfClosingElement:
        //         case SyntaxKind.JsxElement:
        //         case SyntaxKind.JsxOpeningElement:
        //             isJsxIdentifierExpected = true;
        //             if (contextToken.kind === SyntaxKind.LessThanToken) {
        //                 isRightOfOpenTag = true;
        //                 location = contextToken;
        //             }
        //             break;
        //         case SyntaxKind.JsxExpression:
        //         case SyntaxKind.JsxSpreadAttribute:
        //             // For `<div foo={true} [||] ></div>`, `parent` will be `{true}` and `previousToken` will be `}`
        //             if (previousToken.kind === SyntaxKind.CloseBraceToken && currentToken.kind === SyntaxKind.GreaterThanToken) {
        //                 isJsxIdentifierExpected = true;
        //             }
        //             break;
        //         case SyntaxKind.JsxAttribute:
        //             // For `<div className="x" [||] ></div>`, `parent` will be JsxAttribute and `previousToken` will be its initializer
        //             if ((parent as JsxAttribute).initializer === previousToken &&
        //                 previousToken.end < position) {
        //                 isJsxIdentifierExpected = true;
        //                 break;
        //             }
        //             switch (previousToken.kind) {
        //                 case SyntaxKind.EqualsToken:
        //                     isJsxInitializer = true;
        //                     break;
        //                 case SyntaxKind.Identifier:
        //                     isJsxIdentifierExpected = true;
        //                     // For `<div x=[|f/**/|]`, `parent` will be `x` and `previousToken.parent` will be `f` (which is its own JsxAttribute)
        //                     // Note for `<div someBool f>` we don't want to treat this as a jsx inializer, instead it's the attribute name.
        //                     if (parent !== previousToken.parent &&
        //                         !(parent as JsxAttribute).initializer &&
        //                         findChildOfKind(parent, SyntaxKind.EqualsToken, sourceFile)) {
        //                         isJsxInitializer = previousToken as Identifier;
        //                     }
        //             }
        //             break;
        //     }
        // }
    }
    // const semanticStart = timestamp();
    // let completionKind = CompletionKind.None;
    let isNewIdentifierLocation = false;
    // let isNonContextualObjectLiteral = false;
    // let hasUnresolvedAutoImports = false;
    // let keywordFilters = KeywordCompletionFilters.None;
    // This also gets mutated in nested-functions after the return
    let symbols = [];
    // const symbolToOriginInfoMap: SymbolOriginInfoMap = [];
    // const symbolToSortTextIdMap: SymbolSortTextIdMap = [];
    // const seenPropertySymbols = new Map<SymbolId, true>();
    // const isTypeOnlyLocation = isTypeOnlyCompletion();
    // const getModuleSpecifierResolutionHost = memoizeOne((isFromPackageJson: boolean) => {
    //     return createModuleSpecifierResolutionHost(isFromPackageJson ? host.getPackageJsonAutoImportProvider!()! : program, host);
    // });
    if (isRightOfDot || isRightOfQuestionDot) {
        getTypeScriptMemberSymbols();
    }
    // else if (isRightOfOpenTag) {
    //     symbols = typeChecker.getJsxIntrinsicTagNamesAt(location);
    //     Debug.assertEachIsDefined(symbols, "getJsxIntrinsicTagNames() should all be defined");
    //     tryGetGlobalSymbols();
    //     completionKind = CompletionKind.Global;
    //     keywordFilters = KeywordCompletionFilters.None;
    // }
    // else if (isStartingCloseTag) {
    //     const tagName = (contextToken.parent.parent as JsxElement).openingElement.tagName;
    //     const tagSymbol = typeChecker.getSymbolAtLocation(tagName);
    //     if (tagSymbol) {
    //         symbols = [tagSymbol];
    //     }
    //     completionKind = CompletionKind.Global;
    //     keywordFilters = KeywordCompletionFilters.None;
    // }
    else {
        // For JavaScript or TypeScript, if we're not after a dot, then just try to get the
        // global symbols in scope.  These results should be valid for either language as
        // the set of symbols that can be referenced from this location.
        // if (!tryGetGlobalSymbols()) {
        //     return undefined;
        // }
    }
    function getTypeScriptMemberSymbols() {
        var _a;
        // Right of dot member completion list
        // completionKind = CompletionKind.PropertyAccess;
        console.log('get typescript member symbol');
        // Since this is qualified name check it's a type node location
        const isImportType = isLiteralImportTypeNode(node);
        const isTypeLocation = insideJsDocTagTypeExpression
            || (isImportType && !node.isTypeOf);
        // || isPartOfTypeNode(node.parent)
        // || isPossiblyTypeArgumentPosition(contextToken, sourceFile, typeChecker);
        const isRhsOfImportDeclaration = isInRightSideOfInternalImportEqualsDeclaration(node);
        if (ts.isEntityName(node) || isImportType || ts.isPropertyAccessExpression(node)) {
            console.log('entity name');
            const isNamespaceName = ts.isModuleDeclaration(node.parent);
            if (isNamespaceName)
                isNewIdentifierLocation = true;
            let symbol = typeChecker.getSymbolAtLocation(node);
            console.log(`symbol node start: ${node.pos}`);
            console.log(`symbol node end: ${node.end}`);
            console.log(`symbol node kind: ${node.kind}`);
            console.log(`symbol node flags: ${node.flags}`);
            console.log(`symbol text: ${symbol.escapedName}`);
            if (symbol) {
                // symbol = skipAlias(symbol, typeChecker);
                console.log(`enter symbol if`);
                console.log(`symbol flags: ${symbol.flags}`);
                console.log(`symbol declarations length: ${symbol.declarations.length}`);
                // if (symbol.flags & (ts.SymbolFlags.Module | ts.SymbolFlags.Enum)) {
                if (1) {
                    // Extract module or enum members
                    console.log(`enter symbol second if`);
                    const exportedSymbols = typeChecker.getExportsOfModule(symbol);
                    // Debug.assertEachIsDefined(exportedSymbols, "getExportsOfModule() should all be defined");
                    const isValidValueAccess = (symbol) => typeChecker.isValidPropertyAccess(isImportType ? node : node.parent, symbol.name);
                    const isValidTypeAccess = (symbol) => symbolCanBeReferencedAtTypeLocation(symbol, typeChecker);
                    const isValidAccess = isNamespaceName
                        // At `namespace N.M/**/`, if this is the only declaration of `M`, don't include `M` as a completion.
                        ? symbol => { var _a; return !!(symbol.flags & ts.SymbolFlags.Namespace) && !((_a = symbol.declarations) === null || _a === void 0 ? void 0 : _a.every(d => d.parent === node.parent)); }
                        : isRhsOfImportDeclaration ?
                            // Any kind is allowed when dotting off namespace in internal import equals declaration
                            symbol => isValidTypeAccess(symbol) || isValidValueAccess(symbol) :
                            isTypeLocation ? isValidTypeAccess : isValidValueAccess;
                    for (const exportedSymbol of exportedSymbols) {
                        if (isValidAccess(exportedSymbol)) {
                            symbols.push(exportedSymbol);
                        }
                    }
                    // If the module is merged with a value, we must get the type of the class and add its propertes (for inherited static methods).
                    if ( //!isTypeLocation &&
                    symbol.declarations &&
                        symbol.declarations.some(d => d.kind !== ts.SyntaxKind.SourceFile && d.kind !== ts.SyntaxKind.ModuleDeclaration && d.kind !== ts.SyntaxKind.EnumDeclaration)) {
                        // let type = typeChecker.getTypeOfSymbolAtLocation(symbol, node).getNonOptionalType();
                        console.log(`enter symbol third if`);
                        let type = typeChecker.getTypeOfSymbolAtLocation(symbol, node); //.getNonOptionalType();
                        // let symbol: ts.Symbol = type.getSymbol();
                        if (type.getSymbol()) {
                            console.log('type is: ', (_a = type.getSymbol()) === null || _a === void 0 ? void 0 : _a.escapedName);
                            // return type.getSymbol()?.escapedName;
                        }
                    }
                    return;
                }
            }
        }
        // if (!isTypeLocation) {
        //     // GH#39946. Pulling on the type of a node inside of a function with a contextual `this` parameter can result in a circularity
        //     // if the `node` is part of the exprssion of a `yield` or `return`. This circularity doesn't exist at compile time because
        //     // we will check (and cache) the type of `this` *before* checking the type of the node.
        //     const container = getThisContainer(node, /*includeArrowFunctions*/ false);
        //     if (!isSourceFile(container) && container.parent) typeChecker.getTypeAtLocation(container);
        //     let type = typeChecker.getTypeAtLocation(node).getNonOptionalType();
        //     let insertQuestionDot = false;
        //     if (type.isNullableType()) {
        //         const canCorrectToQuestionDot =
        //             isRightOfDot &&
        //             !isRightOfQuestionDot &&
        //             preferences.includeAutomaticOptionalChainCompletions !== false;
        //         if (canCorrectToQuestionDot || isRightOfQuestionDot) {
        //             type = type.getNonNullableType();
        //             if (canCorrectToQuestionDot) {
        //                 insertQuestionDot = true;
        //             }
        //         }
        //     }
        // }
    }
}
exports.getTypeName = getTypeName;
//# sourceMappingURL=typeResolve.js.map