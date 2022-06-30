"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deprecatedPseudoElementList = exports.charsetFeatures = exports.mediaFeatures = exports.mediaLogicalOperators = exports.mediaTypes = exports.uniNvueSelect = exports.nullSelect = void 0;
const nullSelect = [''];
exports.nullSelect = nullSelect;
const uniNvueSelect = ['list-item', 'list', 'picker', 'popover', 'rating', 'refresh', 'richtext', 'slider', 'stack', 'swiper', 'tab-bar', 'tab-content', 'tabs'];
exports.uniNvueSelect = uniNvueSelect;
// 增加media相关语法库条目, 参考文件位于:
// https://developer.mozilla.org/en-US/docs/Web/CSS/@media
// https://www.w3schools.com/cssref/css3_pr_mediaquery.asp
// https://www.runoob.com/cssref/css3-pr-mediaquery.html
const mediaTypes = [
    { name: 'all', description: 'Suitable for all devices.' },
    {
        name: 'print',
        description: 'Intended for paged material and documents viewed on a screen in print preview mode. (Please see [paged media](https://developer.mozilla.org/en-US/docs/Web/CSS/Paged_Media) for information about formatting issues that are specific to these formats.)',
    },
    { name: 'screen', description: 'Intended primarily for screens.' },
    // 分割线, 下面是废弃的type
    {
        name: 'tty',
        description: 'Applies to fixed character grids such as telegrams, terminal devices, and portable devices with limited characters. Deprecated in Media Queries Level 4.',
    },
    { name: 'tv', description: 'Applied to TV and Internet TV. Deprecated in Media Queries Level 4.' },
    { name: 'projection', description: ' Applied to projection equipment. Deprecated in Media Queries Level 4.' },
    { name: 'handheld', description: 'For handheld devices or smaller devices such as PDAs and small phones. Deprecated in Media Queries Level 4.' },
    { name: 'braille', description: 'Applied to speech and voice synthesizers. Deprecated in Media Queries Level 4.' },
    { name: 'embossed', description: ' Blind printing equipment for printing. Deprecated in Media Queries Level 4.' },
    { name: 'aural', description: 'For speech and voice synthesizers. Deprecated in Media Queries Level 4.' },
    { name: 'speech', description: 'For sound-emitting devices such as screen readers. Deprecated in Media Queries Level 4.' },
];
exports.mediaTypes = mediaTypes;
const mediaLogicalOperators = ['and', 'not', 'or']; // only只在开始的时候使用, 故在调用处添加
exports.mediaLogicalOperators = mediaLogicalOperators;
const mediaFeatures = [
    // 以下内容参考: https://developer.mozilla.org/en-US/docs/Web/CSS/@media
    {
        name: 'any-hover',
        description: 'Does any available input mechanism allow the user to hover over elements? Added in Media Queries Level 4.\n\n[MDN Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/any-hover)',
    },
    {
        name: 'any-pointer',
        description: 'Is any available input mechanism a pointing device, and if so, how accurate is it? Added in Media Queries Level 4.\n\n[MDN Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/any-pointer)',
    },
    {
        name: 'aspect-ratio',
        description: 'Width-to-height aspect ratio of the viewport.\n\n[MDN Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/aspect-ratio)',
    },
    {
        name: 'color',
        description: 'Number of bits per color component of the output device, or zero if the device is not color.\n\n[MDN Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/color)',
    },
    {
        name: 'color-gamut',
        description: 'Approximate range of colors that are supported by the user agent and output device. Added in Media Queries Level 4.\n\n[MDN Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/color-gamut)',
    },
    {
        name: 'color-index',
        description: "Number of entries in the output device's color lookup table, or zero if the device does not use such a table.\n\n[MDN Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/color-index)",
    },
    {
        name: 'display-mode',
        description: "The display mode of the application, as specified in the web app manifest's [display](https://developer.mozilla.org/en-US/docs/Web/Manifest#display) member. Defined in the [Web App Manifest spec](https://w3c.github.io/manifest/#the-display-mode-media-feature).\n\n[MDN Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/display-mode)",
    },
    {
        name: 'forced-colors',
        description: 'Detect whether user agent restricts color palette. Added in Media Queries Level 5.\n\n[MDN Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors)',
    },
    { name: 'grid', description: 'Does the device use a grid or bitmap screen?\n\n[MDN Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/grid)' },
    { name: 'height', description: 'Height of the viewport.\n\n[MDN Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/height)' },
    {
        name: 'hover',
        description: 'Does the primary input mechanism allow the user to hover over elements? Added in Media Queries Level 4.\n\n[MDN Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover)',
    },
    {
        name: 'inverted-colors',
        description: 'Is the user agent or underlying OS inverting colors? Added in Media Queries Level 5.\n\n[MDN Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/inverted-colors)',
    },
    {
        name: 'monochrome',
        description: "Bits per pixel in the output device's monochrome frame buffer, or zero if the device isn't monochrome.\n\n[MDN Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/monochrome)",
    },
    { name: 'orientation', description: 'Orientation of the viewport.\n\n[MDN Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/orientation)' },
    {
        name: 'overflow-block',
        description: 'How does the output device handle content that overflows the viewport along the block axis? Added in Media Queries Level 4.\n\n[MDN Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/overflow-block)',
    },
    {
        name: 'overflow-inline',
        description: 'Can content that overflows the viewport along the inline axis be scrolled? Added in Media Queries Level 4.\n\n[MDN Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/overflow-inline)',
    },
    {
        name: 'pointer',
        description: 'Is the primary input mechanism a pointing device, and if so, how accurate is it? Added in Media Queries Level 4.\n\n[MDN Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer)',
    },
    {
        name: 'prefers-color-scheme',
        description: 'Detect if the user prefers a light or dark color scheme. Added in Media Queries Level 5.\n\n[MDN Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)',
    },
    {
        name: 'prefers-contrast',
        description: 'Detects if the user has requested the system increase or decrease the amount of contrast between adjacent colors. Added in Media Queries Level 5.\n\n[MDN Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast)',
    },
    {
        name: 'prefers-reduced-motion',
        description: 'The user prefers less motion on the page. Added in Media Queries Level 5.\n\n[MDN Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)',
    },
    { name: 'resolution', description: 'Pixel density of the output device.\n\n[MDN Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/resolution)' },
    {
        name: 'scripting',
        description: 'Detects whether scripting (i.e. JavaScript) is available. Added in Media Queries Level 5.\n\n[MDN Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/scripting)',
    },
    {
        name: 'update',
        description: 'How frequently the output device can modify the appearance of content. Added in Media Queries Level 4.\n\n[MDN Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/update-frequency)',
    },
    {
        name: 'width',
        description: 'Width of the viewport including width of scrollbar.\n\n[MDN Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/width)',
    },
    // 分割线, 以下内容参考: https://www.w3schools.com/cssref/css3_pr_mediaquery.asp
    { name: 'light-level', description: 'Current ambient light level (added in Media Queries Level 4).' },
    { name: 'max-aspect-ratio', description: 'The maximum ratio between the width and the height of the display area.' },
    { name: 'max-color', description: 'The maximum number of bits per color component for the output device.' },
    { name: 'max-color-index', description: 'The maximum number of colors the device can display.' },
    { name: 'max-height', description: 'The maximum height of the display area, such as a browser window.' },
    { name: 'max-monochrome', description: 'The maximum number of bits per "color" on a monochrome (greyscale) device.' },
    { name: 'max-resolution', description: 'The maximum resolution of the device, using dpi or dpcm.' },
    { name: 'max-width', description: 'The maximum width of the display area, such as a browser window.' },
    { name: 'min-aspect-ratio', description: 'The minimum ratio between the width and the height of the display area.' },
    { name: 'min-color', description: 'The minimum number of bits per color component for the output device.' },
    { name: 'min-color-index', description: 'The minimum number of colors the device can display.' },
    { name: 'min-height', description: 'The minimum height of the display area, such as a browser window.' },
    { name: 'min-monochrome', description: 'The minimum number of bits per "color" on a monochrome (greyscale) device.' },
    { name: 'min-resolution', description: 'The minimum resolution of the device, using dpi or dpcm.' },
    { name: 'min-width', description: 'The minimum width of the display area, such as a browser window.' },
    { name: 'scan', description: 'The scanning process of the output device.' },
    // 分割线, 以下内容参考: https://www.runoob.com/cssref/css3-pr-mediaquery.html
    { name: 'max-device-aspect-ratio', description: "Defines the maximum ratio of the output device's screen width to height." },
    { name: 'max-device-height', description: 'Define the maximum height visible to the screen of the output device.' },
    { name: 'max-device-width', description: 'Define the maximum visible width of the screen for the output device.' },
    { name: 'min-device-aspect-ratio', description: "Defines the minimum ratio of the output device's screen width to height." },
    { name: 'min-device-width', description: 'Define the minimum visible width of the screen for the output device.' },
    { name: 'min-device-height', description: 'Defines the minimum visible height of the screen of the output device.' },
    // 分割线, 下面是废弃的typee
    {
        name: 'device-aspect-ratio',
        description: 'Width-to-height aspect ratio of the output device. Deprecated in Media Queries Level 4.\n\n[MDN Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/device-aspect-ratio)',
    },
    {
        name: 'device-height',
        description: 'Height of the rendering surface of the output device. Deprecated in Media Queries Level 4.\n\n[MDN Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/device-height)',
    },
    {
        name: 'device-width',
        description: 'Width of the rendering surface of the output device. Deprecated in Media Queries Level 4.\n\n[MDN Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/device-width)',
    },
];
exports.mediaFeatures = mediaFeatures;
const charsetFeatures = [
    {
        name: 'asmo-708',
        description: 'asmo-708',
    },
    {
        name: 'big5',
        description: 'big5',
    },
    {
        name: 'cp1256',
        description: 'cp1256',
    },
    {
        name: 'cp866',
        description: 'cp866',
    },
    {
        name: 'csISO2022jp',
        description: 'csISO2022jp',
    },
    {
        name: 'din_66003-kr',
        description: 'din_66003-kr',
    },
    {
        name: 'dos-720',
        description: 'dos-720',
    },
    {
        name: 'dos-862',
        description: 'dos-862',
    },
    {
        name: 'dos-874',
        description: 'dos-874',
    },
    {
        name: 'euc-jp',
        description: 'euc-jp',
    },
    {
        name: 'euc-kr',
        description: 'euc-kr',
    },
    {
        name: 'gb2312',
        description: 'gb2312',
    },
    {
        name: 'hz-gb-2312',
        description: 'hz-gb-2312',
    },
    {
        name: 'ibm852',
        description: 'ibm852',
    },
    {
        name: 'ibm866',
        description: 'ibm866',
    },
    {
        name: 'irv',
        description: 'irv',
    },
    {
        name: 'iso-2022-kr',
        description: 'iso-2022-kr',
    },
    {
        name: 'iso-8859-1',
        description: 'iso-8859-1',
    },
    {
        name: 'iso-8859-15',
        description: 'iso-8859-15',
    },
    {
        name: 'iso-8859-2',
        description: 'iso-8859-2',
    },
    {
        name: 'iso-8859-3',
        description: 'iso-8859-3',
    },
    {
        name: 'iso-8859-4',
        description: 'iso-8859-4',
    },
    {
        name: 'iso-8859-5',
        description: 'iso-8859-5',
    },
    {
        name: 'iso-8859-6',
        description: 'iso-8859-6',
    },
    {
        name: 'iso-8859-7',
        description: 'iso-8859-7',
    },
    {
        name: 'iso-8859-8',
        description: 'iso-8859-8',
    },
    {
        name: 'iso-8859-9',
        description: 'iso-8859-9',
    },
    {
        name: 'koi8-r',
        description: 'koi8-r',
    },
    {
        name: 'ks_c_5601',
        description: 'ks_c_5601',
    },
    {
        name: 'ns_4551-1-kr',
        description: 'ns_4551-1-kr',
    },
    {
        name: 'sen_850200_b',
        description: 'sen_850200_b',
    },
    {
        name: 'shift_jis',
        description: 'shift_jis',
    },
    {
        name: 'us-ascii',
        description: 'us-ascii',
    },
    {
        name: 'utf-8',
        description: 'utf-8',
    },
    {
        name: 'windows-1250',
        description: 'windows-1250',
    },
    {
        name: 'windows-1251',
        description: 'windows-1251',
    },
    {
        name: 'windows-1252',
        description: 'windows-1252',
    },
    {
        name: 'windows-1253',
        description: 'windows-1253',
    },
    {
        name: 'windows-1254',
        description: 'windows-1254',
    },
    {
        name: 'windows-1255',
        description: 'windows-1255',
    },
    {
        name: 'windows-1256',
        description: 'windows-1256',
    },
    {
        name: 'windows-1257',
        description: 'windows-1257',
    },
    {
        name: 'windows-1258',
        description: 'windows-1258',
    },
    {
        name: 'windows-874',
        description: 'windows-874',
    },
    {
        name: 'x-euc',
        description: 'x-euc',
    },
];
exports.charsetFeatures = charsetFeatures;
const deprecatedPseudoElementList = [
    {
        name: ':before',
        description: '(single colon) CSS2 deprecated syntax (only used to support IE8)',
    },
];
exports.deprecatedPseudoElementList = deprecatedPseudoElementList;
//# sourceMappingURL=extraProcessor.js.map