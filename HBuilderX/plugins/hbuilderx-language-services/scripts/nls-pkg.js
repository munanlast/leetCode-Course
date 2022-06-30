function stripComments(contents) {
    /**
   * First capturing group matches double quoted string
   * Second matches single quotes string
   * Third matches block comments
   * Fourth matches line comments
   */
    var regexp = /("(?:[^\\\"]*(?:\\.)?)*")|('(?:[^\\\']*(?:\\.)?)*')|(\/\*(?:\r?\n|.)*?\*\/)|(\/{2,}.*?(?:(?:\r?\n)|$))/g;
    var result = contents.replace(regexp, function (match, m1, m2, m3, m4) {
        // Only one of m1, m2, m3, m4 matches
        if (m3) {
            // A block comment. Replace with nothing
            return '';
        }
        else if (m4) {
            // A line comment. If it ends in \r?\n then keep it.
            var length = m4.length;
            if (length > 2 && m4[length - 1] === '\n') {
                return m4[length - 2] === '\r' ? '\r\n' : '\n';
            }
            else {
                return '';
            }
        }
        else {
            // We match a string
            return match;
        }
    });
    return result;
}

function bindLanguage(i18nBaseDir, baseDir) {
    return es.through(function (file) {
        var _this = this;
        function isDefined(value) {
            return typeof value !== 'undefined';
        }
        function isString(value) {
            return toString.call(value) === '[object String]';
        }
        function isUndefined(value) {
            return typeof value === 'undefined';
        }

        var basename = path.basename(file.relative);
        var isPackageFile = basename === 'package.nls.json';

        var nlsfile = isPackageFile || basename.match(/nls.metadata.json$/) !== null;
        if (!nlsfile)
            return;

        var filename = isPackageFile
            ? file.relative.substr(0, file.relative.length - '.nls.json'.length)
            : file.relative.substr(0, file.relative.length - '.nls.metadata.json'.length);


        if (file.isBuffer()) {
            var buffer = file.contents;
            var json = JSON.parse(buffer.toString('utf8'));
            var bundle = null;
            var packageBundle = false;
            if (json && isDefined(json.keys) && isDefined(json.messages)) {
                if (json.messages.length == json.keys.length) {
                    var keys_1 = [];
                    var map_1 = Object.create(null);
                    json.keys.forEach(function (key, index) {
                        var resolvedKey = isString(key) ? key : key.key;
                        keys_1.push(resolvedKey);
                        map_1[resolvedKey] = json.messages[index];
                    });
                    bundle = { messages: json.messages, keys: keys_1, map: map_1 };
                    packageBundle = false;
                }
            }
            else {
                bundle = json;
                packageBundle = true;
            }
            if (bundle) {
                languages.forEach(
                    function (lang) {
                        var folderName = lang.folderName || lang.id;
                        var i18nFile = (baseDir
                            ? path.join(i18nBaseDir, folderName, baseDir, filename)
                            : path.join(i18nBaseDir, folderName, filename)) + '.i18n.json';

                        var messages;
                        if (fs.existsSync(i18nFile)) {
                            var content = stripComments(fs.readFileSync(i18nFile, 'utf8'));
                            messages = JSON.parse(content);
                        }
                        if (messages) {
                            if (!packageBundle) {
                                bundle.keys.forEach(function (key) {
                                    var translated = messages[key];
                                    if (!isUndefined(translated)) {
                                        bundle.map[key] = translated;
                                    }
                                });
                                _this.queue(new File({
                                    base: file.base,
                                    path: path.join(file.base, filename) + '.nls.' + lang.id + '.json',
                                    contents: new Buffer(JSON.stringify(bundle.map, null, '\t').replace(/\r\n/g, '\n'), 'utf8')
                                }));
                            }
                            else {
                                Object.keys(bundle).forEach(function (key) {
                                    var translated = messages[key];
                                    if (!isUndefined(translated)) {
                                        bundle[key] = translated;
                                    }
                                });
                                _this.queue(new File({
                                    base: file.base,
                                    path: path.join(file.base, filename) + '.nls.' + lang.id + '.json',
                                    contents: new Buffer(JSON.stringify(bundle, null, '\t').replace(/\r\n/g, '\n'), 'utf8')
                                }));
                            }
                        }
                    }
                )
            }
        }
    })
}

gulp.task("publishnls", (function () {
    const publishOut = "./packout";
    const publisCache = "./packout/.cache";

    function bundleLanguages(id, version, outdir) {
        var bundles = Object.create(null);
        function getModuleKey(relativeFile) {
            return relativeFile.match(/(.*)\.nls\.(?:.*\.)?json/)[1].replace(/\\/g, '/');
        }
        return es.through(function (file) {
            var basename = path.basename(file.path);
            var matches = basename.match(/.nls\.(?:(.*)\.)?json/);
            if (!matches || !file.isBuffer()) {
                return;
            }
            var language = matches[1] ? matches[1] : 'en';
            var bundle = bundles[language];
            if (!bundle) {
                bundle = {
                    base: file.base,
                    content: { version: version, contents: {} }
                };
                bundles[language] = bundle;
            }
            var module = getModuleKey(file.relative);
            if (module == "package")
                bundle.content.contents[module] = JSON.parse(file.contents.toString('utf8'));
            else
                bundle.content.contents[outdir + "/" + module] = JSON.parse(file.contents.toString('utf8'));
        }, function () {
            for (var language in bundles) {
                var bundle = bundles[language];
                var languageId = language === 'en' ? '' : language + ".";
                var file = new File({
                    base: bundle.base,
                    path: path.join(bundle.base, id + "." + languageId + "json"),
                    contents: new Buffer(JSON.stringify(bundle.content, undefined, 4), 'utf8')
                });
                this.queue(file);
            }
            this.queue(null);
        });
    }

    function packagePub() {
        return gulp.src('package.nls.json')
            .pipe(bindLanguage('i18n', ''))
            .pipe(gulp.dest(publisCache));
    }

    function sourcePub() {
        return gulp.src(['./**/*.js', '!node_modules/**', '!out/**', '!gulpfile.js'])
            .pipe(nls.rewriteLocalizeCalls())
            .pipe(nls.createKeyValuePairFile())
            .pipe(bindLanguage('i18n', ''))
            .pipe(gulp.dest(publisCache));
    }

    function merge() {
        return gulp.src([publisCache + "/**/*.json"])
            .pipe(bundleLanguages("hx-nls-sample", "1.0.0", ""))
            .pipe(gulp.dest(publishOut));
    }

    function cleanCache() {
        return del([publisCache]);
    }

    return gulp.series(packagePub, sourcePub, merge, cleanCache);
})());