// 服务器运行
import { createApp } from './app'

// 设置服务器端 router 的位置

// 等到 router 将可能的异步组件和钩子函数解析完
export default async (context) => {
  const { app, router } = createApp()
  router.push(context.url)
  await new Promise(router.onReady.bind(router))
  return app
}
