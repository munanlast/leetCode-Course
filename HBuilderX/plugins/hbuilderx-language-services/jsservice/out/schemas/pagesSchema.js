"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagesSchema = void 0;
let baseUrl = 'http://uniapp.dcloud.io/';
function buildUrl(url) {
    return baseUrl + url;
}
// pages.json schema
let PagesSchema = {
    "type": "object",
    "definitions": {
        "PagesOptionsPage": {
            "type": "object",
            "properties": {
                "path": {
                    "description": "页面路径",
                    "type": "string",
                    "enum": ["HBuilderX.PageURIString"]
                },
                "style": {
                    "description": "页面样式",
                    "$ref": "#/definitions/PagesOptionsPageStyle"
                }
            }
        },
        "PreloadRulePage": {
            "type": "object",
            "properties": {
                "network": {
                    "description": "在指定网络下预下载",
                    "type": "string",
                    "enum": ["all", "wifi"]
                },
                "packages": {
                    "description": "进入页面后预下载分包的 root 或 name",
                    "type": "object"
                }
            }
        },
        "PagesOptionsPageStyle": {
            "type": "object",
            "properties": {
                "navigationBarBackgroundColor": {
                    "description": "导航栏背景颜色",
                    "type": "string",
                    "enum": ["HBuilderX.ColorString"]
                },
                "navigationBarTextStyle": {
                    "description": "导航栏标题颜色，仅支持 black/white",
                    "type": "string",
                    "enum": ["white", "black"]
                },
                "navigationBarShadow": {
                    "description": "导航栏阴影",
                    "type": "object",
                    "properties": {
                        "colorType": {
                            "description": "阴影的颜色，支持：grey、blue、green、orange、red、yellow",
                            "type": "string"
                        }
                    }
                },
                "disableScroll": {
                    "description": "设置为 true 则页面整体不能上下滚动（bounce效果），只在页面配置中有效，在globalStyle中设置无效",
                    "type": "boolean"
                },
                "enablePullDownRefresh": {
                    "description": "是否开启下拉刷新",
                    "type": "boolean"
                },
                "navigationBarTitleText": {
                    "description": "导航栏标题文字内容",
                    "type": "string"
                },
                "navigationStyle": {
                    "description": "导航栏样式",
                    "type": "string",
                    "enum": ["default", "custom"]
                },
                "backgroundColor": {
                    "description": "页面背景颜色",
                    "type": "string",
                    "enum": ["HBuilderX.ColorString"]
                },
                "backgroundTextStyle": {
                    "description": "下拉 loading 的样式",
                    "type": "string",
                    "enum": ["dark", "light"]
                },
                "onReachBottomDistance": {
                    "description": "页面上拉触底事件触发时距页面底部距离",
                    "type": "number"
                },
                "backgroundColorTop": {
                    "description": "顶部窗口的背景色",
                    "type": "string",
                    "enum": "HBuilderX.ColorString"
                },
                "backgroundColorBottom": {
                    "description": "底部窗口的背景色",
                    "type": "string",
                    "enum": "HBuilderX.ColorString"
                },
                "disableSwipeBack": {
                    "description": "是否禁用滑动返回",
                    "type": "boolean",
                },
                "titleImage": {
                    "description": "导航栏图片地址（替换当前文字标题），支付宝小程序内必须使用https的图片链接地址",
                    "type": "string",
                    "enum": ["HBuilderX.ImageURIString"]
                },
                "transparentTitle": {
                    "description": "导航栏透明设置。默认 none",
                    "type": "string",
                    "enum": ["always", "auto", "none"]
                },
                "titlePenetrate": {
                    "description": "导航栏点击穿透",
                    "type": "string",
                    "enum": ["YES", "NO"]
                },
                "app-plus": {
                    "description": "5+ App 特有配置",
                    "$ref": "#/definitions/PagesOptionsPageStyleAppPlus"
                },
                "h5": {
                    "description": "H5 特有配置",
                    "$ref": "#/definitions/PagesOptionsPageStyleH5"
                },
                "mp-alipay": {
                    "description": "支付宝小程序特有配置",
                    "$ref": "#/definitions/PagesOptionsPageStyleMPAlipay"
                },
                "mp-weixin": {
                    "description": "微信小程序特有配置",
                    "type": "object"
                },
                "mp-baidu": {
                    "description": "百度小程序特有配置",
                    "type": "object"
                },
                "mp-tuotiao": {
                    "description": "头条小程序特有配置",
                    "type": "object"
                },
                "mp-qq": {
                    "description": "QQ小程序特有配置",
                    "type": "object"
                },
                "mp-kuaishou": {
                    "description": "快手小程序特有配置",
                    "type": "object"
                },
                "mp-jd": {
                    "description": "设置编译到 mp-jd 平台的特定样式",
                    "type": "object"
                },
                "mp-lark": {
                    "description": "飞书小程序特有配置",
                    "type": "object"
                },
                "usingComponenets": {
                    "description": "使用自定义组件",
                    "type": "object"
                },
                "leftWindow": {
                    "description": "当存在 leftWindow时，当前页面是否显示 leftWindow",
                    "type": "boolean"
                },
                "topWindow": {
                    "description": "当存在 topWindow时，当前页面是否显示 topWindow",
                    "type": "boolean"
                },
                "rightWindow": {
                    "description": "当存在 rightWindow时，当前页面是否显示 rightWindow",
                    "type": "boolean"
                },
                "maxWidth": {
                    "description": "单位px，当浏览器可见区域宽度大于maxWidth时，两侧留白，当小于等于maxWidth时，页面铺满；不同页面支持配置不同的maxWidth；maxWidth = leftWindow(可选)+page(页面主体)+rightWindow(可选)",
                    "type": "number"
                }
            }
        },
        "PagesGlobalPageStyle": {
            "type": "object",
            "properties": {
                "navigationBarBackgroundColor": {
                    "description": "导航栏背景颜色",
                    "type": "string",
                    "enum": ["HBuilderX.ColorString"]
                },
                "navigationBarTextStyle": {
                    "description": "导航栏标题颜色，仅支持 black/white",
                    "type": "string",
                    "enum": ["white", "black"]
                },
                "navigationBarTitleText": {
                    "description": "导航栏标题文字内容",
                    "type": "string"
                },
                "navigationStyle": {
                    "description": "导航栏样式",
                    "type": "string",
                    "enum": ["default", "custom"]
                },
                "backgroundColor": {
                    "description": "导航栏背景颜色",
                    "type": "string",
                    "enum": ["HBuilderX.ColorString"]
                },
                "backgroundTextStyle": {
                    "description": "下拉 loading 的样式",
                    "type": "string",
                    "enum": ["dark", "light"]
                },
                "enablePullDownRefresh": {
                    "description": "是否开启下拉刷新",
                    "type": "boolean"
                },
                "onReachBottomDistance": {
                    "description": "页面上拉触底事件触发时距页面底部距离",
                    "type": "number"
                },
                "backgroundColorTop": {
                    "description": "顶部窗口的背景色",
                    "type": "string",
                    "enum": "HBuilderX.ColorString"
                },
                "backgroundColorBottom": {
                    "description": "底部窗口的背景色",
                    "type": "string",
                    "enum": "HBuilderX.ColorString"
                },
                "titleImage": {
                    "description": "导航栏图片地址（替换当前文字标题），支付宝小程序内必须使用https的图片链接地址",
                    "type": "string",
                    "enum": ["HBuilderX.ImageURIString"]
                },
                "transparentTitle": {
                    "description": "导航栏透明设置。默认 none",
                    "type": "string",
                    "enum": ["always", "auto", "none"]
                },
                "titlePenetrate": {
                    "description": "导航栏点击穿透",
                    "type": "string",
                    "enum": ["YES", "NO"]
                },
                "pageOrientation": {
                    "description": "屏幕旋转设置",
                    "type": "string"
                },
                "animationType": {
                    "description": "窗口显示的动画效果",
                    "type": "string",
                    "enum": ["slide-in-right", "slide-in-left", "slide-in-top", "slide-in-bottom", "fade-in", "zoom-out", "zoom-fade-out", "pop-in"]
                },
                "animationDuration": {
                    "description": "窗口显示动画的持续时间",
                    "type": "number"
                },
                "allowsBounceVertical": {
                    "description": "是否允许向下拉拽。默认 YES。如果需要下拉刷新值必须为YES",
                    "type": "string",
                    "enum": ["YES", "NO"]
                },
                "usingComponents": {
                    "description": "使用自定义组件",
                    "type": "object"
                },
                "renderingMode": {
                    "description": "同层渲染，webrtc(实时音视频) 无法正常时尝试配置 seperated 强制关掉同层",
                    "type": "string"
                },
                "leftWindow": {
                    "description": "当存在 leftWindow时，当前页面是否显示 leftWindow",
                    "type": "boolean"
                },
                "topWindow": {
                    "description": "当存在 topWindow时，当前页面是否显示 topWindow",
                    "type": "boolean"
                },
                "rightWindow": {
                    "description": "当存在 rightWindow时，当前页面是否显示 rightWindow",
                    "type": "boolean"
                },
                "rpxCalcMaxDeviceWidth": {
                    "description": "rpx 计算所支持的最大设备宽度，单位 px",
                    "type": "number"
                },
                "rpxCalcBaseDeviceWidth": {
                    "description": "rpx 计算使用的基准设备宽度，设备实际宽度超出 rpx 计算所支持的最大设备宽度时将按基准宽度计算，单位 px",
                    "type": "number"
                },
                "rpxCalcIncludeWidth": {
                    "description": "rpx 计算特殊处理的值，始终按实际的设备宽度计算，单位 rpx",
                    "type": "number"
                },
                "dynamicRpx": {
                    "description": "动态 rpx，屏幕大小变化会重新渲染 rpx",
                    "type": "boolean"
                },
                "maxWidth": {
                    "description": "单位px，当浏览器可见区域宽度大于maxWidth时，两侧留白，当小于等于maxWidth时，页面铺满；不同页面支持配置不同的maxWidth；maxWidth = leftWindow(可选)+page(页面主体)+rightWindow(可选)",
                    "type": "number"
                },
                "softinputMode": {
                    "description": "弹出系统软键盘模式",
                    "type": "string",
                    "enum": ["nothing", "adjustPan", "adjustResize"]
                },
                "app-plus": {
                    "description": "5+ App 特有配置",
                    "$ref": "#/definitions/PagesOptionsPageStyleAppPlus"
                },
                "h5": {
                    "description": "H5 特有配置",
                    "$ref": "#/definitions/PagesOptionsPageStyleH5"
                },
                "mp-alipay": {
                    "description": "支付宝小程序特有配置",
                    "$ref": "#/definitions/PagesOptionsPageStyleMPAlipay"
                },
                "mp-weixin": {
                    "description": "微信小程序特有配置",
                    "type": "object"
                },
                "mp-baidu": {
                    "description": "百度小程序特有配置",
                    "type": "object"
                },
                "mp-tuotiao": {
                    "description": "头条小程序特有配置",
                    "type": "object"
                },
                "mp-qq": {
                    "description": "QQ小程序特有配置",
                    "type": "object"
                },
                "mp-kuaishou": {
                    "description": "快手小程序特有配置",
                    "type": "object"
                },
                "mp-jd": {
                    "description": "设置编译到 mp-jd 平台的特定样式",
                    "type": "object"
                },
                "mp-lark": {
                    "description": "飞书小程序特有配置",
                    "type": "object"
                }
            }
        },
        "PagesWindowsOptions": {
            "type": "object",
            "properties": {
                "path": {
                    "description": "配置页面路径",
                    "type": "string"
                },
                "style": {
                    "description": "配置页面窗口表现，配置项参考下方",
                    "type": "object"
                },
                "matchMedia": {
                    "description": "导航栏标题文字内容",
                    "type": "object"
                },
            }
        },
        "PagesOptionsPageStyleAppPlus": {
            "type": "object",
            "properties": {
                "background": {
                    "description": "窗体背景色。无论vue页面还是nvue页面，在App上都有一个父级原生窗体，该窗体的背景色生效时间快于页面里的css生效时间",
                    "type": "string",
                    "enum": ["HBuilderX.ColorString"]
                },
                "titleNView": {
                    "description": "导航栏设置",
                    "$ref": "#/definitions/PageStyleAppPlusTitleNView"
                },
                "subNVues": {
                    "description": "原生子窗体设置",
                    "type": "array",
                    "items": { "$ref": "#/definitions/PageStyleAppPlusSubNVues" }
                },
                "softinputmode": {
                    "description": "弹出系统软键盘模式",
                    "type": "string",
                    "enum": ["nothing", "adjustPan", "adjustResize"]
                },
                "bounce": {
                    "description": "回弹效果",
                    "type": "string",
                    "enum": ["none", "vertical", "horizontal", "all"]
                },
                "popGesture": {
                    "description": "侧滑返回功能，可选值：\"close\"（启用侧滑返回）、\"none\"（禁用侧滑返回）",
                    "type": "string",
                    "enum": ["close", "none"]
                },
                "pullToRefresh": {
                    "description": "下拉刷新",
                    "$ref": "#/definitions/PageStyleAppPlusPullToRefresh"
                },
                "scrollIndicator": {
                    "description": "是否显示滚动条，设置为 \"none\" 时不显示滚动条。",
                    "type": "string"
                },
                "animationType": {
                    "description": "窗口的显示的动画类型",
                    "type": "string",
                    "enum": ["auto", "none", "slide-in-right", "slide-in-left", "slide-in-top", "slide-in-bottom", "fade-in", "zoom-out", "zoom-fade-out", "pop-in"]
                },
                "animationDuration": {
                    "description": "窗口的显示动画的持续时间",
                    "type": "number"
                },
                "softinputNavBar": {
                    "description": "软键盘上导航条的显示模式",
                    "type": "string",
                    "enum": ["auto", "none"]
                }
            }
        },
        "PageStyleAppPlusTitleNView": {
            "type": "object",
            "properties": {
                "backgroundColor": {
                    "description": "标题栏控件的背景颜色",
                    "type": "string",
                    "enum": ["HBuilderX.ColorString"]
                },
                "buttons": {
                    "description": "标题栏上的自定义按钮",
                    "type": "array",
                    "items": { "$ref": "#/definitions/PageStyleAppPlusTitleNViewButton" }
                },
                "titleColor": {
                    "description": "标题栏控件的标题文字颜色",
                    "type": "string",
                    "enum": ["HBuilderX.ColorString"]
                },
                "titleOverflow": {
                    "description": "标题栏控件的标题文字超出显示区域时处理方式",
                    "type": "string",
                    "enum": ["clip", "ellipsis"]
                },
                "titleText": {
                    "description": "标题栏控件的标题文字",
                    "type": "string"
                },
                "titleSize": {
                    "description": "标题栏控件的标题文字字体大小",
                    "type": "string"
                },
                "type": {
                    "description": "标题栏控件样式",
                    "type": "string",
                    "enum": ["default", "transparent", "float"]
                },
                "tags": {
                    "description": "原生 View 增强",
                    "type": "array"
                },
                "searchInput": {
                    "description": "原生导航栏上的搜索框样式",
                    "$ref": "#/definitions/PageStyleAppPlusTitleNViewSearchInput"
                },
                "backButton": {
                    "description": "返回按钮样式",
                    "$ref": "#/definitions/PageStyleAppPlusBackButton"
                },
                "autoBackButton": {
                    "description": "标题栏控件是否显示左侧返回按钮",
                    "type": "boolean"
                },
                "homeButton": {
                    "description": "标题栏控件是否显示Home按钮",
                    "type": "boolean"
                },
                "backgroundImage": {
                    "description": "支持以下类型： 背景图片路径 - 如\"./img/t.png\"，仅支持本地文件路径， 相对路径，相对于当前页面的host位置，根据实际标题栏宽高拉伸绘制； 渐变色 - 仅支持线性渐变，两种颜色的渐变，如“linear-gradient(to top, #a80077, #66ff00)”， 其中第一个参数为渐变方向，可取值： \"to right\"表示从左向右渐变， \"to left\"表示从右向左渐变， \"to bottom\"表示从上到下渐变， \"to top\"表示从下到上渐变， \"to bottom right\"表示从左上角到右下角， \"to top left\"表示从右下角到左上角",
                    "type": "string",
                    "enum": ["HBuilderX.ImageURIString"]
                },
                "backgroundRepeat": {
                    "description": "仅在backgroundImage设置为图片路径时有效。 可取值： \"repeat\" - 背景图片在垂直方向和水平方向平铺； \"repeat-x\" - 背景图片在水平方向平铺，垂直方向拉伸； \"repeat-y\" - 背景图片在垂直方向平铺，水平方向拉伸； \"no-repeat\" - 背景图片在垂直方向和水平方向都拉伸。 默认使用 \"no-repeat\"",
                    "type": "string",
                    "enum": ["repeat", "repeat-x", "repeat-y", "no-repeat"]
                },
                "titleAlign": {
                    "description": "标题对齐方式",
                    "type": "string",
                    "enum": ["center", "left", "auto"]
                },
            }
        },
        "PageStyleAppPlusSubNVues": {
            "type": "object",
            "properties": {
                "id": {
                    "description": "subNVue 原生子窗体的标识",
                    "type": "string"
                },
                "path": {
                    "description": "配置 nvue 文件路径，nvue 文件需放置到使用 subNvue 的页面文件目录下",
                    "type": "string",
                    "enum": ["HBuilderX.NPageURIString"]
                },
                "type": {
                    "description": "内置样式",
                    "type": "string",
                    "enum": ["popup", "navigationBar"]
                },
                "style": {
                    "description": "subNVue 原生子窗体的样式，配置项参考下方",
                    "$ref": "#/definitions/SubNVuesStyle"
                }
            }
        },
        "SubNVuesStyle": {
            "type": "object",
            "properties": {
                "position": {
                    "description": "原生子窗体的排版位置",
                    "type": "string",
                    "enum": ["static", "absolute", "dock"]
                },
                "dock": {
                    "description": "原生子窗体的停靠方式,仅当原生子窗体 \"position\" 属性值设置为 \"dock\" 时才生效",
                    "type": "string",
                    "enum": ["top", "bottom", "right", "left"]
                },
                "mask": {
                    "description": "原生子窗体的遮罩层",
                    "type": "string",
                    "enum": ["HBuilderX.ColorString"]
                },
                "width": {
                    "description": "原生子窗体的宽度",
                    "type": "string"
                },
                "height": {
                    "description": "原生子窗体的高度",
                    "type": "string"
                },
                "top": {
                    "description": "原生子窗体垂直向下的偏移量",
                    "type": "string"
                },
                "bottom": {
                    "description": "原生子窗体垂直向上的偏移量",
                    "type": "string"
                },
                "left": {
                    "description": "原生子窗体水平向左的偏移量",
                    "type": "string"
                },
                "right": {
                    "description": "原生子窗体水平向右的偏移量",
                    "type": "string"
                },
                "margin": {
                    "description": "原生子窗体的边距",
                    "type": "string"
                }
            }
        },
        "PageStyleAppPlusPullToRefresh": {
            "type": "object",
            "properties": {
                "support": {
                    "description": "是否开启窗口的下拉刷新功能",
                    "type": "boolean"
                },
                "color": {
                    "description": "颜色值格式为\"#RRGGBB\"，仅\"circle\"样式下拉刷新支持此属性。",
                    "type": "string",
                    "enum": ["HBuilderX.ColorString"]
                },
                "style": {
                    "description": "下拉刷新控件样式",
                    "type": "string",
                    "enum": ["default", "circle"]
                },
                "height": {
                    "description": "窗口的下拉刷新控件进入刷新状态的拉拽高度。支持百分比，如\"10%\"；像素值，如\"50px\"。",
                    "type": "string"
                },
                "range": {
                    "description": "窗口可下拉拖拽的范围。支持百分比，如\"10%\"；像素值，如\"50px\"。",
                    "type": "string"
                },
                "offset": {
                    "description": "下拉刷新控件的起始位置。仅对\"circle\"样式下拉刷新控件有效，用于定义刷新控件下拉时的起始位置。支持百分比，如\"10%\"；像素值，如\"50px\"。",
                    "type": "string"
                },
                "contentdown": {
                    "description": "在下拉可刷新状态时下拉刷新控件显示的内容",
                    "$ref": "#/definitions/PageStyleAppPlusPullToRefreshContent"
                },
                "contentover": {
                    "description": "在释放可刷新状态时下拉刷新控件显示的内容",
                    "$ref": "#/definitions/PageStyleAppPlusPullToRefreshContent"
                },
                "contentrefresh": {
                    "description": "在正在刷新状态时下拉刷新控件显示的内容",
                    "$ref": "#/definitions/PageStyleAppPlusPullToRefreshContent"
                }
            }
        },
        "PageStyleAppPlusPullToRefreshContent": {
            "type": "object",
            "properties": {
                "caption": {
                    "description": "下拉刷新控件上显示的标题内容",
                    "type": "string"
                }
            }
        },
        "PageStyleAppPlusTitleNViewButton": {
            "type": "object",
            "properties": {
                "type": {
                    "description": "按钮样式。运行环境中内置按钮样式直接使用，内置样式忽略fontSrc和text属性。",
                    "type": "string",
                    "enum": ["forward", "back", "share", "favorite", "home", "menu", "close", "none"]
                },
                "color": {
                    "description": "按钮上文字颜色",
                    "type": "string",
                    "enum": ["HBuilderX.ColorString"]
                },
                "colorPressed": {
                    "description": "按下状态按钮文字颜色",
                    "type": "string"
                },
                "float": {
                    "description": "按钮在标题栏上的显示位置",
                    "type": "string",
                    "enum": ["right", "left"]
                },
                "fontWeight": {
                    "description": "按钮上文字的粗细",
                    "type": "string",
                    "enum": ["normal", "bold"]
                },
                "fontSize": {
                    "description": "按钮上文字大小",
                    "type": "string"
                },
                "fontSrc": {
                    "description": "按钮上文字使用的字体文件路径",
                    "type": "string"
                },
                "onclick": {
                    "description": "按钮点击后触发的回调函数",
                    "type": "string",
                    "enum": ["Function"]
                },
                "text": {
                    "description": "按钮上显示的文字",
                    "type": "string"
                }
            }
        },
        "PageStyleAppPlusTitleNViewProgress": {
            "type": "object",
            "properties": {
                "color": {
                    "description": "进度条颜色",
                    "type": "string",
                    "enum": ["HBuilderX.ColorString"]
                },
                "height": {
                    "description": "进度条高度",
                    "type": "string"
                }
            }
        },
        "PageStyleAppPlusTitleNViewSplitLine": {
            "type": "object",
            "properties": {
                "color": {
                    "description": "底部分割线颜色",
                    "type": "string",
                    "enum": ["HBuilderX.ColorString"]
                },
                "height": {
                    "description": "底部分割线高度",
                    "type": "string"
                }
            }
        },
        "PageStyleAppPlusTitleNViewSearchInput": {
            "type": "object",
            "properties": {
                "autoFocus": {
                    "description": "是否自动获取焦点",
                    "type": "boolean"
                },
                "align": {
                    "description": "非输入状态下文本的对齐方式",
                    "type": "string",
                    "enum": ["left", "right", "center"]
                },
                "backgroundColor": {
                    "description": "背景颜色",
                    "type": "string"
                },
                "borderRadius": {
                    "description": "输入框的圆角半径",
                    "type": "string"
                },
                "placeholder": {
                    "description": "提示文本",
                    "type": "string"
                },
                "placeholderColor": {
                    "description": "提示文本颜色",
                    "type": "string"
                },
                "disabled": {
                    "description": "是否可输入",
                    "type": "boolean"
                }
            }
        },
        "PageStyleAppPlusBackButton": {
            "type": "object",
            "properties": {
                "background": {
                    "description": "背景颜色，仅在标题栏type=transparent时生效，当标题栏透明时按钮显示的背景颜色。 可取值#RRGGBB和rgba格式颜色字符串，默认值为灰色半透明。",
                    "type": "string"
                },
                "badgeText": {
                    "description": "角标文本，最多显示3个字符，超过则显示为...",
                    "type": "string"
                },
                "color": {
                    "description": "",
                    "type": "string"
                },
                "colorPressed": {
                    "description": "按下状态按钮文字颜色，可取值： \"#RRGGBB\"格式字符串，如\"#FF0000\"表示红色； \"rgba(R,G,B,A)\"，其中R/G/B分别代表红色值/绿色值/蓝色值，正整数类型，取值范围为0-255，A为透明度，浮点数类型，取值范围为0-1（0为全透明，1为不透明），如\"rgba(255,0,0,0.5)\"，表示红色半透明。 默认值为color属性值自动调整透明度为0.3。",
                    "type": "string"
                },
                "fontWeight": {
                    "description": "返回图标的粗细，可取值：\"normal\" - 标准字体； \"bold\" - 加粗字体。",
                    "type": "string"
                },
                "fontSize": {
                    "description": "返回图标文字大小，可取值：字体高度像素值，数字加\"px\"格式字符串，如\"22px\"。 窗口标题栏为透明样式（type=\"transparent\"）时，默认值为\"22px\"； 窗口标题栏为默认样式（type=\"default\"）时，默认值为\"27px\"。",
                    "type": "string"
                },
                "redDot": {
                    "description": "是否显示红点，设置为true则显示红点，false则不显示红点。默认值为false。 注意：当设置了角标文本时红点不显示。",
                    "type": "boolean"
                },
                "title": {
                    "description": "返回按钮上的标题，显示在返回图标（字体图标）后，默认为空字符串。",
                    "type": "string"
                },
                "ftitleWeight": {
                    "description": "返回按钮上标题的粗细，可取值： \"normal\" - 标准字体； \"bold\" - 加粗字体。",
                    "type": "string"
                }
            }
        },
        "PagesOptionsPageStyleH5": {
            "type": "object",
            "properties": {
                "titleNView": {
                    "description": "导航栏设置",
                    "$ref": "#/definitions/PageStyleH5TitleNView"
                },
                "pullToRefresh": {
                    "description": "下拉刷新",
                    "$ref": "#/definitions/PageStyleH5PullToRefresh"
                }
            }
        },
        "PagesOptionsPageStyleMPAlipay": {
            "type": "object",
            "properties": {
                "allowsBounceVertical": {
                    "description": "是否允许向下拉拽。默认 YES。如果需要下拉刷新值必须为YES",
                    "type": "string",
                    "enum": ["YES", "NO"]
                },
                "transparentTitle": {
                    "description": "导航栏透明设置。默认 none",
                    "type": "string",
                    "enum": ["always", "auto", "none"]
                },
                "titlePenetrate": {
                    "description": "导航栏点击穿透",
                    "type": "string"
                },
                "showTitleLoading": {
                    "description": "进入时导航栏显示loading",
                    "type": "string",
                    "enum": ["YES", "NO"]
                },
                "titleImage": {
                    "description": "导航栏图片地址，替换导航栏标题，必须为https的图片链接地址",
                    "type": "string"
                },
                "backgroundImageUrl": {
                    "description": "下拉露出显示的背景图链接",
                    "type": "string",
                    "enum": ["HBuilderX.ImageURIString"]
                },
                "backgroundImageColor": {
                    "description": "下拉露出显示的背景图底色",
                    "type": "string",
                    "enum": ["HBuilderX.ColorString"]
                },
                "gestureBack": {
                    "description": "支付宝小程序 iOS 用，是否支持手势返回。默认 NO",
                    "type": "string",
                    "enum": ["YES", "NO"]
                },
                "enableScrollBar": {
                    "description": "支付宝小程序 Android 用，是否显示 WebView 滚动条。默认 YES",
                    "type": "string",
                    "enum": ["YES", "NO"]
                }
            }
        },
        "PageStyleH5TitleNView": {
            "type": "object",
            "properties": {
                "backgroundColor": {
                    "description": "标题栏控件的背景颜色",
                    "type": "string",
                    "enum": ["HBuilderX.ColorString"]
                },
                "buttons": {
                    "description": "标题栏上的自定义按钮",
                    "type": "array",
                    "items": { "refs": "#/definitions/PageStyleH5TitleNViewButton" }
                },
                "titleColor": {
                    "description": "标题栏控件的标题文字颜色",
                    "type": "string",
                    "enum": ["HBuilderX.ColorString"]
                },
                "titleText": {
                    "description": "标题栏控件的标题文字",
                    "type": "string"
                },
                "titleSize": {
                    "description": "标题栏控件的标题文字字体大小",
                    "type": "string"
                },
                "type": {
                    "description": "标题栏控件样式",
                    "type": "string",
                    "enum": ["default", "transparent"]
                }
            }
        },
        "PageStyleH5PullToRefresh": {
            "type": "object",
            "properties": {
                "support": {
                    "description": "是否开启窗口的下拉刷新功能",
                    "type": "boolean"
                },
                "color": {
                    "description": "颜色值格式为\"#RRGGBB\"，仅\"circle\"样式下拉刷新支持此属性。",
                    "type": "string",
                    "enum": ["HBuilderX.ColorString"]
                },
                "type": {
                    "description": "下拉刷新控件样式",
                    "type": "string",
                    "enum": ["default", "circle"]
                },
                "height": {
                    "description": "窗口的下拉刷新控件进入刷新状态的拉拽高度。支持百分比，如\"10%\"；像素值，如\"50px\"。",
                    "type": "string"
                },
                "range": {
                    "description": "窗口可下拉拖拽的范围。支持百分比，如\"10%\"；像素值，如\"50px\"。",
                    "type": "string"
                },
                "offset": {
                    "description": "下拉刷新控件的起始位置。仅对\"circle\"样式下拉刷新控件有效，用于定义刷新控件下拉时的起始位置。支持百分比，如\"10%\"；像素值，如\"50px\"。",
                    "type": "string"
                },
                "contentdown": {
                    "description": "在下拉可刷新状态时下拉刷新控件显示的内容",
                    "$ref": "#/definitions/PageStyleAppPlusPullToRefreshContent"
                },
                "contentover": {
                    "description": "在释放可刷新状态时下拉刷新控件显示的内容",
                    "$ref": "#/definitions/PageStyleAppPlusPullToRefreshContent"
                },
                "contentrefresh": {
                    "description": "在正在刷新状态时下拉刷新控件显示的内容",
                    "$ref": "#/definitions/PageStyleAppPlusPullToRefreshContent"
                }
            }
        },
        "PageStyleH5TitleNViewButton": {
            "type": "object",
            "properties": {
                "type": {
                    "description": "按钮样式。运行环境中内置按钮样式直接使用，内置样式忽略fontSrc和text属性。",
                    "type": "string",
                    "enum": ["forward", "back", "share", "favorite", "home", "menu", "close", "none"]
                },
                "color": {
                    "description": "按钮上文字颜色",
                    "type": "string",
                    "enum": ["HBuilderX.ColorString"]
                },
                "colorPressed": {
                    "description": "按下状态按钮文字颜色",
                    "type": "string"
                },
                "float": {
                    "description": "按钮在标题栏上的显示位置",
                    "type": "string",
                    "enum": ["right", "left"]
                },
                "fontWeight": {
                    "description": "按钮上文字的粗细",
                    "type": "string",
                    "enum": ["normal", "bold"]
                },
                "fontSize": {
                    "description": "按钮上文字大小",
                    "type": "string"
                },
                "fontSrc": {
                    "description": "按钮上文字使用的字体文件路径",
                    "type": "string"
                },
                "onclick": {
                    "description": "按钮点击后触发的回调函数",
                    "type": "string",
                    "enum": ["Function"]
                },
                "text": {
                    "description": "标题栏控件的标题文字超出显示区域时处理方式",
                    "type": "string"
                },
            }
        },
        "PagesOptionsTabbar": {
            "type": "object",
            "properties": {
                "iconfontSrc": {
                    "description": ".ttf文件目录",
                    "type": "string"
                },
                "color": {
                    "description": "tab 上的文字默认颜色",
                    "type": "string",
                    "enum": ["HBuilderX.ColorString"]
                },
                "selectedColor": {
                    "description": "tab 上的文字选中时的颜色",
                    "type": "string",
                    "enum": ["HBuilderX.ColorString"]
                },
                "backgroundColor": {
                    "description": "tab 的背景色",
                    "type": "string",
                    "enum": ["HBuilderX.ColorString"]
                },
                "borderStyle": {
                    "description": "tabbar上边框的颜色， 仅支持 black/white",
                    "type": "string"
                },
                "list": {
                    "description": "tab 的列表",
                    "type": "array",
                    "items": { "$ref": "#/definitions/PagesOptionsTabbarList" }
                },
                "position": {
                    "description": "tabbar 的位置",
                    "type": "string",
                    "enum": ["top", "bottom"]
                },
                "fontSize": {
                    "description": "tabbar文字大小",
                    "type": "string"
                },
                "iconWidth": {
                    "description": "图标默认宽度（高度等比例缩放）",
                    "type": "string"
                },
                "spacing": {
                    "description": "图标和文字的间距",
                    "type": "string"
                },
                "height": {
                    "description": "tabBar 默认高度",
                    "type": "string"
                },
                "midButton": {
                    "$ref": "#/definitions/PagesOptionsTabbarMidButton"
                },
                "backgroundImage": {
                    "description": "设置图片背景色优先级高于 backgroundColor",
                    "type": "string"
                },
                "backgroundRepeat": {
                    "description": "设置标题栏的背景图平铺方式",
                    "type": "string"
                },
                "redDotColor": {
                    "description": "tabbar上红点颜色",
                    "type": "string",
                    "enum": ["HBuilderX.ColorString"]
                },
            }
        },
        "PagesOptionsTabbarMidButton": {
            "type": "object",
            "description": "tabBar 默认高度",
            "properties": {
                "width": {
                    "description": "中间按钮的宽度，tabBar 其它项为减去此宽度后平分，默认值为与其它项平分宽度",
                    "type": "string"
                },
                "height": {
                    "description": "中间按钮的高度，可以大于 tabBar 高度，达到中间凸起的效果",
                    "type": "string"
                },
                "text": {
                    "description": "中间按钮的文字",
                    "type": "string"
                },
                "iconPath": {
                    "description": "中间按钮的图片路径",
                    "type": "string",
                    "enum": ["HBuilderX.ImageURIString"]
                },
                "iconWidth": {
                    "description": "图标默认宽度（高度等比例缩放）",
                    "type": "string"
                },
                "backgroundImage": {
                    "description": "中间按钮的背景图片路径",
                    "type": "string",
                    "enum": ["HBuilderX.ImageURIString"]
                }
            }
        },
        "PagesOptionsTabbarList": {
            "type": "object",
            "properties": {
                "iconfont": {
                    "description": "字体图标，优先级高于 iconPath",
                    "type": "object",
                    "properties": {
                        "text": {
                            "description": "字库 Unicode 码",
                            "type": "string"
                        },
                        "selectedText": {
                            "description": "选中后字库 Unicode 码",
                            "type": "string"
                        },
                        "fontSize": {
                            "description": "字体图标字号(px)",
                            "type": "string"
                        },
                        "color": {
                            "description": "字体图标颜色",
                            "type": "string",
                            "enum": ["HBuilderX.ColorString"]
                        },
                        "selectedColor": {
                            "description": "字体图标选中颜色",
                            "type": "string",
                            "enum": ["HBuilderX.ColorString"]
                        },
                    }
                },
                "pagePath": {
                    "description": "页面路径",
                    "type": "string",
                    "enum": ["HBuilderX.PageURIString"]
                },
                "text": {
                    "description": "tab 上按钮文字",
                    "type": "string"
                },
                "iconPath": {
                    "description": "图片路径",
                    "type": "string",
                    "enum": ["HBuilderX.ImageURIString"]
                },
                "selectedIconPath": {
                    "description": "选中时的图片路径",
                    "type": "string",
                    "enum": ["HBuilderX.ImageURIString"]
                }
            }
        },
        "PagesCondition": {
            "type": "object",
            "properties": {
                "current": {
                    "description": "当前激活的模式，list节点的索引值。",
                    "type": "number"
                },
                "list": {
                    "description": "启动模式列表",
                    "type": "array",
                    "items": { "$ref": "#/definitions/PagesConditionItem" }
                }
            }
        },
        "PagesConditionItem": {
            "type": "object",
            "properties": {
                "name": {
                    "description": "启动模式名称",
                    "type": "string"
                },
                "path": {
                    "description": "启动页面路径",
                    "type": "string",
                    "enum": ["HBuilderX.PageURIString"]
                },
                "query": {
                    "description": "启动参数，可在页面的 onLoad 函数里获得",
                    "type": "string"
                }
            }
        },
        "PagesSubPackages": {
            "type": "object",
            "properties": {
                "root": {
                    "description": "子包的根目录",
                    "type": "string"
                },
                "pages": {
                    "description": "子包由哪些页面组成",
                    "type": "array",
                    "items": { "$ref": "#/definitions/PagesOptionsPage" }
                }
            }
        }
    },
    "properties": {
        "globalStyle": {
            "description": "默认页面的窗口表现",
            "$ref": "#/definitions/PagesGlobalPageStyle",
        },
        "topWindow": {
            "description": "上窗体",
            "$ref": "#/definitions/PagesWindowsOptions",
        },
        "leftWindow": {
            "description": "左窗体",
            "$ref": "#/definitions/PagesWindowsOptions",
        },
        "rightWindow": {
            "description": "右窗体",
            "$ref": "#/definitions/PagesWindowsOptions",
        },
        "pages": {
            "description": "页面路径及窗口表现",
            "type": "array",
            "items": { "$ref": "#/definitions/PagesOptionsPage" }
        },
        "tabBar": {
            "description": "底部 tab 的表现",
            "$ref": "#/definitions/PagesOptionsTabbar",
        },
        "condition": {
            "description": "启动模式",
            "$ref": "#/definitions/PagesCondition",
        },
        "subPackages": {
            "description": "分包加载配置",
            "type": "array",
            "items": { "$ref": "#/definitions/PagesSubPackages" }
        },
        "workers": {
            "description": "使用 Worker 处理多线程任务时，设置 Worker 代码放置的目录",
            "type": "string"
        },
        "preloadRule": {
            "description": "声明分包预下载的规则",
            "patternProperties": {
                "^[a-zA-Z_]+\\w?": { "$ref": "#/definitions/PreloadRulePage" }
            }
        },
        "easycom": {
            "description": "组件自动引入规则",
            "type": "object",
            "properties": {
                "autoscan": {
                    "description": "是否开启自动扫描，开启后将会自动扫描符合components/组件名称/组件名称.vue目录结构的组件",
                    "type": "boolean"
                },
                "custom": {
                    "description": "以正则方式自定义组件匹配规则。如果autoscan不能满足需求，可以使用custom自定义匹配规则",
                    "type": "object"
                }
            }
        }
    }
};
exports.PagesSchema = PagesSchema;
//# sourceMappingURL=pagesSchema.js.map