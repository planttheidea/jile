const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const eslintFriendlyFormatter = require('eslint-friendly-formatter');

const PORT = 4000;

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

  devtool: 'eval-cheap-module-source-map',

  entry: [
    path.resolve (__dirname, 'test/App.jsx')
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
        exclude: /\.test\.js/,
        include: [
          /src/,
          /test/
        ],
        loader: 'eslint-loader',
        test: /\.(js|jsx)$/
      }
    ],

    loaders: [
      {
        exclude: [
          /node_modules/,
          /\.test\.js/
        ],
        loader: 'babel',
        test: /\.(js|jsx)?$/
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

    fallback: [
      path.join (__dirname, 'src')
    ],

    root: __dirname
  }
};
