/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/base/common/glob", "vs/base/common/uuid", "vs/base/common/network", "vs/base/common/path", "vs/base/common/platform", "vs/platform/contextkey/common/contextkey"], function (require, exports, glob, UUID, network_1, path_1, platform_1, contextkey_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CellStatusbarAlignment = exports.NotebookTextDiffEditorPreview = exports.ShowCellStatusBarKey = exports.CellToolbarLocKey = exports.DisplayOrderKey = exports.CellSequence = exports.notebookDocumentFilterMatch = exports.NotebookEditorPriority = exports.NOTEBOOK_EDITOR_CURSOR_BOUNDARY = exports.diff = exports.sortMimeTypes = exports.mimeTypeSupportedByCore = exports.CellUri = exports.getCellUndoRedoComparisonKey = exports.CellEditType = exports.NotebookCellsChangeType = exports.outputHasDynamicHeight = exports.RenderOutputType = exports.addIdToOutput = exports.isTransformedDisplayOutput = exports.MimeTypeRendererResolver = exports.NotebookCellRunState = exports.notebookDocumentMetadataDefaults = exports.NotebookRunState = exports.BUILTIN_RENDERER_ID = exports.ACCESSIBLE_NOTEBOOK_DISPLAY_ORDER = exports.NOTEBOOK_DISPLAY_ORDER = exports.CellOutputKind = exports.CellKind = void 0;
    var CellKind;
    (function (CellKind) {
        CellKind[CellKind["Markdown"] = 1] = "Markdown";
        CellKind[CellKind["Code"] = 2] = "Code";
    })(CellKind = exports.CellKind || (exports.CellKind = {}));
    var CellOutputKind;
    (function (CellOutputKind) {
        CellOutputKind[CellOutputKind["Text"] = 1] = "Text";
        CellOutputKind[CellOutputKind["Error"] = 2] = "Error";
        CellOutputKind[CellOutputKind["Rich"] = 3] = "Rich";
    })(CellOutputKind = exports.CellOutputKind || (exports.CellOutputKind = {}));
    exports.NOTEBOOK_DISPLAY_ORDER = [
        'application/json',
        'application/javascript',
        'text/html',
        'image/svg+xml',
        'text/markdown',
        'image/png',
        'image/jpeg',
        'text/plain'
    ];
    exports.ACCESSIBLE_NOTEBOOK_DISPLAY_ORDER = [
        'text/markdown',
        'application/json',
        'text/plain',
        'text/html',
        'image/svg+xml',
        'image/png',
        'image/jpeg',
    ];
    exports.BUILTIN_RENDERER_ID = '_builtin';
    var NotebookRunState;
    (function (NotebookRunState) {
        NotebookRunState[NotebookRunState["Running"] = 1] = "Running";
        NotebookRunState[NotebookRunState["Idle"] = 2] = "Idle";
    })(NotebookRunState = exports.NotebookRunState || (exports.NotebookRunState = {}));
    exports.notebookDocumentMetadataDefaults = {
        editable: true,
        runnable: true,
        cellEditable: true,
        cellRunnable: true,
        cellHasExecutionOrder: true,
        displayOrder: exports.NOTEBOOK_DISPLAY_ORDER,
        custom: {},
        runState: NotebookRunState.Idle
    };
    var NotebookCellRunState;
    (function (NotebookCellRunState) {
        NotebookCellRunState[NotebookCellRunState["Running"] = 1] = "Running";
        NotebookCellRunState[NotebookCellRunState["Idle"] = 2] = "Idle";
        NotebookCellRunState[NotebookCellRunState["Success"] = 3] = "Success";
        NotebookCellRunState[NotebookCellRunState["Error"] = 4] = "Error";
    })(NotebookCellRunState = exports.NotebookCellRunState || (exports.NotebookCellRunState = {}));
    var MimeTypeRendererResolver;
    (function (MimeTypeRendererResolver) {
        MimeTypeRendererResolver[MimeTypeRendererResolver["Core"] = 0] = "Core";
        MimeTypeRendererResolver[MimeTypeRendererResolver["Active"] = 1] = "Active";
        MimeTypeRendererResolver[MimeTypeRendererResolver["Lazy"] = 2] = "Lazy";
    })(MimeTypeRendererResolver = exports.MimeTypeRendererResolver || (exports.MimeTypeRendererResolver = {}));
    function isTransformedDisplayOutput(thing) {
        return thing.outputKind === CellOutputKind.Rich && !!thing.outputId;
    }
    exports.isTransformedDisplayOutput = isTransformedDisplayOutput;
    const addIdToOutput = (output, id = UUID.generateUuid()) => output.outputKind === CellOutputKind.Rich
        ? (Object.assign(Object.assign({}, output), { outputId: id })) : output;
    exports.addIdToOutput = addIdToOutput;
    var RenderOutputType;
    (function (RenderOutputType) {
        RenderOutputType[RenderOutputType["None"] = 0] = "None";
        RenderOutputType[RenderOutputType["Html"] = 1] = "Html";
        RenderOutputType[RenderOutputType["Extension"] = 2] = "Extension";
    })(RenderOutputType = exports.RenderOutputType || (exports.RenderOutputType = {}));
    const outputHasDynamicHeight = (o) => o.type !== 2 /* Extension */ && o.hasDynamicHeight;
    exports.outputHasDynamicHeight = outputHasDynamicHeight;
    var NotebookCellsChangeType;
    (function (NotebookCellsChangeType) {
        NotebookCellsChangeType[NotebookCellsChangeType["ModelChange"] = 1] = "ModelChange";
        NotebookCellsChangeType[NotebookCellsChangeType["Move"] = 2] = "Move";
        NotebookCellsChangeType[NotebookCellsChangeType["CellClearOutput"] = 3] = "CellClearOutput";
        NotebookCellsChangeType[NotebookCellsChangeType["CellsClearOutput"] = 4] = "CellsClearOutput";
        NotebookCellsChangeType[NotebookCellsChangeType["ChangeLanguage"] = 5] = "ChangeLanguage";
        NotebookCellsChangeType[NotebookCellsChangeType["Initialize"] = 6] = "Initialize";
        NotebookCellsChangeType[NotebookCellsChangeType["ChangeMetadata"] = 7] = "ChangeMetadata";
        NotebookCellsChangeType[NotebookCellsChangeType["Output"] = 8] = "Output";
    })(NotebookCellsChangeType = exports.NotebookCellsChangeType || (exports.NotebookCellsChangeType = {}));
    var CellEditType;
    (function (CellEditType) {
        CellEditType[CellEditType["Replace"] = 1] = "Replace";
        CellEditType[CellEditType["Output"] = 2] = "Output";
        CellEditType[CellEditType["Metadata"] = 3] = "Metadata";
    })(CellEditType = exports.CellEditType || (exports.CellEditType = {}));
    function getCellUndoRedoComparisonKey(uri) {
        const data = CellUri.parse(uri);
        if (!data) {
            return uri.toString();
        }
        return data.notebook.toString();
    }
    exports.getCellUndoRedoComparisonKey = getCellUndoRedoComparisonKey;
    var CellUri;
    (function (CellUri) {
        CellUri.scheme = network_1.Schemas.vscodeNotebookCell;
        const _regex = /^\d{7,}/;
        function generate(notebook, handle) {
            return notebook.with({
                scheme: CellUri.scheme,
                fragment: `${handle.toString().padStart(7, '0')}${notebook.scheme !== network_1.Schemas.file ? notebook.scheme : ''}`
            });
        }
        CellUri.generate = generate;
        function generateCellMetadataUri(notebook, handle) {
            return notebook.with({
                scheme: network_1.Schemas.vscode,
                authority: 'vscode-notebook-cell-metadata',
                fragment: `${handle.toString().padStart(7, '0')}${notebook.scheme !== network_1.Schemas.file ? notebook.scheme : ''}`
            });
        }
        CellUri.generateCellMetadataUri = generateCellMetadataUri;
        function parse(cell) {
            if (cell.scheme !== CellUri.scheme) {
                return undefined;
            }
            const match = _regex.exec(cell.fragment);
            if (!match) {
                return undefined;
            }
            const handle = Number(match[0]);
            return {
                handle,
                notebook: cell.with({
                    scheme: cell.fragment.substr(match[0].length) || network_1.Schemas.file,
                    fragment: null
                })
            };
        }
        CellUri.parse = parse;
    })(CellUri = exports.CellUri || (exports.CellUri = {}));
    function mimeTypeSupportedByCore(mimeType) {
        if ([
            'application/json',
            'application/javascript',
            'text/html',
            'image/svg+xml',
            'text/markdown',
            'image/png',
            'image/jpeg',
            'text/plain',
            'text/x-javascript'
        ].indexOf(mimeType) > -1) {
            return true;
        }
        return false;
    }
    exports.mimeTypeSupportedByCore = mimeTypeSupportedByCore;
    // if (isWindows) {
    // 	value = value.replace(/\//g, '\\');
    // }
    function matchGlobUniversal(pattern, path) {
        if (platform_1.isWindows) {
            pattern = pattern.replace(/\//g, '\\');
            path = path.replace(/\//g, '\\');
        }
        return glob.match(pattern, path);
    }
    function getMimeTypeOrder(mimeType, userDisplayOrder, documentDisplayOrder, defaultOrder) {
        let order = 0;
        for (let i = 0; i < userDisplayOrder.length; i++) {
            if (matchGlobUniversal(userDisplayOrder[i], mimeType)) {
                return order;
            }
            order++;
        }
        for (let i = 0; i < documentDisplayOrder.length; i++) {
            if (matchGlobUniversal(documentDisplayOrder[i], mimeType)) {
                return order;
            }
            order++;
        }
        for (let i = 0; i < defaultOrder.length; i++) {
            if (matchGlobUniversal(defaultOrder[i], mimeType)) {
                return order;
            }
            order++;
        }
        return order;
    }
    function sortMimeTypes(mimeTypes, userDisplayOrder, documentDisplayOrder, defaultOrder) {
        const sorted = mimeTypes.sort((a, b) => {
            return getMimeTypeOrder(a, userDisplayOrder, documentDisplayOrder, defaultOrder) - getMimeTypeOrder(b, userDisplayOrder, documentDisplayOrder, defaultOrder);
        });
        return sorted;
    }
    exports.sortMimeTypes = sortMimeTypes;
    function diff(before, after, contains, equal = (a, b) => a === b) {
        const result = [];
        function pushSplice(start, deleteCount, toInsert) {
            if (deleteCount === 0 && toInsert.length === 0) {
                return;
            }
            const latest = result[result.length - 1];
            if (latest && latest.start + latest.deleteCount === start) {
                latest.deleteCount += deleteCount;
                latest.toInsert.push(...toInsert);
            }
            else {
                result.push({ start, deleteCount, toInsert });
            }
        }
        let beforeIdx = 0;
        let afterIdx = 0;
        while (true) {
            if (beforeIdx === before.length) {
                pushSplice(beforeIdx, 0, after.slice(afterIdx));
                break;
            }
            if (afterIdx === after.length) {
                pushSplice(beforeIdx, before.length - beforeIdx, []);
                break;
            }
            const beforeElement = before[beforeIdx];
            const afterElement = after[afterIdx];
            if (equal(beforeElement, afterElement)) {
                // equal
                beforeIdx += 1;
                afterIdx += 1;
                continue;
            }
            if (contains(afterElement)) {
                // `afterElement` exists before, which means some elements before `afterElement` are deleted
                pushSplice(beforeIdx, 1, []);
                beforeIdx += 1;
            }
            else {
                // `afterElement` added
                pushSplice(beforeIdx, 0, [afterElement]);
                afterIdx += 1;
            }
        }
        return result;
    }
    exports.diff = diff;
    exports.NOTEBOOK_EDITOR_CURSOR_BOUNDARY = new contextkey_1.RawContextKey('notebookEditorCursorAtBoundary', 'none');
    var NotebookEditorPriority;
    (function (NotebookEditorPriority) {
        NotebookEditorPriority["default"] = "default";
        NotebookEditorPriority["option"] = "option";
    })(NotebookEditorPriority = exports.NotebookEditorPriority || (exports.NotebookEditorPriority = {}));
    //TODO@rebornix test
    function isDocumentExcludePattern(filenamePattern) {
        const arg = filenamePattern;
        if ((typeof arg.include === 'string' || glob.isRelativePattern(arg.include))
            && (typeof arg.exclude === 'string' || glob.isRelativePattern(arg.exclude))) {
            return true;
        }
        return false;
    }
    function notebookDocumentFilterMatch(filter, viewType, resource) {
        if (Array.isArray(filter.viewType) && filter.viewType.indexOf(viewType) >= 0) {
            return true;
        }
        if (filter.viewType === viewType) {
            return true;
        }
        if (filter.filenamePattern) {
            let filenamePattern = isDocumentExcludePattern(filter.filenamePattern) ? filter.filenamePattern.include : filter.filenamePattern;
            let excludeFilenamePattern = isDocumentExcludePattern(filter.filenamePattern) ? filter.filenamePattern.exclude : undefined;
            if (glob.match(filenamePattern, path_1.basename(resource.fsPath).toLowerCase())) {
                if (excludeFilenamePattern) {
                    if (glob.match(excludeFilenamePattern, path_1.basename(resource.fsPath).toLowerCase())) {
                        // should exclude
                        return false;
                    }
                }
                return true;
            }
        }
        return false;
    }
    exports.notebookDocumentFilterMatch = notebookDocumentFilterMatch;
    class CellSequence {
        constructor(textModel) {
            this.textModel = textModel;
        }
        getElements() {
            const hashValue = new Int32Array(this.textModel.cells.length);
            for (let i = 0; i < this.textModel.cells.length; i++) {
                hashValue[i] = this.textModel.cells[i].getHashValue();
            }
            return hashValue;
        }
    }
    exports.CellSequence = CellSequence;
    exports.DisplayOrderKey = 'notebook.displayOrder';
    exports.CellToolbarLocKey = 'notebook.cellToolbarLocation';
    exports.ShowCellStatusBarKey = 'notebook.showCellStatusBar';
    exports.NotebookTextDiffEditorPreview = 'notebook.diff.enablePreview';
    var CellStatusbarAlignment;
    (function (CellStatusbarAlignment) {
        CellStatusbarAlignment[CellStatusbarAlignment["LEFT"] = 0] = "LEFT";
        CellStatusbarAlignment[CellStatusbarAlignment["RIGHT"] = 1] = "RIGHT";
    })(CellStatusbarAlignment = exports.CellStatusbarAlignment || (exports.CellStatusbarAlignment = {}));
});
//# sourceMappingURL=notebookCommon.js.map