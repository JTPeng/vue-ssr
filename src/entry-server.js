// 服务器运行
import { createApp } from './app'

// 设置服务器端 router 的位置

// 等到 router 将可能的异步组件和钩子函数解析完
export default async (context) => {
  const { app, router, store } = createApp()
  const meta = app.$meta()
  router.push(context.url)
  context.meta = meta
  await new Promise(router.onReady.bind(router))
  context.rendered = () => {
    // Renderer会把context.state 数据对象内联到页面模板中
    // 最终发送给客户端的页面会包含一个脚本 window.__INITIAL_STATE__ = context.state
    // 客户端就要把页面中的 window.__INITIAL_STATE__拿出来填充到客户端 store容器中
    context.state = store.state
  }
  return app
}
