let content = {
"vue.3.AppConfig.errorHandler": `
指定一个处理函数，来处理组件渲染方法执行期间以及侦听器抛出的未捕获错误。这个处理函数被调用时，可获取错误信息和应用实例。

参考:<br/>
https://v3.cn.vuejs.org/api/application-config.html#errorhandler

<pre>
app.config.errorHandler = (err, vm, info) => {
// 处理错误
// info 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
}
</pre>
`,
"vue.3.AppConfig.warnHandler": `
为 Vue 的运行时警告指定一个自定义处理函数。注意这只会在开发环境下生效，在生产环境下它会被忽略。

参考:<br/>
https://v3.cn.vuejs.org/api/application-config.html#warnhandler

<pre>
app.config.warnHandler = function(msg, vm, trace) {
// trace 是组件的继承关系追踪
}
</pre>
`,
"vue.3.AppConfig.globalProperties": `
添加可以在应用程序内的任何组件实例中访问的全局 property。属性名冲突时，组件的 property 将具有优先权。

参考:<br/>
https://v3.cn.vuejs.org/api/application-config.html#globalproperties

<pre>
app.config.globalProperties.foo = 'bar'

app.component('child-component', {
  mounted() {
    console.log(this.foo) // 'bar'
  }
})
</pre>  
`,
"vue.3.AppConfig.isCustomElement": `
指定一个方法，用来识别在 Vue 之外定义的自定义元素（例如，使用 Web Components API）。如果组件符合此条件，则不需要本地或全局注册，并且 Vue 不会抛出关于 Unknown custom element 的警告。

参考:<br/>
https://v3.cn.vuejs.org/api/application-config.html#iscustomelement

<pre>
// 任何以“ion-”开头的元素都将被识别为自定义元素
app.config.isCustomElement = tag => tag.startsWith('ion-')
</pre>
`,
"vue.3.AppConfig.optionMergeStrategies": `
为自定义选项定义合并策略。
合并策略选项分别接收在父实例和子实例上定义的该选项的值作为第一个和第二个参数，引用上下文实例被作为第三个参数传入。

参考:<br/>
https://v3.cn.vuejs.org/api/application-config.html#optionmergestrategies  

<pre>
const app = Vue.createApp({
  mounted() {
    console.log(this.$options.hello)
  }
})

app.config.optionMergeStrategies.hello = (parent, child, vm) => {
  return \`Hello, \${child}\`
}

app.mixin({
  hello: 'Vue'
})

// 'Hello, Vue
</pre>
`,
"vue.3.AppConfig.performance": `
设置为 true 以在浏览器开发工具的 performance/timeline 面板中启用对组件初始化、编译、渲染和更新的性能追踪。只适用于开发模式和支持 performance.mark API 的浏览器。

参考:<br/>
https://v3.cn.vuejs.org/api/application-config.html#performance
`,
"vue.3.reactivity.reactive": `
返回对象的响应式副本

参考:<br/>
https://v3.cn.vuejs.org/api/basic-reactivity.html#reactive
`,
"vue.3.reactivity.readonly": `
获取一个对象 (响应式或纯对象) 或 ref 并返回原始代理的只读代理。只读代理是深层的：访问的任何嵌套 property 也是只读的。

参考:<br/>
https://v3.cn.vuejs.org/api/basic-reactivity.html#readonly

<pre>
const original = reactive({ count: 0 })

const copy = readonly(original)

watchEffect(() => {
  // 适用于响应性追踪
  console.log(copy.count)
})

// 变更original 会触发侦听器依赖副本
original.count++

// 变更副本将失败并导致警告
copy.count++ // 警告!
</pre>
`,
"vue.3.reactivity.isProxy": `
检查对象是 reactive 还是 readonly创建的代理。

参考:<br/>
https://v3.cn.vuejs.org/api/basic-reactivity.html#isproxy
`,
"vue.3.reactivity.isReactive": `
检查对象是否是 reactive创建的响应式 proxy。

参考:<br/>
https://v3.cn.vuejs.org/api/basic-reactivity.html#isreactive
`,
"vue.3.reactivity.isReadonly": `
检查对象是否是由readonly创建的只读代理。

参考:<br/>
https://v3.cn.vuejs.org/api/basic-reactivity.html#isreadonly
`,
"vue.3.reactivity.toRaw": `
返回 reactive 或 readonly 代理的原始对象。

参考:<br/>
https://v3.cn.vuejs.org/api/basic-reactivity.html#toraw
`,
"vue.3.reactivity.markRaw": `
标记一个对象，使其永远不会转换为代理。返回对象本身。

参考:<br/>
https://v3.cn.vuejs.org/api/basic-reactivity.html#markraw
`,
"vue.3.reactivity.shallowReactive": `
创建一个响应式代理，该代理跟踪其自身 property 的响应性，但不执行嵌套对象的深度响应式转换 (暴露原始值)。

参考:<br/>
https://v3.cn.vuejs.org/api/basic-reactivity.html#shallowreactive
`,
"vue.3.reactivity.shallowReadonly": `
创建一个代理，使其自身的 property 为只读，但不执行嵌套对象的深度只读转换 (暴露原始值)。

参考:<br/>
https://v3.cn.vuejs.org/api/basic-reactivity.html#shallowreadonly
`,
"vue.3.reactivity.ref": `
接受一个内部值并返回一个响应式且可变的 ref 对象。ref 对象具有指向内部值的单个 property .value。

参考:<br/>
https://v3.cn.vuejs.org/api/refs-api.html#ref
`,
"vue.3.reactivity.unref": `
如果参数为 ref，则返回内部值，否则返回参数本身。这是 val = isRef(val) ? val.value : val。

参考:<br/>
https://v3.cn.vuejs.org/api/refs-api.html#unref
`,
"vue.3.reactivity.toRef": `
可以用来为源响应式对象上的 property 性创建一个 ref。然后可以将 ref 传递出去，从而保持对其源 property 的响应式连接。

参考:<br/>
https://v3.cn.vuejs.org/api/refs-api.html#toref
`,
"vue.3.reactivity.toRefs": `
将响应式对象转换为普通对象，其中结果对象的每个 property 都是指向原始对象相应 property 的ref。

参考:<br/>
https://v3.cn.vuejs.org/api/refs-api.html#torefs
`,
"vue.3.reactivity.isRef": `
检查对象是否是 ref 对象。

参考:<br/>
https://v3.cn.vuejs.org/api/refs-api.html#isref
`,
"vue.3.reactivity.customRef": `
创建一个自定义的 ref，并对其依赖项跟踪和更新触发进行显式控制。它需要一个工厂函数，该函数接收 track 和 trigger 函数作为参数，并应返回一个带有 get 和 set 的对象。

参考:<br/>
https://v3.cn.vuejs.org/api/refs-api.html#customref
`,
"vue.3.reactivity.shallowRef": `
创建一个 ref，它跟踪自己的 .value 更改，但不会使其值成为响应式的。

参考:<br/>
https://v3.cn.vuejs.org/api/refs-api.html#shallowref
`,
"vue.3.reactivity.triggerRef": `
手动执行与 shallowRef](#shallowref) 关联的任何效果。

参考:<br/>
https://v3.cn.vuejs.org/api/refs-api.html#triggerref

<pre>
const shallow = shallowRef({
  greet: 'Hello, world'
})

// 第一次运行时记录一次 "Hello, world"
watchEffect(() => {
  console.log(shallow.value.greet)
})

// 这不会触发作用，因为 ref 很浅层
shallow.value.greet = 'Hello, universe'

// 记录 "Hello, universe"
triggerRef(shallow)
</pre>
`,
"vue.3.reactivity.computed": `
使用 getter 函数，并为从 getter 返回的值返回一个不变的响应式 ref 对象。

参考:<br/>
https://v3.cn.vuejs.org/api/computed-watch-api.html#computed

<pre>
const shallow = shallowRef({
  greet: 'Hello, world'
})

// 第一次运行时记录一次 "Hello, world"
watchEffect(() => {
  console.log(shallow.value.greet)
})

// 这不会触发作用，因为 ref 很浅层
shallow.value.greet = 'Hello, universe'

// 记录 "Hello, universe"
triggerRef(shallow)
</pre>
`,
"vue.3.core.watchEffect": `
在响应式地跟踪其依赖项时立即运行一个函数，并在更改依赖项时重新运行它。

参考:<br/>
https://v3.cn.vuejs.org/api/computed-watch-api.html#watcheffect

<pre>
const count = ref(0)

watchEffect(() => console.log(count.value))
// -> logs 0

setTimeout(() => {
  count.value++
  // -> logs 1
}, 100)
</pre>
`,
"vue.3.core.watch": `
watch API 与选项式 API this.$watch (以及相应的 watch 选项) 完全等效。watch 需要侦听特定的 data 源，并在单独的回调函数中副作用。默认情况下，它也是惰性的——即，回调是仅在侦听源发生更改时调用。

参考:<br/>
https://v3.cn.vuejs.org/api/computed-watch-api.html#watch
`,
"vue.3.core.onBeforeMount": `
在挂载开始之前被调用：相关的 render 函数首次被调用。该钩子在服务器端渲染期间不被调用。

参考:<br/>
https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#beforemount
`,
"vue.3.core.onActivated": `
keep-alive 组件激活时调用。

参考:<br/>
https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#activated

该钩子在服务器端渲染期间不被调用。
`,
"vue.3.core.onDeactivated": `
keep-alive 组件停用时调用。

参考:<br/>
https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#deactivated

该钩子在服务器端渲染期间不被调用。
`,
"vue.3.core.onMounted": `
实例被挂载后调用，这时 Vue.createApp({}).mount() 被新创建的 vm.$el 替换了。如果根实例挂载到了一个文档内的元素上，当 mounted 被调用时 vm.$el 也在文档内。

参考:<br/>
https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#mounted

该钩子在服务器端渲染期间不被调用。
注意mounted不会承诺所有的子组件也都一起被挂载。
`,
"vue.3.core.onBeforeUpdate": `
数据更新时调用，发生在虚拟 DOM 打补丁之前。这里适合在更新之前访问现有的 DOM，比如手动移除已添加的事件监听器。

参考:<br/>
https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#beforeupdate

该钩子在服务器端渲染期间不被调用，因为只有初次渲染会在服务端进行。
`,
"vue.3.core.onUpdated": `
由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。

参考:<br/>
https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#updated

该钩子在服务器端渲染期间不被调用。
`,
"vue.3.core.onBeforeUnmount": `
在卸载组件实例之前调用。在这个阶段，实例仍然是完全正常的。

参考:<br/>
https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#beforeunmount

钩子在服务器端渲染期间不被调用。
`,
"vue.3.core.onUnmounted": `
卸载组件实例后调用。调用此钩子时，组件实例的所有指令都被解除绑定，所有事件侦听器都被移除，所有子组件实例被卸载。

参考:<br/>
https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#unmounted

该钩子在服务器端渲染期间不被调用。
`,
"vue.3.core.onErrorCaptured": `
当捕获一个来自子孙组件的错误时被调用。此钩子会收到三个参数：错误对象、发生错误的组件实例以及一个包含错误来源信息的字符串。此钩子可以返回 false 以阻止该错误继续向上传播。

参考:<br/>
https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#errorcaptured
`,
"vue.3.core.onRenderTracked": `
跟踪虚拟 DOM 重新渲染时调用。钩子接收 debugger event 作为参数。此事件告诉你哪个操作跟踪了组件以及该操作的目标对象和键。

参考:<br/>
https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#rendertracked
`,
"vue.3.core.onRenderTriggered": `
当虚拟 DOM 重新渲染为 triggered.Similarly 为renderTracked，接收 debugger event 作为参数。此事件告诉你是什么操作触发了重新渲染，以及该操作的目标对象和键。

参考:<br/>
https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#rendertriggered
`,
"vue.3.core.App.component": `
注册或检索全局组件。注册还会使用给定的 name 参数自动设置组件的 name。

参考:<br/>
https://v3.cn.vuejs.org/api/application-api.html#component
`,
"vue.3.core.App.directive": `
注册或检索全局指令。

参考:<br/>
https://v3.cn.vuejs.org/api/application-api.html#directive
`,
"vue.3.core.App.mixin": `
在整个应用范围内应用混入。一旦注册，它们就可以在当前的应用中任何组件模板内使用它。插件作者可以使用此方法将自定义行为注入组件。不建议在应用代码中使用。

参考:<br/>
https://v3.cn.vuejs.org/api/application-api.html#mixin
`,
"vue.3.core.App.mount": `
将应用实例的根组件挂载在提供的 DOM 元素上。

参考:<br/>
https://v3.cn.vuejs.org/api/application-api.html#mount
`,
"vue.3.core.App.provide": `
设置一个可以被注入到应用范围内所有组件中的值。组件应该使用 inject 来接收提供的值。
从 provide/inject 的角度来看，可以将应用程序视为根级别的祖先，而根组件是其唯一的子级。

参考:<br/>
https://v3.cn.vuejs.org/api/application-api.html#provide
`,
"vue.3.core.App.unmount": `
在提供的 DOM 元素上卸载应用实例的根组件。

参考:<br/>
https://v3.cn.vuejs.org/api/application-api.html#unmount
`,
"vue.3.core.App.use": `
安装 Vue.js 插件。如果插件是一个对象，它必须暴露一个 install 方法。如果它本身是一个函数，它将被视为安装方法。
该安装方法将以应用实例作为第一个参数被调用。传给 use 的其他 options 参数将作为后续参数传入该安装方法。
当在同一个插件上多次调用此方法时，该插件将仅安装一次。

参考:<br/>
https://v3.cn.vuejs.org/api/application-api.html#use
`,
"vue.3.dom.createApp": `
返回一个提供应用上下文的应用实例。应用实例挂载的整个组件树共享同一个上下文。

参考:<br/>
https://v3.cn.vuejs.org/api/global-api.html#createapp
`,
"vue.3.core.h": `
返回一个“虚拟节点”，通常缩写为 VNode：一个普通对象，其中包含向 Vue 描述它应在页面上渲染哪种节点的信息，包括所有子节点的描述。它的目的是用于手动编写的渲染函数

参考:<br/>
https://v3.cn.vuejs.org/api/global-api.html#h

<pre>
render() {
  return Vue.h('h1', {}, 'Some title')
}
</pre>
`,
"vue.3.core.defineComponent": `
从实现上看，defineComponent 只返回传递给它的对象。但是，就类型而言，返回的值有一个合成类型的构造函数，用于手动渲染函数、TSX 和 IDE 工具支持。

参考:<br/>
https://v3.cn.vuejs.org/api/global-api.html#definecomponent
`,
"vue.3.core.defineProps": `
为了声明 props 和 emits 选项且具备完整的类型推断，可以使用 defineProps 和 defineEmits API，它们在 <script setup> 中都是自动可用的

参考:<br/>
https://v3.cn.vuejs.org/api/sfc-script-setup.html
`,
"vue.3.core.defineAsyncComponent": `
创建一个只有在需要时才会加载的异步组件。

参考:<br/>
https://v3.cn.vuejs.org/api/global-api.html#defineasynccomponent`,
"vue.3.core.resolveComponent": `
resolveComponent 只能在 render 或 setup 函数中使用。
如果在当前应用实例中可用，则允许按名称解析 component。
返回一个 Component。如果没有找到，则返回 undefined。

参考:<br/>
https://v3.cn.vuejs.org/api/global-api.html#resolvecomponent

<pre>
import { resolveComponent } from 'vue'
render() {
  const MyComponent = resolveComponent('MyComponent')
}
</pre>
`,
"vue.3.core.resolveDynamicComponent": `
resolveDynamicComponent 只能在 render 或 setup 函数中使用。
允许使用与 <component :is=""> 相同的机制来解析一个 component。
返回已解析的 Component 或新创建的 VNode，其中组件名称作为节点标签。如果找不到 Component，将发出警告。

参考:<br/>
https://v3.cn.vuejs.org/api/global-api.html#resolvedynamiccomponent

<pre>
import { resolveDynamicComponent } from 'vue'
render () {
  const MyComponent = resolveDynamicComponent('MyComponent')
}
</pre>
`,
"vue.3.core.resolveDirective": `
resolveDirective 只能在 render 或 setup 函数中使用。
如果在当前应用实例中可用，则允许通过其名称解析一个 directive。
返回一个 Directive。如果没有找到，则返回 undefined。

参考:<br/>
https://v3.cn.vuejs.org/api/global-api.html#resolvedirective

<pre>
const app = Vue.createApp({})
app.directive('highlight', {})

import { resolveDirective } from 'vue'
render () {
  const highlightDirective = resolveDirective('highlight')
}
</pre>
`,
"vue.3.dom.render": `
字符串模板的另一种选择，允许你充分利用 JavaScript 的编程功能。

参考:<br/>
https://v3.cn.vuejs.org/api/options-dom.html#render

render 函数的优先级高于从挂载元素 template 选项或内置 DOM 提取出的 HTML 模板编译渲染函数。
`,
"vue.3.core.withDirectives": `
withDirectives 只能在 render 或 setup 函数中使用。
允许将指令应用于 VNode。返回一个包含应用指令的 VNode。

参考:<br/>
https://v3.cn.vuejs.org/api/global-api.html#withdirectives

<pre>
const app = Vue.createApp({})
app.directive('highlight', {})

import { resolveDirective } from 'vue'
render () {
  const highlightDirective = resolveDirective('highlight')
}
</pre>
`,
"vue.3.core.createRenderer": `
createRenderer 函数接受两个泛型参数： HostNode 和 HostElement，对应于宿主环境中的 Node 和 Element 类型。
例如，对于 runtime-dom，HostNode 将是 DOM Node 接口，HostElement 将是 DOM Element 接口。

参考:<br/>
https://v3.cn.vuejs.org/api/global-api.html#createrenderer

<pre>
import { createRenderer } from 'vue'
const { render, createApp } = createRenderer<Node, Element>({
  patchProp,
  ...nodeOps
})
</pre>
`,
"vue.3.core.nextTick": `
将回调推迟到下一个 DOM 更新周期之后执行。在更改了一些数据以等待 DOM 更新后立即使用它。

参考:<br/>
https://v3.cn.vuejs.org/api/global-api.html#nexttick

<pre>
import { createApp, nextTick } from 'vue'

const app = createApp({
  setup() {
    const message = ref('Hello!')
    const changeMessage = async newMessage => {
      message.value = newMessage
      await nextTick()
      console.log('Now DOM is updated')
    }
  }
})
</pre>
`,
"vue.3.core.ComponentPublicInstance.watch": `
侦听组件实例上的响应式 property 或函数计算结果的变化。回调函数得到的参数为新值和旧值。我们只能将顶层的 data、prop 或 computed property 名作为字符串传递。对于更复杂的表达式，用一个函数取代。

参考:<br/>
https://v3.cn.vuejs.org/api/instance-methods.html#watch

<pre>		
const app = Vue.createApp({
  data() {
    return {
      a: 1,
      b: 2,
      c: {
        d: 3,
        e: 4
      }
    }
  },
  created() {
    // 顶层property 名
    this.$watch('a', (newVal, oldVal) => {
    // 做点什么
  })

  // 用于监视单个嵌套property 的函数
  this.$watch(
    () => this.c.d,
    (newVal, oldVal) => {
      // 做点什么
    }
  )

  // 用于监视复杂表达式的函数
  this.$watch(
    // 表达式 \`this.a + this.b\` 每次得出一个不同的结果时
    // 处理函数都会被调用。
    // 这就像监听一个未被定义的计算属性
    () => this.a + this.b,
      (newVal, oldVal) => {
        // 做点什么
      }
    )
  }
})
</pre>
`,
"vue.3.core.ComponentPublicInstance.emit": `
触发当前实例上的事件。附加参数都会传给监听器回调。

参考:<br/>
https://v3.cn.vuejs.org/api/instance-methods.html#emit
`,
"vue.3.core.ComponentPublicInstance.forceUpdate": `
迫使 Vue 实例重新渲染。注意它仅仅影响实例本身和插入插槽内容的子组件，而不是所有子组件。

参考:<br/>
https://v3.cn.vuejs.org/api/instance-methods.html#forceupdate
`,
"vue.3.core.ComponentPublicInstance.nextTick": `
将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。它跟全局方法 nextTick 一样，不同的是回调的 this 自动绑定到调用它的实例上。

参考:<br/>
https://v3.cn.vuejs.org/api/instance-methods.html#nexttick

<pre>
Vue.createApp({
  // ...
  methods: {
  // ...
  example() {
    // modify data
    this.message = 'changed'
    // DOM is not updated yet
    this.$nextTick(function() {
      // DOM is now updated
      // \`this\` is bound to the current instance
      this.doSomethingElse()
    })
  }
  }
})
</pre>
`,
"vue.3.core.App.config": `
包含应用配置的对象。

参考:<br/>
https://v3.cn.vuejs.org/api/application-api.html#config

<pre>
import { createApp } from 'vue'
const app = createApp({})

app.config = {...}
</pre>
`,
"vue.3.core.ComponentPublicInstance.data": `
Vue 实例观察的数据对象。Vue 实例代理了对其 data 对象属性的访问。

参考:<br/>
https://v3.cn.vuejs.org/api/instance-properties.html#data
`,
"vue.3.core.ComponentPublicInstance.el": `
Vue 实例使用的根 DOM 元素。

参考:<br/>
https://v3.cn.vuejs.org/api/instance-properties.html#el
`,
"vue.3.core.ComponentPublicInstance.props": `
当前组件接收到的 props 对象。组件实例代理了对其 props 对象 property 的访问。

参考:<br/>
https://v3.cn.vuejs.org/api/instance-properties.html#props
`,
"vue.3.core.ComponentPublicInstance.options": `
用于当前 Vue 实例的初始化选项。

参考:<br/>
https://v3.cn.vuejs.org/api/instance-properties.html#options

<pre>
const app = Vue.createApp({
  customOption: 'foo',
  created() {
    console.log(this.$options.customOption) // => 'foo'
  }
})
</pre>
`,
"vue.3.core.ComponentPublicInstance.parent": `
父实例，如果当前实例有的话。

参考:<br/>
https://v3.cn.vuejs.org/api/instance-properties.html#parent
`,
"vue.3.core.ComponentPublicInstance.root": `
当前组件树的根 Vue 实例。如果当前实例没有父实例，此实例将会是其自己。

参考:<br/>
https://v3.cn.vuejs.org/api/instance-properties.html#root
`,
"vue.3.core.ComponentPublicInstance.slots": `
用来访问被插槽分发的内容。每个具名插槽 有其相应的属性 (例如：slot="foo" 中的内容将会在 vm.$slots.foo 中被找到)。default 属性包括了所有没有被包含在具名插槽中的节点。

参考:<br/>
https://v3.cn.vuejs.org/api/instance-properties.html#slots

<pre>
const app = Vue.createApp({})

app.component('blog-post', {
  render() {
    return Vue.h('div', [
      Vue.h('header', this.$slots.header()),
      Vue.h('main', this.$slots.default()),
      Vue.h('footer', this.$slots.footer())
  ])
  }
})
</pre>
`,
"vue.3.core.ComponentPublicInstance.refs": `
一个对象，持有注册过 ref 特性 的所有 DOM 元素和组件实例。

参考:<br/>
https://v3.cn.vuejs.org/api/instance-properties.html#refs
`,
"vue.3.core.ComponentPublicInstance.attrs": `
包含了父作用域中不作为 prop 被识别 (且获取) 的特性绑定 (class 和 style 除外)。当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定 (class 和 style 除外)，并且可以通过 v-bind="$attrs" 传入内部组件——在创建高级别的组件时非常有用。

参考:<br/>
https://v3.cn.vuejs.org/api/instance-properties.html#attrs
`,
"vue.3.core.ComponentInternalInstance.data": `
返回组件实例的 data 对象的函数。

参考:<br/>
https://v3.cn.vuejs.org/api/options-data.html#data-2

<pre>
// 直接创建一个实例
const data = { a: 1 }

// 这个对象将添加到组件实例中
const vm = Vue.createApp({
  data() {
    return data
  }
}).mount('#app')

console.log(vm.a) // => 1
</pre>
`,
"vue.3.core.ComponentInternalInstance.props": `
props 可以是数组或对象，用于接收来自父组件的数据。props 可以是简单的数组，或者使用对象作为替代，对象允许配置高级选项，如类型检测、自定义校验和设置默认值。

参考:<br/>
https://v3.cn.vuejs.org/api/options-data.html#props

<pre>
const app = Vue.createApp({})

// 简单语法
app.component('props-demo-simple', {
  props: ['size', 'myMessage']
})

// 对象语法，提供验证
app.component('props-demo-advanced', {
  props: {
    // 类型检查
    height: Number,
    // 类型检查 + 其他验证
    age: {
    type: Number,
      default: 0,
      required: true,
      validator: value => {
        return value >= 0
      }
    }
  }
})
</pre>
`,
"vue.3.LegacyOptions.computed": `
计算属性将被混入到 Vue 实例中。所有 getter 和 setter 的 this 上下文自动地绑定为 Vue 实例。

参考:<br/>
https://v3.cn.vuejs.org/api/options-data.html#computed

<pre>
const app = Vue.createApp({
  data() {
    return { a: 1 }
  },
  computed: {
    // 仅读取
    aDouble() {
      return this.a * 2
    },
    // 读取和设置
    aPlus: {
      get() {
        return this.a + 1
      },
      set(v) {
        this.a = v - 1
      }
    }
  }
})

const vm = app.mount('#app')
console.log(vm.aPlus) // => 2
vm.aPlus = 3
console.log(vm.a) // => 2
console.log(vm.aDouble) // => 4
</pre>
`,
"vue.3.LegacyOptions.methods": `
methods 将被混入到 Vue 实例中。可以直接通过 VM 实例访问这些方法，或者在指令表达式中使用。方法中的 this 自动绑定为 Vue 实例。

参考:<br/>
https://v3.cn.vuejs.org/api/options-data.html#methods

<pre>
const app = Vue.createApp({
  data() {
    return { a: 1 }
  },
  methods: {
    plus() {
      this.a++
    }
  }
})

const vm = app.mount('#app')

vm.plus()
console.log(vm.a) // => 2
</pre>
`,
"vue.3.LegacyOptions.watch": `
一个对象，键是需要观察的表达式，值是对应回调函数。值也可以是方法名，或者包含选项的对象。Vue 实例将会在实例化时调用 $watch()，遍历 watch 对象的每一个属性。

参考:<br/>
https://v3.cn.vuejs.org/api/options-data.html#watch

<pre>
const app = Vue.createApp({
data() {
  return {
    a: 1,
    b: 2,
    c: {
      d: 4
    },
    e: 'test',
    f: 5
  }
},
watch: {
  a(val, oldVal) {
    console.log(\`new: \${val}, old: \${oldVal}\`)
  },
  // 字符串方法名
  b: 'someMethod',
  // 该回调会在任何被侦听的对象的 property 改变时被调用，不论其被嵌套多深
  c: {
    handler(val, oldVal) {
      console.log('c changed')
    },
    deep: true
  },
  // 该回调将会在侦听开始之后被立即调用
  e: {
    handler(val, oldVal) {
      console.log('e changed')
    },
    immediate: true
  },
  // 你可以传入回调数组，它们会被逐一调用
  f: [
    'handle1',
    function handle2(val, oldVal) {
      console.log('handle2 triggered')
    },
    {
      handler: function handle3(val, oldVal) {
      console.log('handle3 triggered')
    }
    /* ... */
    }
  ]
},
methods: {
  someMethod() {
    console.log('b changed')
  },
  handle1() {
    console.log('handle 1 triggered')
  }
}
})

const vm = app.mount('#app')

vm.a = 3 // => new: 3, old: 1
</pre>

注意，不应该使用箭头函数来定义 watcher 函数 (例如 searchQuery: newValue => this.updateAutocomplete(newValue))。理由是箭头函数绑定了父级作用域的上下文，所以 this 将不会按照期望指向 Vue 实例，this.updateAutocomplete 将是 undefined。
`,
"vue.3.ComponentOptionsBase.emits": `
emits 可以是数组或对象，从组件触发自定义事件，emits 可以是简单的数组，或者对象作为替代，允许配置和事件验证。

参考:<br/>
https://v3.cn.vuejs.org/api/options-data.html#emits

<pre>
const app = Vue.createApp({})

// 数组语法
app.component('todo-item', {
  emits: ['check'],
  created() {
    this.$emit('check')
  }
})

// 对象语法
app.component('reply-form', {
  emits: {
    // 没有验证函数
    click: null,

    // 带有验证函数
    submit: payload => {
      if (payload.email && payload.password) {
        return true
      } else {
        console.warn(\`Invalid submit event payload!\`)
        return false
      }
    }
  }
})
</pre>  
`,
"vue.3.ComponentOptionsBase.template": `
一个字符串模板作为 Vue 实例的标识使用。模板将会替换挂载的元素。挂载元素的内容都将被忽略，除非模板的内容有分发插槽。

参考:<br/>
https://v3.cn.vuejs.org/api/options-dom.html#template

如果 Vue 选项中包含渲染函数，该模板将被忽略。
`,
"vue.3.ComponentOptionsBase.render": `
字符串模板的另一种选择，允许你充分利用 JavaScript 的编程功能。

参考:<br/>
https://v3.cn.vuejs.org/api/options-dom.html#render

render 函数的优先级高于从挂载元素 template 选项或内置 DOM 提取出的 HTML 模板编译渲染函数。
`,
"vue.3.LegacyOptions.beforeCreate": `
在实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用。

参考:<br/>
https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#beforecreate
`,
"vue.3.LegacyOptions.created": `
在实例创建完成后被立即调用。在这一步，实例已完成以下的配置：数据观测 (data observer)，property 和方法的运算，watch/event 事件回调。然而，挂载阶段还没开始，$el property 目前尚不可用。

参考:<br/>
https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#created
`,
"vue.3.LegacyOptions.beforeMount": `
在挂载开始之前被调用：相关的 render 函数首次被调用。该钩子在服务器端渲染期间不被调用。

参考:<br/>
https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#beforemount
`,
"vue.3.LegacyOptions.mounted": `
实例被挂载后调用，这时 Vue.createApp({}).mount() 被新创建的 vm.$el 替换了。如果根实例挂载到了一个文档内的元素上，当 mounted 被调用时 vm.$el 也在文档内。

参考:<br/>
https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#mounted

该钩子在服务器端渲染期间不被调用。
注意mounted不会承诺所有的子组件也都一起被挂载。
`,
"ue.3.LegacyOptions.beforeUpdate": `
数据更新时调用，发生在虚拟 DOM 打补丁之前。这里适合在更新之前访问现有的 DOM，比如手动移除已添加的事件监听器。

参考:<br/>
https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#beforeupdate

该钩子在服务器端渲染期间不被调用，因为只有初次渲染会在服务端进行。
`,
"vue.3.LegacyOptions.updated": `
由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。

参考:<br/>
https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#updated

钩子在服务器端渲染期间不被调用。
`,
"vue.3.LegacyOptions.activated": `
被 keep-alive 缓存的组件激活时调用。

参考:<br/>
https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#activated

该钩子在服务器端渲染期间不被调用。
`,
"vue.3.LegacyOptions.deactivated": `
被 keep-alive 缓存的组件停用时调用。

参考:<br/>
https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#deactivated

该钩子在服务器端渲染期间不被调用。
`,
"vue.3.LegacyOptions.beforeUnmount": `
在卸载组件实例之前调用。在这个阶段，实例仍然是完全正常的。

参考:<br/>
https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#beforeunmount

该钩子在服务器端渲染期间不被调用。
`,
"ue.3.LegacyOptions.unmounted": `
卸载组件实例后调用。调用此钩子时，组件实例的所有指令都被解除绑定，所有事件侦听器都被移除，所有子组件实例被卸载。

参考:<br/>
https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#unmounted

该钩子在服务器端渲染期间不被调用。
`,
"vue.3.LegacyOptions.renderTracked": `
跟踪虚拟 DOM 重新渲染时调用。钩子接收 debugger event 作为参数。此事件告诉你哪个操作跟踪了组件以及该操作的目标对象和键。

参考:<br/>
https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#rendertracked
`,
"vue.3.LegacyOptions.renderTriggered": `
当虚拟 DOM 重新渲染为 triggered.Similarly 为renderTracked，接收 debugger event 作为参数。此事件告诉你是什么操作触发了重新渲染，以及该操作的目标对象和键。

参考:<br/>
https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#rendertriggered
`,
"vue.3.LegacyOptions.errorCaptured": `
当捕获一个来自子孙组件的错误时被调用。此钩子会收到三个参数：错误对象、发生错误的组件实例以及一个包含错误来源信息的字符串。此钩子可以返回 false 以阻止该错误继续向上传播。

参考:<br/>
https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#errorcaptured

该钩子在服务器端渲染期间不被调用。
`,
"vue.3.ComponentOptionsBase.directives": `
声明一组可用于组件实例中的指令。

参考:<br/>
https://v3.cn.vuejs.org/api/options-assets.html#directives
`,
"vue.3.ComponentOptionsBase.components": `
包含组件实例可用组件的哈希表。

参考:<br/>
https://v3.cn.vuejs.org/api/options-assets.html#components
`,
"vue.3.LegacyOptions.mixins": `
mixins 选项接受一个混入对象的数组。这些混入实例对象可以像正常的实例对象一样包含选项，他们将在 Vue.extend() 里最终选择使用相同的选项合并逻辑合并。举例：如果你的混入包含一个钩子而创建组件本身也有一个，两个函数将被调用。Mixin 钩子按照传入顺序依次调用，并在调用组件自身的钩子之前被调用。

参考:<br/>
https://v3.cn.vuejs.org/api/options-composition.html#mixins

<pre>
const mixin = {
  created: function() {
    console.log(1)
  }
}

Vue.createApp({
  created() {
    console.log(2)
  },
  mixins: [mixin]
})

// => 1
// => 2
</pre>
`,
"vue.3.LegacyOptions.extends": `
允许声明扩展另一个组件 (可以是一个简单的选项对象或构造函数)。这主要是为了便于扩展单文件组件。
这和 mixins 类似。

参考:<br/>
https://v3.cn.vuejs.org/api/options-composition.html#extends

<pre>
const CompA = { ... }

// 在没有调用 \`Vue.extend\` 时候继承 CompA
const CompB = {
  extends: CompA,
  ...
}
</pre>  
`,
"vue.3.LegacyOptions.provide": `
需要和inject一起使用

参考:<br/>
https://v3.cn.vuejs.org/api/options-composition.html#provide-inject

provide 和 inject 主要为高阶插件/组件库提供用例。并不推荐直接用于应用程序代码中。
`,
"vue.3.LegacyOptions.inject": `
需要和provide一起使用。provide 选项应该是一个对象或返回一个对象的函数。该对象包含可注入其子孙的 property。在该对象中你可以使用 ES2015 Symbols 作为 key，但是只在原生支持 Symbol 和 Reflect.ownKeys 的环境下可工作。

参考:<br/>
https://v3.cn.vuejs.org/api/options-composition.html#provide-inject

provide 和 inject 主要为高阶插件/组件库提供用例。并不推荐直接用于应用程序代码中。
`,
"vue.3.core.ComponentOptionsBase.name": `
允许组件模板递归地调用自身。注意，组件在全局用 Vue.createApp({}).component({}) 注册时，全局 ID 自动作为组件的 name。

参考:<br/>
https://v3.cn.vuejs.org/api/options-misc.html#name
`,
"vue.3.ComponentOptionsBase.directives": `
改变纯文本插入分隔符。

参考:<br/>
https://v3.cn.vuejs.org/api/options-misc.html#delimiters

<pre>
Vue.createApp({
  // Delimiters changed to ES6 template string style
  delimiters: ['\${', '}']
})
</pre>  
`,
"vue.3.ComponentOptionsBase.inheritAttrs": `
默认情况下父作用域的不被认作 props 的 attribute 绑定 (attribute bindings) 将会“回退”且作为普通的 HTML attribute 应用在子组件的根元素上。当撰写包裹一个目标元素或另一个组件的组件时，这可能不会总是符合预期行为。通过设置 inheritAttrs 到 false，这些默认行为将会被去掉。而通过实例 property $attrs 可以让这些 attribute 生效，且可以通过 v-bind 显性的绑定到非根元素上。

参考:<br/>
https://v3.cn.vuejs.org/api/options-misc.html#inheritattrs

<pre>
app.component('base-input', {
inheritAttrs: false,
props: ['label', 'value'],
emits: ['input'],
template: \`
  <label>
    {{ label }}
    <input
      v-bind="$attrs"
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
    >
  </label>
\`
})
</pre>	  
`,
"vue.3.core.SetupContext.attrs": `
在挂载开始之前被调用：相关的 render 函数首次被调用。该钩子在服务器端渲染期间不被调用。

参考:<br/>
https://v3.cn.vuejs.org/guide/composition-api-setup.html
`,
"vue.3.core.SetupContext.slots": `
实例被挂载后调用，这时 Vue.createApp({}).mount() 被新创建的 vm.$el 替换了。如果根实例挂载到了一个文档内的元素上，当 mounted 被调用时 vm.$el 也在文档内。

参考:<br/>
https://v3.cn.vuejs.org/guide/composition-api-setup.html

该钩子在服务器端渲染期间不被调用。
注意mounted不会承诺所有的子组件也都一起被挂载。
`
// "vue.3.core.SetupContext.emit": ``
}

module.exports = content;