const path = require('path');
const webpack = require('webpack');
const eslintFriendlyFormatter = require('eslint-friendly-formatter');

module.exports = {
  cache: true,

  debug: true,

  devtool: 'eval-cheap-module-source-map',

  entry: [
    path.resolve (__dirname, 'src/index.js')
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
        include: /src/,
        loader: 'eslint-loader',
        test: /\.(js|jsx)$/
      }
    ],

    loaders: [
      {
        exclude: /node_modules/,
        loader: 'babel',
        test: /\.(js|jsx)?$/
      }, {
        exclude: /node_modules/,
        loaders: [
          'style',
          'css?sourceMap&modules',
          'postcss',
          'sass'
        ],
        test: /\.scss?$/
      }
    ]
  },

  output: {
    filename: 'jile.js',
    library: 'jile',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
    umdNamedDefine: true
  },

  plugins: [
    new webpack.EnvironmentPlugin([
      'NODE_ENV'
    ])
  ],

  resolve: {
    extensions: [
      '',
      '.js'
    ],

    fallback: [
      path.join (__dirname, 'src')
    ],

    root: __dirname
  }
};
