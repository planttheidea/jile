const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const eslintFriendlyFormatter = require('eslint-friendly-formatter');

const PORT = 3000;

module.exports = {
  cache: true,

  debug: true,

  devServer : {
    contentBase: './dist',
    host: 'localhost',
    inline: true,
    lazy: false,
    noInfo: false,
    quiet: false,
    port: PORT,
    stats: {
      colors: true,
      progress: true
    }
  },

  devtool: 'source-map',

  entry: [
    path.resolve (__dirname, 'example', 'App.js')
  ],

  eslint: {
    configFile: '.eslintrc',
    emitError: true,
    failOnError: true,
    failOnWarning: false,
    formatter: eslintFriendlyFormatter
  },

  module: {
    preLoaders: [
      {
        include: [
          /src/,
          /example/
        ],
        loader: 'eslint-loader',
        test: /\.js$/
      }
    ],

    loaders: [
      {
        include: [
          /src/,
          /example/
        ],
        loader: 'babel',
        test: /\.js?$/
      }
    ]
  },

  output: {
    filename: 'jile.js',
    library: 'jile',
    path: path.resolve(__dirname, 'dist'),
    publicPath: `http://localhost:${PORT}/`
  },

  plugins: [
    new webpack.DefinePlugin({
      process: {
        env: {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        }
      }
    }),
    new HtmlWebpackPlugin()
  ],

  resolve: {
    extensions: [
      '',
      '.js',
      '.jsx'
    ],

    root: __dirname
  }
};
