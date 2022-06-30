const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const typescript = require('typescript');
const gulp = require('gulp');
const es = require('event-stream');
const path = require('path');
const fs = require('fs');
const nls = require('vscode-nls-dev');
var File = require("vinyl");

const languages = [{ folderName: 'zh-cn', id: 'zh-cn' }, { folderName: 'en', id: 'en' }];
const extensionRoot = path.resolve(__dirname, "../");

function collectProject(dir) {
    let projectList = [];
    function collectSubDir(dir) {
        let index = projectList.findIndex((v) => {
            return v.dir == dir;
        });
        if (index >= 0) {
            return;
        }
        let cfgpath = path.join(dir, 'tsconfig.json');
        if (fs.existsSync(cfgpath)) {
            const tsProject = ts.createProject(cfgpath, { typescript });
            if (tsProject.projectReferences) {
                tsProject.projectReferences.forEach(p => {
                    collectSubDir(p.path);
                });
            }
        }
        projectList.push({ dir });
    }
    collectSubDir(dir);
    return projectList;
}

function createNLSTasks(projects) {
    function createTask(project) {
        return () => {
            let dir = project.dir;
            const relativeDir = path.relative(extensionRoot, dir);
            const name = relativeDir.replace(/\//g, '-');
            const headerId = "hbuilderx." + name;
            let cfgfile = path.join(dir, 'tsconfig.json');
            const tsProject = ts.createProject(cfgfile, { typescript });
            const sourceRoot = tsProject.options.rootDir || "";
            const outDir = tsProject.options.outDir;
            if (!outDir) {
                console.error("compile option must specify outDir: " + cfgfile);
                return null;
            }
            let r = tsProject.src()
                .pipe(sourcemaps.init())
                .pipe(tsProject()).js
                .pipe(nls.rewriteLocalizeCalls())
                .pipe(nls.createAdditionalLanguageFiles(languages, path.join(dir, 'i18n'), ''))
                .pipe(nls.bundleMetaDataFiles(headerId, ''))
                .pipe(nls.bundleLanguageFiles());

            r = r.pipe(sourcemaps.write(outDir, { sourceRoot }));
            return r.pipe(gulp.dest(outDir));
        }
    }
    return projects.map((p) => {
        return createTask(p);
    }).filter(task => {
        return !!task;
    });
}

function createMessageTask(projects) {
    function createTask(project) {
        return () => {
            let dir = project.dir;
            const suffix = '.i18n.json';
            let cfgpath = path.join(dir, 'tsconfig.json');
            const tsProject = ts.createProject(cfgpath, { typescript });
            const outDir = path.resolve(dir, 'i18n/base');
            let r = tsProject.src()
                .pipe(tsProject()).js
                .pipe(nls.rewriteLocalizeCalls())
                .pipe(nls.createKeyValuePairFile())
                .pipe(es.through(function (file) {
                    // 仅处理.i18n.json
                    if (file.path.indexOf(suffix, file.path.length - suffix.length) !== -1) {
                        // try {
                        //     let oriMessage = JSON.parse(file.contents.toString('utf8'));
                        //     languages.forEach(info => {
                        //         const i18nFile = path.resolve(dir, `i18n/${info.folderName}/${file.relative}`);
                        //         if (!fs.existsSync(i18nFile)) {
                        //             this.queue(new File({
                        //                 base: file.base,
                        //                 path: i18nFile,
                        //                 contents: file.contents;
                        //             }));
                        //         }
                        //     });
                        // } catch (error) {

                        // }
                        this.queue(file);
                    }
                }));
            r.pipe(gulp.dest(outDir));
            return r;
        }
    }
    return projects.map((p) => {
        return createTask(p);
    }).filter(task => {
        return !!task;
    });
}

const projects = collectProject(path.dirname(__dirname)).filter((p) => {
    return path.basename(p.dir) == 'indexservice';
});

gulp.task("nls", gulp.series(createNLSTasks(projects)));
gulp.task("message", gulp.series(createMessageTask(projects)));

