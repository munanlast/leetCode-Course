
const hx = require("../hbxBridge.js");


const GitOperation = {
    Fetch: "Fetch",
    GetBranchs: "GetBranchs",
    CheckoutBranch: "CheckoutBranch",
    Pull: "Pull",
    Push: "Push",
    Exec: "Exec",
    Stash: "Stash"
}

// 考虑在插件处理一些错误信息， 暂时什么都没做
function processError(operation, err) {
    if (err instanceof Error)
        return { message: err.message };
    if (err.message || !!err.gitErrorCode) {
        return err; // do nothing
    }
    return err;
}

async function stashAndCheckout(gittool, args) {
    let repository = gittool.repository(args.path);

    try {
        await repository.createStash(undefined, true);
    }
    catch (err) {
        return processError(GitOperation.Stash, err);
    }
    let remote = !!args.ref.remote;
    let refname = args.ref.name;
    try {
        if (remote) {
            refs = await repository.findTrackingBranches(refname);
            if (refs.length > 0)
                refname = repository.checkout(refs[0], [], { track: remote });
        }

        await repository.checkout(refname, [], { track: remote });
        await repository.popStash();
        return { exitCode: 0 };
    } catch (err) {
        return processError(GitOperation.CheckoutBranch, err);
    }
}

async function checkoutBranch(gittool, args, options) {
    let repository = gittool.repository(args.path);
    let remote = !!args.ref.remote;
    let refname = args.ref.name;

    try {
        if (remote) {
            refs = await repository.findTrackingBranches(refname);
            if (refs.length > 0)
                refname = repository.checkout(refs[0], [], { track: remote });
        }
        let force = options && !!options.force;
        await repository.checkout(refname, [], { track: remote, force });
        return { exitCode: 0 };
    } catch (err) {
        if (options && !!options.force) {
            return processError(GitOperation.CheckoutBranch, err);
        }
        if (err && /Please,? commit your changes or stash them/.test(err.stderr)) {
            //let msg = "Your local changes would be overwritten by checkout.";
            //let btns = ["Force Checkout", "Stash && Checkout", "Cancel"];
            let msg = "签出会覆盖本地更改";
            let btns = ["强制签出", "储藏并签出", "取消"];
            return hx.window.showMessageBox({
                type: "warning",
                title: "",
                text: msg,
                buttons: btns,
                defaultButton: 0
            }).then(function (button) {
                if (button == btns[0]) {
                    return checkoutBranch(gittool, args, { force: true });
                }
                else if (button == btns[1]) {
                    return stashAndCheckout(gittool, args);
                }
            });
        }
        return processError(GitOperation.CheckoutBranch, err);
    }
}

async function pushWithUpstreamBranch(gittool, args) {
    let repository = gittool.repository(args.path);
    try {
        let repo = args.remoteRepository;
        let bran = args.remoteBranch;
        let track = !!args.track;
        await repository.push(repo, bran, track, false, args.forceMode);
        return { exitCode: 0 };
    } catch (err) {
        if (err && err.stderr) {
            let match = err.stderr.match("^fatal: The current branch (.*?) has no upstream branch");
            if (!match || !match[1])
                return processError(GitOperation.CheckoutBranch, err);
            return hx.window.showFormDialog({
                submitButtonText: "&OK",
                cancelButtonText: "&Cancel",
                validate: function (formData) {
                    if (!formData.remoteRepository) {
                        this.showError("请输入远程仓库");
                        return false;
                    }
                    if (!formData.remoteBranch) {
                        this.showError("请输入远程分支");
                        return false;
                    }
                    return true;
                },
                ...{
                    width: 355,
                    height: 260,
                    title: "Git强制推送",
                    subtitle: "未发现跟踪的远程分支，请输入远程仓库和分支名称",
                    formItems: [
                        {
                            type: "input",
                            name: "remoteRepository",
                            label: "远程仓库",
                            placeholder: "请输入远程仓库",
                            value: "origin"
                        },
                        {
                            type: "input",
                            name: "remoteBranch",
                            label: "远程分支",
                            placeholder: "请输入远程分支",
                            value: match[1]
                        },
                        {
                            "type": "checkBox",
                            "name": "track",
                            "label": "跟踪远程分支",
                            "value": false
                        }
                    ],
                }
            }).then(function (input) {
                if (input.remoteRepository && input.remoteBranch) {
                    args.remoteRepository = input.remoteRepository;
                    args.remoteBranch = input.remoteBranch;
                    args.track = !!input.track;
                    return pushWithUpstreamBranch(gittool,args);
                }
            }, function () {
                return processError(GitOperation.CheckoutBranch, err);
            });
        }
    }
    return processError(GitOperation.CheckoutBranch, err);
}

