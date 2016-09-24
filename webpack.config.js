const path = require('path');
const webpack = require('webpack');
const eslintFriendlyFormatter = require('eslint-friendly-formatter');

module.exports = {
  cache: true,

  devtool: 'source-map',

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

  externals: {
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
    ])
  ],

  resolve: {
    extensions: [
      '',
      '.js'
    ],

    root: __dirname
  }
};
