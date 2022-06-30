# HBuilder X - Release Notes
======================================
## 3.4.7.20220422
* 修复 语言服务 html a标签 target属性，没有自动拉出代码候选项的Bug [详情](https://ask.dcloud.net.cn/question/143628)
* 修复 语言服务 html 引用js后不提示js全局变量方法的Bug
* 修复 语言服务 html 输入!+tab后，`<html lang="">`设置为en的Bug [详情](https://ask.dcloud.net.cn/question/143531)
* 修复 语言服务 css属性 属性位置替换文本，替换内容错误的Bug
* 修复 语言服务 Vue script节点，无法提示vue某些代码块的Bug
* 修复 语言服务 Vue script节点，this.方法名，无法转到定义的Bug
* 修复 语言服务 uni-app pages.json提示的文件路径不区分大小写的Bug
* 修复 编辑器 撤销、恢复撤销操作，光标位置跳转错误的Bug
* 修复 项目运行过程中，项目管理器关闭项目可能引发的编辑器闪退的bug
* 修复 App安心打包 某些情况下提交安心打包失败的Bug
* 修复 App真机运行 某些情况下，因adb问题，查找模拟器设备失败的Bug
* 修复 App真机运行 当项目资源过大，引发的真机运行超时的Bug
* 【uni-app插件】
  + 新增 vue3 项目内置支持 pinia [详情](https://uniapp.dcloud.net.cn/tutorial/vue3-pinia.html)
  + 修复 3.4.6 版本引发的 vue3 项目使用 pinia 报错的Bug [详情](https://ask.dcloud.net.cn/question/143578)
  + 修复 3.4.6 版本引发的 vue3 项目部分情况编译变慢的Bug [详情](https://github.com/dcloudio/uni-app/issues/3458)
  + App平台 修复 vue3 项目 nvue 页面引用的静态资源编译后可能不存在的Bug
  + App平台 修复 vue3 项目 nvue 页面事件无法冒泡的Bug
  + App平台 修复 vue3 项目 nvue 页面 input，textarea 组件的 v-model 不生效的Bug [详情](https://ask.dcloud.net.cn/question/143547)
  + App平台 修复 3.4.6 版本引发的 ArrayBuffer 类型判断错误的Bug [详情](https://ask.dcloud.net.cn/question/143534)
  + App-Android平台 修复 3.4.6版本 引出的 nvue 页面在部分设备可能出现渲染闪烁的Bug [详情](https://ask.dcloud.net.cn/question/143657)
  + H5平台 修复 vue3 项目 html 原生标签（如div）renderjs/wxs 事件监听无法获取 ownerInstance 的Bug [详情](https://github.com/dcloudio/uni-app/issues/3436)
  + H5平台 修复 vue3 项目运行到浏览器，本地服务端口校验可能报错的Bug [详情](https://ask.dcloud.net.cn/question/143504)
  + H5平台 修复 vue3 项目 map 组件 polyline、circles 颜色设置不生效的Bug [详情](https://github.com/dcloudio/uni-app/issues/3433)
  + 小程序平台 修复 vue3 项目当 style 样式值为数字，部分情况下丢失的Bug [详情](https://github.com/dcloudio/uni-app/issues/3456)
  + 微信小程序平台 修复 vue3 项目当 input 事件函数返回 Promise 时，输入框显示错误的Bug [详情](https://github.com/dcloudio/uni-app/issues/3462)
* 【App插件(含5+App和uni-app的App端)】
  + Android平台 更新 高德地图SDK为 9.2.0 版， 解决在部分设备使用地图引起应用崩溃的Bug [详情](https://ask.dcloud.net.cn/question/143573)
  + iOS平台 修复 3.4.6版本 引出的 获取底部安全区域高度不正确的Bug [详情](https://ask.dcloud.net.cn/question/143633)
  + iOS平台 修复 3.4.6版本 引出的 未使用Push模块上传 AppStore 报`ITMS-90078: Missing Push Notification Entitlement`警告的Bug

## 3.4.6.20220420
* 【重要】调整 HBuilderX语言服务 由Java切换为Node，减少内存占用、增强语法提示 [详情](https://hx.dcloud.net.cn/Tutorial/update/lang_service)
* 调整 取消单独的App开发版安装包，统一为一个标准安装包。标准版也可以安装app相关插件。
* 新增 代码悬浮提示 支持着色
* 新增 新建uni-app项目时直接选择Vue2或3的版本（后续可在manifest里调整）
* 新增 文档保存时自动格式化，可通过【设置】-【编辑器配置】-【保存时自动格式化】开启
* 调整 App真机运行 不再长期监听手机，运行时检测，减少资源消耗
* 调整 安装HBuilderX核心插件时，由下载最新版插件调整为和当前HBuilderX版本匹配的插件
* 新增 HBuilderX CLI uni-app 制作应用wgt包 [详情](https://hx.dcloud.net.cn/cli/publish-app-wgt)
* 新增 HBuilderX CLI uni-app 生成本地打包App资源 [详情](https://hx.dcloud.net.cn/cli/publish-app-appResource)
* 修复 MacOSX 某些情况下，HBuilderX启动后，立即按下`command+w`关闭标签卡，编辑器闪退的Bug
* 修复 文档格式化后，撤销时光标位置不对的Bug
* 修复 某些情况，Git更新文件后，编辑器内文件不会自动刷新的Bug
* 修复 查找索引符号 搜索后，HBuilderX闪退的Bug
* 修复 某些情况，文档编辑后出现着色错乱的Bug
* 优化 markdown一键分享 网页内容适配移动端
* 优化 markdown一键分享 生成的html文件 调整代码区代码着色
* 优化 uni-app 发行 制作应用wgt包窗口样式
* 优化 uni-app 运行菜单和发行小程序的界面样式
* 修复 uni-app 新建页面，输入已存在的页面名称，不勾选创建同名目录，旧文件被覆盖的Bug
* 修复 uni-app manifest.json中`app-plus`-`compilerVersion`未配置时发行和运行会弹出设置微信开发者工具对话框的Bug
* 修复 uni-app manifest.json生成通用链接时，协作者选择服务空间时获取不到自定义域名的Bug
* 优化 uniCloud 新建公共模块界面 支持选择模板
* 【uni-app插件】
  + 新增 vue2 项目支持发布到 京东小程序
  + 优化 vue3 项目支持 vitest 测试框架 [详情](https://github.com/dcloudio/uni-app/issues/3398)
  + 优化 vue3 项目全平台支持使用 props 接收页面参数 [详情](https://uniapp.dcloud.net.cn/tutorial/migration-to-vue3.html#url-search-params)
  + 优化 vue3 项目支持导出 onSaveExitState 生命周期 [详情](https://github.com/dcloudio/uni-app/issues/3427)
  + 修复 vue3 项目兼容 vite-plugin-eslint [详情](https://github.com/dcloudio/uni-app/issues/3247)
  + 修复 vue3 项目 App.vue 中的 provide 不生效的Bug [详情](https://github.com/dcloudio/uni-app/issues/3404)
  + 修复 vue3 项目错误信息行号可能不正确的Bug [详情](https://ask.dcloud.net.cn/question/143075)
  + App平台、H5平台 新增 map 组件支持 polygons [详情](https://uniapp.dcloud.io/component/map)
  + App平台、H5平台 新增 input 组件配置 ignoreCompositionEvent 属性 [详情](https://uniapp.dcloud.io/component/input?id=input)
  + App平台、H5平台 优化 取消全局 canvas 高清处理，支持配置单个 canvas 组件 hidpi 属性
  + App平台、H5平台 修复 自定义组件监听 tap.native 不生效的Bug [详情](https://github.com/dcloudio/uni-app/issues/3259)
  + App平台、H5平台 修复 vue3 项目 uni.pageScrollTo 的 duration 为0时不生效的Bug [详情](https://ask.dcloud.net.cn/question/139432)
  + App平台、H5平台 修复 vue3 项目 input 组件 类型为 number 时在低版本 webview 失去焦点时报错的Bug [详情](https://ask.dcloud.net.cn/question/138088)
  + App平台、小程序平台 修复 vue3 项目配置 base 后资源路径可能错误的Bug [详情](https://github.com/dcloudio/uni-app/issues/3362)
  + 【重要】App平台 新增 海外SDK 支持 Google 地图 [详情](https://uniapp.dcloud.net.cn/app-maps)
  + 【重要】App平台 新增 海外SDK 支持 Paypal、Stripe、Google Pay 等支付SDK [详情](https://uniapp.dcloud.io/app-payment-paypal)
  + 【重要】App平台 新增 海外SDK  Google、Facebook 等登录SDK [详情](https://uniapp.dcloud.io/api/plugins/login?id=app-oauth)
  + App平台 新增 vue 页面 video 组件支持 vslide-gesture、vslide-gesture-in-fullscreen 属性 [详情](https://uniapp.dcloud.io/component/video)
  + App平台 新增 pages.json 支持在 style 配置 disableSwipeBack 以禁用 iOS 侧滑返回
  + App平台 新增 vue 页面支持 live-pusher 组件 [详情](https://uniapp.dcloud.net.cn/component/live-pusher)
  + App平台 新增 打开微信客服功能 [详情](https://uniapp.dcloud.io/api/plugins/share.html)
  + App平台 新增 nvue ad-content-page 组件 支持内容播放状态事件start、pause、resume、complete [规范](https://uniapp.dcloud.io/component/ad-content-page.html#%E7%9F%AD%E8%A7%86%E9%A2%91%E5%86%85%E5%AE%B9%E8%81%94%E7%9B%9F%E7%BB%84%E4%BB%B6)
  + App平台 新增 tabbar 支持配置字体图标 iconfont [详情](https://uniapp.dcloud.net.cn/api/ui/tabbar?id=settabbaritem)
  + App平台 新增 InnerAudioContext、BackgroundAudioManager 支持音频倍速播放
  + 【重要】App平台 优化 nvue 页面支持 vue3（需要项目的 Vue 版本切换为3）[详情](https://uniapp.dcloud.net.cn/tutorial/migration-to-vue3.html)
  + App平台 修复 uni.addPhoneContact 重复添加联系人的Bug [详情](https://gitee.com/dcloud/uni-app/issues/I4NY6C)
  + App平台 修复 uni.getBackgroundAudioManager 的 onPrev onNext 事件无效Bug [详情](https://ask.dcloud.net.cn/question/107325)
  + App平台 修复 uni.request、uni.onSocketMessage 等接口返回的 ArrayBuffer 类型不可用 instanceof 做类型判断的Bug
  + App平台 修复 vue2 nvue 页面文本首尾回车符占用高度的Bug [详情](https://ask.dcloud.net.cn/question/95429)
  + App平台 修复 vue3 使用 html 原生标签（如 div）时，事件监听报错的Bug [详情](https://github.com/dcloudio/uni-app/issues/3240)
  + App平台 修复 vue3 navigator 组件和 rich-text 组件嵌套使用时 scopeId 值不一致导致的样式Bug [详情](https://ask.dcloud.net.cn/question/140644)
  + App平台 修复 vue3 wxs/renderjs 监听事件运行报错的Bug [详情](https://github.com/dcloudio/uni-app/issues/3324)
  + App平台 修复 vue3 内联样式引用静态资源可能错误的Bug [详情](https://ask.dcloud.net.cn/question/141278)
  + App平台 修复 vue3 picker-view 组件 调整列数据时渲染错误的Bug [详情](https://ask.dcloud.net.cn/question/140609)
  + App平台 修复 vue3 uni.getSavedFileList、uni.getSavedFileInfo、uni.removeSavedFile、uni.getFileInfo 无效的Bug  [详情](https://ask.dcloud.net.cn/question/142428)
  + App平台 修复 vue3 App.vue 中的 css 可能编译报错的Bug [详情](https://github.com/dcloudio/uni-app/issues/3403)
  + App平台 修复 vue3 nvue map 组件 部分属性无效的Bug [详情](https://ask.dcloud.net.cn/question/142159)
  + App平台 修复 vue3 使用 vue-i18n 运行报错的Bug [详情](https://ask.dcloud.net.cn/question/142911)
  + App平台 修复 vue3 renderjs 在低版本手机可能运行报错的Bug [详情](https://github.com/dcloudio/uni-app/issues/3366)
  + App平台 修复 uni.getEnv 在 nvue webview 中返回值不准确的Bug [详情](https://uniapp.dcloud.net.cn/component/web-view.html#getenv)
  + App平台 修复 InnerAudioContext 某些情况下 paused 属性值不正确的Bug [详情](https://ask.dcloud.net.cn/question/141832)
  + App-Android平台 优化 nvue box-shadow 组件 渲染逻辑，解决在部分设备可能出现排版异常及闪烁的问题 [详情](https://uniapp.dcloud.io/tutorial/nvue-css.html#android-box-shadow)
  + App-Android平台 修复 nvue image 组件 mode 属性设置为 widthFix/HeightFix 时可能导致图片无法显示的Bug [详情](https://ask.dcloud.net.cn/question/139541)
  + App-Android平台 修复 nvue list 组件插入列表项可能引起页面闪烁的Bug [详情](https://ask.dcloud.net.cn/question/139424)
  + App-Android平台 修复 nvue web-view 组件 progress 颜色值不支持3位十六进制格式字符串的Bug [详情](https://ask.dcloud.net.cn/question/138670)
  + App-Android平台 修复 nvue web-view 组件 无法正常加载使用非受信任证书网页的Bug [详情](https://ask.dcloud.net.cn/question/134287)
  + App-Android平台 修复 nvue animation 动画切到后台可能无法执行的Bug [详情](https://ask.dcloud.net.cn/question/137868)
  + App-Android平台 修复 nvue map 组件 marker 设置 joinCluster 为 true 时导致 callouttap 事件不响应的Bug [详情](https://ask.dcloud.net.cn/question/136381)
  + App-Android平台 修复 nvue text 组件 font-style 设置 italic 在部分设备可能无效的Bug [详情](https://ask.dcloud.net.cn/question/120801)
  + App-Android平台 修复 nvue 页面切换可能导致 plus.key.addEventListener 监听 keydown 事件不触发回调的Bug [详情](https://ask.dcloud.net.cn/question/140203)
  + App-Android平台 修复 nvue map 组件 使用高德地图时，频繁调用 addMarkers 增加聚合点可能引起崩溃的Bug [详情](https://ask.dcloud.net.cn/question/140461)
  + App-Android平台 修复 nvue map 组件 使用谷歌地图时，调用 moveAlong 移动 marker 可能出现偏移的Bug
  + App-Android平台 修复 nvue swiper 组件 设置 circular 为 true 时首次启动可能先显示最后一项的Bug [详情](https://ask.dcloud.net.cn/question/140931)
  + App-Android平台 修复 nvue swiper 组件 在特定环境下可能出现页面空白的Bug [详情](https://ask.dcloud.net.cn/question/140942)
  + App-Android平台 修复 nvue list 组件 横向滚动不会触发 loadmore 事件的Bug
  + App-Android平台 修复 nvue 页面 flex 布局在部分设备可能出现换行计算不正确的Bug
  + App-Android平台 修复 nvue 页面调用 dom.scrollToElement 滚动到 list 组件 指定元素位置可能无效的Bug [详情](https://ask.dcloud.net.cn/question/143035)
  + App-Android平台 修复 连续调用 uni.chooseImage 在部分手机可能引起应用闪退的Bug
  + App-Android平台 修复 uni.saveImageToPhotosAlbum 在部分手机可能无法正常保存到系统相册的Bug [详情](https://ask.dcloud.net.cn/question/143125)
  + App-Android平台 修复 uni.getScreenBrightness 获取屏幕亮度始终返回 -1 的Bug [详情](https://ask.dcloud.net.cn/question/142726)
  + App-iOS平台 修复 vue3 项目 调试时启动白屏的Bug
  + App-iOS平台 修复 nvue map 组件 marker 的 joinCluster 为 false 时 removeMarkers 方法不生效的Bug [详情](https://ask.dcloud.net.cn/question/140648)
  + App-iOS平台 修复 nvue rich-text 组件 text-overflow 样式不生效的Bug [详情](https://ask.dcloud.net.cn/question/140586)
  + App-iOS平台 修复 nvue 组件 userInteractionEnabled 属性无效的Bug [详情](https://ask.dcloud.net.cn/question/140838)
  + App-iOS平台 修复 nvue refresh 组件 pullingdown 事件触发时机不正确的Bug [详情](https://ask.dcloud.net.cn/question/138962)
  + App-iOS平台 修复 nvue swiper 组件 内嵌 list-waterfall 时，横向滑动的同时列表还可以竖向滚动的Bug [详情](https://ask.dcloud.net.cn/question/134909)
  + App-iOS平台 修复 nvue 页面内存在可滚动子组件时，开启 enablePullDownRefresh 下拉刷新功能无效的Bug
  + App-iOS平台 修复 video 组件 vslide-gesture-in-fullscreen 属性无效的Bug [详情](https://ask.dcloud.net.cn/question/138299)
  + App-iOS平台 修复 nvue image 组件 不支持 gif 图片中设置循环次数参数的Bug [详情](https://ask.dcloud.net.cn/question/140176)
  + App-iOS平台 修复 在页面生命周期 onLoad 方法中调用 lockOrientation 锁定屏幕方向可能引起布局异常的Bug
  + App-iOS平台 修复 video 不支持 enable-play-gesture 属性的Bug [详情](https://ask.dcloud.net.cn/question/141862)
  + App-iOS平台 修复 nvue input 组件 confirm-hold 属性默认值不正确的Bug
  + 【重要】H5平台 新增 ad 组件 [详情](https://uniapp.dcloud.io/component/ad.html)
  + H5平台 优化 vue3 navigator 组件 使用 a 标签渲染以利于SEO
  + H5平台 修复 vue3 html 中引入 static 目录的 js 文件包含 ifdef 编译报错的Bug [详情](https://github.com/dcloudio/uni-app/issues/3201)
  + H5平台 修复 vue3 renderjs 发行后不正常的Bug [详情](https://ask.dcloud.net.cn/question/137832)
  + H5平台 修复 vue3 dataset 不支持对象类型错误的Bug [详情](https://ask.dcloud.net.cn/question/139181)
  + H5平台 修复 vue3 禁用摇树后，uni.showModal 等弹窗缺少样式的Bug [详情](https://ask.dcloud.net.cn/question/139593)
  + H5平台 修复 vue3 热刷新编译报错的Bug [详情](https://ask.dcloud.net.cn/question/135765)
  + H5平台 修复 vue3 text 组件 使用 v-if 时显示错误的Bug [详情](https://github.com/dcloudio/uni-app/issues/3225)
  + H5平台 修复 vue3 wxs/renderjs 热刷新不生效的Bug [详情](https://ask.dcloud.net.cn/question/140800)
  + H5平台 修复 vue3 特定情况下拉刷新后页面跳转的Bug [详情](https://github.com/dcloudio/uni-app/issues/3326)
  + H5平台 修复 vue3 配置 base 发行后资源路径可能错误的Bug [详情](https://github.com/dcloudio/uni-app/issues/3354)
  + H5平台 修复 vue3 同时使用 style 节点和 style scoped 节点时，样式可能错乱的Bug [详情](https://github.com/dcloudio/uni-app/issues/3410)
  + H5平台 修复 vue3 renderjs/wxs 部分事件监听无法获取 ownerInstance 的Bug [详情](https://github.com/dcloudio/uni-app/issues/3436)
  + H5平台 修复 map 组件 marker 不能设置 id 为 0 的Bug
  + H5平台 修复 部分情况下 input 组件 显示数值错误的Bug [详情](https://ask.dcloud.net.cn/question/140366)
  + H5平台 修复 input 组件 启用 password 后在小米手机钉钉内置浏览器无法弹出键盘的Bug [详情](https://ask.dcloud.net.cn/question/142834)
  + 小程序平台 优化 vue3 自定义组件支持 v-bind="" 语法 [详情](https://github.com/dcloudio/uni-app/issues/3330)
  + 小程序平台 优化 vue3 支持动态导入静态资源 [详情](https://github.com/dcloudio/uni-app/issues/3376)
  + 小程序平台 修复 vue3 uni.getSystemInfo 无法获取 deviceId 的Bug [详情](https://ask.dcloud.net.cn/question/139733)
  + 小程序平台 修复 vue3 不支持 v-html 的Bug [详情](https://ask.dcloud.net.cn/question/138290)
  + 小程序平台 修复 vue3 v-if 中使用 wxs 等模块时报错的Bug [详情](https://github.com/dcloudio/uni-app/issues/3199)
  + 小程序平台 修复 vue3 defineEmits 事件名包含 - 分隔符时无法正常监听的Bug [详情](https://github.com/dcloudio/uni-app/issues/3210)
  + 小程序平台 修复 vue3 setup 手动引入组件不生效的Bug [详情](https://github.com/dcloudio/uni-app/issues/3213)
  + 小程序平台 修复 vue3 v-for 嵌套使用时部分情况运行报错的Bug [详情](https://github.com/dcloudio/uni-app/issues/3263)
  + 小程序平台 修复 vue3 wxs 调用 callMethod 不生效的Bug [详情](https://github.com/dcloudio/uni-app/issues/3218)
  + 小程序平台 修复 vue3 全局组件路径解析错误的Bug [详情](https://ask.dcloud.net.cn/question/138662)
  + 小程序平台 修复 vue3 全局 mixin 分享 onShareAppMessage，onShareTimeline 不生效的Bug [详情](https://ask.dcloud.net.cn/question/140351)
  + 小程序平台 修复 vue3 部分情况下视图更新延迟的Bug [详情](https://github.com/dcloudio/uni-app/issues/3311)
  + 小程序平台 修复 vue3 模板中 style 属性包含换行符时编译报错的Bug [详情](https://github.com/dcloudio/uni-app/issues/3320)
  + 小程序平台 修复 vue3 v-model.number 不生效的Bug [详情](https://github.com/dcloudio/uni-app/issues/3381)
  + 小程序平台 修复 vue3 页面复杂时可能编译报错的Bug [详情](https://github.com/dcloudio/uni-app/issues/3397)
  + 小程序平台 修复 vue3 slot 在部分复杂情况运行报错的Bug [详情](https://github.com/dcloudio/uni-app/issues/3346)
  + 小程序平台 修复 vue2 v-if 中同时包含成员表达式和逻辑表达式编译出错的Bug [详情](https://ask.dcloud.net.cn/question/142293)
  + 小程序平台 修复 vue3 pages.json 配置国际化信息显示错误的Bug
  + 小程序平台 修复 vue3 在 Windows 系统上生成的依赖文件可能错乱的Bug [详情](https://github.com/dcloudio/uni-app/issues/3425)
  + 微信小程序平台 优化 uni.showActionSheet 支持 title 参数
  + 微信小程序平台 修复 vue2 v-for 遍历部分表达式时 stop 修饰符无效的Bug [详情](https://ask.dcloud.net.cn/question/138684)
  + 微信小程序平台 修复 vue3 canvas 监听 touch 不生效的Bug [详情](https://github.com/dcloudio/uni-app/issues/3209)
  + 微信小程序平台 修复 vue3 部分情况下事件监听错乱的Bug [详情](https://github.com/dcloudio/uni-app/issues/3228)
  + 微信小程序平台 修复 vue3 使用小程序插件组件无法传递属性的Bug [详情](https://github.com/dcloudio/uni-app/issues/3257)
  + 微信小程序平台 修复 vue3 input 事件 return 一个字符串没有同步到输入框的Bug [详情](https://github.com/dcloudio/uni-app/issues/3371)
  + 微信小程序平台 修复 vue3 发行为混合分包运行报错的Bug [详情](https://github.com/dcloudio/uni-app/issues/3416)
  + 支付宝小程序平台 优化 vue3 默认开启 es6=>es5 [详情](https://ask.dcloud.net.cn/question/140742)
  + 支付宝小程序平台 修复 vue2 小程序组件事件监听失效的Bug [详情](https://github.com/dcloudio/uni-app/issues/2273)
  + 支付宝小程序平台 修复 vue2 小程序插件中组件事件监听失效的Bug [详情](https://github.com/dcloudio/uni-app/issues/2410)
  + 支付宝小程序平台 修复 vue3 分包页面事件响应不正常的Bug [详情](https://ask.dcloud.net.cn/question/140742)
  + 支付宝小程序平台 修复 vue3 默认分享功能失效的Bug [详情](https://github.com/dcloudio/uni-app/issues/3377)
  + 支付宝小程序平台 修复 vue3 部分情况下渲染错误的Bug [详情](https://github.com/dcloudio/uni-app/issues/3408)
  + 百度小程序平台 修复 vue3 项目 onInit 生命周期不触发的Bug [详情](https://github.com/dcloudio/uni-app/issues/3384)
  + 百度小程序平台 修复 vue3 项目 editor 组件 ready 事件监听可能失败的Bug [详情](https://github.com/dcloudio/uni-app/issues/3444)
  + QQ小程序平台 修复 vue3 项目 appid 配置不生效的Bug [详情](https://github.com/dcloudio/uni-app/issues/3339)
  + QQ小程序平台 修复 vue3 项目部分情况运行报错的Bug [详情](https://github.com/dcloudio/uni-app/issues/3419)
  + 字节跳动小程序平台 修复 vue3 项目部分情况下数据不响应的Bug [详情](https://github.com/dcloudio/uni-app/issues/3340)
  + 字节跳动小程序平台 修复 vue3 项目 options 方式配置 provide/inject 不生效的Bug [详情](https://github.com/dcloudio/uni-app/issues/3360)
  + hello uniCloud 新增云对象使用示例[详情](https://ext.dcloud.net.cn/plugin?id=4082)
* 【uniCloud插件】
  + 【重要】阿里云 调整 单次数据库查询最大超时时间由1秒调整为3秒，重新上传云函数后自动生效
  + 【重要】新增`云对象`。将callfunction函数调用升级为模块化方式，网络不再传递json，前端对象化使用云API [详情](https://uniapp.dcloud.net.cn/uniCloud/cloud-obj)
  + 【调整】发送短信API 从内置库剥离为扩展库 uni-cloud-sms [详情](https://uniapp.dcloud.net.cn/uniCloud/send-sms?id=extension)
  + 【调整】一键登录API 从内置库剥离为扩展库 uni-cloud-verify [详情](https://uniapp.dcloud.net.cn/uniCloud/univerify?id=extension)
  + 【调整】uniCloud本地调试插件 云函数右键本地运行时，此云函数内的callFunction由调用云端云函数改为调用本地云函数
  + 修复 JQL语法 部分情况下过度限制了权限的Bug [详情](https://ask.dcloud.net.cn/question/142457)
  + 新增 jql语法 允许在 getTemp 联表查询的虚拟联表内使用 groupBy distinct [详情](https://uniapp.dcloud.net.cn/uniCloud/jql?  id=lookup-with-temp)
  + 优化 HBuilderX新建云函数的界面支持选择模板和依赖
  + 修复 阿里云 云函数删除文件接口返回数据格式不正确的Bug
  + 修复 uni-cloud-jql扩展库 权限校验失败等场景未抛出错误的Bug
* 【App插件(含5+App和uni-app的App端)】
  + 【重要】uni-AD 新增 百度百青藤广告联盟 包括开屏、信息流、插屏、激励视频广告 [详情](https://ask.dcloud.net.cn/article/36769)
  + 【重要】uni-AD 新增 支持华为广告联盟 包括开屏、信息流、插屏、激励视频广告（仅Android平台） [详情](https://ask.dcloud.net.cn/article/36769)
  + 【重要】uni-AD 修复 Android平台 穿山甲广告联盟在部分设备可能提示`应用的uni-AD业务状态异常`的Bug
  + 新增 支持Google地图 [详情](https://uniapp.dcloud.io/app-maps?id=google%e5%9c%b0%e5%9b%be)
  + 新增 音频播放 AudioPlayer 支持 playbackRate 设置倍速播放 [文档](https://www.html5plus.org/doc/zh_cn/audio.html#plus.audio.AudioPlayer.playbackRate)
  + Android平台 新增 Google支付支持 isReadyToPay 方法 [文档](https://www.html5plus.org/doc/zh_cn/payment.html#plus.payment.PaymentChannel.isReadyToPay)
  + Android平台 更新 UniPush 使用的个推SDK版本为3.2.7.0，个推核心组件SDK版本为3.1.7.0，优化云端打包按需包含厂商通道SDK
  + Android平台 更新 高德定位SDK为 6.0.1 版，高德地图SDK为 9.0.1 版；UniPush 使用的个推SDK为 3.2.9.0 版，小米厂商推送库SDK为 3.1.1 版；Google地图SDK为 18.0.2 版
  + Android平台 优化 应用启动首页可能出现上下抖动的Bug [详情](https://ask.dcloud.net.cn/question/138243)
  + Android平台 优化 二维码扫码检测到 QR 码时自动放大，提升扫码识别率 [详情](https://ask.dcloud.net.cn/question/142209)
  + Android平台 修复 uni-AD 腾讯优量汇插屏广告在 onLoad 回调中执行 show 可能引起广告无法正常显示的Bug
  + Android平台 修复 使用 X5 内核调用 plus.key.addEventListener 监听 keyup 事件不触发回调的Bug
  + Android平台 修复 Android8及以上设备 plus.navigator.createShortcut 无法创建桌面快捷图标的Bug [详情](https://ask.dcloud.net.cn/question/125119)
  + Android平台 修复 视频播放控件 video 边缘可能出现黑线的Bug [详情](https://ask.dcloud.net.cn/question/138320)
  + Android平台 修复 在部分设备调用 plus.runtime.restart 可能引起应用闪退的Bug [详情](https://ask.dcloud.net.cn/question/138965)
  + Android平台 修复 系统语言设置为土耳其语时，tabbar 切换选项可能导致不显示的Bug [详情](https://ask.dcloud.net.cn/question/139313)
  + Android平台 修复 本地相册选择视频设置 compressed 为 false 时依然会压缩的Bug [详情](https://ask.dcloud.net.cn/question/140417)
  + Android平台 修复 在部分设备识别国际化语言不正确的Bug [详情](https://ask.dcloud.net.cn/question/141688)
  + iOS平台 新增 uni原生插件 支持 applicationMain 获取 main 函数启动参数 argc、argv [文档](https://nativesupport.dcloud.net.cn/NativePlugin/course/ios?id=hook%e7%b3%bb%e7%bb%9f%e4%ba%8b%e4%bb%b6)
  + iOS平台 修复 Webview窗口标题栏 titleNView无法动态更新网络页面标题的Bug [详情](https://ask.dcloud.net.cn/question/138958)
  + iOS平台 修复 compressVideo 视频压缩可能出现尺寸错乱的Bug [详情](https://ask.dcloud.net.cn/question/138303)
  + iOS平台 修复 微博分享 type 为 web 时无法正常分享的Bug [详情](https://ask.dcloud.net.cn/question/138830)
  + iOS平台 修复 播放背景音频时系统锁屏界面音乐播放器的进度条可能显示不正确的Bug [详情](https://ask.dcloud.net.cn/question/140101)
  + iOS平台 修复 音频播放 AudioPlayer 获取暂停状态不准确的Bug [详情](https://ask.dcloud.net.cn/question/141832)
  + iOS平台 修复 视频播放 video 播放视频音量与系统音量不一致的Bug
  + iOS平台 修复 视频播放 video 在刘海屏设备全屏播放时进度条可能无法拖动的Bug [详情](https://ask.dcloud.net.cn/question/141862)
  + iOS平台 修复 视频播放 video 设置 show-fullscreen-btn 属性为 false 时可能显示不正确的Bug
  + iOS平台 修复 在 iOS15.4 及以上设备系统时间设置为12小时制 pickDate 返回值异常的Bug [详情](https://ask.dcloud.net.cn/question/141906)
  + iOS平台 修复 安心打包使用 swift 开发的uni原生插件时上传 AppStore 报`ITMS-90426: Invalid Swift Support`错误的Bug [详情](https://ask.dcloud.net.cn/question/142611)
* 【Uni小程序SDK】
  + Android平台 新增 支持自定义实现获取匿名设备标识符OAID
  + Android平台 优化 混淆配置规则，解决 zip4j 可能与其他的库冲突的Bug
  + Android平台 修复 3.3.5 引出的 微信支付回调可能会引起崩溃的Bug
  + Android平台 修复 多个小程序分别配置使用 vue2、vue3， 同时打开可能引起白屏的Bug [详情](https://ask.dcloud.net.cn/question/138576)
  + Android平台 修复 关闭小程序后台运行模式，重复操作打开/关闭小程序可能导致小程序无法正常运行的Bug
  + Android平台 修复 小程序切换到后台，直达页面启动时出现闪屏的Bug
  + Android平台 修复 微信登录连续多次调用可能会导致失败的Bug
  + Android平台 修复 转场动画在 Android12 设备可能失效的Bug
  + Android平台 修复 调用 startActivityForUniMPTask 在 Android8 以下设备可能会引起应用崩溃的Bug
  + iOS平台 修复 关闭小程序后快速启动小程序并直达页面，重复操作偶现崩溃的Bug
  + iOS平台 修复 小程序SDK中设置 user-agent 影响宿主原生页面中 Webview 的Bug


## 3.3.13.20220314
* 修复 3.3.9引出的 App 安心打包 manifest.json 配置Google统计 安心打包没有提交相关文件的bug
* 修复 MacOSX iOS安心打包 操作系统钥匙串访问 登录项没有显示的Bug
* 【uni-app插件】
  + 修复 vue3 项目兼容 vite@2.8.x [详情](https://ask.dcloud.net.cn/question/139311)
  + 修复 vue3 项目兼容 vite-plugin-eslint [详情](https://github.com/dcloudio/uni-app/issues/3247)
  + App平台、H5平台 修复 vue3 项目两个开启了下拉刷新的页面跳转后返回，下拉刷新不触发 onPullDownRefresh 生命周期的Bug [详情](https://github.com/dcloudio/uni-app/issues/3187)
  + App平台、H5平台 修复 vue3 项目 uni.pageScrollTo 的 duration 为0时不生效的Bug [详情](https://ask.dcloud.net.cn/question/139432)
  + App平台 修复 vue3 项目 nvue 页面使用 map 组件时部分方法不生效的Bug [详情](https://ask.dcloud.net.cn/question/138515)
  + App平台 修复 vue3 项目使用 html 原生标签（如div）时，事件监听报错的Bug [详情](https://github.com/dcloudio/uni-app/issues/3240)
  + App平台 修复 vue3 项目 navigator 组件和 rich-text 组件嵌套使用时 scopeId 值不一致导致的样式Bug [详情](https://ask.dcloud.net.cn/question/140644)
  + App平台 修复 vue3 项目 wxs/renderjs 监听事件运行报错的Bug [详情](https://github.com/dcloudio/uni-app/issues/3324)
  + App-Android平台 修复 vue3 项目 安卓低版本时使用 type=number 的 input 组件输入报错的Bug [详情](https://ask.dcloud.net.cn/question/138088)
  + App-iOS平台 修复 vue3 项目 canvas 组件绘制本地图像后无法导出到本地到Bug
  + App-iOS平台 修复 vue3 项目 调试时启动白屏的Bug
  + H5平台 优化 uni.chooseLocation 支持传入坐标
  + H5平台 优化 vue3 项目 navigator 组件使用 a 标签渲染以利于SEO
  + H5平台 修复 vue2 项目开启摇树后 ad 组件失效的Bug
  + H5平台 修复 vue3 项目 image 组件 mode=heightFix 图像大小显示错误的Bug
  + H5平台 修复 vue3 项目 button 组件发行后 loading 不显示的Bug
  + H5平台 修复 vue3 项目 html 中引入 static 目录的 js 文件包含 ifdef 编译报错的Bug [详情](https://github.com/dcloudio/uni-app/issues/3201)
  + H5平台 修复 vue3 项目 renderjs 发行后不正常的Bug [详情](https://ask.dcloud.net.cn/question/137832)
  + H5平台 修复 vue3 项目 dataset 不支持对象类型错误的Bug [详情](https://ask.dcloud.net.cn/question/139181)
  + H5平台 修复 vue3 项目 禁用摇树后，uni.showModal 等弹窗缺少样式的Bug [详情](https://ask.dcloud.net.cn/question/139593)
  + H5平台 修复 vue3 项目 热刷新编译报错的Bug [详情](https://ask.dcloud.net.cn/question/135765)
  + H5平台 修复 vue3 项目 text 组件使用 v-if 时显示错误的Bug [详情](https://github.com/dcloudio/uni-app/issues/3225)
  + H5平台 修复 vue3 项目 wxs/renderjs 热刷新不生效的Bug [详情](https://ask.dcloud.net.cn/question/140800)
  + H5平台 修复 vue3 项目特定情况下拉刷新后页面跳转的Bug [详情](https://github.com/dcloudio/uni-app/issues/3326)
  + 小程序平台 修复 vue3 项目 uni.getSystemInfo 无法获取 deviceId 的Bug [详情](https://ask.dcloud.net.cn/question/139733)
  + 小程序平台 修复 vue3 项目 不支持 v-html 的Bug [详情](https://ask.dcloud.net.cn/question/138290)
  + 小程序平台 修复 vue3 项目 v-if 中使用 wxs 等模块时报错的Bug [详情](https://github.com/dcloudio/uni-app/issues/3199)
  + 小程序平台 修复 vue3 项目 defineEmits 事件名包含 - 分隔符时无法正常监听的Bug [详情](https://github.com/dcloudio/uni-app/issues/3210)
  + 小程序平台 修复 vue3 项目 setup 手动引入组件不生效的Bug [详情](https://github.com/dcloudio/uni-app/issues/3213)
  + 小程序平台 修复 vue3 项目 v-for 嵌套使用时部分情况运行报错的Bug [详情](https://github.com/dcloudio/uni-app/issues/3263)
  + 小程序平台 修复 vue3 项目 wxs 调用 callMethod 不生效的Bug [详情](https://github.com/dcloudio/uni-app/issues/3218)
  + 小程序平台 修复 vue3 项目 全局组件路径解析错误的Bug [详情](https://ask.dcloud.net.cn/question/138662)
  + 小程序平台 修复 vue3 项目 全局 mixin 分享 onShareAppMessage，onShareTimeline 不生效的Bug [详情](https://ask.dcloud.net.cn/question/140351)
  + 小程序平台 修复 vue3 项目部分情况下视图更新延迟的Bug [详情](https://github.com/dcloudio/uni-app/issues/3311)
  + 小程序平台 修复 vue3 项目模板中 style 属性包含换行符时编译报错的Bug [详情](https://github.com/dcloudio/uni-app/issues/3320)
  + 微信小程序平台 修复 vue3 项目 canvas 监听 touch 不生效的Bug [详情](https://github.com/dcloudio/uni-app/issues/3209)
  + 微信小程序平台 修复 vue3 项目部分情况下事件监听错乱的Bug [详情](https://github.com/dcloudio/uni-app/issues/3228)
  + 微信小程序平台 修复 vue3 项目使用小程序插件组件无法传递属性的Bug [详情](https://github.com/dcloudio/uni-app/issues/3257)
  + 支付宝小程序平台 优化 vue3 项目默认开启 es6=>es5 [详情](https://ask.dcloud.net.cn/question/140742)
* 【App插件(含5+App和uni-app的App端)】
  + 更新 uni-AD 腾讯优量汇SDK Android为 4.450.1320 版，iOS为 4.13.50 版；今日头条穿山甲SDK Android为 4.3.0.1 版， iOS为 4.3.0.2 版；快手广告SDK Android为 3.3.21 版，iOS为 3.3.21 版
  + Android平台 更新 UniPush 使用的个推SDK版本为3.2.7.0，个推核心组件SDK版本为3.1.7.0，优化云端打包按需包含厂商通道SDK
  + Android平台 修复 一键登录 授权页面服务协议自定义复选框状态图片设置不正确的Bug [详情](https://ask.dcloud.net.cn/question/139830)
  + iOS平台 修复 geitImageInfo 可能不触发回调的Bug [详情](https://ask.dcloud.net.cn/question/139361)

## 3.3.11.20220210
* 修复 HBuilderX CLI发行微信小程序，某些情况下，HBuilderX出现出现闪退的Bug [详情](https://ask.dcloud.net.cn/question/139189)
* 修复 3.3.10引出的 uni-app 运行到浏览器 某些情况下，HBuilderX出现闪退的Bug [详情](https://ask.dcloud.net.cn/question/138828)
* 修复 3.3.9引出的 uni-app 运行 自定义条件编译没有生效的Bug [详情](https://ask.dcloud.net.cn/question/139125)
* 【uni-app插件】
  + H5平台 修复 3.3.9 引出的 uni.previewImage 预览图像无法拖动的Bug [详情](https://ask.dcloud.net.cn/question/138972)
  + App-Android平台 修复 3.3.10版本引出的 picker 组件样式错误的Bug [详情](https://ask.dcloud.net.cn/question/138748)
  + App-iOS平台 修复 3.3.9 版本引出的 nvue swiper-list 组件中的 list 组件设置 show-scrollbar 为 false 时吸顶效果异常的Bug [详情](https://ask.dcloud.net.cn/question/138944)
* 【App插件(含5+App和uni-app的App端)】
  + Android平台 修复 3.3.9 版本引出的 一键登录 同时自定义 logo 与 closeIcon 可能导致显示异常的Bug [详情](https://ask.dcloud.net.cn/question/137642)
  + iOS平台 修复 Downloader 下载图片文件可能失败的Bug [详情](https://ask.dcloud.net.cn/question/116101)

## 3.3.10.20220124
* 修复 3.3.9引出的 uni-app 自定义发行 运行错误的Bug
* 修复 uniCloud 当项目比较大时 控制台切换卡顿的Bug
* 【uni-app插件】
  + 支付宝小程序平台 修复 触发自定义事件报错的Bug [详情](https://ask.dcloud.net.cn/question/138706)
* 【uniCloud】
  + 修复 3.3.9版本引发的 multiSend 报错的Bug [详情](https://ask.dcloud.net.cn/question/138783)
* 【uni小程序SDK】
  + iOS平台 修复 动态切换横竖屏导致页面布局异常的Bug

## 3.3.9.20220121
* 新增 HBuilderX CLI 支持发行uni-app到微信小程序 [详情](https://hx.dcloud.net.cn/cli/publish-mp-weixin)
* 新增 HBuilderX CLI 支持发行uni-app到H5 [详情](https://hx.dcloud.net.cn/cli/publish-h5)
* 修复 MacOSX 某些情况下，项目管理器项目无法展开的Bug
* 调整 内置浏览器 地理位置设置 经纬度支持设置6位小数
* 修复 App 真机运行 部分Windows电脑运行App到iOS15以上手机失败的Bug
* 修复 App 真机运行 部分Android 11系统，同步文件失败的Bug
* 修复 uni-app 安心打包 没有生成iOS符号表文件的Bug
* 调整 uni-app 发行到微信小程序，支持自动上传代码到微信平台，无需再通过微信开发者工具上传发行 [详情](https://hx.dcloud.net.cn/Tutorial/App/uni-app-publish-mp-weixin)
* 【uni-app插件】
  + 优化 vue3 项目 vite.config.js 支持自定义 isCustomElement，isNativeTag  [详情](https://github.com/dcloudio/uni-app/issues/3133)
  + 优化 vue3 项目 vite.config.js 支持自定义 scss additionalData [详情](https://github.com/dcloudio/uni-app/issues/3135)
  + 修复 vue3 项目 static 目录不支持按平台编译的Bug [详情](https://github.com/dcloudio/uni-app/issues/3132)
  + App平台、H5平台 新增 textarea、input 组件支持 confirm-hold 属性 [详情](https://uniapp.dcloud.io/component/input)
  + App平台、H5平台 优化 image 组件 draggable 属性默认值改为 false
  + App平台 优化 uni.request 请求参数支持 ArrayBuffer 类型
  + App平台 修复 nvue 页面使用 scss/sass 时条件编译不生效的Bug
  + App平台 修复 vue3 项目 发行后 renderjs 调用 ownerInstance.callMethod 失效的Bug [详情](https://ask.dcloud.net.cn/question/137832)
  + App平台 修复 vue3 项目 picker 组件默认语言固定为英文的Bug [详情](https://ask.dcloud.net.cn/question/136954)
  + App-Android平台 修复 picker 组件选择选项后同页面 input 组件可能无法正常获取焦点的Bug [详情](https://ask.dcloud.net.cn/question/138237)
  + App-Android平台 修复 nvue input 组件不支持自定义字体的Bug [详情](https://ask.dcloud.net.cn/question/135514)
  + App-Android平台 修复 nvue list 组件不支持 click 事件的Bug [详情](https://ask.dcloud.net.cn/question/136754)
  + App-iOS平台 修复 nvue swiper-list 组件滚动条无法隐藏的Bug [详情](https://ask.dcloud.net.cn/question/136261)
  + App-iOS平台 修复 3.3.3 版本引出的支持多个音频同时播放引发iOS影响静音开关的问题，默认不支持同时播放多个文件，如果需要可手动设置 sessionCategory
  + H5平台 修复 vue3 项目 manifest.json 中配置 devServer 不生效的Bug [详情](https://ask.dcloud.net.cn/question/133429)
  + H5平台 修复 右键单击事件 contextmenu 丢失 clientX、clientY 属性的Bug [详情](https://ask.dcloud.net.cn/question/136530)
  + 小程序平台 修复 启用压缩后差量更新过慢的Bug
  + 小程序平台 修复 模板中包含转义引号时在小程序开发工具中编译报错或显示异常的Bug
  + 小程序平台 修复 vue3 项目 组件使用 id 属性不生效的Bug [详情](https://github.com/dcloudio/uni-app/issues/3179)
  + 小程序平台 修复 vue3 项目 部分情况 defineExpose 不生效的Bug [详情](https://github.com/dcloudio/uni-app/issues/3180)
  + 小程序平台 修复 vue3 项目 兼容 unocss 插件 [详情](https://ask.dcloud.net.cn/question/138021)
  + 小程序平台 修复 3.3.4 版本引出的发行模式下包体积变大的Bug
  + 微信小程序平台 修复 vue3 项目 v-for 中绑定事件可能错乱的Bug [详情](https://ask.dcloud.net.cn/question/137217)
  + 微信小程序平台 修复 多页面，组件内使用插槽数据时，差量编译丢失插槽信息的Bug [详情](https://ask.dcloud.net.cn/question/136258)
  + 微信小程序平台 修复 vue3 项目 当 v-for 循环变量名为 index 时渲染不正确的Bug [详情](https://github.com/dcloudio/uni-app/issues/3193)
  + 微信小程序平台 修复 vue3 项目无法自动开启开发工具窗口的Bug
  + 百度小程序平台 修复 vue3 项目 对象类型数据差量更新时报错的Bug [详情](https://ask.dcloud.net.cn/question/137222)  
  + 支付宝小程序平台 修复 vue3 项目 mixin 中包含 props 运行报错的Bug [详情](https://github.com/dcloudio/uni-app/issues/3191)
* 【uniCloud】
  + 修复 JQL语法 getTemp 返回结果传递给组件属性时在微信小程序端报错的Bug [详情](https://ask.dcloud.net.cn/question/138308)
  + 新增 JQL语法 使用 getTemp 进行联表查询时，支持在临时表内使用 as 或其他运算操作 [详情](https://uniapp.dcloud.net.cn/uniCloud/jql?id=lookup-with-temp)
  + 新增 JQL语法 使用 getTemp 进行联表查询时，支持在虚拟联表内使用 foreignKey 方法指定要使用的 foreignKey 的归属的字段 [详情](https://uniapp.dcloud.net.cn/uniCloud/jql?id=lookup-with-temp)
  + 新增 web控制台 阿里云 前端网页托管支持为指定路径开启 uni-app history 路由跳转模式支持 [详情](https://uniapp.dcloud.net.cn/uniCloud/hosting?id=routing)
  + 新增 uni-id 支持自定义国际化语言支持 [详情](https://uniapp.dcloud.net.cn/uniCloud/uni-id?id=custom-i8n)
  + 修复 uni-id 一键登录时未校验重复手机号是否已验证的Bug
  + 修复 uni-id Apple 登录时用户邮箱为空时报错的Bug
  + 修复 uni-id 用户名密码登录时多个应用出现重复用户名登录报错的Bug
  + 修复 本地调试插件 打开非云函数根目录文件时使用运行菜单本地运行云函数报错的Bug
  + 修复 本地调试插件 部分情况下客户端连接启用了 JQL 扩展的本地云函数报错的Bug
* 【App插件(含5+App和uni-app的App端)】
  + 【重要】新增 Payment 模块支持 Paypal支付、Stripe支付、Google支付 [文档](https://uniapp.dcloud.io/app-payment)
  + 【重要】新增 Statistic 模块支持 Google统计 [文档](https://uniapp.dcloud.io/app-statistic-google)
  + 新增 一键登录 支持 closeIcon 属性设置自定义关闭按钮图片 [文档](https://uniapp.dcloud.io/univerify)
  + 更新 uni-AD 快手广告SDK Android为 3.3.20 版，iOS为 3.3.20 版；快手内容联盟SDK Android为 3.3.27 版， iOS为 3.3.27 版
  + Android平台 修复 调用 plus.runtime.restart 重启应用后 user-agent 会清空的Bug [详情](https://ask.dcloud.net.cn/question/136105)
  + Android平台 修复 plus.downloader.enumerate 可能获取不到下载任务的Bug [详情](https://ask.dcloud.net.cn/question/137548)
  + Android平台 修复 一键登录 在部分 Android 8.0、8.1 设备无法弹出登录框的Bug
  + Android平台 修复 一键登录 设置登录界面 logo 图片可能不生效的Bug
  + Android平台 修复 视频播放控件 VideoPlayer 设置 object-fit 属性可能不生效的Bug [详情](https://ask.dcloud.net.cn/question/137150)
  + Android平台 修复 使用系统定位模块执行 watchPosition 后再执行 getCurrentPosition 可能失败的Bug [详情](https://ask.dcloud.net.cn/question/137586)
  + Android平台 修复 Push模块 createMessage 在安卓系统8以下系统可能无法创建通知栏消息的Bug [详情](https://ask.dcloud.net.cn/question/137923)
  + Android平台 修复 图片选择界面设置 crop 属性在部分手机和模拟器上可能引起黑屏崩溃的Bug [详情](https://ask.dcloud.net.cn/question/136969)
  + Android平台 修复 图片选择界面未勾选`原图`时图片方向可能发生变化的Bug [详情](https://ask.dcloud.net.cn/question/137358)
  + iOS平台 修复 uni-AD 使用自定义 storyboard 时开屏广告底部应用图标、名称可能不显示的Bug
* 【uni小程序SDK】
  + 新增 小程序 wgt 资源文件支持加密 [文档](https://nativesupport.dcloud.net.cn/UniMPDocs/API/ios?id=installWgt)
  + Android平台 修复 不设置任何参数初始化小程序SDK可能会引起崩溃的Bug [详情](https://ask.dcloud.net.cn/question/137175)
  + Android平台 修复 启动使用 vue3 的小程序可能出现白屏的Bug
  + iOS平台 修复 小程序未开启后台运行，通过手势关闭小程序后快速打开小程序偶现崩溃的Bug
  + iOS平台 修复 在隐藏小程序的回调方法中再次打开同一小程序无效的Bug
  + iOS平台 修复 同时打开多个小程序 getCurrentPageUrl 获取当前显示的小程序页面路径不正确的Bug

## 3.3.5.20211229
* 【uni-app插件】
  + App平台 修复 nvue 页面使用 scss/sass 时条件编译不生效的Bug
  + App平台 修复 vue3 项目 picker-view 组件报错的Bug [详情](https://github.com/dcloudio/uni-app/issues/3130)
  + App-Android平台  修复 3.3.3 版本引出的 nvue video 组件全屏后 cover-view 在部分情况下排版不正确的Bug [详情](https://ask.dcloud.net.cn/question/137179)
  + 小程序平台 修复 vue3 项目 差量编译时组件模板内容被清空的Bug [详情](https://github.com/dcloudio/uni-app/issues/3122)
  + 小程序平台 修复 vue3 项目 分包静态资源未复制到输出目录的Bug [详情](https://github.com/dcloudio/uni-app/issues/3123)
* 【App插件(含5+App和uni-app的App端)】
  + Android平台 修复 targetSdkVersion 设置为 31 在 Android 12 设备可能无法安装的Bug [详情](https://ask.dcloud.net.cn/question/137233)

## 3.3.4.20211228
* 【uni-app插件】
  + App平台 修复 nvue 页面使用 scss/sass 时条件编译不生效的Bug
  + App平台 修复 vue3 项目 input/textarea 组件使用 v-model 不生效的Bug [详情](https://github.com/dcloudio/uni-app/issues/3107)
  + App-Android平台 修复 nvue input组件 maxlength 属性不生效的Bug [详情](https://ask.dcloud.net.cn/question/137031)
  + App-Android平台 修复 3.3.3 版本引出的 nvue video 组件 cover-view 全屏后排版不正确的Bug [详情](https://ask.dcloud.net.cn/question/136812)
  + H5平台 修复 vue3 项目 在首页执行 reLaunch 时，首页内的组件未销毁的Bug [详情](https://github.com/dcloudio/uni-app/issues/3114)
  + 小程序平台 优化 运行时启用压缩代码后，移除代码注释，减少包体积大小
  + 小程序平台 优化 vue3 项目 支持在页面 setup 中使用 onShareTimeline，onShareAppMessage，onPageScroll [详情](https://github.com/dcloudio/uni-app/issues/3097)
  + 微信小程序平台 修复 vue3 项目 textarea 组件 input 事件在 iOS 平台不触发的Bug [详情](https://github.com/dcloudio/uni-app/issues/3090)
  + 支付宝小程序平台 修复 vue3 项目 button 组件 getPhoneNumber 事件报错的Bug [详情](https://github.com/dcloudio/uni-app/issues/3116)
* 【uniCloud】
  + 修复 云函数JQL扩展库 使用 getTemp 联表查询时报错的Bug [详情](https://ask.dcloud.net.cn/question/137089)
  + 修复 uniCloud本地调试插件 启动调试服务时错误的提示集合未初始化的Bug
  + 修复 multiSend 和 unicloud-db 组件搭配使用报错的Bug
* 【App插件(含5+App和uni-app的App端)】
  + Android平台 修复 二维码扫码在部分设备可能引起崩溃的Bug [详情](https://ask.dcloud.net.cn/question/137114)

## 3.3.3.20211225
* 【重要】调整 新建项目界面，预置大量云端一体完整项目 [详情](https://hx.dcloud.net.cn/Tutorial/project?id=CreateProjectWindows)
* 新增 项目管理器视图toolbar 新增定位和折叠所有的悬浮按钮 [详情](https://hx.dcloud.net.cn/Tutorial/project?id=toolbar)
* 修复 Markdown 代码区块第一行后字体显示倾斜的Bug [详情](https://ask.dcloud.net.cn/question/94477)
* 修复 查找索引符号 鼠标点击搜索区域或者内置资源管理器地址栏时，编辑器出现崩溃的Bug
* 修复 某些情况下，打开内置浏览器，再进行文件搜索引起的文件列表窗口渲染异常的Bug
* 修复 插件市场 云端一体页面模板 导入非uni_modules插件后pages.json path路径尾部多了一个点的Bug
* 修复 MacOSX 当HBuilderX安装路径带有空格时，运行项目到iOS模拟器失败的Bug
* 新增 原生App-云打包 打包窗口 增加Sigmob激励视频广告联盟配置
* 修复 uniCloud 运行云服务空间初始化向导，某些情况下，DB Schema创建确认窗口，没有显示全部创建的Bug
* 修复 uniCloud 上传所有云函数，某些情况下，未上传的云函数数量及名称显示错误的Bug
* 修复 uniCloud 在项目关闭运行时，偶发没有同步结束的Bug
* 优化 uni-app 运行带有预处理CSS语言的项目，运行时自动安装相关插件，无需再跳转到插件市场安装
* 新增 uni-app自动化测试插件 支持在HBuilderX内对uni-app普通项目、CLI项目进行自动化测试 [详情](https://ext.dcloud.net.cn/plugin?id=5708)
* 修复 HBuilderX CLI pack、cloud某些命令，运行异常的Bug
* 优化 在相关界面 增加HBuilderX CLI教程链接
* 【uni-app插件】
  + 【重要】小程序平台 优化 vue3 项目使用 vite 编译，提供更快的编译速度 [详情](https://ask.dcloud.net.cn/article/37834)
  + 【重要】App平台 修复 uni.getLocation 参数 type 配置不生效的Bug [详情](https://ask.dcloud.net.cn/article/39552)
  + 修复 vue3 项目 部分组合式 API 参数缺少类型的Bug [详情](https://github.com/dcloudio/uni-app/issues/3076#issuecomment-994557108)
  + App平台、H5平台 新增 uni.request 支持 PATCH 方法
  + App平台、H5平台 修复 swiper 组件开启衔接滑动点击指示器时切换问题 [详情](https://github.com/dcloudio/uni-app/issues/2985)
  + App平台、H5平台 修复 vue2 项目缺失 uni.previewImage.cancel 国际化的Bug [详情](https://ask.dcloud.net.cn/question/136054)
  + App平台 优化 nvue 页面默认文字大小更改为 16px
  + App平台 优化 innerAudioContext 支持多个音频同时播放
  + App平台 修复 vue3 项目使用 uni.canvasGetImageData 报错的Bug [详情](https://ask.dcloud.net.cn/question/134355)
  + App平台 修复 vue3 项目使用 uni.showLoading 方法在不调用 hideLoading 时会运行两秒左右自动关闭的Bug [详情](https://ask.dcloud.net.cn/question/135551)
  + App平台 修复 vue3 项目 开发期间页面热刷新不生效的Bug
  + App平台 修复 vue3 项目 开发期间页面直达不生效的Bug
  + App平台 修复 vue3 项目 部分样式在低版本手机上不生效的Bug [详情](https://github.com/dcloudio/uni-app/issues/3073)
  + App-Android平台 修复 nvue input 组件 placeholder-class 样式中 font-size 不支持 rpx 单位的Bug [详情](https://ask.dcloud.net.cn/question/134764)
  + App-Android平台 修复 uni.getBackgroundAudioManager 触发 seek、pause后再播放 onTimeUpdate 可能不触发的Bug [详情](https://ask.dcloud.net.cn/question/134439)
  + App-Android平台 修复 nvue waterfall/list 组件横竖屏切换导致滚动偏移位置回到顶部的Bug [详情](https://ask.dcloud.net.cn/question/135845)
  + App-Android平台 修复 nvue input/textarea 组件使用中文输入法切换到英文时无法输入的Bug [详情](https://ask.dcloud.net.cn/question/133523)
  + App-Android平台 修复 nvue map 组件调用 addMarkers 设置 clear 参数不生效的Bug [详情](https://ask.dcloud.net.cn/question/132127)
  + App-Android平台 修复 nvue map 组件 marker 中 callout 首次显示位置可能不正确的Bug [详情](https://ask.dcloud.net.cn/question/135351)
  + App-iOS平台 修复 nvue 页面固定横屏启动时 rpx 计算错误的Bug [详情](https://ask.dcloud.net.cn/question/134971)
  + App-iOS平台 修复 nvue rich-text 组件在页面中动态创建时可能引起崩溃的Bug [详情](https://ask.dcloud.net.cn/question/135136)
  + App-iOS平台 修复 nvue map 组件当聚合簇中只有1个 marker 时，markertap 事件返回的 id 不正确的Bug [详情](https://ask.dcloud.net.cn/question/136245)
  + H5平台 修复 map 组件 @callouttap 失效的Bug [详情](https://ask.dcloud.net.cn/question/134803)
  + H5平台 新增 vue3 版本 page-meta 标签下支持浏览器原生head，方便进行 seo 优化 [详情](https://uniapp.dcloud.net.cn/component/page-meta?id=head)
  + H5平台 修复 vue3 项目 picker 组件无法动态赋值的Bug [详情](https://ask.dcloud.net.cn/question/135418)
  + H5平台 修复 vue3 项目 uni.previewImage 长按按钮显示英文的Bug [详情](https://ask.dcloud.net.cn/question/135557)
  + H5平台 修复 vue3 项目 safe-area-inset-* css 变量失效的Bug [详情](https://ask.dcloud.net.cn/question/134249)
  + H5平台 修复 vue3 项目 运行至内置浏览器时，控制台日志输出没有文件行号的Bug
  + H5平台 修复 vue3 项目 运行模式下热刷新报错的Bug
  + H5平台 修复 vue3 项目 发行模式下 rpx 不生效的Bug [详情](https://ask.dcloud.net.cn/question/136238)
  + H5平台 修复 vue3 项目 vite.config.js host 配置不生效的Bug [详情](https://github.com/dcloudio/uni-app/issues/3083)
  + 小程序平台 修复 百度小程序 login 组件 @getphonenumber 无参数的问题 [详情](https://ask.dcloud.net.cn/question/130022)
* 【uniCloud】
  + 新增 支持云函数内使用 JQL 语法操作数据库的扩展库 [详情](https://uniapp.dcloud.net.cn/uniCloud/jql-cloud)
  + 新增 腾讯云redis
  + 新增 批量短信 发送功能 [详情](https://uniapp.dcloud.net.cn/uniCloud/send-sms)
  + 新增 uniCloud DB Schema 支持国际化 [详情](https://uniapp.dcloud.net.cn/collocation/i18n?id=schema)
  + 修复 腾讯云 geoNear 聚合阶段 maxDistance、minDistance 参数无法正常生效的Bug
  + 修复 app 端 nvue 页面无法连接本地云函数的Bug [详情](https://ask.dcloud.net.cn/question/135703)
  + 修复 app 端使用腾讯云作为服务商时 在高版本 iOS 安装后第一次启动无法连接云函数的Bug [详情](https://ask.dcloud.net.cn/question/136725)
  + 修复 uniCloud本地调试插件 云函数内使用腾讯云自定义登录调用 createTicket 接口报错的Bug
  + 修复 clientDB getTemp 联表时部分情况下 where 方法无法正确筛选数据的Bug
* 【App插件(含5+App和uni-app的App端)】
  + 新增 拍照和本地相册选择 crop 裁剪编辑图片支持 saveToAlbum 属性设置是否保存编辑后的图片到相册 [文档](https://www.html5plus.org/doc/zh_cn/camera.html#plus.camera.CameraCropStyles)
  + 新增 系统定位模块，无需商业授权 [详情](https://uniapp.dcloud.io/app/geolocation)
  + 优化 定位模块默认使用 wgs84 坐标系，优先使用系统定位 
  + 新增 uni-AD 基础开屏广告支持 gif 图
  + 新增 uni-AD 支持设置是否关闭个性化推荐功能 [文档](https://www.html5plus.org/doc/zh_cn/ad.html#plus.ad.setPersonalizedAd)
  + 更新 uni-AD 腾讯优量汇SDK Android为 4.431.1301 版，iOS为 4.13.31 版；今日头条穿山甲SDK iOS为 4.1.0.1 版；快手广告SDK Android为 3.3.19 版，iOS为 3.3.19 版；快手内容联盟SDK Android为 3.3.25 版， iOS为 3.3.25 版；Sigmob广告联盟SDK Android为 3.5.3 版，iOS为 3.5.0 版
  + 修复 微信分享场景参数 scene 默认值不正确的Bug
  + 【重要】Android平台 新增 支持未同意隐私政策模式，解决应用市场上架合规检测违反“App不得因用户不同意提供非必要个人信息，而拒绝用户使用其基本功能服务”问题 [详情](https://uniapp.dcloud.io/app-disagreemode)
  + Android平台 新增 云端打包支持配置 packagingOptions [文档](https://ask.dcloud.net.cn/article/94#packagingOptions)
  + Android平台 更新 高德定位SDK为 5.6.1 版，高德地图SDK为 8.1.0 版；UniPush使用的个推SDK为 3.2.5.0 版，个推核心组件SDK为 3.1.6.0 版
  + Android平台 优化 录音保存为 mp3 格式的音质
  + Android平台 修复 uni-AD 加载激励视频广告可能触发申请访问设备信息、读写手机存储等权限的Bug
  + Android平台 修复 uni-AD 开屏广告部分情况下点击事件可能透传的Bug
  + Android平台 修复 3.2.13 版本引出的 更新UniPush使用的个推SDK导致出现App相同权限安装失败的Bug [详情](https://ask.dcloud.net.cn/question/135963)
  + Android平台 修复 视频播放控件 VideoPlayer 设置 objectFit 可能不生效的Bug [详情](https://ask.dcloud.net.cn/question/134278)
  + Android平台 修复 视频播放控件 VideoPlayer 播放部分 rtsp 格式视频时加载进度条展示异常的Bug [详情](https://ask.dcloud.net.cn/question/135060)
  + Android平台 修复 直播推流 LivePusher 设置宽高为100%时视频流可能变形的Bug [详情](https://ask.dcloud.net.cn/question/135749)
  + Android平台 修复 设置 targetSdkVersion 为 31 时本地相册选择图片压缩失败的Bug [详情](https://ask.dcloud.net.cn/question/134897)
  + Android平台 修复 二维码扫码 pdf417 码时竖向无法识别、识别中文字符为乱码的Bug
  + Android平台 修复 视频播放控件 VideoPlayer 在 Android8 以下设备动态切换 src 可能会导致黑屏的Bug [详情](https://ask.dcloud.net.cn/question/134171)
  + Android平台 修复 爱加密等安全检测平台报StrandHogg漏洞的Bug
  + 【重要】iOS平台 更新 云端打包环境 XCode 为 13.2.1 版、iOS SDK 为 15.2 版，解决提交 AppStore 审核报 ITMS-90901 警告的问题 [详情](https://ask.dcloud.net.cn/question/136405) 
  + iOS平台 修复 uni-AD setSplashAd 关闭开屏广告可能不生效的Bug
  + iOS平台 修复 uni-AD 后台切前台时开屏广告展示间隔时间设置无效及可能重复展示的Bug
  + iOS平台 修复 plus.nativeUI.showWaiting 在暗黑模式下默认文字颜色不正确的Bug
  + iOS平台 修复 二维码扫码 pdf417 码时识别中文字符为乱码的Bug
  + iOS平台 修复 本地相册选择进入编辑界面可能出现点击完成按钮无响应的Bug [详情](https://ask.dcloud.net.cn/question/135653)
  + iOS平台 修复 拍照和本地相册选择 crop 裁剪编辑图片 resize 参数默认值不正确的Bug
  + iOS平台 修复 uni原生插件 validArchitectures 配置不正确可能导致云端打包失败的Bug
* 【uni小程序SDK】
  + Android平台 修复 在部分红米设备可能无法触发关闭小程序回调的Bug
  + Android平台 修复 手动安装wgt模式下不支持 vue3 的Bug
  + Android平台 修复 热启动模式下直达页面参数不生效的Bug

## 3.2.16.20211122
* 修复 代码悬浮提示 某些情况下，HBuilderX出现闪退的Bug
* 修复 App 真机运行 某些情况下，HBuilderX出现闪退的Bug
* 修复 MacOSX manifest.json 配置iOS通用链接 提交打包 某些情况下，打包完成时，HBuilderX出现闪退的Bug

## 3.2.15.20211120
* 新增 uni-app 支持运行和发布到 飞书小程序
* 修复 MacOSX Xcode13 运行uniapp项目到iOS模拟器，iOS模拟器无法自动启动的的Bug
* 修复 Windows 11 真机运行提示wmic错误的Bug
* 优化 代码悬浮提示 超过1M大小的文件不显示悬浮提示框
* 修复 当用户环境变量中配置的max-old-space-size过大时导致node进程启动失败的Bug [详情](https://ask.dcloud.net.cn/question/133144)
* 优化 App manifest.json 打开速度
* 修复 App manifest.json 勾选使用原生隐私政策提示框 再次打开manifest.json后 此选项没有被勾选的Bug
* 新增 App manifest.json App常用其它设置 增加设置项 生成iOS平台符号表(dsym)文件
* 新增 App manifest.json App模块配置 定位 增加设置项 系统定位
* 优化 App manifest.json App模块配置 定位 支持多选
* 删除 uni-app manifest.json App模块配置 删除统计配置项
* 调整 uniCloud admin 改名为 uni-admin [详情](https://uniapp.dcloud.net.cn/uniCloud/admin)
* 【uni-app插件】
  + App平台、H5平台 新增 rich-text 组件支持 itemclick 事件 [详情](https://uniapp.dcloud.io/component/rich-text)
  + App平台、H5平台 新增 uni.setClipboardData 支持配置是否弹出提示 [详情](https://uniapp.dcloud.io/api/system/clipboard?id=setclipboarddata)
  + App平台、H5平台 新增 异步触发 uni.chooseImage 时，会进入失败回调 [详情](https://ask.dcloud.net.cn/question/130768)
  + App平台、H5平台 修复 picker-view 滚动时会触发页面下拉刷新的Bug [详情](https://ask.dcloud.net.cn/question/113718)
  + App平台、H5平台 修复 swiper 组件动态加载内容时，触摸造成显示异常的Bug [详情](https://ask.dcloud.net.cn/question/100684)
  + App平台 新增 NVUE map API poiSearchNearBy 支持 offset，poiKeywordsSearch 支持 offset、cityLimit [详情](https://uniapp.dcloud.net.cn/api/location/map?id=poisearchnearby)
  + App平台 新增 cover 组件支持嵌套 [详情](https://uniapp.dcloud.io/component/cover-view?id=cover-view)
  + App平台 新增 nvue 页面支持 dynamicRpx 配置，用于 rpx 适配屏幕大小动态变化 [详情](https://uniapp.dcloud.io/collocation/pages?id=globalstyle)
  + App平台 修复 在 slot 使用 v-for 无法渲染的Bug [详情](https://ask.dcloud.net.cn/question/130258)
  + App平台 修复 editor 组件 a 标签 href 填写相对地址时渲染错误的Bug  [详情](https://github.com/dcloudio/uni-app/issues/2218)
  + App平台 修复 editor、rich-text 组件 img 本地路径图片渲染错误的Bug [详情](https://ask.dcloud.net.cn/question/117245)
  + App-Android平台 修复 在 Android4.4 设备默认显示为英文的Bug
  + App-Android平台 修复 showTabBarRedDot 设置红点可能不生效的Bug [详情](https://ask.dcloud.net.cn/question/134420)
  + App-Android平台 修复 nvue web-view 组件网络请求与其它网络请求 user-agent 不一致的Bug
  + App-Android平台 修复 nvue list 组件中 cell 过多导致排版错误，可能抛出错误日志或引起崩溃的Bug [详情](https://ask.dcloud.net.cn/question/133072)
  + App-Android平台 修复 nvue map 组件中 Marker 标签 rotate 属性旋转方向不正确的Bug [详情](https://ask.dcloud.net.cn/question/133418)
  + App-Android平台 修复 nvue waterfall 中 cell 组件横竖屏切换后可能出现排版不正常的Bug [详情](https://ask.dcloud.net.cn/question/133738)
  + App-Android平台 修复 subNvue 原生子窗体 style 样式设置 top 属性值后可能出现排版不正确的Bug [详情](https://ask.dcloud.net.cn/question/132913)
  + App-iOS平台 修复 editor 组件设置字体格式时，placeholder 显示异常的Bug [详情](https://ask.dcloud.net.cn/question/106127)
  + App-iOS平台 修复 uni.request 请求与其它网络请求 user-agent 不一致的Bug
  + App-iOS平台 修复 nvue cover-view 组件样式可能存在异常的Bug
  + App-iOS平台 修复 nvue image 组件请求网络图片与其它网络请求 user-agent 不一致的Bug
  + App-iOS平台 修复 nvue video 中 cover-view 组件的点击事件会透传到 video 中的Bug [详情](https://ask.dcloud.net.cn/question/132936)
  + App-iOS平台 修复 nvue map 组件设置 marker-callout-textAlign 属性为 center 不生效的Bug [详情](https://ask.dcloud.net.cn/question/133264)
  + H5平台 优化 map 组件 marker label 支持 borderWidth、borderColor、bgColor 等配置
  + H5平台 修复 使用 uni.setClipboardData 时，会出现文本框的Bug
  + H5平台 修复 map 组件 marker label 坐标设置不生效的Bug [详情](https://ask.dcloud.net.cn/question/102514)
  + H5平台 修复 map 组件 marker callout 失效的Bug [详情](https://ask.dcloud.net.cn/question/133590)
  + H5平台 修复 vue3 项目 picker-view 组件显示不正确的Bug [详情](https://ask.dcloud.net.cn/question/132418)
  + 微信小程序平台、支付宝小程序平台 新增 小程序导出到插件 [详情](https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/using.html#%E5%AF%BC%E5%87%BA%E5%88%B0%E6%8F%92%E4%BB%B6)
* 【App插件(含5+App和uni-app的App端)】
  + 新增 一键登录 服务协议项样式支持 checkBoxSize 属性设置复选框大小 [详情](https://uniapp.dcloud.io/univerify)
  + 新增 closePreviewImage 方法关闭预览图片界面 [规范](https://www.html5plus.org/doc/zh_cn/nativeui.html#plus.nativeUI.closePreviewImage)
  + 更新 uni-AD 腾讯优量汇SDK Android为4.422.1292版；快手广告SDK Android为 3.3.17 版，iOS为 3.3.17 版；快手内容联盟SDK Android为 3.3.23 版；Sigmob广告联盟SDK Android为 3.5.1 版
  + 【重要】Android平台 更新 云端打包默认 targetSdkVersion 为 28 [文档](https://ask.dcloud.net.cn/article/193#targetsdkversion)
  + Android平台 修复 上架某些应用市场审核检测可能检测到收集已安装应用列表行为的Bug
  + Android平台 修复 uploader 上传文件请求中 user-agent 不正确的Bug
  + Android平台 修复 plus.os.language 获取系统语言可能不正确的Bug
  + Android平台 修复 部分设备在静止情况下监听获取到的方向数据出现波动的Bug [详情](https://ask.dcloud.net.cn/question/132154)
  + iOS平台 新增 云端打包支持生成符号表 dsym 文件 [详情](https://uniapp.dcloud.io/app/ios/dsym)
  + 【重要】iOS平台 修复 应用启动时间统计在网络服务异常时可能引起崩溃的Bug [详情](https://ask.dcloud.net.cn/article/39448)
  + iOS平台 更新 友盟统计SDK UMCommon 为 7.3.5 版，UMAPM 为 1.5.2 版
  + iOS平台 修复 基础开屏广告可能重复显示的Bug
  + iOS平台 修复 图片/视频选择界面中选择iCloud视频可能报错的Bug [详情](https://ask.dcloud.net.cn/question/133635)
  + iOS平台 修复 plus.navigator.getSignature 获取签名标识在应用通过 AppStore 或 Testflight 安装时 返回空值的Bug [详情](https://ask.dcloud.net.cn/question/133881)

## 3.2.12.20211029
* 新增 HBuilderX插件开发断点调试 [详情](https://hx.dcloud.net.cn/ExtensionTutorial/HowToDebug)
* 新增 uniCloud云函数断点调试 [详情](https://uniapp.dcloud.net.cn/uniCloud/quickstart?id=debug)
* 新增 代码提示 鼠标悬停 显示代码帮助悬浮窗口 [详情](https://hx.dcloud.net.cn/Tutorial/Language/Overview?id=hover-code-assist)
* 优化 插件API hx.window.createOutputChannel 控制台内容带有URL时，支持点击跳转
* 新增 终端 支持点击URL跳转到浏览器 [详情](https://hx.dcloud.net.cn/Tutorial/UserGuide/terminal?id=open-links)
* 修复 终端 当输入内容超过一定长度时，换行显示错误的Bug
* 修复 控制台或终端，创建多个时，HBuilderX整体窗口超出屏幕范围的Bug
* 修复 代码格式化导致编辑器上的书签丢失的Bug
* 修复 compile-node-sass插件 设置项onDidSaveExecution不生效的Bug
* 修复 多文件字符搜索 配置过滤模式，过滤模式文本颜色没有置灰的Bug
* 修复 多文件字符搜索 配置过滤模式，某些情况下，过滤模式被清除导致搜索结果错误的Bug
* 修复 字符搜索和多文件搜索切换，搜索条件内容被清除的Bug
* 优化 uniCloud 新建数据集合schema文件
* 修复 uniCloud 关联项目解除关联后，重启HBuilderX后项目管理器还显示关联项目的Bug
* 修复 uniCloud 关联项目 发行到H5 某些情况下，提示未关联服务空间的Bug
* 优化 uniCloud 云函数上传ContentAccessDenied错误，控制台增加解决方法 [详情](https://hx.dcloud.net.cn/Tutorial/Questions/win10-defender-contentaccessdenied)
* 修复 uniapp-cli vue3项目，无法运行发行app的Bug [详情](https://ask.dcloud.net.cn/question/132565)
* 修复 uniapp-cli vue3项目，以SSR方式发行，提示未绑定服务空间的Bug
* 优化 原生App-云打包 当项目下uniCloud未关联服务空间时，提交打包，增加弹窗提示
* 【uni-app插件】
  + App平台、H5平台 新增 支持设置动态配置 tabBarItem 显示隐藏 [详情](https://uniapp.dcloud.io/api/ui/tabbar?id=settabbaritem)
  + App平台、H5平台 新增 uni.showModal 支持配置是否显示输入框 [详情](https://uniapp.dcloud.io/api/ui/prompt?id=showmodal)
  + App平台、H5平台 修复 vue3 项目 picker-view 组件部分情况下 value 错误的Bug [详情](https://ask.dcloud.net.cn/question/132545)
  + App平台 新增 nvue map 组件 API MapContext.on [详情](https://uniapp.dcloud.net.cn/api/location/map?id=createmapcontext)
  + App-Android平台 修复 nvue scroll-view 组件设置 scroll-y 为 false 时引起横向滚动失效的Bug [详情](https://github.com/dcloudio/uni-app/issues/1487)
  + App-Android平台 修复 nvue textarea 组件设置 v-model 时使用手写输入法出现异常的Bug [详情](https://ask.dcloud.net.cn/question/122239)
  + App-Android平台 修复 uni.setLocale 设置应用语言后无法正确获取系统语言的Bug
  + App-Android平台 修复 nvue image 组件无法显示 webp 动图的Bug [详情](https://ask.dcloud.net.cn/question/132750)
  + App-iOS平台 修复 nvue list 组件在 iOS15 设备上可能出现空白内容的Bug [详情](https://ask.dcloud.net.cn/question/131714)
  + App-iOS平台 修复 nvue map 组件 marker 的 label 属性值格式不正确时可能引起崩溃的Bug
  + App-iOS平台 修复 应用长时间后台运行再回到前台 tabbar 页面可能显示白屏的Bug
  + App-iOS平台 修复 nvue textarea 组件 padding 样式显示不正确的Bug [详情](https://ask.dcloud.net.cn/question/131761)
  + App-iOS平台 修复 nvue list 中 header 组件在 iOS15 设备上存在默认 padding-top 的Bug [详情](https://ask.dcloud.net.cn/question/132524)
  + H5平台 新增 支持配置和使用谷歌地图 [详情](https://uniapp.dcloud.io/collocation/manifest?id=h5sdkconfigmaps)
  + H5平台 修复 rich-text 组件 nodes 节点的 class 样式不生效的Bug  [详情](https://ask.dcloud.net.cn/article/36661)
  + 小程序平台 修复 使用 uniIDHasRole、uniIDHasPermission 报错的Bug [详情](https://ask.dcloud.net.cn/question/125165)
  + 支付宝小程序平台 新增 默认启用小程序基础库 2.x 构建 [详情](https://uniapp.dcloud.net.cn/collocation/manifest?id=mp-alipay)
  + 修复 unicloud-db 组件在某些情况下修改 page-size 无效的Bug [详情](https://github.com/dcloudio/uniCloud-admin/issues/8)
  + 新增 Hello i18n 国际化示例项目 [详情](https://ext.dcloud.net.cn/plugin?id=6462) 
* 【App插件(含5+App和uni-app的App端)】
  + 更新 uni-AD 今日头条穿山甲广告SDK iOS为4.1.0.0版；Sigmob广告联盟SDK Android为3.4.1版，iOS为3.4.2版
  + 修复 geolocation 设置 timeout 参数时无法获取位置信息并且在控制报错的Bug
  + Android平台 新增 屏幕亮度参数值 -1 支持设置应用屏幕亮度与系统屏幕亮度保持一致
  + Android平台 更新 支付宝SDK为 15.8.03 版；高德地图SDK为 8.0.1 版，高德定位SDK为 5.5.0 版
  + Android平台 修复 previewImage 预览图片无法按照图片正确方向显示的Bug[详情](https://ask.dcloud.net.cn/question/131446)
  + Android平台 修复 3.2.8 版本引出的 视频播放控件 VideoPlayer 不能播放 AES-128 模式 m3u8 视频的Bug [详情](https://ask.dcloud.net.cn/question/131768)
  + Android平台 修复 视频播放控件 VideoPlayer 不能播放 rtsp 视频的Bug [详情](https://ask.dcloud.net.cn/question/131816)
  + Android平台 修复 视频播放控件 VideoPlayer 设置 objectFit 属性为 fill 时 poster 封面显示效果不正确的Bug [详情](https://ask.dcloud.net.cn/question/129760)
  + Android平台 修复 视频播放控件 VideoPlayer 在部分设备全屏显示可能引起崩溃的Bug [详情](https://ask.dcloud.net.cn/question/131547)
  + Android平台 修复 3.2.2 版本引出的 toast 提示框设置图标后无法正常显示的Bug [详情](https://ask.dcloud.net.cn/question/131445)
  + Android平台 修复 uni-AD 开通增强广告在部分设备首次启动可能误报`应用的uni-AD业务状态异常（-9001）`提示的Bug
  + Android平台 修复 上架某些应用市场审核检测可能误报存在收集安装列表行为的Bug [详情](https://ask.dcloud.net.cn/question/132948)
  + iOS平台 修复 wgt热更新资源后再整包覆盖安装 App 导致获取不到之前 storage 保存的数据的Bug
  + iOS平台 修复 sqlite 在页面关闭时可能会自动关闭数据库的Bug [详情](https://ask.dcloud.net.cn/question/131917)
  + iOS平台 修复 视频播放控件 VideoPlayer 设置 poster 后点播放按钮封面消失后播放器可能出现黑屏的Bug [详情](https://ask.dcloud.net.cn/question/131740)
  + iOS平台 修复 显示模态弹窗如 actionSheet 引起系统状态栏文字颜色会自动变成黑色的Bug [详情](https://ask.dcloud.net.cn/question/132444)
  + iOS平台 修复 打开悬浮红包广告可能引起崩溃或无法关闭广告页面的Bug [详情](https://ask.dcloud.net.cn/question/132543)
  + iOS平台 修复 图片选择界面在 iOS15 设备上导航栏会显示白色的Bug [详情](https://ask.dcloud.net.cn/question/132528)

## 3.2.9.20210927
* 【重要】新增 HBuilderX 支持本地语言扩展 (菜单【工具】，可切换其它语言) [详情](https://github.com/dcloudio/hbuilderx-language-packs)
* 【重要】新增 uni-app Vue3 版本 支持运行和发行到 App （暂不支持nvue）
* 新增 设置项 更新设置 支持配置是否检查更新，默认启动时自动检查更新 （【设置 - 常用配置】，检查更新）[详情](https://hx.dcloud.net.cn/Tutorial/setting?id=更新设置)
* 新增 设置项 帮助我们改进HBuilderX的功能和性能 允许用户自主选择是否上报使用情况统计信息和崩溃报告 [详情](https://hx.dcloud.net.cn/Tutorial/CrashReporter)
* 调整 HBuilderX编辑器顶部菜单【帮助 - 许可协议】，调整为在线链接，点击后跳转到浏览器打开
* 优化 vue3 代码提示、转到定义
* 新增 代码提示 package.json文件 增加相关字段提示
* 新增 js import {} 按需导入，{}内换行自动补上逗号
* 修复 HBuilderX编辑器无法渲染阿拉伯语的Bug
* 修复 菜单【编辑 - 缩进】调整缩进，某些情况下，在当前编辑器没有生效的Bug
* 新增 编辑器 删除连续的空格时, 根据设置的tab宽度, 一次性进行删除
* 修复 新建项目 当项目存储路径尾部带有/时，新建项目导致编辑器闪退的Bug
* 修复 Windows 某些情况下，复制操作，导致QQ、搜狗拼音输入法无法输入英文;,.标点符号的Bug
* 修复 MacOSX 操作系统自带的简体拼音输入法，输入easycom，编辑器出现崩溃的Bug
* 修复 MacOSX 编辑器开启【失去焦点时自动保存】功能后，处于dirty状态下的文件关闭时弹出对话框后编辑器无响应的Bug
* 修复 MacOSX 某些情况下，打开终端，终端顶部内容被挤压的Bug
* 修复 视图 前端网页托管，在地址栏，双击根目录/，编辑器闪退的Bug
* 修复 未启用.editorconfig支持 当.editorconfig文件存在错误，依然弹窗提示的Bug
* 新增 Markdown, 有序列表删除或插入, 自动修正序号
* 升级 eslint-vue插件 解决vue3 template多个root时校验出错的Bug
* 修复 Git 当项目管理器项目为Git项目子目录时，文件修改后，项目管理器没有显示相应标记的Bug
* 修复 Git 在单窗体中，打开Git项目，项目管理器项目名称后面，没有显示Git分支信息的Bug
* 修复 Git 项目管理器，相同前缀项目，某些情况下，git分支信息显示异常的Bug [详情](https://ask.dcloud.net.cn/question/130696)
* 优化 Git 推送 当本地分支没有跟踪远程分支时提示用户输入远程仓库
* 修复 Git 某些情况下，因.git/index.lock文件导致git命令运行失败的Bug
* 修复 外部命令 userInput, 某些情况下没有生效的Bug
* 新增 uniapp 发行H5 支持以SSR方式发行 [详情](https://uniapp.dcloud.io/collocation/ssr)
* 修复 uniapp-cli manifest.json 勾选使用原生隐私政策提示库，自动创建的androidPrivacy.json文件位置错误的Bug
* 优化 App manifest.json 取消使用原生隐私政策提示库，增加确认弹窗
* 新增 uniCloud 云函数require公共模块 支持提示公共模块名称
* 优化 uniCloud 关联其它项目的服务空间逻辑 不支持关联协作者服务空间项目
* 修复 uni_modules 插件市场导入`uni_modules`插件，某些情况下，提示`处理外部应用请求未能完成`的Bug
* 优化 App 原生打包 iOS 不再支持构建越狱包
* 调整 App Android平台 打包，没有配置icon时，不再添加橘红色图标
* 调整 App manifest.json QQ通用链接上传apple-app-site-association规则 [参考](https://wiki.connect.qq.com/%E5%A1%AB%E5%86%99%E5%8F%8A%E6%A0%A1%E9%AA%8Cuniversallinks)
* 删除 App manifest.json App模块配置 移除小米登录、讯飞语言、广告基础功能
* 优化 App manifest.json 将“QQ平台通用链接”和“新浪微博平台通用链接”的标题名称统一更改为iOS平台通用链接
* 优化 App manifest.json 微信自动生成的通用链接的结尾加上/
* 【uni-app插件】
  + App平台、H5平台 新增 uni.getLocale、uni.setLocale、uni.onLocaleChange 接口，用于获取和设置应用语言 [详情](https://uniapp.dcloud.io/api/ui/locale)
  + App平台、H5平台 修复 scroll-view 组件滚动过快时 scroll 事件回调返回信息不正确的Bug [详情](https://ask.dcloud.net.cn/question/128573)
  + App平台、H5平台 修复 canvas 组件 createPattern 方法无效的Bug [详情](https://ask.dcloud.net.cn/question/128793)
  + App平台、H5平台 修复 canvas 组件 重复触发 resize 导致延迟绘图时 canvas 改变的Bug [详情](https://github.com/dcloudio/uni-app/issues/2847)
  + App平台 新增 uni.configMTLS 支持 https 请求配置自签名证书 [详情](https://uniapp.dcloud.io/api/request/request?id=configmtls)
  + App平台 优化 nvue 页面排版机制，解决横竖屏切换可能引起页面显示不正常的Bug
  + App平台 修复 nvue 页面 rich-text 组件解析块元素出现多余换行的Bug [详情](https://ask.dcloud.net.cn/question/116518)
  + App平台 修复 3.2.2 引出的 uni.chooseImage 无法压缩拍照图像的Bug [详情](https://ask.dcloud.net.cn/question/129238)
  + App-Android平台 新增 nvue 页面适配支持折叠屏手机
  + App-Android平台 修复 nvue 页面 text 组件 line-height 高度失真引起 picker-view 无法对齐的Bug [详情](https://ask.dcloud.net.cn/question/128610)
  + App-Android平台 修复 nvue 页面 list、swiper、waterfall 组件嵌套时，包含的 header 组件可能无法正常显示Bug [详情](https://ask.dcloud.net.cn/question/128578)
  + App-iOS平台 修复 nvue 页面 textarea 组件的 blur 事件回调参数中缺少 cursor 属性数据的Bug [详情](https://ask.dcloud.net.cn/question/129023)
  + App-iOS平台 修复 nvue 页面 video 组件上方存在其他组件时可能引起显示错乱的Bug [详情](https://ask.dcloud.net.cn/question/129662)
  + App-iOS平台 修复 uni.openDocument 部分情况下回调错误的Bug
  + App-iOS平台 修复 tabbar 设置选中项图片为 gif 时动画速度太慢的Bug [详情](https://ask.dcloud.net.cn/question/125824)
  + App-iOS平台 修复 search 类型的 input 组件在 iOS15 默认显示搜索图标的Bug [详情](https://ask.dcloud.net.cn/question/129259)
  + H5平台 修复 导航栏 searchInput 输入框出现两个清空 icon 的Bug [详情](https://ask.dcloud.net.cn/question/129225)
  + H5平台 修复 titleNView 配置 type 为 transparent 时，float 为 left 的 button 不居中的Bug [详情](https://ask.dcloud.net.cn/question/129598)
  + 支付宝小程序平台 修复 uni.chooseImage 在模拟器上不返回 tempFiles 的Bug [详情](https://ask.dcloud.net.cn/question/128732)
  + 字节小程序平台 修复 同名文件内引用同一个组件作用域插槽渲染错误的Bug [详情](https://ask.dcloud.net.cn/question/127962)
  + 字节小程序平台 修复 使用 .sync 更新父子组件间的值失效的Bug [详情](https://ask.dcloud.net.cn/question/127397)
  + 字节小程序平台 修复 部分事件无法触发的Bug [#2774](https://github.com/dcloudio/uni-app/issues/2774)
  + 支付宝小程序平台 新增 支持在 App.vue 文件内监听 onShareAppMessage 事件 [#2844](https://github.com/dcloudio/uni-app/pull/2844)
  + QQ小程序平台 修复 真机运行报错的Bug [#2648](https://github.com/dcloudio/uni-app/issues/2648)
* 【uniCloud】
  + 【重要】clientDB 新增 支持使用 getTemp 对主表、副表过滤后再联表查询，大幅提升联表查询性能 [详情](https://uniapp.dcloud.net.cn/uniCloud/clientdb?id=lookup-with-temp)
  + uniCloud本地调试插件 修复 云函数日志 文件路径存在中文时无法点击跳转的Bug
  + uniCloud本地调试插件 修复 阿里云事务执行 updateAndReturn 报错的Bug
  + 本地调试插件 新增 设置启动调试参数（.hbuilderx/launch.json）关闭系统日志 [详情](https://uniapp.dcloud.net.cn/uniCloud/quickstart?id=calllocalfunction)
  + 本地调试插件 优化 公共模块查找逻辑，减少调试错误
  + clientDB 新增 action 依赖公共模块的功能 [详情](https://uniapp.dcloud.net.cn/uniCloud/clientdb?id=common-for-action)
* 【App插件(含5+App和uni-app的App端)】
  + 新增 登录鉴权 支持Google登录和Facebook登录 [详情](http://ask.dcloud.net.cn/article/192)
  + 新增 微信分享 支持打开微信客服功能 [规范](https://www.html5plus.org/doc/zh_cn/share.html#plus.share.ShareService.openCustomerServiceChat)
  + 新增 uni-AD Sigmob广告联盟支持激励视频广告 [文档](https://uniapp.dcloud.io/api/a-d/rewarded-video)
  + 更新 uni-AD 今日头条穿山甲广告SDK Android为4.0.0.1版；腾讯优量汇SDK Android为4.410.1280版，iOS为4.13.11版；快手广告SDK Android为3.3.14版，iOS为3.3.15.1版；快手内容联盟SDK Android为3.3.22版，iOS为3.3.23.1版
  + 更新 微信SDK Android为6.7.9版，iOS为1.9.2版
  + 优化 uni-AD 基础开屏广告填充率
  + 【重要】Android平台 新增 Android Support Library 升级迁移到 AndroidX 
  + Android平台 新增 原生隐私政策提示框内容中的链接支持本地 html 页面地址 [详情](https://ask.dcloud.net.cn/article/36937)
  + Android平台 更新 云端打包环境 compileSdkVersion 版本为 30，buildToolsVersion 版本为 29.0.3
  + Android平台 更新 友盟统计SDK为9.4.2版
  + Android平台 优化 compressVideo 视频压缩性能，支持 resolution 参数
  + Android平台 修复 系统相册中存在大量图片时图片选择界面操作卡顿的Bug[详情](https://ask.dcloud.net.cn/question/130582)
  + Android平台 修复 视频播放控件 VideoPlayer 在 Android11 设备播放视频可能崩溃的Bug [详情](https://ask.dcloud.net.cn/question/129108)
  + Android平台 修复 原生隐私政策提示框切换到横屏是显示异常的Bug [详情](https://ask.dcloud.net.cn/question/130403)
  + Android平台 修复 Orientation 方向传感器在部分平板设备可能无法方向信息的Bug
  + Android平台 修复 图片选择不设置 sizeType 时默认不显示`原图`按钮，选择图片会进行压缩的Bug [详情](https://ask.dcloud.net.cn/question/129156)
  + Android平台 修复 图片选择界面设置 filter 为 video 时仍然显示`原图`按钮的Bug
  + iOS平台 优化 compressVideo 视频压缩速度
  + iOS平台 修复 3.2.0 版本引出的 微信登录、分享、支付，QQ登录、分享在部分设备可能引起崩溃的Bug [详情](https://ask.dcloud.net.cn/question/129378)
  + iOS平台 修复 一键登录 授权页面服务协议复选框不好点击的Bug [详情](https://ask.dcloud.net.cn/question/130881)
  + iOS平台 修复 二维码扫码在应用横屏模式时预览画面被旋转了的Bug [详情](https://ask.dcloud.net.cn/question/116187)
  + iOS平台 修复 视频播放控件 VideoPlayer 播放直播视频无法触发 timeupdate 事件的Bug [详情](https://ask.dcloud.net.cn/question/129955)
  + iOS平台 修复 视频播放控件 VideoPlayer 可能无法正常播放m3u8视频流的Bug [详情](https://ask.dcloud.net.cn/question/129884)
  + iOS平台 修复 视频播放控件 VideoPlayer 视频带有方向属性时 poster 封面图会被旋转的Bug [详情](https://ask.dcloud.net.cn/question/129090)
  + iOS平台 修复 视频播放控件 VideoPlayer 设置 objectFit 为 cover 时封面显示不正确的Bug [详情](https://ask.dcloud.net.cn/question/127991)
  + iOS平台 修复 新浪分享模块在某些安全平台检测可能误报使用 UIWebview APIs 的Bug
  + iOS平台 修复 二维码扫码部分图片可能无法识别的Bug
  + iOS平台 修复 在 iOS15 设备配置使用广告标识 IDFA 首次启动可能不弹 AppTrackingTransparency 权限框的Bug
  + iOS平台 修复 在 iOS15 部分设备使用`标准运行基座`真机运行可能引起崩溃的Bug [详情](https://ask.dcloud.net.cn/question/131198)

## 3.2.3.20210825
* 【uni-app插件】
  + App平台 修复 3.2.2 版本引出的资源重复编译的Bug [详情](https://ask.dcloud.net.cn/question/129157)
* 【App插件(含5+App和uni-app的App端)】
  + 更新 uni-AD 腾讯优量汇SDK Android为4.400.1270版，iOS为4.13.02版；快手广告SDK iOS为3.3.14版；快手内容联盟SDK iOS为3.3.22版
  + Android平台 修复 图片选择不设置 sizeType 时默认不显示`原图`按钮，选择图片会进行压缩的Bug [详情](https://ask.dcloud.net.cn/question/129156)
  + iOS平台 修复 3.2.2 版本引出的 微信登录、分享、支付，QQ登录、分享在部分设备可能引起崩溃的Bug [详情](https://ask.dcloud.net.cn/question/129378)
  + iOS平台 修复 新浪分享模块在某些安全平台检测可能误报使用 UIWebview APIs 的Bug

## 3.2.2.20210818
* 【重要】新增 uni-app项目在 manifest-基础配置中 切换项目的 vue版本 使用2或3 （vue3版暂不支持app） [详情](https://ask.dcloud.net.cn/article/37834)
* 【重要】新增 uni-app 支持运行和发布到 快手小程序
* 新增 Git插件 支持在项目管理器上显示Git分支并可点击进行快捷操作 [详情](https://hx.dcloud.net.cn/Tutorial/SourceControl/git)
* 新增 左下角账号快捷切换
* 新增 设置项 选择自动换行方式 按单词截取、按字符截取 （【设置 - 编辑器配置】，选择自动换行方式）
* 新增 插件API 插件command支持声明快捷键 [详情](https://hx.dcloud.net.cn/ExtensionDocs/ContributionPoints/README?id=keybindings)
* 新增 插件API 新增when表达式 isMac、isWindows、editorHasSelection [详情](https://hx.dcloud.net.cn/ExtensionDocs/ContributionPoints/README?id=when)
* 修复 插件开发 Windows 控制台日志部分路径无法打开的Bug
* 修复 自定义主题 编辑器上某些颜色无法自定义的Bug
* 修复 项目管理器 单击预览文件，文件缩进和.editorconfig缩进配置不一致的Bug
* 新增 项目管理器 对被自定义编辑器关联的文件，增加“打开方式”菜单（【设置】源码视图，增加自定义编辑器文件关联配置）
* 修复 某些情况下，因.editorconfig文件内容不合法，打开后编辑器出现崩溃的Bug
* 修复 多屏情况下并且界面在第二个屏幕上，快捷键冲突时，冲突菜单显示位置不对的Bug
* 修复 Windows 多屏DPI不一致时，导致编辑器文字排版错乱的Bug
* 修复 当编辑器标签卡存在搜索结果页时，ctrl+tab切换最近的标签卡，切换列表，出现多条名称为“搜索结果”的Bug
* 修复 某些编程语言(Python)，安装相应代码块插件后，无法提示代码块的Bug
* 修复 某些情况下，转到定义激活后, 文字无法恢复普通状态的Bug
* 修复 JavaScript `switch case`语句 换行会自动加逗号的Bug [详情](https://ask.dcloud.net.cn/question/113434)
* 修复 JavaScript Vue模板字符串 换行会自动加逗号的Bug [详情](https://ask.dcloud.net.cn/question/126186)
* 修复 编辑器启动后，已打开的文件，右键菜单【重排代码格式】菜单置灰的Bug
* 修复 条件编译，鼠标双击注释内容，选区不正确的Bug
* 修复 Markdown折叠 文件换行符为'\r'时折叠计算错误的Bug
* 修复 MacOSX，双击uni-app、uniCloud加密文件在编辑器打开后，编辑器无法最小化的Bug
* 优化 MacOSX，新建项目界面，增加模板列表显示条目数量
* 调整 原生App-云打包，原生插件包名校验不分区大小写
* 修复 原生App-云打包，打包结果控制台，一键上传到uniCloud，协作者无法上传安装包到uniCloud服务空间的Bug
* 修复 iOS安心打包 某些情况下，App安装包mainfest.json文件不是最新的Bug
* 新增 插件市场 导入uniapp原生SDK项目 导入HBuilderX后，自动将appid和pluginID绑定
* 修复 uni_modules 插件市场导入`uni_modules`插件，某些情况下，提示`处理外部应用请求未能完成`的Bug
* 优化 uniCloud clientDB的field代码提示
* 新增 uniCloud 初始化向导 增加【部署项目下的DB Schema及扩展校验函数】选项
* 新增 uniCloud 前端网页托管 支持协作者上传网站到服务器
* 优化 uniCloud 前端网页托管 优化上传网站到服务器的界面
* 修复 uniCloud 创建公共模块、uni-clientDB-actions、schema、validateFunction时，同类资源本地存在同名时提示语不正确的Bug
* 优化 uni-app 发行到H5、制作wgt，增加校验
* 优化 uni-app 新建项目 包含付费云函数的项目 自动拉起初始化向导
* 新增 uni-app 插件大赛一等奖获奖作品内置到新建项目模板中 [详情](https://ask.dcloud.net.cn/article/39133)
* 新增 App manifest.json 一键生成iOS通用链接 支持QQ登录、QQ分享、新浪微博登录、新浪微博分享 [详情](https://uniapp.dcloud.io/api/plugins/universal-links)
* 修复 App 真机运行 某些情况下，获取iOS自定义基座版本号错误，导致每次修改代码都会重新安装基座到手机的Bug
* 【uni-app插件】
  + App平台、H5平台 新增 input 组件 type 支持 tel 类型
  + App平台、H5平台 新增 input 组件支持 text-content-type 属性
  + App平台、H5平台 修复 3.1.22 版本引出的 scroll-view 组件下拉刷新失效的Bug
  + App-Andriod平台 优化 uni.chooseImage 图片选择界面增加`原图`按钮
  + App-Android平台 修复 uni.saveFile 保存通过 uni.chooseImage 选择的图片在 Android11 设备上可能失败的Bug [详情](https://ask.dcloud.net.cn/question/128442)
  + App-iOS平台 修复 压缩后的视频无法通过 plus.io 接口操作的Bug
  + App-iOS平台 修复 nvue map 组件 marker 设置 label 的 bgColor 为透明值无效的Bug [详情](https://ask.dcloud.net.cn/question/126459)
  + App-iOS平台 修复 uni.chooseImage 图片选择界面`原图`按钮操作逻辑不正确的Bug
  + H5平台 优化 导航栏搜索框增加清除按钮
  + 小程序平台 修复 作用域插槽内使用事件后默认使用新版作用域插槽编译模式的Bug [详情](https://ask.dcloud.net.cn/question/127297)
  + 支付宝小程序平台 修复 部分内置组件事件当做自定义事件处理的Bug
  + 【重要】 uniad广告的ad组件 支持h5平台  [详情](https://uniapp.dcloud.net.cn/component/ad)
  + 【重要】 uni ui 支持 vue3 [详情](https://ext.dcloud.net.cn/plugin?id=55)
  + HBuilder官方预置项目全面支持 vue3，包括hello uni-app、hello uniCloud、uniCloud admin、uni-starter等
  + 新增 VUE3 条件编译，方便一套代码同时兼容vue2和vue3 [详情](https://uniapp.dcloud.net.cn/platform?id=preprocessor)
  + uni-ui uni-collapse 修复 由1.2.0版本引起的 change 事件返回 undefined 的Bug
  + uni-ui uni-collapse 优化 组件示例
  + uni-ui uni-collapse 新增 组件折叠动画
  + uni-ui uni-collapse 新增 value\v-model 属性 ，动态修改面板折叠状态
  + uni-ui uni-collapse 新增 title 插槽 ，可定义面板标题
  + uni-ui uni-collapse 新增 border 属性 ，显示隐藏面板内容分隔线
  + uni-ui uni-collapse 新增 title-border 属性 ，显示隐藏面板标题分隔线
  + uni-ui uni-collapse 修复 resize 方法失效的Bug
  + uni-ui uni-collapse 修复 change 事件返回参数不正确的Bug
  + uni-ui uni-collapse 优化 H5、App 平台自动更具内容更新高度，无需调用 reszie() 方法
  + uni-ui uni-data-checkbox 优化 在uni-forms组件，与label不对齐的问题
  + uni-ui uni-data-checkbox 修复 单选默认值为0不能选中的Bug
  + uni-ui uni-easyinput 优化 errorMessage 属性支持 Boolean 类型
  + uni-ui uni-file-picker 修复 return-type为object下，返回值不正确的Bug
  + uni-ui uni-file-picker 修复（重要） H5 平台下如果和uni-forms组件一同使用导致页面卡死的问题
  + uni-ui uni-file-picker 优化 h5平台下上传文件导致页面卡死的问题
  + uni-ui uni-forms 修复 vue2 下条件编译导致destroyed生命周期失效的Bug
  + uni-ui uni-forms 修复 1.2.1 引起的示例在小程序平台报错的Bug
  + uni-ui uni-forms 修复 动态校验表单，默认值为空的情况下校验失效的Bug
  + uni-ui uni-forms 修复 不指定name属性时，运行报错的Bug
  + uni-ui uni-forms 优化 label默认宽度从65调整至70，使required为true且四字时不换行
  + uni-ui uni-forms 优化 组件示例，新增动态校验示例代码
  + uni-ui uni-forms 优化 组件文档，使用方式更清晰
  + uni-ui uni-list 修复 与其他组件嵌套使用时，点击失效的Bug
  + uni-ui uni-swipe-action 修复 跨页面修改组件数据 ，导致不能滑动的问题
  + hello-uniapp 新增 同时适配 vue2 和 vue3（HBuilder X 3.2.0+ 支持 vue3）
  + uniCloud admin 新增 同时适配 vue2 和 vue3（HBuilder X 3.2.0+ 支持 vue3）
  + uniCloud admin 新增 应用管理功能，管理用户可登录的应用，如某账户只能登录管理端、不能登录用户端（uni-id@3.3.1+ 支持）
  + uniCloud admin 新增 升级系统管理 list 页的表格功能，支持数据排序、筛选、搜索等功能
  + uniCloud admin 修复 刷新页面时，左侧菜单丢失高亮状态的 bug
  + uniCloud admin 修复 修改密码失败的 bug
  + 新增 插件市场 支持前端文件加密 限付费的云端一体项目类型的前端文件 [详情](https://ask.dcloud.net.cn/article/35408)
* 【App插件(含5+App和uni-app的App端)】
  + 新增 一键登录 服务协议项样式支持设置复选框图标 [详情](https://uniapp.dcloud.io/univerify)
  + 优化 新浪微博 登录、分享 模块配置，去掉appsecret参数
  + 修复 一键登录 应用横屏显示时打开一键登录页面UI显示异常的Bug [详情](https://ask.dcloud.net.cn/question/126597)
  + 【重要】Android平台 新增 androidPrivacy.json 文件配置隐私政策提示框 [详情](https://ask.dcloud.net.cn/article/36937)
  + Android平台 更新 uni-AD 今日头条穿山甲广告SDK为3.8.0.6版；腾讯优量汇广告SDK为4.380.1250版；快手广告联盟SDK为3.3.12版，快手内容联盟SDK为3.3.20版
  + Android平台 更新 腾讯X5内核版本为 4.3.0.176_44076，解决在部分设备无法加载使用X5内核的问题
  + Android平台 更新 UniPush 使用的个推SDK版本为3.2.2.0，个推核心组件SDK版本为3.1.2.0
  + Android平台 修复 3.1.22 版本引出的 template 原生隐私政策提示框内容过多时显示不正常的Bug [详情](https://ask.dcloud.net.cn/question/127582)
  + Android平台 修复 3.1.19 版本引出的 UniPush 云端打包设置 GooglePlay(AAB) 渠道，getClientInfo 无法获取推送标识信息的Bug [详情](https://ask.dcloud.net.cn/question/127434)
  + Android平台 修复 3.1.19 版本引出的 直播推流 LivePusher 无法全屏预览的Bug [详情](https://ask.dcloud.net.cn/question/127987)
  + Android平台 修复 5+App项目打包后提交华为应用市场审核会误报包含三方广告SDK的Bug [详情](https://ask.dcloud.net.cn/question/126498)
  + Android平台 修复 申请权限被用户拒绝后，引导用户跳转设置界面开启权限后返回应用依然无法获取权限的Bug [详情](https://ask.dcloud.net.cn/question/128369)
  + Android平台 修复 页面中 input 标签 type 为 file 时，应用没有读写手机存储权限不会主动申请导致无法正常使用的Bug
  + Android平台 修复 VideoPlayer 播放带方向信息的视频源，暂停时显示方向不正确的Bug [详情](https://ask.dcloud.net.cn/question/125783)
  + Android平台 修复 VideoPlayer 播放部分视频源，暂停时可能显示黑边的Bug [详情](https://github.com/dcloudio/uni-app/issues/2779)
  + Android平台 修复 LivePusher 推流设置的本地缓冲池过大导致延迟时间过长的Bug
  + iOS平台 更新 QQ 登录、分享SDK版本为V3.5.3；新浪微博 登录、分享SDK版本为3.3.1；微信 登录、分享、支付SDK版本为1.9.1
  + iOS平台 更新 UniPush 使用的个推SDK为2.5.10.0无IDFA版
  + iOS平台 修复 一键登录 设置服务协议复选框默认不勾选时授权按钮背景颜色显示不正确的Bug
  + iOS平台 修复 Downloader 下载文件返回的请求头 Content-Range 数据为空时引起应用崩溃的Bug
  + iOS平台 修复 Downloader 下载文件名称出现乱码或包含特殊字符，导致保存文件无法读取的Bug
  + iOS平台 修复 百度语音识别在用户拒绝录音权限时没有返回错误回调的Bug
  + iOS平台 修复 在 iOS14 设备使用 5G 网络可能引起崩溃的Bug
* 【uniCloud】
  + 云数据库 新增 updateAndReturn 方法，可以更新并返回更新后的值（仅可在云函数中使用） [详情](https://uniapp.dcloud.net.cn/uniCloud/cf-database?id=update-and-return)
  + uniCloud本地调试插件 修复 部分情况下项目启动时报 npm 安装失败的Bug
  + uni-id 新增 多系统（如管理端、用户端）的配置隔离 [详情](https://uniapp.dcloud.net.cn/uniCloud/uni-id?id=isolate-config)
  + uni-id 新增 多系统用户管理，如某账户只能登录管理端，不能登录用户端 [详情](https://uniapp.dcloud.net.cn/uniCloud/uni-id?id=isolate-user)
    * 此版本升级需要开发者处理历史用户数据，请参考 [补齐用户dcloud_appid字段](https://uniapp.dcloud.net.cn/uniCloud/uni-id?id=makeup-dcloud-appid)
  + uni-id 新增 QQ登录、注册相关功能 [详情](https://uniapp.dcloud.net.cn/uniCloud/uni-id?id=qq)
  + uni-id 调整 不再支持绑定手机、邮箱时不填验证码直接绑定

## 3.1.22.20210709
* 【重要】MacOSX 升级内置浏览器版本到Chrome 69、升级QT引擎到5.12.10
* 修复 插件卸载 某些插件卸载重装后，不重启HBuilderX，插件无法激活的Bug
* 修复 插件卸载 使用自定义编辑器的插件卸载后，没有恢复文件默认打开方式的Bug
* 优化 插件开发 控制台日志输出，增加文件行号的点击跳转
* 优化 大文档选择行数比较多时的性能问题
* 修复 MacOSX vue-cli项目，当电脑本身没有安装node环境时，运行项目到内置终端，相关npm命令执行失败的Bug
* 新增 底部控制台标签卡，支持鼠标滚轮翻动
* 修复 当设置中没有勾选`Ctrl+鼠标滚轮缩放编辑器`设置项时，底部控制台，鼠标滚轮缩放依然生效的Bug
* 修复 未命名标签卡收藏时，提示需要保存，但是选择了保存后仍然没有收藏成功的Bug
* 修复 编辑器 选中整行，按下tab, 行内容消失的Bug
* 新增 Markdown 列表内容为`[]()` 支持锚点跳转
* 新增 Markdown <>标签，支持转到邮箱
* 新增 Markdown 图片语法`![]()`和链接语法`[]()` 支持相对路径
* 修复 Markdown添加列表快捷键，在其它非Markdown文件也生效的Bug
* 修复 代码提示 代码助手处于数字模式时，当按下的数字大于可选项的个数时无法输入的Bug
* 优化 代码提示改为异步获取提示数据 避免某些情况计算时间过长卡UI
* 新增 支持自定义编辑器代码颜色 [详情](https://hx.dcloud.net.cn/Tutorial/themes?id=自定义编辑器代码颜色)
* 调整 json文件代码的高亮逻辑
* 修复 雅蓝、酷黑主题 HTML无效标签被加上背景色的Bug
* 修复 标签栏空白处，右键菜单，关闭所有标签卡功能无效的Bug
* 修复 底部区域标签卡过多时（比如启动多个运行项目，打开多个终端），导致窗口被撑大，并且无法缩放的Bug
* 修复 真机运行 某些Android 11系统真机运行同步文件失败的Bug
* 新增 App 原生App-云打包 Android打包 支持使用云端证书 [详情](https://ask.dcloud.net.cn/article/35985#server) 
* 新增 uni-app vue3 支持以SSR方式运行、发行H5
* 新增 代码提示 uniCloud 支持提示关联项目的schema、collection
* 修复 uniCloud 云服务空间初始化向导 当加密云函数时，某些情况下初始化失败的Bug
* 【uni-app插件】
  + 【重要】调整 App平台、H5平台 input 组件 number 类型在 iOS 平台改用仅数字键盘（九宫格），如需输入负数和小数请改用 digit 类型
  + App平台、H5平台 修复 editor 组件 insertImage 多次触发 input 事件的Bug [详情](https://ask.dcloud.net.cn/question/124809)
  + App平台、H5平台 修复 image 组件使用 transform 样式后，大小计算错误的Bug [详情](https://ask.dcloud.net.cn/question/125987)
  + App平台、H5平台 修复 scroll-view 下拉刷新错误触发的Bug [详情](https://ask.dcloud.net.cn/question/124430)
  + App平台、H5平台 修复 input 组件同时设置 type=number 和 maxlength 时，部分情况 value 同步错误的Bug
  + App平台、H5平台 修复 textarea 组件设置 min-height 后高度异常的Bug
  + App平台 新增 一键登录自定义按钮添加 provider 属性，用于动态生成 buttons 时区分按钮 [详情](https://uniapp.dcloud.io/univerify?id=用户点击一键登录自定义按钮)
  + App平台 新增 uni.chooseImage 支持 crop 裁剪配置 [详情](https://uniapp.dcloud.io/api/media/image?id=chooseimage)
  + App平台 新增 video 组件支持 header 配置 [详情](https://uniapp.dcloud.io/component/video)
  + App平台 新增 uni.showToast 接口 icon 支持 error 类型
  + App平台 优化 nvue 页面中去除 display:flex 相关警告
  + App平台 优化 uni.chooseLocation 搜索结果按综合排序 [详情](https://ask.dcloud.net.cn/question/125044)
  + App-Android平台 优化 快速频繁操作应用启动/关闭可能出现白屏现象的问题
  + App-Android平台 修复 uni.request 请求 header 中设置自定义 content-type 会添加 charset 的Bug [详情](https://ask.dcloud.net.cn/question/123961)
  + App-Android平台 修复 uni.previewImage 长按保存图片可能失败的Bug [详情](https://ask.dcloud.net.cn/question/125357)
  + App-Android平台 修复 websocket 请求过多可能引起崩溃的Bug
  + App-Android平台 修复 tabBar 列表项不设置 selectedIconPath 在部分手机可能引起`trying to use a recycled bitmap android.graphics.Bitmap`崩溃的Bug
  + App-Android平台 修复 nvue 页面 webview 组件设置 background 属性不生效的Bug [详情](https://ask.dcloud.net.cn/question/117845)
  + App-Android平台 修复 nvue 页面 video 组件暂定播放后可能出现黑边的Bug [详情](https://ask.dcloud.net.cn/question/124152)
  + App-Android平台 修复 nvue 页面 swiper 组件嵌套 list 组件时 source 信息错误的Bug [详情](https://ask.dcloud.net.cn/question/121039)
  + App-iOS平台 修复 调用 uni.hideKeyboard 后点击页面任意位置 input 组件自动聚焦的Bug [详情](https://ask.dcloud.net.cn/question/125233)
  + App-iOS平台 修复 nvue 页面 textarea 组件不设置 padding 时 placeholder 显示位置不正常的Bug [详情](https://ask.dcloud.net.cn/question/122376)
  + App-iOS平台 修复 iOS14.6 键盘弹出卡顿的Bug [详情](https://ask.dcloud.net.cn/question/125870)
  + H5平台 修复 input 组件设置 confirm-type 为 search 时，无法自动获取焦点的Bug
  + 小程序平台 优化 作用域插槽内支持使用作用域外数据 [#495](https://github.com/dcloudio/uni-app/issues/495)
  + 小程序平台 修复 v-for 中含有复杂表达式时，事件接收的 item 参数错误的Bug
  + 小程序平台 修复 部分数值变更无法更新的Bug [#2696](https://github.com/dcloudio/uni-app/issues/2696)
  + 百度小程序平台 修复 基础库 3.290.33 以上页面 mounted 执行两次的Bug [#2642](https://github.com/dcloudio/uni-app/issues/2642)
  + 百度小程序平台 修复 使用 usingComponents 后代码上传报错的Bug [#2652](https://github.com/dcloudio/uni-app/issues/2652)
  + 百度小程序平台 修复 部分 class 写法编译后失效的Bug
  + 支付宝小程序平台 优化 支持 useDynamicPlugins 配置 [详情](https://ask.dcloud.net.cn/article/39114)
  + QQ小程序 修复 默认启用 nodeModules 导致作用域插槽编译后运行报错的Bug
  + 字节小程序平台 修复 基础库 2.0 以上组件关系错乱的Bug [#2651](https://github.com/dcloudio/uni-app/issues/2651)
  + 字节小程序平台 修复 新版开发者工具中 uni.request 发送请求失败的Bug
* 【uniCloud】
  + 【重要】云函数支持创建时选择 nodejs 版本 [详情](https://uniapp.dcloud.net.cn/uniCloud/cf-functions?id=runtime)
  + 新增 内容安全公共模块，包含图片鉴黄、文字内容违规检测，免费且全端可用 [详情](https://ext.dcloud.net.cn/plugin?id=5460)
  + 新增 uniCloud响应体规范，方便前端拦截器统一处理、方便国际化 [详情](https://uniapp.dcloud.net.cn/uniCloud/unicloud-response-format)
  + clientDB 新增 multiSend 接口，用于多个clientDB联网请求合并为一次联网 [详情](https://uniapp.dcloud.net.cn/uniCloud/clientdb?id=multi-send)
  + unicloud-db组件和API 新增 getTemp 接口，用于在 multiSend 内使用 [详情](https://uniapp.dcloud.net.cn/uniCloud/clientdb?id=multi-send)
  + JQL数据库管理 修复 部分情况下执行数据库操作无响应的Bug
  + uni-id 调整 3.1.1版本发布，使用兼容 uniCloud 响应体规范的新错误码格式 [详情](https://uniapp.dcloud.net.cn/uniCloud/uni-id?id=errcode)
  + uniCloud本地调试插件 修复 部分情况下出现 MaxListenersExceededWarning 警告的Bug
  + uniCloud本地调试插件 修复 项目内存在项目外文件的软链时，修改无法实时生效的Bug
  + 客户端 新增 添加拦截器、移除拦截器API [详情](https://uniapp.dcloud.net.cn/uniCloud/client-sdk?id=add-interceptor)
  + 客户端 修复 HBuilderX 3.1.17 引出的 db.on("error") 回调不执行的Bug
  + 客户端 修复 leftWindow、topWindow 中使用 uniCloud 腾讯云报错的Bug [详情](https://ask.dcloud.net.cn/question/125039)
  + 客户端 修复 nvue 页面无法触发 App.vue 内注册的 db.on('error')、db.on('refreshToken') 等回调的Bug
  + DB Schema 调整 enum 属性最大可枚举500条数据
* 【App插件(含5+App和uni-app的App端)】
  + 新增 拍照和本地相册选择 支持设置 crop 裁剪编辑图片 [规范](https://www.html5plus.org/doc/zh_cn/camera.html#plus.camera.CameraOptions)
  + 新增 视频播放控件 VideoPlayer 播放http/https协议视频资源时支持设置请求的 header [规范](https://www.html5plus.org/doc/zh_cn/video.html#plus.video.VideoPlayerStyles)
  + 新增 登录鉴权服务对象支持 nativeClient 属性标识依赖的客户端App是否已安装 [规范](https://www.html5plus.org/doc/zh_cn/oauth.html#plus.oauth.AuthService.nativeClient)
  + 更新 uni-AD 穿山甲SDK Android为3.7.0.2版；快手广告联盟SDK Android为3.3.10.2版，iOS为3.3.10版；快手内容联盟SDK Android为3.3.18.1版，iOS为3.3.19版；腾讯优量汇SDK iOS为4.12.71版
  + Android平台 更新 LivePusher 直播推流模块基于开源项目[yasea](https://github.com/begeekmyfriend/yasea)，支持 srs4.x
  + Android平台 优化 通知栏操作逻辑，解决提交 Google Play 审核可能提示 Implicit PendingIntent Vulnerability 的问题 [详情](https://ask.dcloud.net.cn/question/126207)
  + Android平台 优化 template 原生隐私政策提示框UI样式
  + Android平台 修复 template 原生隐私政策提示框点击同意按钮前可能读取设备标识的Bug
  + Android平台 修复 手机语言设置为阿拉伯文后无法操作页面返回的Bug [详情](https://ask.dcloud.net.cn/question/124914)
  + Android平台 修复 H5页面中 intent:// 协议无法拉起三方App的Bug [详情](https://ask.dcloud.net.cn/question/124597)
  + Android平台 修复 云端打包 提交 Google Play 审核提示包含无法识别的语言的Bug [详情](https://ask.dcloud.net.cn/question/125203)
  + Android平台 修复 getVideoInfo 方法调用无响应的Bug [详情](https://ask.dcloud.net.cn/question/122739)
  + Android平台 修复 3.1.14版本引出的 微博登录取消授权后再次调用无响应的Bug [详情](https://ask.dcloud.net.cn/question/125273)
  + Android平台 修复 targetSdkVersion 设置为 30 在部分 Android 11 设备可能无法正常拉起支付App的Bug
  + Android平台 修复 getFileInfo 在 Android11 设备上可能无法正常获取文件信息的Bug [详情](https://ask.dcloud.net.cn/question/124440)
  + Android平台 修复 storage 数据存储键值 key 中包含特殊字符时可能存取失败的Bug
  + iOS平台 新增 安全区域配置 safearea 支持 backgroundDark 属性设置暗黑模式的背景颜色 [详情](https://ask.dcloud.net.cn/article/36995#safearea)
  + iOS平台 更新 云端打包环境为XCode12.5.1，解决在 iOS15 设备无法安装的Bug
  + iOS平台 更新 视频播放控件 VideoPlayer 使用的 FFmpeg 版本为 ff4.0--ijk0.8.8--20210426--001
  + iOS平台 修复 uni-AD 开屏广告在部分应用中可能引起曝光率较低的Bug
  + iOS平台 修复 uni-AD 应用从后台切换到前台开屏广告可能被其它界面覆盖的Bug
  + iOS平台 修复 uni-AD 显示穿山甲开屏广告时在部分手机上可能`跳过`按钮无法点击的Bug
  + iOS平台 修复 plus.sqlite.isOpenDatabase 不传入参数可能引起卡死或崩溃的Bug [详情](https://ask.dcloud.net.cn/question/114091)
  + iOS平台 修复 Geolocation 定位模块在用户未授权或设备关闭定位功能时返回错误码与规范不一致的Bug
  + iOS平台 修复 在部分情况下 WKWebView 同步共享 cookie 可能引起崩溃的Bug
* 【UniMPSDK】
  + iOS平台 修复 push 方式打开小程序手势返回关闭后偶现无法再次打开小程序页面的Bug
  + iOS平台 修复 动态设置 titleNView 样式后可能导致胶囊菜单按钮弹出的 actionSheet 部分 item 显示空白的Bug

## 历史更新日志
[https://update.dcloud.net.cn/hbuilderx/changelog/3.1.18.20210609.html](https://update.dcloud.net.cn/hbuilderx/changelog/3.1.18.20210609.html)
