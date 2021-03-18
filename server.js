/**
 * 通用应用 Web 服务启动脚本
 */
const express = require('express')
const Vue = require('vue')
const fs = require('fs')

const serverBundle = require('./dist/vue-ssr-server-bundle.json')
const template = fs.readFileSync('./index.template.html', 'utf-8')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')
// 创建一个 express 实例
const server = express()
// 生成一个渲染器
const renderer = require('vue-server-renderer').createBundleRenderer(serverBundle, {
  template,
  clientManifest,
})

server.use('/dist', express.static('./dist'))

// 设置一个路由
server.get('/', (req, res) => {
  renderer.renderToString(
    {
      title: 'vue-ssr',
      meta: `
	   <meta name="ssr" content="vue-ssr">
	  `,
    },
    (err, html) => {
      if (err) {
        return res.status(500).end('Internal Server Error.')
      }
      res.setHeader('Content-Type', 'text/html; charset=utf8')
      res.end(html)
    }
  )
})
// 监听端口，启动 Web 服务
server.listen(3000, () => {
  console.log('http://localhot:3000.')
})
