const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const webpack = require('webpack')
const devMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware')

const resolvePath = (file) => path.resolve(__dirname, file)
module.exports = function(server, callback) {
  let ready, serverBundle, clientManifest, template
  const onReady = new Promise((resolve) => (ready = resolve))
  // 更新函数 重新构建
  const update = () => {
    if (template && serverBundle && clientManifest) {
      ready() // 执行成功的Promise
      callback(serverBundle, template, clientManifest) // 重新构建
    }
  }
  // 初始化调用一次
  update()
  /**
   * 监视template => 调用update => 更新render
   * 1.读取文件
   * 2.监视变化,再次读取
   */
  const templatePath = path.resolve(__dirname, '../index.template.html')
  template = fs.readFileSync(templatePath, 'utf-8')
  chokidar.watch(templatePath).on('change', () => {
    template = fs.readFileSync(templatePath, 'utf-8')
    update()
  })

  /**
   * serverBundle => 调用update => 更新render
   * 1.读取
   * 2.自动执行打包构建 => 默认通过监视的方式进行打包构建 => 打包内容存储在内存中
   * 3.serverCompiler.hooks.done.ta => 每次编译结束都会触发的勾子函数
   */
   const serverConfig = require('./webpack.server.config')
   const serverCompiler = webpack(serverConfig)
   // 自动执行打包构建 => 默认通过监视的方式进行打包构建 => 打包内容存储在内存中
   const serverMiddleWare = devMiddleware(serverCompiler, {
     logLevel: 'silent', // 关闭日志输出 -> 由FriendlyErrorsWebpackPlugin来管理
   })
   // 每次编译结束都会触发的勾子函数
   serverCompiler.hooks.done.tap('server', () => {
     // 使用require读取文件会有缓存
     serverBundle = JSON.parse(
       // serverMiddleWare.fileSystem类似于fs 其操作的是内存中的文件
       serverMiddleWare.fileSystem.readFileSync(
         resolvePath('../dist/vue-ssr-server-bundle.json', 'utf-8')
       )
     )
     update()
    //  console.log(serverBundle)
   })

  /**
   * clientManifest => 调用update => 更新render
   */
  // 1.读取
  const clientConfig = require('./webpack.client.config')
  clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
  clientConfig.entry.app = [
    'webpack-hot-middleware/client?reload=true&noInfo=true', // 处理和服务端热更新 noInfo关闭日志输出
    clientConfig.entry.app,
  ]
  clientConfig.output.filename = '[name].js' // 不是用hashchang命名 -> 热更新下确保一致的hash
  const clientCompiler = webpack(clientConfig)
  // 自动执行打包构建 => 默认通过监视的方式进行打包构建 => 打包内容存储在内存中
  const clientMiddleWare = devMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath, // 构建输出请求前的路径
    logLevel: 'silent', // 关闭日志输出 -> 由FriendlyErrorsWebpackPlugin来管理
  })
  // 每次编译结束都会触发的勾子函数
  clientCompiler.hooks.done.tap('server', () => {
    // 使用require读取文件会有缓存
    clientManifest = JSON.parse(
      // serverMiddleWare.fileSystem类似于fs 其操作的是内存中的文件
      clientMiddleWare.fileSystem.readFileSync(
        resolvePath('../dist/vue-ssr-client-manifest.json', 'utf-8')
      )
    )
    update()
    // console.log(clientManifest)
  })
  // 将clientMiddleWare挂载到express服务中,提供对其内部内存中数据的访问
  server.use(clientMiddleWare)
  server.use(
    hotMiddleware(clientCompiler, {
      log: false, // 关闭日志输出
    })
  )
  return onReady
}
