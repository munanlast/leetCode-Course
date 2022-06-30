const gulp = require('gulp');
    const del = require('del');
    const rename = require('gulp-rename');
    const es = require('event-stream');
    const nls = require('vscode-nls-dev');

    // 支持的语言
    const languages = [{ folderName: 'zh-cn', id: 'zh-cn' },{ folderName: 'zh-en', id: 'zh-en' }];
    // 以下方案适配于2021年9月, 第一版国际化, 后续有更改请说明或删除说明
    // 注意, hx未使用vsc的规则, 此处的zh-cn应为zh_cn
    // 且: 若存在id为en的语言, 默认语言翻译将设置为en
    // 请将en修改为别的字符, 生成后再改回en

    const cleanTask = function() {
        return del(['out/**', 'package.nls.*.json']);
    }

    // 源码
    const sourcesNsl = function() {
        var r = gulp.src(['./**/*.js', '!node_modules/**', '!gulpfile.js'])
            .pipe(nls.rewriteLocalizeCalls())
            .pipe(nls.createAdditionalLanguageFiles(languages, 'i18n', ''))
            .pipe(nls.bundleMetaDataFiles('hx-nls-sample', ''))
            .pipe(nls.bundleLanguageFiles());

        // 输出到out目录
        return r.pipe(gulp.dest("out"));
    };

    // package.json
    const packageNls = function() {
        return gulp.src(['package.nls.json'], {allowEmpty: true})
            .pipe(nls.createAdditionalLanguageFiles(languages, 'i18n'))
            .pipe(gulp.dest('.'));
    };

    const nlsTask = gulp.series(cleanTask, sourcesNsl, packageNls);

    gulp.task('clean', cleanTask);

    gulp.task('nls', nlsTask);


    // 提取需要翻译的字符串到i18n/base目录，方便翻译
    const sourcesMsg = function () {
        const suffix = '.i18n.json';
        var r = gulp.src(['./**/*.js', '!node_modules/**', '!out/**', '!gulpfile.js'])
            .pipe(nls.rewriteLocalizeCalls())
            .pipe(nls.createKeyValuePairFile())
            .pipe(es.through(function (file) {
                // 仅处理.i18n.json
                if (file.path.indexOf(suffix, file.path.length - suffix.length) !== -1) {
                    this.queue(file);
                }
            }))
            .pipe(gulp.dest(`./i18n/base`));
        return r;
    };

    // package.nls.json，结构一致，只需要拷贝一份
    const packageMsg = function () {
        var r = gulp.src(['package.nls.json'])
            .pipe(rename({ basename:"package", suffix: ".i18n"}))
            .pipe(gulp.dest(`./i18n/base`));
        return r;
    };

    const messageTask = gulp.series(sourcesMsg, packageMsg);
    gulp.task('message', messageTask);