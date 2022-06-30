const hx = require("../hbxBridge.js");
const Disposable = require("./disposable.js");

const ButtonStatus = ['disable', 'loading'];
var dialogID = 0;
WebViewDialog = class {
    constructor(dialogOpt, webOpt) {
        dialogID++;
        this._id = "webviewdialog." + dialogID;
        this._webView = hx.window.createWebView(this._id, webOpt);
        this._closeListeners = [];
        this._dlgOpt = dialogOpt;
    }

    get webView() {
        return this._webView.webView;
    }

    get id() {
        return this._id;
    }

    show() {
        return hx.request("window.showWebViewDialog", {
            id: this._id,
            dialogArgs: this._dlgOpt,
            webViewOptions: this._webView.options});
    }

    close() {
        hx.request("window.closeWebViewDialog", this._id);
    }

    displayError(text){
        hx.request("window.setWebViewDialogError", {id:this._id, text: text});
    }

    setButtonStatus(button, status){
        let check = [];
        let firstText = false;
        // 过滤掉多余的内容
        for(let i = 0; i < status.length; i++){
            if (ButtonStatus.indexOf(status[i]) >= 0){
                check.push(status[i])
            }
            else if (!firstText && status[i].startsWith('text:')){
                check.push(status[i]);
                firstText = true;
            }
        }
        hx.request("window.setDialogButtonStatus", { id: this._id, button: button, status: check});
    }

    dispatchCloseEvent() {
        for (let i = 0; i < this._closeListeners.length; i++) {
            let listener = this._closeListeners[i];
            if (listener) {
                listener();
            }
        }
    }

    onDialogClosed(listener) {
        this._closeListeners.push(listener);
        function removeListener(p) {
            let index = this._closeListeners.indexOf(listener);
            if (index > -1) {
                this._closeListeners.splice(index, 1);
            }
        }
        let remove = removeListener.bind(this, listener);
        return new Disposable(remove);
    }
}

module.exports = WebViewDialog;