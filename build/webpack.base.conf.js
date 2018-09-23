const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const env = process.env.NODE_ENV // node environment variable
const config = require('../config/config.' + env + '.json')

module.exports = {
  entry: {
    app: './src/app.client.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.less', '.sass', '.scss', '.css'], // suffix name auto completion
    alias: {
      // Set the alias name under the 'config' folder to 'config' and make an environment distinction.
      config: path.resolve(__dirname, 'config/config.' + env + '.json')
    }
  },

  plugins: [
    // Automatically generate template files in the webpack 'output' setting and import package files.
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'tmp-index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            // Written in the'.babelrc'file can be written in presets here
            [
              'env',
              {
                "targets": {
                  // To target specific browsers, the mobile terminal can be modified to a higher version browser
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
      {
        test: /\.(sa|sc|le|c)ss$/,
        exclude: '/node_modules',
        use: [
          env === 'development' ? 'style-loader' :  MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.posix.join(config.assetsSubDirectory, 'img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.posix.join(config.assetsSubDirectory, 'media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.posix.join(config.assetsSubDirectory, 'fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
