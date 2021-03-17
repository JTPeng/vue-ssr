const express = require('express')
const Vue = require('vue')
const { createRenderer } = require('vue-server-renderer')
const renderer = createRenderer()
const server = express()

server.get('/', (req, res) => {
  const app = new Vue({
    template: `<div>{{msg}}</div>`,
    data: {
      msg: '吃饭睡觉打豆豆!',
    },
  })
  renderer.renderToString(app, (err, html) => {
    if (err) {
      return res.status(500).end('Server Error')
    }
    // 编码格式设置
    res.header('Content-Type', 'text/html; charset=utf8')
    res.end(html)
  })
})

server.listen(3000, () => {
  console.log('http://localhost:3000')
})
