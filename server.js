/**
 * 通用应用 Web 服务启动脚本
 */
const express = require('express')
const path = require('path')
const fs = require('fs')

const isProd = process.env.NODE_ENV === 'production'
// 生成一个渲染器
let renderer
if (isProd) {
  // 生产模式
  const serverBundle = require('./dist/vue-ssr-server-bundle.json')
  const template = fs.readFileSync('./index.template.html', 'utf-8')
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')
  renderer = require('vue-server-renderer').createBundleRenderer(serverBundle, {
    template,
    clientManifest,
  })
} else {
  // 开发模式:打包构建(客户端+服务端) -> 创建渲染器
}

// 创建一个 express 实例
const server = express()
server.use(express.static(path.resolve(__dirname, '/dist')))

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
    return res.status(500).end(err.msg)
  }
}

// 设置一个路由
server.get(
  '*',
  isProd
    ? render // 生产模式 => 使用构建好的包直接渲染
    : (req, res) => {
        // 开发模式 => 等编译构建好再渲染
      }
)
// 监听端口，启动 Web 服务
server.listen(3000, () => {
  console.log('http://localhot:3000.')
})
