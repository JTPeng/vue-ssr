/**
 * 通用应用 Web 服务启动脚本
 */
const express = require('express')
const server = express()
const fs = require('fs')
const setupDevServer = require('./build/setup-dev-server')
const { createBundleRenderer } = require('vue-server-renderer')

// 用于处理静态资源
// 请求dist路径时,尝试去./dist下去请求资源
// express.static是处理物理磁盘中的静态文件
server.use('/dist', express.static('./dist'))
const isProd = process.env.NODE_ENV === 'production'
// 创建一个 express 实例
// 生成一个渲染器
let renderer, onReady
if (isProd) {
  // 生产模式
  const serverBundle = require('./dist/vue-ssr-server-bundle.json')
  const template = fs.readFileSync('./index.template.html', 'utf-8')
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')
  renderer = createBundleRenderer(serverBundle, {
    template,
    clientManifest,
  })
} else {
  // 开发模式:打包构建(客户端+服务端) -> 创建渲染器
  onReady = setupDevServer(server, (serverBundle, template, clientManifest) => {
    renderer = createBundleRenderer(serverBundle, {
      template,
      clientManifest,
    })
  })
}

const render = async (req, res) => {
  try {
    const html = await renderer.renderToString(
      {
        title: '测试',
        meta: `<meta name="viewport" content="测试">`,
        url: req.url, // 路由路径
      } // context
    )
    res.setHeader('Content-Type', 'text/html; charset=utf8')
    res.end(html)
  } catch (error) {
    console.log(error)
    return res.status(500).end(error.msg)
  }
}

// 设置一个路由
server.get(
  '*',
  isProd
    ? render // 生产模式 => 使用构建好的包直接渲染
    : async (req, res) => {
        // 开发模式 => 等编译构建好再渲染
        await onReady
        render(req, res)
      }
)
// 监听端口，启动 Web 服务
server.listen(3000, () => {
  console.log('http://localhost:3000.')
})
