let content = {
"vue.2.options.ComponentOptions.data": `
Vue 实例的数据对象。
    
参考:<br/>
https://cn.vuejs.org/v2/api/?#data
    
<pre>
var data = { a: 1 }

// 直接创建一个实例
var vm = new Vue({
  data: data
})
vm.a // => 1
vm.$data === data // => true

// Vue.extend() 中 data 必须是函数
var Component = Vue.extend({
  data: function () {
    return { a: 1 }
  }
})
</pre>
`,
"vue.2.options.ComponentOptions.props": `
props 可以是数组或对象，用于接收来自父组件的数据。props 可以是简单的数组，或者使用对象作为替代，对象允许配置高级选项，如类型检测、自定义校验和设置默认值。
    
参考:<br/>
https://cn.vuejs.org/v2/api/?#props
    
<pre>
// 简单语法
Vue.component('props-demo-simple', {
  props: ['size', 'myMessage']
})

// 对象语法，提供校验
Vue.component('props-demo-advanced', {
  props: {
    // 检测类型
    height: Number,
    // 检测类型 + 其他验证
    age: {
      type: Number,
      default: 0,
      required: true,
      validator: function (value) {
        return value >= 0
      }
    }
  }
})
</pre>
`,
"vue.2.options.ComponentOptions.propsData": `
创建实例时传递 props。主要作用是方便测试。
    
参考:<br/>
https://cn.vuejs.org/v2/api/?#propsData
    
<pre>
var Comp = Vue.extend({
  props: ['msg'],
  template: '<div>{{ msg }}</div>'
})

var vm = new Comp({
  propsData: {
    msg: 'hello'
  }
})
</pre>
`,
"vue.2.options.ComponentOptions.computed": `
计算属性将被混入到 Vue 实例中。所有 getter 和 setter 的 this 上下文自动地绑定为 Vue 实例。

参考:<br/>
https://cn.vuejs.org/v2/api/?#computed

<pre>
var vm = new Vue({
  data: { a: 1 },
  computed: {
    // 仅读取
    aDouble: function () {
      return this.a * 2
    },
    // 读取和设置
    aPlus: {
      get: function () {
        return this.a + 1
      },
      set: function (v) {
        this.a = v - 1
      }
    }
  }
})
vm.aPlus   // => 2
vm.aPlus = 3
vm.a       // => 2
vm.aDouble // => 4
</pre>
`,
"vue.2.options.ComponentOptions.methods": `
methods 将被混入到 Vue 实例中。可以直接通过 VM 实例访问这些方法，或者在指令表达式中使用。方法中的 this 自动绑定为 Vue 实例。

参考:<br/>
https://cn.vuejs.org/v2/api/?#methods

<pre>
var vm = new Vue({
  data: { a: 1 },
  methods: {
    plus: function () {
      this.a++
    }
  }
})
vm.plus()
vm.a // 2
</pre>

注意，不应该使用箭头函数来定义 method 函数 (例如 plus: () => this.a++)。理由是箭头函数绑定了父级作用域的上下文，所以 this 将不会按照期望指向 Vue 实例，this.a 将是 undefined。
`,
"vue.2.options.ComponentOptions.watch": `
一个对象，键是需要观察的表达式，值是对应回调函数。值也可以是方法名，或者包含选项的对象。Vue 实例将会在实例化时调用 $watch()，遍历 watch 对象的每一个属性。

参考:<br/>
https://cn.vuejs.org/v2/api/?#watch

<pre>
var vm = new Vue({
  data: {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: {
      f: {
        g: 5
      }
    }
  },
  watch: {
    a: function (val, oldVal) {
      console.log('new: %s, old: %s', val, oldVal)
    },
    // 方法名
    b: 'someMethod',
    // 深度 watcher
    c: {
      handler: function (val, oldVal) { /* ... */ },
      deep: true
    },
    // 该回调将会在侦听开始之后被立即调用
    d: {
      handler: function (val, oldVal) { /* ... */ },
      immediate: true
    },
    e: [
      function handle1 (val, oldVal) { /* ... */ },
      function handle2 (val, oldVal) { /* ... */ }
    ],
    // watch vm.e.f's value: {g: 5}
    'e.f': function (val, oldVal) { /* ... */ }
  }
})
vm.a = 2 // => new: 2, old: 1
</pre>    
`,
"vue.2.options.ComponentOptions.el": `
提供一个在页面上已存在的 DOM 元素作为 Vue 实例的挂载目标。可以是 CSS 选择器，也可以是一个 HTMLElement 实例。

参考:<br/>
https://cn.vuejs.org/v2/api/?#el
`,
"vue.2.options.ComponentOptions.template": `
一个字符串模板作为 Vue 实例的标识使用。模板将会 替换 挂载的元素。挂载元素的内容都将被忽略，除非模板的内容有分发插槽。

参考:<br/>
https://cn.vuejs.org/v2/api/?#template

如果 Vue 选项中包含渲染函数，该模板将被忽略。
`,
"vue.2.options.ComponentOptions.render": `
字符串模板的代替方案，允许你发挥 JavaScript 最大的编程能力。该渲染函数接收一个 createElement 方法作为第一个参数用来创建 VNode。

参考:<br/>
https://cn.vuejs.org/v2/api/?#render

Vue 选项中的 render 函数若存在，则 Vue 构造函数不会从 template 选项或通过 el 选项指定的挂载元素中提取出的 HTML 模板编译渲染函数。
`,
"vue.2.options.ComponentOptions.renderError": `
<b>2.2.0 新增。只在开发者环境下工作。</b>当 render 函数遭遇错误时，提供另外一种渲染输出。其错误将会作为第二个参数传递到 renderError。这个功能配合 hot-reload 非常实用。

参考:<br/>
https://cn.vuejs.org/v2/api/?#renderError

<pre>
new Vue({
  render (h) {
    throw new Error('oops')
  },
  renderError (h, err) {
    return h('pre', { style: { color: 'red' }}, err.stack)
  }
}).$mount('#app')
</pre>    
`,
"vue.2.options.ComponentOptions.beforeCreate": `
在实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用。

参考:<br/>
https://cn.vuejs.org/v2/api/?#beforeCreate
`,
"vue.2.options.ComponentOptions.created": `
在实例创建完成后被立即调用。在这一步，实例已完成以下的配置：数据观测 (data observer)，属性和方法的运算，watch/event 事件回调。然而，挂载阶段还没开始，$el 属性目前不可见。

参考:<br/>
https://cn.vuejs.org/v2/api/?#created
`,
"vue.2.options.ComponentOptions.beforeDestroy": `
实例销毁之前调用。在这一步，实例仍然完全可用。

参考:<br/>
https://cn.vuejs.org/v2/api/?#beforeDestroy

该钩子在服务器端渲染期间不被调用。
`,
"vue.2.options.ComponentOptions.destroyed": `
Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。

参考:<br/>
https://cn.vuejs.org/v2/api/?#destroyed

该钩子在服务器端渲染期间不被调用。
`,
"vue.2.options.ComponentOptions.beforeMount": `
在挂载开始之前被调用：相关的 render 函数首次被调用。该钩子在服务器端渲染期间不被调用。

参考:<br/>
https://cn.vuejs.org/v2/api/?#beforeMount
`,
"vue.2.options.ComponentOptions.mounted": `
el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子。如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$el 也在文档内。

参考:<br/>
https://cn.vuejs.org/v2/api/?#mounted

该钩子在服务器端渲染期间不被调用。
`,
"vue.2.options.ComponentOptions.beforeUpdate": `
数据更新时调用，发生在虚拟 DOM 打补丁之前。这里适合在更新之前访问现有的 DOM，比如手动移除已添加的事件监听器。

参考:<br/>
https://cn.vuejs.org/v2/api/?#beforeUpdate

该钩子在服务器端渲染期间不被调用，因为只有初次渲染会在服务端进行。
`,
"vue.2.options.ComponentOptions.updated": `
由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。

参考:<br/>
https://cn.vuejs.org/v2/api/?#updated

该钩子在服务器端渲染期间不被调用。
`,
"vue.2.options.ComponentOptions.activated": `
keep-alive 组件激活时调用。

参考:<br/>
https://cn.vuejs.org/v2/api/?#activated

该钩子在服务器端渲染期间不被调用。
`,
"vue.2.options.ComponentOptions.deactivated": `
keep-alive 组件停用时调用。

参考:<br/>
https://cn.vuejs.org/v2/api/?#deactivated

该钩子在服务器端渲染期间不被调用。
`,
"vue.2.options.ComponentOptions.errorCaptured": `
<b>2.5.0+ 新增</b>当捕获一个来自子孙组件的错误时被调用。此钩子会收到三个参数：错误对象、发生错误的组件实例以及一个包含错误来源信息的字符串。此钩子可以返回 false 以阻止该错误继续向上传播。

参考:<br/>
https://cn.vuejs.org/v2/api/?#errorCaptured
`,
"vue.2.options.ComponentOptions.directives": `
包含 Vue 实例可用指令的哈希表。

参考:<br/>
https://cn.vuejs.org/v2/api/?#directives
`,
"vue.2.options.ComponentOptions.components": `
包含 Vue 实例可用组件的哈希表。

参考:<br/>
https://cn.vuejs.org/v2/api/?#components
`,
"vue.2.options.ComponentOptions.filters": `
包含 Vue 实例可用过滤器的哈希表。

参考:<br/>
https://cn.vuejs.org/v2/api/?#filters
`,
"vue.2.options.ComponentOptions.provide": `
需要和inject一起使用

参考:<br/>
https://cn.vuejs.org/v2/api/?#provide-inject

provide 和 inject 主要为高阶插件/组件库提供用例。并不推荐直接用于应用程序代码中。
`,
"vue.2.options.ComponentOptions.inject": `
需要和inject一起使用

参考:<br/>
https://cn.vuejs.org/v2/api/?#provide-inject

provide 和 inject 主要为高阶插件/组件库提供用例。并不推荐直接用于应用程序代码中。
`,
"vue.2.options.ComponentOptions.model": `
允许一个自定义组件在使用 v-model 时定制 prop 和 event。默认情况下，一个组件上的 v-model 会把 value 用作 prop 且把 input 用作 event，但是一些输入类型比如单选框和复选框按钮可能想使用 value prop 来达到不同的目的。使用 model 选项可以回避这些情况产生的冲突。

参考:<br/>
https://cn.vuejs.org/v2/api/?#model

<pre>
Vue.component('my-checkbox', {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    // this allows using the \`value\` prop for a different purpose
    value: String,
    // use \`checked\` as the prop which take the place of \`value\`
    checked: {
      type: Number,
      default: 0
    }
  },
  // ...
})
</pre>
<pre>
<my-checkbox v-model="foo" value="some value"></my-checkbox>
</pre>
<pre>
上述代码相当于：
<my-checkbox
  :checked="foo"
  @change="val => { foo = val }"
  value="some value">
</my-checkbox>
</pre>    
`,
"vue.2.options.ComponentOptions.parent": `
指定已创建的实例之父实例，在两者之间建立父子关系。子实例可以用 this.$parent 访问父实例，子实例被推入父实例的 $children 数组中。

参考:<br/>
https://cn.vuejs.org/v2/api/?#parent

节制地使用 $parent 和 $children - 它们的主要目的是作为访问组件的应急方法。更推荐用 props 和 events 实现父子组件通信
`,
"vue.2.options.ComponentOptions.mixins": `
mixins 选项接受一个混入对象的数组。这些混入实例对象可以像正常的实例对象一样包含选项，他们将在 Vue.extend() 里最终选择使用相同的选项合并逻辑合并。举例：如果你的混入包含一个钩子而创建组件本身也有一个，两个函数将被调用。
Mixin 钩子按照传入顺序依次调用，并在调用组件自身的钩子之前被调用。

参考:<br/>
https://cn.vuejs.org/v2/api/?#mixins

<pre>
var mixin = {
  created: function () { console.log(1) }
}
var vm = new Vue({
  created: function () { console.log(2) },
  mixins: [mixin]
})
// => 1
// => 2
</pre>
`,
"vue.2.options.ComponentOptions.name": `
允许组件模板递归地调用自身。注意，组件在全局用 Vue.component() 注册时，全局 ID 自动作为组件的 name。
指定 name 选项的另一个好处是便于调试。有名字的组件有更友好的警告信息。另外，当在有 vue-devtools，未命名组件将显示成 <AnonymousComponent>，这很没有语义。通过提供 name 选项，可以获得更有语义信息的组件树。

参考:<br/>
https://cn.vuejs.org/v2/api/?#name
`,
"vue.2.options.ComponentOptions.extends": `
允许声明扩展另一个组件(可以是一个简单的选项对象或构造函数)，而无需使用 Vue.extend。这主要是为了便于扩展单文件组件。

参考:<br/>
https://cn.vuejs.org/v2/api/?#extends

<pre>
var CompA = { ... }

// 在没有调用 \`Vue.extend\` 时候继承 CompA
var CompB = {
  extends: CompA,
  ...
}
</pre>
`,
"vue.2.options.ComponentOptions.delimiters": `
改变纯文本插入分隔符。

参考:<br/>
https://cn.vuejs.org/v2/api/?#delimiters

<pre>
new Vue({
  delimiters: ['\${', '}']
})

// 分隔符变成了 ES6 模板字符串的风格
</pre>
`,
"vue.2.FunctionalComponentOptions.functional": `
使组件无状态 (没有 data ) 和无实例 (没有 this 上下文)。他们用一个简单的 render 函数返回虚拟节点使他们更容易渲染。

参考:<br/>
https://cn.vuejs.org/v2/api/?#functional
`,
"vue.2.options.ComponentOptions.comments": `
当设为 true 时，将会保留且渲染模板中的 HTML 注释。默认行为是舍弃它们。

参考:<br/>
https://cn.vuejs.org/v2/api/?#comments
`,
"vue.2.options.ComponentOptions.inheritAttrs": `
默认情况下父作用域的不被认作 props 的特性绑定 (attribute bindings) 将会“回退”且作为普通的 HTML 特性应用在子组件的根元素上。当撰写包裹一个目标元素或另一个组件的组件时，这可能不会总是符合预期行为。通过设置 inheritAttrs 到 false，这些默认行为将会被去掉。而通过 (同样是 2.4 新增的) 实例属性 $attrs 可以让这些特性生效，且可以通过 v-bind 显性的绑定到非根元素上。

参考:<br/>
https://cn.vuejs.org/v2/api/?#inheritAttrs
`,
"vue.2.VueConfiguration.slient": `
默认值是false

参考:<br/>
https://cn.vuejs.org/v2/api/#silent

//取消 Vue 所有的日志与警告。
Vue.config.silent = true
`,
"vue.2.VueConfiguration.optionMergeStrategies": `
自定义合并策略的选项。合并策略选项分别接收在父实例和子实例上定义的该选项的值作为第一个和第二个参数，Vue 实例上下文被作为第三个参数传入。

参考:<br/>
https://cn.vuejs.org/v2/api/#optionMergeStrategies

<pre>
Vue.config.optionMergeStrategies._my_option = function (parent, child, vm) {
  return child + 1
}

const Profile = Vue.extend({
  _my_option: 1
})

// Profile.options._my_option = 2
</pre>
`,
"vue.2.VueConfiguration.devtools": `
配置是否允许 vue-devtools 检查代码。开发版本默认为 true，生产版本默认为 false。生产版本设为 true 可以启用检查。

参考:<br/>
https://cn.vuejs.org/v2/api/#devtools

<pre>
// 务必在加载 Vue 之后，立即同步设置以下内容
Vue.config.devtools = true
</pre> 
`,
"vue.2.VueConfiguration.productionTip": `
<b>2.2.0 新增。</b>设置为 false 以阻止 vue 在启动时生成生产提示。

参考:<br/>
https://cn.vuejs.org/v2/api/#productionTip
`,
"vue.2.VueConfiguration.performance": `
<b>2.2.0 新增。</b>设置为 true 以在浏览器开发工具的性能/时间线面板中启用对组件初始化、编译、渲染和打补丁的性能追踪。只适用于开发模式和支持 performance.mark API 的浏览器上。

参考:<br/>
https://cn.vuejs.org/v2/api/#performance
`,
"vue.2.VueConfiguration.errorHandler": `
指定组件的渲染和观察期间未捕获错误的处理函数。这个处理函数被调用时，可获取错误信息和 Vue 实例。

参考:<br/>
https://cn.vuejs.org/v2/api/#errorHandler

<pre>
Vue.config.errorHandler = function (err, vm, info) {
  // handle error
  // \`info\` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
  // 只在 2.2.0+ 可用
}
</pre>
`,
"ue.2.VueConfiguration.warnHandler": `
<b>2.4.0 新增</b>。为 Vue 的运行时警告赋予一个自定义处理函数。注意这只会在开发者环境下生效，在生产环境下它会被忽略。

<pre>
Vue.config.warnHandler = function (msg, vm, trace) {
  // \`trace\` 是组件的继承关系追踪
}
</pre>
`,
"vue.2.VueConfiguration.ignoredElements": `
须使 Vue 忽略在 Vue 之外的自定义元素 (e.g. 使用了 Web Components APIs)。否则，它会假设你忘记注册全局组件或者拼错了组件名称，从而抛出一个关于 Unknown custom element 的警告。

参考:<br/>
https://cn.vuejs.org/v2/api/#ignoredElements

<pre>
Vue.config.ignoredElements = [
  'my-custom-web-component',
  'another-web-component',
  // 用一个 \`RegExp\` 忽略所有“ion-”开头的元素
  // 仅在 2.5+ 支持
  /^ion-/
]
</pre>
`,
"vue.2.VueConfiguration.keyCodes": `
给 v-on 自定义键位别名。

参考:<br/>
https://cn.vuejs.org/v2/api/?#keyCodes

<pre>
Vue.config.keyCodes = {
  v: 86,
  f1: 112,
  // camelCase 不可用
  mediaPlayPause: 179,
  // 取而代之的是 kebab-case 且用双引号括起来
  "media-play-pause": 179,
  up: [38, 87]
}
</pre>
<pre>
&lt;input type="text" @keyup.media-play-pause="method"&gt;
</pre>    
`,
"vue.2.Vue.mount": `
如果 Vue 实例在实例化时没有收到 el 选项，则它处于“未挂载”状态，没有关联的 DOM 元素。可以使用 vm.$mount() 手动地挂载一个未挂载的实例。

参考:<br/>
https://cn.vuejs.org/v2/api/#vm-mount

<pre>
var MyComponent = Vue.extend({
  template: '<div>Hello!</div>'
})

// 创建并挂载到 #app (会替换 #app)
new MyComponent().$mount('#app')

// 同上
new MyComponent({ el: '#app' })

// 或者，在文档之外渲染并且随后挂载
var component = new MyComponent().$mount()
document.getElementById('app').appendChild(component.$el)
</pre>    
`,
"vue.2.Vue.forceUpdate": `
迫使 Vue 实例重新渲染。注意它仅仅影响实例本身和插入插槽内容的子组件，而不是所有子组件。

参考:<br/>
https://cn.vuejs.org/v2/api/#vm-forceUpdate
`,
"vue.2.Vue.destroy": `
完全销毁一个实例。清理它与其它实例的连接，解绑它的全部指令及事件监听器。

参考:<br/>
https://cn.vuejs.org/v2/api/#vm-destroy

在大多数场景中你不应该调用这个方法。最好使用 v-if 和 v-for 指令以数据驱动的方式控制子组件的生命周期。
`,
"vue.2.Vue.set": `
这是全局 Vue.set 的别名。

参考:<br/>
https://cn.vuejs.org/v2/api/#vm-set
`,
"vue.2.Vue.delete": `
这是全局 Vue.delete 的别名。

参考:<br/>
https://cn.vuejs.org/v2/api/#vm-delete
`,
"vue.2.Vue.watch": `
观察 Vue 实例变化的一个表达式或计算属性函数。回调函数得到的参数为新值和旧值。表达式只接受监督的键路径。对于更复杂的表达式，用一个函数取代。

参考:<br/>
https://cn.vuejs.org/v2/api/#vm-watch

<pre>
// 键路径
vm.$watch('a.b.c', function (newVal, oldVal) {
  // 做点什么
})

// 函数
vm.$watch(
  function () {
    return this.a + this.b
  },
  function (newVal, oldVal) {
    // 做点什么
  }
)
</pre>
`,
"vue.2.Vue.on": `
监听当前实例上的自定义事件。事件可以由vm.$emit触发。回调函数会接收所有传入事件触发函数的额外参数。

参考:<br/>
https://cn.vuejs.org/v2/api/#vm-on

<pre>
vm.$on('test', function (msg) {
  console.log(msg)
})
vm.$emit('test', 'hi')
// => "hi"
</pre>
`,
"vue.2.Vue.once": `
监听一个自定义事件，但是只触发一次，在第一次触发之后移除监听器。

参考:<br/>
https://cn.vuejs.org/v2/api/#vm-once
`,
"vue.2.Vue.off": `
移除自定义事件监听器。

参考:<br/>
https://cn.vuejs.org/v2/api/#vm-off
`,
"vue.2.Vue.emit": `
触发当前实例上的事件。附加参数都会传给监听器回调。

参考:<br/>
https://cn.vuejs.org/v2/api/#vm-emit

<pre>
Vue.component('welcome-button', {
  template: \`
    <button v-on:click="$emit('welcome')">
      Click me to be welcomed
    </button>
  \`
})
</pre>
<pre>
&lt;div id="emit-example-simple"&gt;
  &lt;welcome-button v-on:welcome="sayHi"&gt;&lt;/welcome-button&gt;
&lt;/div&gt;
</pre>
<pre>
new Vue({
  el: '#emit-example-simple',
  methods: {
    sayHi: function () {
      alert('Hi!')
    }
  }
})
</pre>    
`,
"vue.2.Vue.nextTick": `
将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。它跟全局方法 Vue.nextTick 一样，不同的是回调的 this 自动绑定到调用它的实例上。

参考:<br/>
https://cn.vuejs.org/v2/api/#vm-nextTick

<pre>
new Vue({
  // ...
  methods: {
    // ...
    example: function () {
      // 修改数据
      this.message = 'changed'
      // DOM 还没有更新
      this.$nextTick(function () {
        // DOM 现在更新了
        // \`this\` 绑定到当前实例
        this.doSomethingElse()
      })
    }
  }
})
</pre>
`,
"vue.2.VueConstructor.extend": `
使用基础 Vue 构造器，创建一个“子类”。参数是一个包含组件选项的对象。
data 选项是特例，需要注意 - 在 Vue.extend() 中它必须是函数

参考:<br/>
https://cn.vuejs.org/v2/api/#Vue-extend

<pre>
&lt;div id="mount-point"&gt;&lt;/div&gt;
</pre>
<pre>
// 创建构造器
var Profile = Vue.extend({
  template: '&lt;p&gt;{{firstName}} {{lastName}} aka {{alias}}&lt;/p&gt;',
  data: function () {
    return {
      firstName: 'Walter',
      lastName: 'White',
      alias: 'Heisenberg'
    }
  }
})
// 创建 Profile 实例，并挂载到一个元素上。
new Profile().$mount('#mount-point')
</pre>
<pre>
结果如下：

&lt;p&gt;Walter White aka Heisenberg&lt;/p&gt;
</pre>
`,
"vue.2.VueConstructor.nextTick": `
在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。

参考:<br/>
https://cn.vuejs.org/v2/api/#Vue-nextTick
    
<pre>
// 修改数据
vm.msg = 'Hello'
// DOM 还没有更新
Vue.nextTick(function () {
  // DOM 更新了
})

// 作为一个 Promise 使用 (2.1.0 起新增，详见接下来的提示)
Vue.nextTick()
  .then(function () {
    // DOM 更新了
})
</pre>
`,
"vue.2.VueConstructor.set": `
向响应式对象中添加一个属性，并确保这个新属性同样是响应式的，且触发视图更新。它必须用于向响应式对象上添加新属性，因为 Vue 无法探测普通的新增属性 (比如 this.myObject.newProperty = 'hi')

参考:<br/>
https://cn.vuejs.org/v2/api/#Vue-set

注意对象不能是 Vue 实例，或者 Vue 实例的根数据对象。
`,
"vue.2.VueConstructor.delete": `
删除对象的属性。如果对象是响应式的，确保删除能触发更新视图。这个方法主要用于避开 Vue 不能检测到属性被删除的限制，但是你应该很少会使用它。

参考:<br/>
https://cn.vuejs.org/v2/api/#Vue-delete

注意对象不能是 Vue 实例，或者 Vue 实例的根数据对象。
`,
"vue.2.VueConstructor.directive": `
注册或获取全局指令。

参考:<br/>
https://cn.vuejs.org/v2/api/#Vue-directive
`,
"vue.2.VueConstructor.filter": `
注册或获取全局过滤器。

参考:<br/>
https://cn.vuejs.org/v2/api/#Vue-filter

<pre>
// 注册
Vue.filter('my-filter', function (value) {
  // 返回处理后的值
})

// getter，返回已注册的过滤器
var myFilter = Vue.filter('my-filter')
</pre>
`,
"vue.2.VueConstructor.component": `
注册或获取全局组件。注册还会自动使用给定的id设置组件的名称。

参考:<br/>
https://cn.vuejs.org/v2/api/#Vue-component

<pre>
// 注册组件，传入一个扩展过的构造器
Vue.component('my-component', Vue.extend({ /* ... */ }))

// 注册组件，传入一个选项对象 (自动调用 Vue.extend)
Vue.component('my-component', { /* ... */ })

// 获取注册的组件 (始终返回构造器)
var MyComponent = Vue.component('my-component')
</pre>
`,
"vue.2.VueConstructor.use": `
安装 Vue.js 插件。如果插件是一个对象，必须提供 install 方法。如果插件是一个函数，它会被作为 install 方法。install 方法调用时，会将 Vue 作为参数传入。
当 install 方法被同一个插件多次调用，插件将只会被安装一次。

参考:<br/>
https://cn.vuejs.org/v2/api/#Vue-use
`,
"vue.2.VueConstructor.mixin": `
全局注册一个混入，影响注册之后所有创建的每个 Vue 实例。插件作者可以使用混入，向组件注入自定义的行为。不推荐在应用代码中使用。

参考:<br/>
https://cn.vuejs.org/v2/api/#Vue-mixin
`,
"vue.2.VueConstructor.compile": `
在 render 函数中编译模板字符串。只在独立构建时有效

参考:<br/>
https://cn.vuejs.org/v2/api/#Vue-compile

<pre>
var res = Vue.compile('<div><span>{{ msg }}</span></div>')

new Vue({
  data: {
    msg: 'hello'
  },
  render: res.render,
  staticRenderFns: res.staticRenderFns
})
</pre>
`,
"vue.2.VueConstructor.config": `
Vue.config 是一个对象，包含 Vue 的全局配置。

参考:<br/>
https://cn.vuejs.org/v2/api/#全局配置
`,
"vue.2.VueConstructor.version": `
提供字符串形式的 Vue 安装版本号。这对社区的插件和组件来说非常有用，你可以根据不同的版本号采取不同的策略。

参考:<br/>
https://cn.vuejs.org/v2/api/#Vue-version
`,
"vue.2.Vue.el": ``,
"vue.2.Vue.options": `
用于当前 Vue 实例的初始化选项。

参考:<br/>
https://cn.vuejs.org/v2/api/#vm-options

<pre>
new Vue({
  customOption: 'foo',
  created: function () {
    console.log(this.$options.customOption) // => 'foo'
  }
})
</pre>
`,
"vue.2.Vue.parent": `
父实例，如果当前实例有的话。

参考:<br/>
https://cn.vuejs.org/v2/api/#vm-parent   
`,
"vue.2.Vue.root": `
当前组件树的根 Vue 实例。如果当前实例没有父实例，此实例将会是其自己。

参考:<br/>
https://cn.vuejs.org/v2/api/#vm-root
`,
"vue.2.Vue.children": `
当前实例的直接子组件。需要注意 $children 并不保证顺序，也不是响应式的。如果你发现自己正在尝试使用 $children 来进行数据绑定，考虑使用一个数组配合 v-for 来生成子组件，并且使用 Array 作为真正的来源。

参考:<br/>
https://cn.vuejs.org/v2/api/#vm-children
`,
"vue.2.Vue.refs": `
一个对象，持有注册过 ref 特性 的所有 DOM 元素和组件实例。

参考:<br/>
https://cn.vuejs.org/v2/api/#vm-refs
`,
"vue.2.Vue.slots": `
用来访问被插槽分发的内容。每个具名插槽 有其相应的属性 (例如：slot="foo" 中的内容将会在 vm.$slots.foo 中被找到)。default 属性包括了所有没有被包含在具名插槽中的节点。

参考:<br/>
https://cn.vuejs.org/v2/api/#vm-slots

<pre>
&lt;blog-post&gt;
  &lt;h1 slot="header"&gt;
    About Me
  &lt;/h1&gt;

  &lt;p&gt;Here's some page content, which will be included in vm.$slots.default, because it's not inside a named slot.&lt;/p&gt;

  &lt;p slot="footer"&gt;
    Copyright 2016 Evan You
  &lt;/p&gt;

  &lt;p&gt;If I have some content down here, it will also be included in vm.$slots.default.&lt;/p&gt;.
&lt;/blog-post&gt;
</pre>
<pre>
Vue.component('blog-post', {
  render: function (createElement) {
    var header = this.$slots.header
    var body   = this.$slots.default
    var footer = this.$slots.footer
    return createElement('div', [
      createElement('header', header),
      createElement('main', body),
      createElement('footer', footer)
    ])
  }
})
</pre>    
`,
"vue.2.Vue.scopedSlots": `
用来访问作用域插槽。对于包括 默认 slot 在内的每一个插槽，该对象都包含一个返回相应 VNode 的函数。

参考:<br/>
https://cn.vuejs.org/v2/api/#vm-scopedSlots
`,
"vue.2.Vue.isServer": `
当前 Vue 实例是否运行于服务器。

参考:<br/>
https://cn.vuejs.org/v2/api/#vm-isServer
`,
"vue.2.Vue.data": `
Vue 实例观察的数据对象。Vue 实例代理了对其 data 对象属性的访问。

参考:<br/>
https://cn.vuejs.org/v2/api/#vm-data
`,
"vue.2.Vue.props": `
当前组件接收到的 props 对象。Vue 实例代理了对其 props 对象属性的访问。

参考:<br/>
https://cn.vuejs.org/v2/api/#vm-props
`,
"vue.2.Vue.attrs": `
包含了父作用域中不作为 prop 被识别 (且获取) 的特性绑定 (class 和 style 除外)。当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定 (class 和 style 除外)，并且可以通过 v-bind="$attrs" 传入内部组件——在创建高级别的组件时非常有用。

参考:<br/>
https://cn.vuejs.org/v2/api/#vm-attrs
`,
"vue.2.Vue.listeners": `
包含了父作用域中的 (不含 .native 修饰器的) v-on 事件监听器。它可以通过 v-on="$listeners" 传入内部组件——在创建更高层次的组件时非常有用。

参考:<br/>
https://cn.vuejs.org/v2/api/#vm-listeners
`
};

module.exports = content;