function _init(conn) {
    conn.onRequest("gitnative/fetch", function (args) {
        let gittool = hx.extensions.getExtension("Git");
        if (!gittool) {
            hx.window.showErrorMessage("Git plugin not exist, please install first.");
            return {};
        }
        if (!args || !args.path)
            return { message: "Invalid arguments for fetch." };

        let repository = gittool.repository(args.path);
        let options = { prune: !!args.prune }
        return repository.fetch(options).then(function () {
            return { exitCode: 0 }; //无返回值
        }, function (err) {
            return processError(GitOperation.Fetch, err); // 可能返回一个带有message属性的对象
        });
    });

    conn.onRequest("gitnative/getBranches", function (args) {
        let gittool = hx.extensions.getExtension("Git");
        if (!gittool) {
            hx.window.showErrorMessage("Git plugin not exist, please install first.");
            return {};
        }

        if (!args || !args.path)
            return { message: "Invalid arguments for get branches." };

        return gittool.repositoryFromPath(args.path).then(
            function (repository) {
                if (repository) {
                    return repository.getRefs().then(function (branches) {
                        return { exitCode: 0, branches: branches };
                    });
                }
                else {
                    return { message: "Invalid arguments for checkout branch" };
                }
            },
            function (err) {
                return processError(GitOperation.GetBranchs, err)
            });
    });

    conn.onRequest("gitnative/checkoutBranch", function (args) {
        let gittool = hx.extensions.getExtension("Git");
        if (!gittool) {
            hx.window.showErrorMessage("Git plugin not exist, please install first.");
            return {};
        }

        if (!args || !args.path || !args.ref || !args.ref.name) {
            return { message: "Invalid arguments for checkout branch." };
        }

        return checkoutBranch(gittool, args);
    });

    conn.onRequest("gitnative/pull", function (args) {
        let gittool = hx.extensions.getExtension("Git");
        if (!gittool) {
            hx.window.showErrorMessage("Git plugin not exist, please install first.");
            return {};
        }

        if (!args || !args.path) {
            return { message: "Invalid arguments for pull." };
        }

        let repository = gittool.repository(args.path);
        let options = {};
        let promise = null;
        let rebase = !!args.rebase;
        if (args.ffMode) {
            options.ffMode = args.ffMode;
            rebase = false;
        }
        options.autostash = !!args.autostash;
        promise = repository.pull(rebase, args.remote, args.branch, options);
        return promise.then(function () {
            return { exitCode: 0 };
        }, function (err) {
            return processError(GitOperation.Pull, err);
        });
    });

    conn.onRequest("gitnative/push", function (args) {
        let gittool = hx.extensions.getExtension("Git");
        if (!gittool) {
            hx.window.showErrorMessage("Git plugin not exist, please install first.");
            return {};
        }

        if (!args || !args.path) {
            return { message: "Invalid arguments for push" };
        }

        return pushWithUpstreamBranch(gittool, args);
    });

    conn.onRequest("gitnative/exec", function (args) {
        let gittool = hx.extensions.getExtension("Git");
        if (!gittool) {
            hx.window.showErrorMessage("Git plugin not exist, please install first.");
            return {};
        }

        if (!args || !args.path) {
            return { message: "Invalid arguments for checkout branch" };
        }

        let repository = gittool.repository(args.path);
        let cmdargs = args.args
        promise = repository.push(cmdargs, undefined, false, false, args.forceMode);
        return promise.then(function (res) {
            return res;
        }, function (err) {
            return processError(GitOperation.Exec, err)
        });
    });
}

module.exports = {
    init: _init
}