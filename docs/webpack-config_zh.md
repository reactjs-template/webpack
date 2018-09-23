# webpack-config

webpack配置说明

## webpack

### 1.1 初始化配置

安装最新的webpack4，webpack4抽离出来了webpack-cli，需要多安装webpack-cli

```js
// npm init
// npm install webpack webpack-cli --save-dev
var path = require('path');
module.exports = {
  entry: {
    app: './src/app.client.js'
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].[chunkhash].js'
  },
  resolve: {},
  plugins: {},
  optimization: {}, // webpack4新加入的配置
  module: {},
  devServer: {}
}
```

### 1.2 解析jsx和es6

解析jsx和es6最好先了解一下babel => babel https://babeljs.io/docs

```js
// npm install babel-core babel-loader babel-preset-env babel-preset-react babel-preset-stage-0 babel-plugin-transform-decorators-legacy --save-dev
module: {
  rules: [
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        presets: [
          // 写在.babelrc文件里面的可以写在presets这里
          [
            'env',
            {
              "targets": {
              // 要针对的都是特定范围的浏览器，移动端可以修改成更高版本浏览器
                "browsers": ["ie >= 8", 'chrome >= 52']
              }
              }
            ],
            'react',
            'stage-0'
          ],
          plugins: ["transform-decorators-legacy"]
        }
      },
    ]
}
```
### 1.3 生成模板文件并引入打包文件

```js
// npm install html-webpack-plugin --save-dev
plugins: [
  // 自动在'output'打包路径里生成模板文件并引入打包文件
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'tmp-index.html',
  })
],
```
### 1.4 打包css、sass/less

从js中提取css，webpack4官方不在推荐使用 extract-text-webpack-plugin了，改换 mini-css-extract-plugin

基本配置如下：
```js
// 处理style,css => npm install style-loader css-loader --save-dev
// sass/less => sass-loader node-sass less less-loader
// 生产环境从js中提取css =>  mini-css-extract-plugin

module:{
  rules:[
    {
      test: /\.(sa|sc|le|c)ss$/,
      exclude: '/node_modules',
      use: [
		// development环境用style-loader把css放入style标签中，非development环境从js中分离css
        env === 'development' ? 'style-loader' :  MiniCssExtractPlugin.loader,
        'css-loader',
        'postcss-loader',
        'sass-loader',
        'less-loader'
      ]
    },
  ]
}
```

生产环境下的压缩css配置优化：

压缩css安装optimize-css-assets-webpack-plugin，放在optimization.minimizer里，但是会覆盖默认压缩js操作，所以还需要安装uglifyjs-webpack-plugin去压缩技术.

```js
// webpack.prod.conf.js
plugins: [
  // MiniCssExtractPlugin => extract css
  new MiniCssExtractPlugin({
    filename: '[name].[hash].css',
    chunkFilename: '[id].[hash].css'
  })
],
optimization: {
  minimizer: [
    new UglifyJsPlugin({ // comporess js (optimize)
      cache: true,
      parallel: true,
      sourceMap: true
    }),
    new OptimizeCSSAssetsPlugin({}) // compress css(optimize)
  ],
},
module: {
  ...rules
}
```

### 1.5 处理css3属性前缀

```js
// postcss-loader
{
  test: /\.(sa|sc|le|c)ss$/,
  exclude: '/node_modules',
  use: [
    'style-loader',
    'css-loader',
    'postcss-loader',
    'sass-loader',
  ]
}
```

新建postcss.config.js配置文件

```js
// postcss-import postcss-cssnext
module.exports = {
  plugins: {
    'postcss-import': {}, // import css need
    'postcss-cssnext': {} // suport css4
  }
}
```

### 1.6 url-loader

url-loader处理文件，图片等

```js
// url-loader
{
  test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
  loader: 'url-loader',
  options: {
    limit: 10000,
    name: path.posix.join('static', 'img/[name].[hash:7].[ext]')
  }
}
```

### 1.7 hotReload

```js
// webpack.dev.conf.js
// webpack-dev-server
plugins: [
  new webpack.HotModuleReplacementPlugin()
],
devServer: {
  clientLogLevel: 'warning', // browser print info of webpack-dev-server
  contentBase: path.join(__dirname, '/dist'),
  inline: true,
  hot: true,
  host: 'localhost',
  port: config.port,
  publicPath: '/',
  open: false,
}
```

package.json
```
"dev": "cross-env NODE_ENV=development webpack-dev-server --config ./build/webpack.dev.conf.js",
```
