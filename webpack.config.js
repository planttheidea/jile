const path = require('path');
const webpack = require('webpack');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = {
  devtool: '#source-map',

  entry: [
    path.resolve (__dirname, 'src', 'index.js')
  ],

  eslint: {
    configFile: '.eslintrc',
    emitError: true,
    failOnError: true,
    failOnWarning: true,
    formatter: require('eslint-friendly-formatter')
  },

  externals: {
    'hash-it': {
      amd: 'hash-it',
      commonjs: 'hash-it',
      commonjs2: 'hash-it',
      root: 'hashIt'
    },
    'inline-style-prefixer': {
      amd: 'inline-style-prefixer',
      commonjs: 'inline-style-prefixer',
      commonjs2: 'inline-style-prefixer',
      root: 'Prefixer'
    }
  },

  module: {
    preLoaders: [
      {
        include: [
          /src/
        ],
        loader: 'eslint-loader',
        test: /\.js$/
      }
    ],

    loaders: [
      {
        include: [
          /src/
        ],
        loader: 'babel',
        test: /\.js?$/
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
    ]),
    new LodashModuleReplacementPlugin()
  ],

  resolve: {
    extensions: [
      '',
      '.js'
    ],

    root: __dirname
  }
};
