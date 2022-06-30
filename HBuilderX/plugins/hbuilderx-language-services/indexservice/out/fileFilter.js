"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportLanguages = exports.supportNameGlob = exports.supportNameReg = void 0;
exports.supportNameReg = /\.((n?vue)|(le|sa|sc)ss|(t|j)s|html)$/i;
exports.supportNameGlob = '**/*.{html,css,js,ts,less,sass,scss,vue,nvue}';
exports.supportLanguages = [
    'css', 'html', 'html_es6', 'vue', 'javascript', 'typescript', 'less', 'scss', 'sass', 'stylus'
];
//# sourceMappingURL=fileFilter.js.map